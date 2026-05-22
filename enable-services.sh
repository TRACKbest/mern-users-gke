#!/bin/bash

# Script pour réactiver tous les services pour la présentation
# Usage: ./enable-services.sh

NAMESPACE="mern-app"

echo "=== Réactivation des services pour la présentation ==="
echo "Namespace: $NAMESPACE"
echo ""

# Réactiver MongoDB en premier (base de données requise)
echo "Réactivation du StatefulSet MongoDB..."
kubectl scale statefulset mongodb -n $NAMESPACE --replicas=1

echo "Attente que MongoDB soit prêt..."
kubectl wait --for=condition=ready pod -l app=mongodb -n $NAMESPACE --timeout=300s

# Réactiver le backend
echo ""
echo "Réactivation du backend..."
kubectl scale deployment backend -n $NAMESPACE --replicas=4

echo "Attente que le backend soit prêt..."
kubectl wait --for=condition=available deployment/backend -n $NAMESPACE --timeout=300s

# Réactiver le frontend
echo ""
echo "Réactivation du frontend..."
kubectl scale deployment frontend -n $NAMESPACE --replicas=2

echo "Attente que le frontend soit prêt..."
kubectl wait --for=condition=available deployment/frontend -n $NAMESPACE --timeout=300s

echo ""
echo "=== Vérification de l'état ==="
kubectl get pods -n $NAMESPACE
kubectl get nodes

echo ""
echo "=== Services réactivés avec succès ==="
echo "Tous les services sont maintenant opérationnels"