#!/bin/bash

# Script pour réduire le nombre de nœuds à 1 (économies maximales)
# Usage: ./scale-nodes-down.sh

CLUSTER_NAME="mern-cluster-ha"
ZONE="europe-west1-b"  # Ajustez selon votre zone
POOL_NAME="default-pool"

echo "=== Réduction du nombre de nœuds à 1 ==="
echo "Cluster: $CLUSTER_NAME"
echo "Pool: $POOL_NAME"
echo ""

# Réduire à 1 nœud
gcloud container clusters resize $CLUSTER_NAME \
  --node-pool $POOL_NAME \
  --num-nodes 1 \
  --zone $ZONE \
  --quiet

echo ""
echo "=== Vérification de l'état des nœuds ==="
kubectl get nodes

echo ""
echo "=== Nœuds réduits à 1 ==="
echo "Utilisez ./scale-nodes-up.sh pour revenir à 3 nœuds"