<#
.SYNOPSIS
    GRT User Onboarding - implements HR Request -> ... -> Document identity flow.
.DESCRIPTION
    Creates the AD account, assigns groups, grants mailbox/app access placeholders,
    assigns a computer object, notes VPN/MFA steps, and logs everything to CSV for
    audit. Manager approval is a gate checked before execution, not automated away.
.PARAMETER FirstName / LastName / Username / Department / Title / Manager
    Standard AD account fields.
.PARAMETER Groups
    AD security/distribution groups to add the user to.
.PARAMETER OUPath
    Target OU, e.g. 'OU=Employees,OU=Betul,DC=grt,DC=local'
.PARAMETER ManagerApproved
    Explicit switch gate - script refuses to create the account without it.
.PARAMETER AssignedComputer
    Computer object name to link/note against the user (AD description or asset CSV).
.EXAMPLE
    .\New-UserOnboarding.ps1 -FirstName Ravi -LastName Sharma -Username rsharma `
        -Department IT -Title "Support Engineer" -Manager "jdoe" -ManagerApproved `
        -Groups 'IT-Staff','VPN-Users' -OUPath 'OU=Employees,DC=grt,DC=local' `
        -AssignedComputer 'LT-0231'
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)] [string]$FirstName,
    [Parameter(Mandatory=$true)] [string]$LastName,
    [Parameter(Mandatory=$true)] [string]$Username,
    [Parameter(Mandatory=$true)] [string]$Department,
    [Parameter(Mandatory=$true)] [string]$Title,
    [Parameter(Mandatory=$true)] [string]$Manager,
    [Parameter(Mandatory=$true)] [string]$OUPath,
    [Parameter(Mandatory=$false)][string[]]$Groups = @(),
    [Parameter(Mandatory=$false)][string]$AssignedComputer = '',
    [Parameter(Mandatory=$false)][switch]$RequiresVPN,
    [Parameter(Mandatory=$false)][switch]$RequiresMFA = $true,
    [Parameter(Mandatory=$true)] [switch]$ManagerApproved,
    [Parameter(Mandatory=$false)][string]$AuditCsv = ".\OnboardingAudit.csv"
)

$ErrorActionPreference = 'Stop'

if (-not $ManagerApproved) {
    throw "STOP: Manager approval flag not set. Per GRT identity policy, no AD account is created without documented manager approval. Re-run with -ManagerApproved once approval is on record."
}

$audit = [ordered]@{
    Username        = $Username
    FullName        = "$FirstName $LastName"
    Department      = $Department
    Title           = $Title
    Manager         = $Manager
    RequestTime     = Get-Date -Format o
    ADAccount       = ''
    GroupsAssigned  = ''
    Mailbox         = ''
    ComputerAssigned= $AssignedComputer
    VPNAccess       = ''
    MFAEnrolled     = ''
    LoginTested     = ''
    Status          = ''
}

function Log-Step($label, $ok, $detail) {
    $color = if ($ok) { 'Green' } else { 'Red' }
    Write-Host "  [$label] $detail" -ForegroundColor $color
}

try {
    Import-Module ActiveDirectory -ErrorAction Stop

    # Step: Create AD Account
    Write-Host "`n[1] Create AD Account" -ForegroundColor Cyan
    $tempPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 14 | ForEach-Object { [char]$_ })
    $securePwd = ConvertTo-SecureString $tempPassword -AsPlainText -Force
    New-ADUser -Name "$FirstName $LastName" -GivenName $FirstName -Surname $LastName `
        -SamAccountName $Username -UserPrincipalName "$Username@grt.local" `
        -Path $OUPath -AccountPassword $securePwd -Enabled $true `
        -ChangePasswordAtLogon $true -Department $Department -Title $Title `
        -Manager $Manager -ErrorAction Stop
    $audit.ADAccount = 'Created'
    Log-Step "AD" $true "Account $Username created in $OUPath (temp password issued out-of-band, not logged)"

    # Step: Assign Required Groups
    Write-Host "`n[2] Assign Required Groups" -ForegroundColor Cyan
    $assigned = @()
    foreach ($g in $Groups) {
        try { Add-ADGroupMember -Identity $g -Members $Username -ErrorAction Stop; $assigned += $g }
        catch { Log-Step "Group" $false "Failed to add to $g : $_" }
    }
    $audit.GroupsAssigned = $assigned -join '; '
    Log-Step "Groups" $true "Added to: $($assigned -join ', ')"

    # Step: Mailbox/Application Access (placeholder - depends on Exchange Online / on-prem)
    Write-Host "`n[3] Mailbox/Application Access" -ForegroundColor Cyan
    $audit.Mailbox = 'Pending - run Exchange/O365 mailbox provisioning separately'
    Log-Step "Mailbox" $true "Flagged for mailbox provisioning (not automated in this script - requires Exchange module/tenant context)"

    # Step: Computer Assignment
    Write-Host "`n[4] Computer Assignment" -ForegroundColor Cyan
    if ($AssignedComputer) {
        try {
            Set-ADUser -Identity $Username -Description "Assigned device: $AssignedComputer"
            Log-Step "Computer" $true "Noted assigned device $AssignedComputer on AD account description"
        } catch { Log-Step "Computer" $false $_ }
    } else { Log-Step "Computer" $true "No device specified - skipped" }

    # Step: VPN/Remote Access
    Write-Host "`n[5] VPN/Remote Access" -ForegroundColor Cyan
    if ($RequiresVPN) {
        try { Add-ADGroupMember -Identity 'VPN-Users' -Members $Username -ErrorAction Stop; $audit.VPNAccess = 'Granted' }
        catch { $audit.VPNAccess = "Failed: $_" }
    } else { $audit.VPNAccess = 'Not required' }
    Log-Step "VPN" $true $audit.VPNAccess

    # Step: MFA
    Write-Host "`n[6] MFA" -ForegroundColor Cyan
    $audit.MFAEnrolled = if ($RequiresMFA) { 'Pending user self-enrollment on first login' } else { 'Not required' }
    Log-Step "MFA" $true $audit.MFAEnrolled

    # Step: Test Login
    Write-Host "`n[7] Test Login" -ForegroundColor Cyan
    $check = Get-ADUser -Identity $Username -Properties Enabled,LockedOut
    $audit.LoginTested = if ($check.Enabled -and -not $check.LockedOut) { 'Account enabled and unlocked - ready for first login' } else { 'Account state issue - review' }
    Log-Step "Login" $true $audit.LoginTested

    $audit.Status = 'Completed'
}
catch {
    $audit.Status = "FAILED: $($_.Exception.Message)"
    Write-Host "`nONBOARDING FAILED: $_" -ForegroundColor Red
}
finally {
    # Step: Document
    $exists = Test-Path $AuditCsv
    [pscustomobject]$audit | Export-Csv -Path $AuditCsv -NoTypeInformation -Append:$exists
    Write-Host "`nAudit record written to $AuditCsv" -ForegroundColor Cyan
    $audit | Format-List
}
