#!/bin/bash

# Script to enable autoscaling on existing GKE cluster node pool
# This improves scalability while keeping the current single-zone setup

set -e

PROJECT_ID="alex-496108"
CLUSTER_NAME="mern-cluster"
ZONE="europe-west1-b"
NODE_POOL="default-pool"

echo "🔧 Enabling autoscaling on existing GKE cluster node pool..."

# Enable autoscaling on the existing node pool
echo "📈 Enabling node pool autoscaling..."
gcloud container clusters update $CLUSTER_NAME \
    --zone=$ZONE \
    --enable-autoscaling \
    --min-nodes=2 \
    --max-nodes=6 \
    --node-pool=$NODE_POOL \
    --project=$PROJECT_ID

echo "✅ Node pool autoscaling enabled!"
echo "📊 New configuration:"
echo "   - Cluster: $CLUSTER_NAME (zone: $ZONE)"
echo "   - Node pool: $NODE_POOL"
echo "   - Autoscaling: 2-6 nodes"
echo "   - Note: Cluster remains single-zone. For multi-zone HA, see regional cluster migration guide."