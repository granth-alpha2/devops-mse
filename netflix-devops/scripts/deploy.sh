#!/bin/bash

# deploy.sh - Deploy to Kubernetes

set -e

echo "🚀 Netflix DevOps - Kubernetes Deployment"
echo "=========================================="

if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Please install kubectl first"
    exit 1
fi

# Check if connected to cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Not connected to Kubernetes cluster"
    exit 1
fi

echo "📋 Current cluster: $(kubectl config current-context)"
echo ""

# Deploy
echo "📦 Deploying to Kubernetes..."
kubectl apply -f infrastructure/kubernetes/

echo ""
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment --all

echo ""
echo "📊 Deployment status:"
kubectl get pods,svc,deployments

echo ""
echo "✨ Deployment complete!"
echo ""
echo "Access your application:"
echo "  kubectl port-forward svc/frontend 3000:3000"
echo "  kubectl port-forward svc/prometheus 9090:9090"
echo "  kubectl port-forward svc/grafana 3000:3000"
