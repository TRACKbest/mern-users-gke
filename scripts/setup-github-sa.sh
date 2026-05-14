#!/bin/bash
set -euo pipefail

# Configuration
PROJECT_ID="alex-496108"
SA_NAME="github-actions-deployer"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="./gh-actions-key.json"

echo "=== Setting up GitHub Actions Service Account ==="

# Set active project
gcloud config set project $PROJECT_ID

# Create service account
echo "Creating service account..."

gcloud iam service-accounts create $SA_NAME \
  --display-name="GitHub Actions Deployer" \
  2>/dev/null || echo "Service account already exists"

# Grant required roles
echo "Granting roles..."

for ROLE in \
  "roles/container.developer" \
  "roles/artifactregistry.writer" \
  "roles/container.clusterViewer"
do
  gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="$ROLE" \
    --quiet
done

# Create service account key
echo "Creating service account key..."

gcloud iam service-accounts keys create $KEY_FILE \
  --iam-account=$SA_EMAIL

echo ""
echo "=== Service Account Created Successfully ==="
echo "Service Account: $SA_EMAIL"
echo "Key file: $KEY_FILE"
echo ""
echo "=== GitHub Actions Setup ==="
echo "1. Open your GitHub repository"
echo "2. Go to: Settings -> Secrets and variables -> Actions"
echo "3. Create a secret named: GCP_SA_KEY"
echo "4. Copy and paste the content of:"
echo "   $KEY_FILE"
echo ""
echo "Then delete the local key file:"
echo "rm $KEY_FILE"
echo ""
echo "IMPORTANT: Never commit the key file to GitHub!" 
