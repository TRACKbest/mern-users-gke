#!/bin/bash

echo "🔧 Configuration complète de l'IP statique pour l'application MERN..."

# Étape 1: Supprimer le service nginx existant pour forcer la recréation avec l'IP statique
echo "🗑️  Suppression du service nginx LoadBalancer existant..."
kubectl delete svc ingress-nginx-controller -n ingress-nginx

# Étape 2: Créer un nouveau service avec l'IP statique
echo "📝 Création du service LoadBalancer avec l'IP statique 34.110.229.165..."
kubectl expose deployment ingress-nginx-controller -n ingress-nginx \
  --name=ingress-nginx-controller \
  --type=LoadBalancer \
  --port=80 \
  --target-port=80 \
  --loadBalancerIP=34.110.229.165

# Étape 3: Appliquer la configuration ingress
echo "📝 Application de la configuration ingress..."
kubectl apply -f /home/nantenainaalex79/mern-user-management/k8s/ingress.yaml

# Étape 4: Attendre que le LoadBalancer soit prêt
echo "⏳ Attente du LoadBalancer (peut prendre 2-3 minutes)..."
for i in {1..30}; do
  EXTERNAL_IP=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
  if [ "$EXTERNAL_IP" == "34.110.229.165" ]; then
    echo "✅ LoadBalancer configuré avec l'IP statique: $EXTERNAL_IP"
    break
  fi
  echo "⏳ En attente... ($i/30)"
  sleep 5
done

# Étape 5: Vérifier le statut final
echo "📊 Statut final:"
kubectl get svc ingress-nginx-controller -n ingress-nginx
kubectl get ingress mern-ingress -n mern-app

echo "✅ Configuration terminée!"
echo "🌐 Accédez à votre application sur: http://34.110.229.165.nip.io"
echo "🌐 Ou directement: http://34.110.229.165"