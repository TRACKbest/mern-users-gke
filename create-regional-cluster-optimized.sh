#!/bin/bash

# Script to create a regional GKE cluster with optimized resource usage
# This configuration uses fewer resources to avoid quota issues

set -e

PROJECT_ID="alex-496108"
NEW_CLUSTER_NAME="mern-cluster-ha"
REGION="europe-west1"
ZONES="europe-west1-b,europe-west1-d"  # Using only 2 zones to reduce resource usage
MACHINE_TYPE="e2-small"  # Smaller machine type
NUM_NODES=1  # Fewer initial nodes
DISK_SIZE=20  # Smaller disk size

echo "🌍 Creating optimized regional GKE cluster for high availability..."

# Create regional cluster with optimized resource configuration
echo "📍 Creating regional cluster in $REGION with zones: $ZONES..."
gcloud container clusters create $NEW_CLUSTER_NAME \
    --region=$REGION \
    --node-locations=$ZONES \
    --num-nodes=$NUM_NODES \
    --machine-type=$MACHINE_TYPE \
    --disk-size=$DISK_SIZE \
    --disk-type=pd-standard \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=3 \
    --enable-ip-alias \
    --network=default \
    --project=$PROJECT_ID

echo "✅ Regional cluster created successfully!"
echo "📊 New cluster configuration:"
echo "   - Name: $NEW_CLUSTER_NAME"
echo "   - Region: $REGION"
echo "   - Zones: $ZONES"
echo "   - Initial nodes: $NUM_NODES per zone"
echo "   - Machine type: $MACHINE_TYPE"
echo "   - Disk size: ${DISK_SIZE}GB"
echo "   - Autoscaling: 1-3 nodes per zone"
echo ""
echo "📝 Next steps:"
echo "1. Get credentials: gcloud container clusters get-credentials $NEW_CLUSTER_NAME --region=$REGION --project=$PROJECT_ID"
echo "2. Migrate workloads from old cluster using migration scripts"
echo "3. Update CI/CD pipelines to deploy to new cluster"
echo "4. Test and verify new cluster"
echo "5. Delete old cluster after validation"