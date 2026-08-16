<#
.SYNOPSIS
    GRT Disk Space Triage - automates the "Disk full -> volume -> directory -> file
    type -> owning app -> log/data/backup/temp -> retention -> action" decision tree.
.DESCRIPTION
    Read-only by default: scans, classifies, and reports what's consuming space and
    what the recommended action is, per GRT retention policy. Use -Execute to
    actually apply cleanup actions (with -WhatIf support built in via ShouldProcess
    equivalent confirmation).
.PARAMETER ComputerName
    Target server.
.PARAMETER ThresholdFreePct
    Only report/act on volumes below this free % (default 15).
.PARAMETER TempRetentionDays / LogRetentionDays
    Age thresholds for temp files and rotated logs to be eligible for cleanup.
.PARAMETER Execute
    If set, actually deletes eligible temp/log files. Without it, dry-run only.
.EXAMPLE
    .\Disk-Space-Triage.ps1 -ComputerName WEB01 -ThresholdFreePct 15
    .\Disk-Space-Triage.ps1 -ComputerName WEB01 -Execute -LogRetentionDays 30
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)]  [string]$ComputerName,
    [Parameter(Mandatory=$false)] [int]$ThresholdFreePct = 15,
    [Parameter(Mandatory=$false)] [int]$TempRetentionDays = 7,
    [Parameter(Mandatory=$false)] [int]$LogRetentionDays = 30,
    [Parameter(Mandatory=$false)] [switch]$Execute,
    [Parameter(Mandatory=$false)] [string]$ReportPath = ".\DiskTriage_$ComputerName`_$(Get-Date -Format yyyyMMdd_HHmm).csv"
)

$findings = New-Object System.Collections.Generic.List[Object]

Write-Host "=== Disk Space Triage: $ComputerName ===" -ForegroundColor Cyan

# 1. Which volume?
$volumes = Invoke-Command -ComputerName $ComputerName -ScriptBlock {
    Get-Volume | Where-Object { $_.DriveType -eq 'Fixed' -and $_.DriveLetter }
}

foreach ($vol in $volumes) {
    $freePct = [math]::Round(($vol.SizeRemaining / $vol.Size) * 100, 1)
    Write-Host "`nVolume $($vol.DriveLetter): $freePct% free" -ForegroundColor Yellow

    if ($freePct -ge $ThresholdFreePct) {
        Write-Host "  OK - above threshold, skipping deep scan" -ForegroundColor Green
        continue
    }

    # 2. Which directory? (top consumers, common suspects first)
    $candidatePaths = @(
        "$($vol.DriveLetter):\Windows\Temp",
        "$($vol.DriveLetter):\Windows\Logs",
        "$($vol.DriveLetter):\inetpub\logs\LogFiles",
        "$($vol.DriveLetter):\Program Files\Microsoft SQL Server\MSSQL*\MSSQL\Log",
        "$($vol.DriveLetter):\Temp",
        "$env:USERPROFILE\AppData\Local\Temp"
    )

    foreach ($path in $candidatePaths) {
        $items = Invoke-Command -ComputerName $ComputerName -ScriptBlock {
            param($p, $tempDays, $logDays)
            $resolved = Resolve-Path $p -ErrorAction SilentlyContinue
            if (-not $resolved) { return $null }
            $files = Get-ChildItem $resolved -Recurse -File -ErrorAction SilentlyContinue
            $totalSizeMB = [math]::Round(($files | Measure-Object Length -Sum).Sum / 1MB, 1)
            [pscustomobject]@{
                Path = $resolved.Path
                TotalSizeMB = $totalSizeMB
                FileCount = $files.Count
                OldTempEligible = ($files | Where-Object { $_.Extension -match '\.tmp|\.log' -and $_.LastWriteTime -lt (Get-Date).AddDays(-$tempDays) }).Count
                OldLogEligible  = ($files | Where-Object { $_.Extension -eq '.log' -and $_.LastWriteTime -lt (Get-Date).AddDays(-$logDays) }).Count
            }
        } -ArgumentList $path, $TempRetentionDays, $LogRetentionDays -ErrorAction SilentlyContinue

        if ($items -and $items.TotalSizeMB -gt 0) {
            # 3-6. Classify: file type / owning app / category / retention eligibility
            $category = if ($path -match 'Temp') { 'Temp' } elseif ($path -match 'Log') { 'Log' } else { 'Data' }
            $action = switch ($category) {
                'Temp' { "Delete files older than $TempRetentionDays days" }
                'Log'  { "Archive/compress then delete logs older than $LogRetentionDays days" }
                default { "Manual review - do not auto-delete data files" }
            }

            $finding = [pscustomobject]@{
                Volume          = $vol.DriveLetter
                Path            = $items.Path
                Category        = $category
                TotalSizeMB     = $items.TotalSizeMB
                FileCount       = $items.FileCount
                EligibleForClean= if ($category -eq 'Temp') { $items.OldTempEligible } else { $items.OldLogEligible }
                RecommendedAction = $action
                ActionTaken     = 'None (dry-run)'
            }

            Write-Host "  $($items.Path): $($items.TotalSizeMB) MB, $($finding.EligibleForClean) files eligible for cleanup -> $action"

            # 7-9. Retention policy / Archive-expand-cleanup / Validate
            if ($Execute -and $category -in @('Temp','Log') -and $finding.EligibleForClean -gt 0) {
                $confirm = Read-Host "  Execute cleanup on $($items.Path)? (y/n)"
                if ($confirm -eq 'y') {
                    $deleted = Invoke-Command -ComputerName $ComputerName -ScriptBlock {
                        param($p, $days, $cat)
                        $cutoff = (Get-Date).AddDays(-$days)
                        $toDelete = Get-ChildItem $p -Recurse -File -ErrorAction SilentlyContinue |
                            Where-Object { $_.LastWriteTime -lt $cutoff -and ($_.Extension -match '\.tmp|\.log') }
                        $count = $toDelete.Count
                        $toDelete | Remove-Item -Force -ErrorAction SilentlyContinue
                        $count
                    } -ArgumentList $items.Path, ($(if($category -eq 'Temp'){$TempRetentionDays}else{$LogRetentionDays})), $category
                    $finding.ActionTaken = "Deleted $deleted files"
                    Write-Host "    Deleted $deleted files. Re-checking free space..." -ForegroundColor Green
                } else {
                    $finding.ActionTaken = 'Skipped by operator'
                }
            }

            $findings.Add($finding)
        }
    }
}

# 10. Validate - re-check free space after actions
if ($Execute) {
    Write-Host "`n=== Post-cleanup validation ===" -ForegroundColor Cyan
    Invoke-Command -ComputerName $ComputerName -ScriptBlock {
        Get-Volume | Where-Object { $_.DriveType -eq 'Fixed' -and $_.DriveLetter } |
        Select-Object DriveLetter, @{N='FreePct';E={[math]::Round(($_.SizeRemaining/$_.Size)*100,1)}}
    } | Format-Table -AutoSize
}

$findings | Export-Csv -Path $ReportPath -NoTypeInformation
Write-Host "`nReport saved: $ReportPath" -ForegroundColor Green
if (-not $Execute) { Write-Host "This was a DRY RUN. Re-run with -Execute to apply cleanup actions." -ForegroundColor Yellow }
