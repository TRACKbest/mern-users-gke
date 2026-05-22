#!/bin/bash

# Script to upgrade GKE cluster for high availability and scalability
# This script upgrades the existing cluster to multi-zone and enables autoscaling

set -e

PROJECT_ID="alex-496108"
CLUSTER_NAME="mern-cluster"
REGION="europe-west1"
ZONES="europe-west1-b,europe-west1-c,europe-west1-d"

echo "🔧 Upgrading GKE cluster for high availability..."

# Upgrade cluster to regional (multi-zone)
echo "📍 Upgrading cluster to regional with multiple zones..."
gcloud container clusters update $CLUSTER_NAME \
    --region=$REGION \
    --node-locations=$ZONES \
    --enable-autoscaling \
    --min-nodes=2 \
    --max-nodes=6 \
    --project=$PROJECT_ID

echo "✅ Cluster upgrade completed!"
echo "📊 New configuration:"
echo "   - Regional cluster with zones: $ZONES"
echo "   - Autoscaling enabled: 2-6 nodes"
echo "   - High availability: Multi-zone deployment"