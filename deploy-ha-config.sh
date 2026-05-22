#!/bin/bash

# Script to deploy high availability and scalability configurations
set -e

echo "🚀 Deploying High Availability and Scalability Configuration..."

# Apply Horizontal Pod Autoscalers
echo "📈 Applying Horizontal Pod Autoscalers..."
kubectl apply -f k8s/backend/hpa.yaml
kubectl apply -f k8s/frontend/hpa.yaml

# Apply Pod Disruption Budgets
echo "🛡️ Applying Pod Disruption Budgets..."
kubectl apply -f k8s/backend/pdb.yaml
kubectl apply -f k8s/frontend/pdb.yaml

# Scale deployments to ensure minimum replicas
echo "🔧 Scaling deployments to minimum replicas..."
kubectl scale deployment backend --replicas=2 -n mern-app
kubectl scale deployment frontend --replicas=2 -n mern-app

# Update deployments with corrected image references
echo "🔄 Updating deployment configurations..."
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/frontend/deployment.yaml

echo "✅ High availability configuration deployed successfully!"
echo ""
echo "📊 Current status:"
kubectl get hpa -n mern-app
kubectl get pdb -n mern-app
kubectl get deployments -n mern-app