#!/bin/bash

# setup.sh - Initial project setup script

set -e  # Exit on error

echo "🚀 Netflix DevOps - Project Setup"
echo "=================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  Docker Compose not found"
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup environment
echo ""
echo "🔧 Setting up environment..."

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
else
    echo "✅ .env already exists"
fi

# Create .env files for services
for service in apps/auth-service apps/backend apps/frontend apps/video-service; do
    if [ ! -f "$service/.env" ] && [ -f "$service/.env.example" ]; then
        echo "Creating $service/.env..."
        cp "$service/.env.example" "$service/.env"
    fi
done

echo ""
echo "📂 Creating necessary directories..."
mkdir -p data/mongodb
mkdir -p uploads
mkdir -p logs

# Docker setup (optional)
echo ""
read -p "Do you want to start Docker containers now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🐳 Starting Docker containers..."
    docker-compose up -d
    echo "✅ Containers started"
    docker-compose ps
fi

# Kubernetes setup (optional)
echo ""
read -p "Do you want to setup Kubernetes? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if ! command -v kubectl &> /dev/null; then
        echo "❌ kubectl not found. Please install kubectl first"
    else
        echo "☸️  Setting up Kubernetes..."
        # kubectl apply -f infrastructure/kubernetes/
        echo "ℹ️  Run: npm run k8s:apply"
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env with your configuration"
echo "  2. npm run dev          - Start all services"
echo "  3. npm run docker:up    - Start with Docker"
echo "  4. npm run test         - Run tests"
echo ""
echo "📚 For more info, see README.md and docs/"
