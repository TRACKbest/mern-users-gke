# 🚨 Guide pour configurer l'IP statique 34.110.229.165

## 📋 Problème actuel
- ✅ Application fonctionne sur l'IP automatique: `104.155.122.241`
- ❌ Application ne fonctionne PAS sur l'IP statique: `34.110.229.165`
- 🔧 Le service nginx LoadBalancer utilise l'IP automatique au lieu de l'IP statique

## 🛠️ Solution

### Étape 1: Redémarrer Cloud Shell (OBLIGATOIRE)
1. **Fermez complètement** votre session Cloud Shell actuelle
2. **Ouvrez une nouvelle session** Cloud Shell
3. **Authentifiez-vous:**
   ```bash
   gcloud auth login
   ```

### Étape 2: Exécuter le script de correction
Une fois dans le nouveau Cloud Shell avec kubectl fonctionnel:

```bash
# Version simple (patch)
cd /home/nantenainaalex79/mern-user-management
./fix-static-ip.sh

# OU version robuste (recréation du service)
cd /home/nantenainaalex79/mern-user-management
./fix-static-ip-v2.sh
```

### Étape 3: Vérifier la configuration
```bash
# Vérifier que le service nginx utilise l'IP statique
kubectl get svc ingress-nginx-controller -n ingress-nginx

# Vérifier l'ingress
kubectl get ingress mern-ingress -n mern-app
```

### Étape 4: Tester l'accès
```bash
# Test avec curl
curl http://34.110.229.165.nip.io

# Test direct IP
curl http://34.110.229.165
```

## 🎯 Ce qui a été modifié

### 1. Service nginx LoadBalancer
- **Avant:** Utilisait l'IP automatique `104.155.122.241`
- **Après:** Utilisera l'IP statique `34.110.229.165`

### 2. Configuration Ingress
- **Simplifiée** pour utiliser uniquement le domaine `34.110.229.165.nip.io`
- **Ajout** de l'annotation nginx pour le rewrite target
- **Suppression** des règles dupliquées

## 📝 Fichiers modifiés/créés
- `k8s/ingress.yaml` - Configuration ingress simplifiée
- `k8s/nginx-lb-patch.yaml` - Patch pour le service nginx
- `fix-static-ip.sh` - Script de correction simple
- `fix-static-ip-v2.sh` - Script de correction robuste
- `STATIC_IP_FIX_GUIDE.md` - Ce guide

## 🔍 Dépannage

### Si le script échoue:
```bash
# Vérifier que kubectl fonctionne
kubectl get pods -n mern-app

# Vérifier l'état de l'IP statique
gcloud compute addresses describe mern-app-ip --global

# Manuellement patcher le service
kubectl patch svc ingress-nginx-controller -n ingress-nginx -p '{"spec":{"loadBalancerIP":"34.110.229.165"}}'
```

### Si l'IP statique ne s'assigne pas:
1. Vérifier que l'IP est bien réservée: `gcloud compute addresses list`
2. Attendre 2-3 minutes pour la propagation
3. Vérifier les logs du controller nginx: `kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller`

## 🌐 URLs d'accès après correction
- **Domaine:** http://34.110.229.165.nip.io
- **Direct IP:** http://34.110.229.165

Les deux devraient fonctionner après l'application de ce script.