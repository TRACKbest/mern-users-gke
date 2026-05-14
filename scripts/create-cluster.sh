#!/bin/bash
set -euo pipefail

# Configuration
PROJECT_ID="alex-496108"
CLUSTER_NAME="mern-cluster"
ZONE="europe-west1-b"

echo "=== Creating GKE Cluster: $CLUSTER_NAME ==="

# Set active project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required APIs..."

gcloud services enable \
  container.googleapis.com \
  compute.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com

# Create the GKE cluster
gcloud container clusters create $CLUSTER_NAME \
  --zone=$ZONE \
  --num-nodes=2 \
  --machine-type=e2-medium \
  --disk-size=30 \
  --enable-ip-alias \
  --release-channel=regular

# Get credentials for kubectl
echo "Getting cluster credentials..."

gcloud container clusters get-credentials $CLUSTER_NAME \
  --zone=$ZONE

echo ""
echo "=== Cluster Created Successfully ==="
echo "Cluster: $CLUSTER_NAME"
echo "Zone: $ZONE"
echo "Nodes: 2 x e2-medium"
echo ""
echo "Verify with: kubectl get nodes" 
