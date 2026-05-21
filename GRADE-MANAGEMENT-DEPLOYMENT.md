# Guide de déploiement - Système de Gestion de Notes Universitaires

## Résumé des changements

L'application MERN a été transformée en système de gestion de notes universitaires avec les fonctionnalités suivantes :

### Backend
- **Nouveau modèle Grade** : Stockage des notes avec matière, note (0-20), coefficient, semestre, année académique
- **Nouveau contrôleur gradeController** : Opérations CRUD et calcul de statistiques
- **Nouvelles routes gradeRoutes** : API endpoints pour la gestion des notes
- **Mise à jour User model** : Ajout des champs étudiant (studentId, major, academicYear)
- **Changement de rôle par défaut** : De 'user' à 'student'

### Frontend
- **Nouvelle page GradesList** : Liste des notes avec formulaire d'ajout/suppression
- **Nouvelle page GradeStats** : Statistiques avec moyennes générales et par matière
- **Nouveau service gradeService** : Service API pour les opérations sur les notes
- **Mise à jour navigation** : Ajout des liens vers Notes et Statistiques
- **Transformation landing page** : Contenu adapté à la gestion de notes universitaires
- **Formulaire d'inscription** : Ajout des champs étudiant
- **Interface française** : Traduction de l'interface utilisateur

## Méthodes de déploiement

### Option 1 : GitHub Actions (Recommandé)

Les GitHub Actions sont déjà configurées dans `.github/workflows/`. Elles devraient se déclencher automatiquement lors du push vers main.

**Prérequis :**
- Variables GitHub configurées : `GCP_PROJECT_ID`
- Secrets GitHub configurés : `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`

**Pour vérifier le statut :**
```bash
gh auth login
gh run list
gh run view
```

### Option 2 : Déploiement manuel via Docker et GCR

Si les GitHub Actions ne fonctionnent pas, voici la procédure manuelle :

#### 1. Construire les images Docker

```bash
# Backend
cd /home/nantenainaalex79/mern-user-management/backend
docker build -t europe-west1-docker.pkg.dev/alex-496108/mern-app/backend:v2-grades .

# Frontend
cd /home/nantenainaalex79/mern-user-management/frontend
docker build -t europe-west1-docker.pkg.dev/alex-496108/mern-app/frontend:v2-grades .
```

#### 2. Authentifier Docker avec GCR

```bash
gcloud auth configure-docker europe-west1-docker.pkg.dev
```

#### 3. Pousser les images vers GCR

```bash
# Backend
docker push europe-west1-docker.pkg.dev/alex-496108/mern-app/backend:v2-grades

# Frontend
docker push europe-west1-docker.pkg.dev/alex-496108/mern-app/frontend:v2-grades
```

#### 4. Mettre à jour les déploiements Kubernetes

```bash
# Backend
kubectl set image deployment/backend \
  backend=europe-west1-docker.pkg.dev/alex-496108/mern-app/backend:v2-grades \
  -n mern-app

# Frontend
kubectl set image deployment/frontend \
  frontend=europe-west1-docker.pkg.dev/alex-496108/mern-app/frontend:v2-grades \
  -n mern-app
```

#### 5. Vérifier le déploiement

```bash
kubectl rollout status deployment/backend -n mern-app
kubectl rollout status deployment/frontend -n mern-app
kubectl get pods -n mern-app
```

### Option 3 : Mise à jour directe des fichiers Kubernetes

Si vous préférez mettre à jour les fichiers de configuration Kubernetes :

#### 1. Mettre à jour les fichiers de déploiement

```bash
# Backend
kubectl edit deployment backend -n mern-app
# Changer l'image vers : europe-west1-docker.pkg.dev/alex-496108/mern-app/backend:v2-grades

# Frontend
kubectl edit deployment frontend -n mern-app
# Changer l'image vers : europe-west1-docker.pkg.dev/alex-496108/mern-app/frontend:v2-grades
```

## Vérification du déploiement

Une fois le déploiement effectué, vérifiez :

```bash
# État des pods
kubectl get pods -n mern-app

# Logs des pods
kubectl logs -f deployment/backend -n mern-app
kubectl logs -f deployment/frontend -n mern-app

# Services
kubectl get svc -n mern-app

# Ingress
kubectl get ingress -n mern-app
```

## Test de l'application

1. **Accéder à l'application** via l'URL Ingress
2. **Créer un compte étudiant** avec les nouveaux champs (numéro étudiant, filière, etc.)
3. **Ajouter des notes** via la page "Notes"
4. **Voir les statistiques** via la page "Statistiques"
5. **Vérifier la landing page** pour confirmer le nouveau thème

## Résolution de problèmes

### Problèmes de connexion GCR

Si vous rencontrez des problèmes de connexion avec GCR :

```bash
# Réauthentifier
gcloud auth login
gcloud auth configure-docker europe-west1-docker.pkg.dev

# Vérifier la configuration
docker info | grep -i registry
```

### Pods en CrashLoopBackOff

```bash
# Vérifier les logs
kubectl logs <pod-name> -n mern-app

# Vérifier les événements
kubectl describe pod <pod-name> -n mern-app
```

### Mise à jour du schéma de base de données

Le nouveau modèle Grade nécessite que MongoDB soit opérationnel. Si vous rencontrez des erreurs de base de données :

```bash
# Vérifier l'état de MongoDB
kubectl get statefulset mongodb -n mern-app
kubectl exec -it mongodb-0 -n mern-app -- mongosh --eval "db.adminCommand('ping')"
```

## Fichiers modifiés

### Backend
- `backend/src/models/Grade.js` (nouveau)
- `backend/src/controllers/gradeController.js` (nouveau)
- `backend/src/routes/gradeRoutes.js` (nouveau)
- `backend/src/app.js` (modifié)
- `backend/src/controllers/authController.js` (modifié)
- `backend/src/models/User.js` (modifié)

### Frontend
- `frontend/src/pages/GradesList.jsx` (nouveau)
- `frontend/src/pages/GradeStats.jsx` (nouveau)
- `frontend/src/services/gradeService.js` (nouveau)
- `frontend/src/App.jsx` (modifié)
- `frontend/src/components/Navbar.jsx` (modifié)
- `frontend/src/pages/Dashboard.jsx` (modifié)
- `frontend/src/pages/Register.jsx` (modifié)
- `frontend/src/context/AuthContext.jsx` (modifié)
- `frontend/src/components/landing/HeroSection.jsx` (modifié)
- `frontend/src/components/landing/FeaturesSection.jsx` (modifié)
- `frontend/src/components/landing/LandingNavbar.jsx` (modifié)

## Support

Pour toute question ou problème, vérifiez :
1. Les logs des pods Kubernetes
2. Les événements du cluster
3. La configuration des GitHub Actions
4. L'état de la connexion réseau à GCR