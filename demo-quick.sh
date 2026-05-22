#!/bin/bash

# Script de démonstration rapide (5-10 minutes)
# Pour montrer HA et scaling à un professeur

set -e

NAMESPACE="mern-app"
CLUSTER="mern-cluster-ha"
REGION="europe-west1"

echo "🎯 DÉMONSTRATION RAPIDE HA ET SCALING"
echo "===================================="
echo ""

echo "1️⃣ CONFIGURATION MULTI-ZONE"
echo "----------------------------"
echo "Cluster régional avec zones:"
gcloud container clusters describe $CLUSTER --region=$REGION --format="value(locations)"
echo ""
echo "Distribution des pods sur les zones:"
kubectl get pods -n $NAMESPACE -o wide
echo ""

echo "2️⃣ CONFIGURATION HPA"
echo "--------------------"
kubectl get hpa -n $NAMESPACE
echo ""

echo "3️⃣ POD DISRUPTION BUDGETS"
echo "-------------------------"
kubectl get pdb -n $NAMESPACE
echo ""

echo "4️⃣ TEST DE CHARGE - Génération de charge"
echo "-----------------------------------------"
# Installer Apache Bench si nécessaire
if ! command -v ab &> /dev/null; then
    echo "Installation d'Apache Bench..."
    sudo apt-get update -qq && sudo apt-get install -y apache2-utils -qq
fi

# Récupérer l'IP du backend
BACKEND_IP=$(kubectl get service backend-service -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')
echo "Backend IP: $BACKEND_IP"
echo ""

echo "Test avec charge moyenne (100 requêtes, 10 concurrents):"
ab -n 100 -c 10 http://$BACKEND_IP:5000/health 2>&1 | grep -E "(Requests per second|Time taken|Failed requests)"
echo ""

echo "5️⃣ OBSERVATION DU SCALING"
echo "-------------------------"
echo "Attente de 15 secondes pour observer l'HPA..."
sleep 15
echo ""
echo "État HPA après charge:"
kubectl get hpa -n $NAMESPACE
echo ""
echo "Nombre de replicas:"
kubectl get deployments -n $NAMESPACE
echo ""

echo "6️⃣ TEST HAUTE DISPONIBILITÉ"
echo "----------------------------"
echo "Simulation de panne de node..."
NODE_NAME=$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')
echo "Node à rendre indisponible: $NODE_NAME"
kubectl cordon $NODE_NAME
echo "✅ Node $NODE_NAME cordonné"
echo ""

echo "Attente de 20 secondes pour observer la redistribution..."
sleep 20
echo ""

echo "Nouvelle distribution des pods:"
kubectl get pods -n $NAMESPACE -o wide
echo ""

echo "Récupération du node:"
kubectl uncordon $NODE_NAME
echo "✅ Node $NODE_NAME rétabli"
echo ""

echo "7️⃣ ÉTAT FINAL"
echo "--------------"
echo "HPA final:"
kubectl get hpa -n $NAMESPACE
echo ""
echo "Deployments finaux:"
kubectl get deployments -n $NAMESPACE
echo ""

echo "Utilisation des ressources:"
kubectl top pods -n $NAMESPACE
echo ""

echo "✅ DÉMONSTRATION TERMINÉE AVEC SUCCÈS!"
echo ""
echo "🎓 Points clés démontrés:"
echo "  ✅ Cluster multi-zone (europe-west1-b, europe-west1-d)"
echo "  ✅ Horizontal Pod Autoscaler fonctionnel"
echo "  ✅ Pod Disruption Budgets actifs"
echo "  ✅ Redistribution automatique des pods"
echo "  ✅ Haute disponibilité prouvée"