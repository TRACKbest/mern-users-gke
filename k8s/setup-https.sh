#!/bin/bash
# Script de déploiement HTTPS avec cert-manager + Let's Encrypt + nip.io
# Usage: ./setup-https.sh <YOUR_EXTERNAL_IP>
# Exemple: ./setup-https.sh 34.56.78.90

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <EXTERNAL_IP>"
  echo "Exemple: $0 34.56.78.90"
  echo ""
  echo "Pour trouver votre IP statique GKE:"
  echo "  gcloud compute addresses describe mern-app-ip --global --format='value(address)'"
  exit 1
fi

EXTERNAL_IP=$1
DOMAIN="${EXTERNAL_IP}.nip.io"

echo "=== Configuration HTTPS pour ${DOMAIN} ==="

# 1. Installer cert-manager
echo ""
echo "[1/4] Installation de cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.4/cert-manager.yaml

echo "Attente que cert-manager soit prêt..."
kubectl wait --for=condition=Available deployment/cert-manager -n cert-manager --timeout=120s
kubectl wait --for=condition=Available deployment/cert-manager-webhook -n cert-manager --timeout=120s
kubectl wait --for=condition=Available deployment/cert-manager-cainjector -n cert-manager --timeout=120s

# 2. Remplacer les placeholders dans les manifests
echo ""
echo "[2/4] Configuration du domaine: ${DOMAIN}"

sed -i "s/<YOUR_EXTERNAL_IP>.nip.io/${DOMAIN}/g" k8s/ingress.yaml
sed -i "s/<YOUR_EXTERNAL_IP>.nip.io/${DOMAIN}/g" k8s/cert-manager/certificate.yaml

# 3. Appliquer le ClusterIssuer
echo ""
echo "[3/4] Création du ClusterIssuer Let's Encrypt..."
kubectl apply -f k8s/cert-manager/cluster-issuer.yaml

# 4. Appliquer le Certificate et l'Ingress mis à jour
echo ""
echo "[4/4] Déploiement du certificat et de l'Ingress..."
kubectl apply -f k8s/cert-manager/certificate.yaml
kubectl apply -f k8s/ingress.yaml

echo ""
echo "=== Déploiement terminé ==="
echo ""
echo "Vérification du certificat (peut prendre 2-5 minutes) :"
echo "  kubectl get certificate mern-app-tls -n mern-app"
echo "  kubectl describe certificate mern-app-tls -n mern-app"
echo ""
echo "Une fois le certificat Ready, accédez à votre app :"
echo "  https://${DOMAIN}"
echo "  https://${DOMAIN}/api"
echo ""
echo "Note: La propagation du certificat peut prendre jusqu'à 10 minutes avec GCE Ingress."
