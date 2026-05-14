#!/bin/bash
set -euo pipefail

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="us-central1"
REPO_NAME="mern-app"

echo "=== Setting up GCP project: $PROJECT_ID ==="

# Set project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable \
  container.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  compute.googleapis.com

# Create Artifact Registry repository for Docker images
echo "Creating Artifact Registry repository..."
gcloud artifacts repositories create $REPO_NAME \
  --repository-format=docker \
  --location=$REGION \
  --description="MERN app Docker images" \
  2>/dev/null || echo "Repository already exists"

# Reserve a global static IP for the Ingress
echo "Reserving static IP..."
gcloud compute addresses create mern-app-ip --global \
  2>/dev/null || echo "Static IP already exists"

# Display the static IP
STATIC_IP=$(gcloud compute addresses describe mern-app-ip --global --format='get(address)')
echo ""
echo "=== Setup Complete ==="
echo "Artifact Registry: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}"
echo "Static IP: ${STATIC_IP}"
echo ""
echo "Next step: Run ./create-cluster.sh"
