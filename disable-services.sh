#!/bin/bash

# Script pour désactiver tous les services afin d'économiser les coûts
# Usage: ./disable-services.sh

NAMESPACE="mern-app"

echo "=== Désactivation des services pour économiser les coûts ==="
echo "Namespace: $NAMESPACE"
echo ""

# Sauvegarder les configurations actuelles
echo "Sauvegarde des configurations actuelles..."
kubectl get deployment -n $NAMESPACE -o json > deployments-backup.json
kubectl get statefulset -n $NAMESPACE -o json > statefulsets-backup.json

# Mettre à l'échelle les déploiements à 0
echo ""
echo "Mise à l'échelle des déploiements à 0 replicas..."
kubectl scale deployment backend -n $NAMESPACE --replicas=0
kubectl scale deployment frontend -n $NAMESPACE --replicas=0

# Mettre à l'échelle le StatefulSet MongoDB à 0
echo "Mise à l'échelle du StatefulSet MongoDB à 0 replicas..."
kubectl scale statefulset mongodb -n $NAMESPACE --replicas=0

echo ""
echo "=== Vérification de l'état ==="
kubectl get pods -n $NAMESPACE
kubectl get nodes

echo ""
echo "=== Services désactivés avec succès ==="
echo "Les fichiers de sauvegarde sont disponibles :"
echo "  - deployments-backup.json"
echo "  - statefulsets-backup.json"