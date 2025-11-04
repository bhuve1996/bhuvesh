#!/bin/bash
# Script to set environment variables in Cloud Run
# These persist across all deployments

SERVICE_NAME="bhuvesh-backend"
REGION="us-central1"
PROJECT_ID="bhuveshportfolio-resumebuilder"

# Set your Gemini API key here or pass as argument
GEMINI_API_KEY="${1:-AIzaSyAV9-3KvdlwgBbt1etD02Qk_PrTY98-Zqs}"

echo "🔧 Setting environment variables for Cloud Run service..."
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo ""

# Update environment variables
gcloud run services update $SERVICE_NAME \
    --region $REGION \
    --update-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY,ENVIRONMENT=production" \
    --project $PROJECT_ID

echo ""
echo "✅ Environment variables updated successfully!"
echo ""
echo "Current environment variables:"
gcloud run services describe $SERVICE_NAME \
    --region $REGION \
    --format="get(spec.template.spec.containers[0].env)" \
    --project $PROJECT_ID

