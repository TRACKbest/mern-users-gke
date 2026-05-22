#!/bin/bash

# Script pour remonter le nombre de nœuds à 3
# Usage: ./scale-nodes-up.sh

CLUSTER_NAME="mern-cluster-ha"
ZONE="europe-west1-b"  # Ajustez selon votre zone
POOL_NAME="default-pool"

echo "=== Augmentation du nombre de nœuds à 3 ==="
echo "Cluster: $CLUSTER_NAME"
echo "Pool: $POOL_NAME"
echo ""

# Augmenter à 3 nœuds
gcloud container clusters resize $CLUSTER_NAME \
  --node-pool $POOL_NAME \
  --num-nodes 3 \
  --zone $ZONE \
  --quiet

echo ""
echo "Attente que les nœuds soient prêts..."
kubectl wait --for=condition=Ready nodes --all --timeout=600s

echo ""
echo "=== Vérification de l'état des nœuds ==="
kubectl get nodes

echo ""
echo "=== Nœuds augmentés à 3 ==="
echo "Tous les nœuds sont maintenant opérationnels"