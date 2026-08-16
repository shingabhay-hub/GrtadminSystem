#!/bin/bash

# GRT Admin Console - Docker Compose Quick Start Script
# This script helps with common Docker Compose operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Functions
print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ GRT Admin Console - Docker Compose     ║${NC}"
    echo -e "${BLUE}║ $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    print_success "Docker and Docker Compose are installed"
}

setup_env() {
    if [ ! -f ".env" ]; then
        print_info "Creating .env file from template..."
        if [ -f ".env.docker" ]; then
            cp .env.docker .env
            print_success ".env file created"
        else
            print_error ".env.docker template not found"
        fi
    fi
}

start_services() {
    print_header "Starting Services"
    setup_env
    
    print_info "Starting Docker containers..."
    docker-compose up -d
    
    print_success "Services started"
    print_info "Waiting for services to initialize (30-60 seconds)..."
    
    # Wait for backend to be healthy
    local count=0
    while [ $count -lt 60 ]; do
        if docker-compose exec -T backend curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
            print_success "Backend is healthy"
            break
        fi
        count=$((count + 1))
        sleep 1
    done
    
    if [ $count -eq 60 ]; then
        print_warning "Backend health check timed out, services may still be starting"
    fi
    
    print_services_info
}

stop_services() {
    print_header "Stopping Services"
    docker-compose stop
    print_success "Services stopped"
}

restart_services() {
    print_header "Restarting Services"
    docker-compose restart
    print_success "Services restarted"
}

view_logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f --tail=50
    else
        docker-compose logs -f --tail=50 "$1"
    fi
}

status_services() {
    print_header "Service Status"
    docker-compose ps
    
    echo ""
    print_info "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

print_services_info() {
    print_header "Services Information"
    
    echo -e "${GREEN}Frontend:${NC}"
    echo -e "  URL: http://localhost"
    echo -e "  Status: $(get_service_status frontend)"
    
    echo ""
    echo -e "${GREEN}Backend API:${NC}"
    echo -e "  URL: http://localhost/api"
    echo -e "  Docs: http://localhost/api/docs"
    echo -e "  Status: $(get_service_status backend)"
    
    echo ""
    echo -e "${GREEN}Grafana:${NC}"
    echo -e "  URL: http://localhost:3000"
    echo -e "  Username: admin"
    echo -e "  Status: $(get_service_status grafana)"
    
    echo ""
    echo -e "${GREEN}Prometheus:${NC}"
    echo -e "  URL: http://localhost:9090"
    echo -e "  Status: $(get_service_status prometheus)"
    
    echo ""
    echo -e "${GREEN}Traefik:${NC}"
    echo -e "  Dashboard: http://localhost:8080"
    echo -e "  Status: $(get_service_status traefik)"
    
    echo ""
    echo -e "${GREEN}MongoDB:${NC}"
    echo -e "  Host: localhost:27017"
    echo -e "  Status: $(get_service_status mongodb)"
    
    echo ""
    echo -e "${GREEN}Redis:${NC}"
    echo -e "  Host: localhost:6379"
    echo -e "  Status: $(get_service_status redis)"
    
    echo ""
}

get_service_status() {
    local container=$1
    if docker-compose ps "$container" 2>/dev/null | grep -q "Up"; then
        echo -e "${GREEN}Running${NC}"
    else
        echo -e "${RED}Down${NC}"
    fi
}

health_check() {
    print_header "Health Check"
    
    local errors=0
    
    # Check Docker daemon
    if docker ps > /dev/null 2>&1; then
        print_success "Docker daemon is running"
    else
        print_error "Docker daemon is not responding"
        errors=$((errors + 1))
    fi
    
    # Check services
    if docker-compose ps | grep -q "Up"; then
        print_success "Services are running"
    else
        print_warning "Some services are not running"
        errors=$((errors + 1))
    fi
    
    # Check backend
    if curl -s http://localhost:5000/api/health > /dev/null; then
        print_success "Backend API is responding"
    else
        print_warning "Backend API is not responding (still starting?)"
        errors=$((errors + 1))
    fi
    
    # Check frontend
    if curl -s http://localhost > /dev/null; then
        print_success "Frontend is responding"
    else
        print_warning "Frontend is not responding (still starting?)"
        errors=$((errors + 1))
    fi
    
    if [ $errors -eq 0 ]; then
        echo ""
        print_success "All health checks passed"
    else
        echo ""
        print_warning "$errors health checks did not pass"
    fi
}

clean_volumes() {
    print_header "Cleaning Volumes"
    print_warning "This will delete all persistent data!"
    
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        docker-compose down -v
        print_success "Volumes cleaned"
    else
        print_info "Cancelled"
    fi
}

rebuild_services() {
    print_header "Rebuilding Services"
    
    docker-compose build --no-cache
    docker-compose up -d
    
    print_success "Services rebuilt"
}

backup_database() {
    print_header "Backing Up Database"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="backups/mongodb_${timestamp}"
    
    mkdir -p "$backup_dir"
    
    print_info "Backing up MongoDB to $backup_dir..."
    docker-compose exec -T mongodb mongodump --out /backup
    
    print_success "Database backup complete"
    print_info "Backup location: $backup_dir"
}

display_menu() {
    echo ""
    echo -e "${BLUE}Available Commands:${NC}"
    echo "  1) start     - Start all services"
    echo "  2) stop      - Stop all services"
    echo "  3) restart   - Restart all services"
    echo "  4) status    - Show service status"
    echo "  5) logs      - View service logs"
    echo "  6) health    - Run health checks"
    echo "  7) rebuild   - Rebuild services"
    echo "  8) clean     - Clean volumes (DELETE DATA!)"
    echo "  9) backup    - Backup database"
    echo "  10) help     - Show this menu"
    echo "  11) exit     - Exit"
    echo ""
}

show_help() {
    print_header "Docker Compose Management"
    
    echo -e "${BLUE}Usage:${NC} $0 [command]"
    echo ""
    echo -e "${BLUE}Commands:${NC}"
    echo "  start              Start all services"
    echo "  stop               Stop all services"
    echo "  restart            Restart all services"
    echo "  status             Show service status"
    echo "  logs [service]     View service logs (no service = all)"
    echo "  health             Run health checks"
    echo "  rebuild            Rebuild services from scratch"
    echo "  clean              Clean all volumes (removes data!)"
    echo "  backup             Backup MongoDB database"
    echo "  help               Show this help message"
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo "  $0 start"
    echo "  $0 logs backend"
    echo "  $0 status"
    echo ""
}

# Main
main() {
    check_requirements
    
    if [ $# -eq 0 ]; then
        # Interactive mode
        print_header "Interactive Mode"
        
        while true; do
            display_menu
            read -p "Select option (1-11): " choice
            
            case $choice in
                1) start_services ;;
                2) stop_services ;;
                3) restart_services ;;
                4) status_services ;;
                5) view_logs ;;
                6) health_check ;;
                7) rebuild_services ;;
                8) clean_volumes ;;
                9) backup_database ;;
                10) show_help ;;
                11) echo "Goodbye!"; exit 0 ;;
                *) print_error "Invalid option" ;;
            esac
        done
    else
        # Command mode
        case "$1" in
            start) start_services ;;
            stop) stop_services ;;
            restart) restart_services ;;
            status) status_services ;;
            logs) view_logs "$2" ;;
            health) health_check ;;
            rebuild) rebuild_services ;;
            clean) clean_volumes ;;
            backup) backup_database ;;
            help) show_help ;;
            *) print_error "Unknown command: $1. Use 'help' for available commands." ;;
        esac
    fi
}

# Run main function
main "$@"
