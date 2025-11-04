#!/bin/bash
# Script to set up GitHub to Cloud Run automatic deployments

set -e

PROJECT_ID="bhuveshportfolio-resumebuilder"
REGION="us-central1"
SERVICE_NAME="bhuvesh-backend"
REPO_OWNER="bhuve1996"
REPO_NAME="bhuvesh"
BRANCH="^main$"
TRIGGER_NAME="bhuvesh-backend-deploy"

echo "🚀 Setting up GitHub to Cloud Run automatic deployments"
echo "Project: $PROJECT_ID"
echo "Repository: $REPO_OWNER/$REPO_NAME"
echo "Branch: $BRANCH"
echo ""

# Step 1: Connect GitHub repository (if not already connected)
echo "📋 Step 1: Connecting GitHub repository..."
echo ""
echo "You need to connect your GitHub repository first:"
echo "1. Go to: https://console.cloud.google.com/cloud-build/triggers?project=$PROJECT_ID"
echo "2. Click 'Connect Repository'"
echo "3. Select GitHub (Cloud Build GitHub App)"
echo "4. Authorize and select repository: $REPO_OWNER/$REPO_NAME"
echo ""
read -p "Press Enter after you've connected the repository..."

# Step 2: Create Cloud Build trigger
echo ""
echo "📋 Step 2: Creating Cloud Build trigger..."
echo ""

# Check if trigger already exists
if gcloud builds triggers describe "$TRIGGER_NAME" --project="$PROJECT_ID" &>/dev/null; then
    echo "⚠️  Trigger '$TRIGGER_NAME' already exists. Updating..."
    gcloud builds triggers delete "$TRIGGER_NAME" --project="$PROJECT_ID" --quiet
fi

# Create the trigger
gcloud builds triggers create github \
    --name="$TRIGGER_NAME" \
    --repo-name="$REPO_NAME" \
    --repo-owner="$REPO_OWNER" \
    --branch-pattern="$BRANCH" \
    --build-config="backend/cloudbuild.yaml" \
    --project="$PROJECT_ID" \
    --description="Auto-deploy backend to Cloud Run on push to main"

echo ""
echo "✅ Trigger created successfully!"
echo ""
echo "📋 Step 3: Verify the setup"
echo ""
echo "Your trigger is configured to:"
echo "  - Watch: $REPO_OWNER/$REPO_NAME"
echo "  - Branch: $BRANCH"
echo "  - Build config: backend/cloudbuild.yaml"
echo "  - Deploy to: Cloud Run service '$SERVICE_NAME'"
echo ""
echo "🔍 View triggers:"
echo "https://console.cloud.google.com/cloud-build/triggers?project=$PROJECT_ID"
echo ""
echo "📝 To test:"
echo "1. Make a change to backend/"
echo "2. Push to main branch: git push origin main"
echo "3. Watch the build: gcloud builds list --limit=1"
echo ""
echo "🎉 Setup complete! Your deployments will now happen automatically on push to main."

