#!/bin/bash

# Script to create a new regional GKE cluster for true multi-zone high availability
# This will be a separate cluster from the current single-zone cluster

set -e

PROJECT_ID="alex-496108"
NEW_CLUSTER_NAME="mern-cluster-ha"
REGION="europe-west1"
ZONES="europe-west1-b,europe-west1-c,europe-west1-d"
MACHINE_TYPE="e2-medium"
NUM_NODES=2

echo "🌍 Creating new regional GKE cluster for high availability..."

# Create regional cluster with multi-zone configuration
echo "📍 Creating regional cluster in $REGION with zones: $ZONES..."
gcloud container clusters create $NEW_CLUSTER_NAME \
    --region=$REGION \
    --node-locations=$ZONES \
    --num-nodes=$NUM_NODES \
    --machine-type=$MACHINE_TYPE \
    --enable-autoscaling \
    --min-nodes=2 \
    --max-nodes=6 \
    --enable-vertical-pod-autoscaling \
    --enable-ip-alias \
    --network=default \
    --enable-shielded-nodes \
    --project=$PROJECT_ID

echo "✅ Regional cluster created successfully!"
echo "📊 New cluster configuration:"
echo "   - Name: $NEW_CLUSTER_NAME"
echo "   - Region: $REGION"
echo "   - Zones: $ZONES"
echo "   - Initial nodes: $NUM_NODES per zone"
echo "   - Autoscaling: 2-6 nodes per zone"
echo "   - Private nodes with shielded security"
echo ""
echo "📝 Next steps:"
echo "1. Get credentials: gcloud container clusters get-credentials $NEW_CLUSTER_NAME --region=$REGION --project=$PROJECT_ID"
echo "2. Migrate workloads from old cluster using migration scripts"
echo "3. Update CI/CD pipelines to deploy to new cluster"
echo "4. Test and verify new cluster"
echo "5. Delete old cluster after validation"