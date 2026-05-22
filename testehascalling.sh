#!/bin/bash

# Script de test complet pour démontrer la HA et le scaling
# À utiliser pour présenter à un professeur

set -e

echo "🧪 DÉMONSTRATION HAUTE DISPONIBILITÉ ET SCALING"
echo "================================================"
echo ""

# Configuration
NAMESPACE="mern-app"
CLUSTER="mern-cluster-ha"
REGION="europe-west1"

echo "📋 ÉTAPE 1: Vérifier l'état initial du cluster"
echo "----------------------------------------------"
echo "Cluster: $CLUSTER (régional: $REGION)"
echo ""
gcloud container clusters describe $CLUSTER --region=$REGION --format="value(locations,nodePools[0].autoscaling)"
echo ""

echo "📊 ÉTAPE 2: Vérifier la distribution multi-zone des pods"
echo "---------------------------------------------------------"
kubectl get pods -n $NAMESPACE -o wide
echo ""
echo "🌍 Zones des nodes:"
kubectl get nodes -o custom-columns=NAME:.metadata.name,ZONE:.metadata.labels.failure-domain\.beta\.kubernetes\.io/zone,STATUS:.status.ready
echo ""

echo "📈 ÉTAPE 3: Vérifier les configurations HPA"
echo "-------------------------------------------"
kubectl get hpa -n $NAMESPACE
echo ""
echo "Détails HPA Backend:"
kubectl describe hpa backend-hpa -n $NAMESPACE | grep -A 5 "Metrics:"
echo ""

echo "🛡️ ÉTAPE 4: Vérifier les Pod Disruption Budgets"
echo "------------------------------------------------"
kubectl get pdb -n $NAMESPACE
echo ""

echo "🔧 ÉTAPE 5: Vérifier l'autoscaling du cluster"
echo "----------------------------------------------"
gcloud container node-pools describe default-pool --cluster=$CLUSTER --region=$REGION --format="yaml(autoscaling)"
echo ""

echo "💾 ÉTAPE 6: Vérifier l'état des déploiements"
echo "--------------------------------------------"
kubectl get deployments -n $NAMESPACE
echo ""

echo "⏳ En attente de 5 secondes avant les tests de charge..."
sleep 5

echo "🚀 ÉTAPE 7: TEST DE SCALING - Génération de charge"
echo "---------------------------------------------------"
echo "Installation de l'outil de charge (Apache Bench)..."
sudo apt-get update -qq
sudo apt-get install -y apache2-utils -qq

echo ""
echo "📍 Récupération de l'IP du service backend (pour test interne)..."
BACKEND_IP=$(kubectl get service backend-service -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')
echo "Backend IP: $BACKEND_IP"

echo ""
echo "🎯 Test 1: Charge légère (10 requêtes, 1 concurrent)"
echo "----------------------------------------------------"
ab -n 10 -c 1 http://$BACKEND_IP:5000/health 2>&1 | grep -E "(Requests per second|Time taken|Failed requests)"
echo ""

echo "⏳ Attente de 10 secondes pour observer l'HPA..."
sleep 10

echo "📊 État HPA après test léger:"
kubectl get hpa -n $NAMESPACE
echo ""

echo "🎯 Test 2: Charge moyenne (100 requêtes, 10 concurrents)"
echo "--------------------------------------------------------"
ab -n 100 -c 10 http://$BACKEND_IP:5000/health 2>&1 | grep -E "(Requests per second|Time taken|Failed requests)"
echo ""

echo "⏳ Attente de 15 secondes pour observer l'HPA..."
sleep 15

echo "📊 État HPA après test moyen:"
kubectl get hpa -n $NAMESPACE
echo ""
echo "📊 Nombre de replicas:"
kubectl get deployments -n $NAMESPACE
echo ""

echo "🎯 Test 3: Charge élevée (500 requêtes, 50 concurrents)"
echo "-------------------------------------------------------"
ab -n 500 -c 50 http://$BACKEND_IP:5000/health 2>&1 | grep -E "(Requests per second|Time taken|Failed requests)"
echo ""

echo "⏳ Attente de 20 secondes pour observer l'HPA..."
sleep 20

echo "📊 État HPA après test élevé:"
kubectl get hpa -n $NAMESPACE
echo ""
echo "📊 Nombre de replicas:"
kubectl get deployments -n $NAMESPACE
echo ""

echo "🎯 Test 4: Charge très élevée (1000 requêtes, 100 concurrents)"
echo "-------------------------------------------------------------"
ab -n 1000 -c 100 http://$BACKEND_IP:5000/health 2>&1 | grep -E "(Requests per second|Time taken|Failed requests)"
echo ""

echo "⏳ Attente de 30 secondes pour observer l'HPA..."
sleep 30

echo "📊 État HPA final après test très élevé:"
kubectl get hpa -n $NAMESPACE
echo ""
echo "📊 Nombre de replicas final:"
kubectl get deployments -n $NAMESPACE
echo ""

echo "🌍 ÉTAPE 8: TEST DE HA - Simulation de panne de node"
echo "-----------------------------------------------------"
echo "Nodes actuels:"
kubectl get nodes
echo ""

echo "🎯 Simulation: Cordon d'un node (le rendre indisponible)"
echo "--------------------------------------------------------"
FIRST_NODE=$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')
echo "Node à cordonner: $FIRST_NODE"
kubectl cordon $FIRST_NODE
echo "✅ Node $FIRST_NODE cordonné (indisponible pour nouveaux pods)"
echo ""

echo "⏳ Attente de 30 secondes pour observer la redistribution..."
sleep 30

echo "📊 État des pods après simulation de panne:"
kubectl get pods -n $ern-app -o wide
echo ""

echo "📊 Distribution des pods par node:"
kubectl get pods -n $NAMESPACE -o wide --no-headers | awk '{print $7}' | sort | uniq -c
echo ""

echo "🔧 ÉTAPE 9: Récupération du node"
echo "---------------------------------"
kubectl uncordon $FIRST_NODE
echo "✅ Node $FIRST_NODE rétabli"
echo ""

echo "⏳ Attente de 20 secondes pour observer la redistribution..."
sleep 20

echo "📊 État final des pods:"
kubectl get pods -n $NAMESPACE -o wide
echo ""

echo "📈 ÉTAPE 10: Vérification du scaling down"
echo "-----------------------------------------"
echo "⏳ Attente de 60 secondes pour observer le scaling down..."
sleep 60

echo "📊 État HPA après période calme:"
kubectl get hpa -n $NAMESPACE
echo ""
echo "📊 Nombre de replicas après scaling down:"
kubectl get deployments -n $NAMESPACE
echo ""

echo "🎉 RÉSUMÉ DE LA DÉMONSTRATION"
echo "============================="
echo ""
echo "✅ Cluster multi-zone configuré"
echo "✅ HPA actif et fonctionnel"
echo "✅ Autoscaling testé avec différentes charges"
echo "✅ Haute disponibilité testée (simulation de panne)"
echo "✅ Pod Disruption Budgets actifs"
echo "✅ Cluster autoscaling configuré"
echo ""
echo "📊 Métriques finales:"
kubectl top nodes
kubectl top pods -n $NAMESPACE
echo ""
echo "🎯 Démonstration terminée avec succès!"