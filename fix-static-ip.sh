#!/bin/bash

echo "🔧 Configuration de l'IP statique pour l'application MERN..."

# Étape 1: Appliquer le patch pour le service nginx avec l'IP statique
echo "📝 Configuration du service LoadBalancer avec l'IP statique 34.110.229.165..."
kubectl patch svc ingress-nginx-controller -n ingress-nginx -p '{"spec":{"loadBalancerIP":"34.110.229.165"}}'

# Étape 2: Appliquer la configuration ingress simplifiée
echo "📝 Application de la configuration ingress..."
kubectl apply -f /home/nantenainaalex79/mern-user-management/k8s/ingress.yaml

# Étape 3: Attendre que le LoadBalancer soit prêt
echo "⏳ Attente du LoadBalancer..."
sleep 10

# Étape 4: Vérifier le statut
echo "📊 Vérification du statut:"
kubectl get svc ingress-nginx-controller -n ingress-nginx
kubectl get ingress mern-ingress -n mern-app

echo "✅ Configuration terminée!"
echo "🌐 Accédez à votre application sur: http://34.110.229.165.nip.io"
echo "🌐 Ou directement: http://34.110.229.165"