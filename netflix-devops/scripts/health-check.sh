#!/bin/bash

# health-check.sh - Check health of all services

echo "🏥 Netflix DevOps - Health Check"
echo "=================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_service() {
    local name=$1
    local url=$2
    local port=$3

    echo -n "Checking $name ($port)... "
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ DOWN${NC}"
        return 1
    fi
}

echo ""
echo "📋 Service Status:"
echo "==================="

check_service "Auth Service" "http://localhost:3001/health" 3001
check_service "Backend" "http://localhost:3000/health" 3000
check_service "Video Service" "http://localhost:3002/health" 3002
check_service "Frontend" "http://localhost:3000" 3000
check_service "MongoDB" "mongodb://localhost:27017" 27017
check_service "Prometheus" "http://localhost:9090" 9090
check_service "Grafana" "http://localhost:3000" 3000

echo ""
echo "📊 Docker Containers:"
echo "===================="
docker-compose ps

echo ""
echo "☸️  Kubernetes Pods:"
echo "=================="
if command -v kubectl &> /dev/null; then
    kubectl get pods
else
    echo "kubectl not installed"
fi

echo ""
echo "✨ Health check complete"
