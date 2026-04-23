#!/bin/bash

# build.sh - Build all services

set -e

echo "🔨 Netflix DevOps - Build All Services"
echo "======================================="

BUILD_TYPE=${1:-docker}

if [ "$BUILD_TYPE" = "docker" ]; then
    echo "🐳 Building Docker images..."
    docker-compose build
    echo "✅ Docker build complete"
    
elif [ "$BUILD_TYPE" = "prod" ]; then
    echo "📦 Building for production..."
    npm run build
    echo "✅ Production build complete"
    
else
    echo "Usage: ./build.sh [docker|prod]"
    echo "  docker - Build Docker images (default)"
    echo "  prod   - Build for production"
    exit 1
fi

echo ""
echo "✨ Build complete"
