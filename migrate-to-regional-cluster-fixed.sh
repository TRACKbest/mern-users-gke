#!/bin/bash

# Script to migrate workloads from single-zone cluster to regional cluster (fixed version)
# This handles the migration process smoothly with temporary ingress configuration

set -e

PROJECT_ID="alex-496108"
OLD_CLUSTER="mern-cluster"
OLD_ZONE="europe-west1-b"
NEW_CLUSTER="mern-cluster-ha"
NEW_REGION="europe-west1"
NAMESPACE="mern-app"

echo "🚀 Starting workload migration to regional cluster..."

# Backup current configurations
echo "💾 Backing up current configurations..."
mkdir -p backup
kubectl get deployments -n $NAMESPACE -o yaml > backup/deployments-backup.yaml
kubectl get services -n $NAMESPACE -o yaml > backup/services-backup.yaml
kubectl get configmaps -n $NAMESPACE -o yaml > backup/configmaps-backup.yaml
kubectl get secrets -n $NAMESPACE -o yaml > backup/secrets-backup.yaml
kubectl get ingress -n $NAMESPACE -o yaml > backup/ingress-backup.yaml

echo "✅ Configurations backed up to ./backup/"

# Get credentials for new cluster
echo "🔑 Getting credentials for new regional cluster..."
gcloud container clusters get-credentials $NEW_CLUSTER --region=$NEW_REGION --project=$PROJECT_ID

# Create namespace in new cluster
echo "📁 Creating namespace in new cluster..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Apply configurations to new cluster
echo "🔄 Applying configurations to new cluster..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/mongodb/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/

# Apply temporary ingress (without TLS placeholders)
echo "🌐 Applying temporary ingress configuration..."
kubectl apply -f k8s/ingress-temp.yaml

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/backend -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n $NAMESPACE

# Apply HPA and PDB configurations
echo "📈 Applying HPA and PDB configurations..."
kubectl apply -f k8s/backend/hpa.yaml
kubectl apply -f k8s/frontend/hpa.yaml
kubectl apply -f k8s/backend/pdb.yaml
kubectl apply -f k8s/frontend/pdb.yaml

echo "✅ Migration completed!"
echo ""
echo "📊 New cluster status:"
kubectl get all -n $NAMESPACE
kubectl get hpa -n $NAMESPACE
kubectl get pdb -n $NAMESPACE
kubectl get nodes -o wide

echo ""
echo "📝 Next steps:"
echo "1. Test the application on the new cluster"
echo "2. Get the external IP: kubectl get ingress -n $NAMESPACE"
echo "3. Update DNS to point to the new cluster's ingress IP"
echo "4. Update ingress.yaml with your actual domain and apply cert-manager"
echo "5. Update CI/CD pipelines to deploy to $NEW_CLUSTER in $NEW_REGION"
echo "6. Monitor the new cluster for 24-48 hours"
echo "7. Delete old cluster after validation: gcloud container clusters delete $OLD_CLUSTER --zone=$OLD_ZONE --project=$PROJECT_ID"