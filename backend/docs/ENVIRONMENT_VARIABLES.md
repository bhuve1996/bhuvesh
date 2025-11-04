# Cloud Run Environment Variables Guide

## ✅ Current Setup

Your environment variables are **already set** and will persist across deployments:

- `ENVIRONMENT=production`
- `GEMINI_API_KEY=AIzaSyAV9-3KvdlwgBbt1etD02Qk_PrTY98-Zqs`

## 🔧 Methods to Set Environment Variables

### Method 1: Using gcloud CLI (Current Method)

```bash
# Set environment variables directly
gcloud run services update bhuvesh-backend \
    --region us-central1 \
    --update-env-vars "GEMINI_API_KEY=your-key,ENVIRONMENT=production"
```

**✅ Pros:**

- Simple and immediate
- Persists across deployments
- Easy to update

**❌ Cons:**

- API keys visible in service config
- Not ideal for sensitive secrets

### Method 2: Using Helper Script

```bash
# Use the helper script
./backend/scripts/set-cloud-run-env.sh [GEMINI_API_KEY]

# Example:
./backend/scripts/set-cloud-run-env.sh AIzaSyAV9-3KvdlwgBbt1etD02Qk_PrTY98-Zqs
```

### Method 3: Using Secret Manager (Recommended for Production)

For sensitive values like API keys, use Google Secret Manager:

```bash
# 1. Create secret
echo -n "AIzaSyAV9-3KvdlwgBbt1etD02Qk_PrTY98-Zqs" | \
  gcloud secrets create gemini-api-key --data-file=-

# 2. Grant Cloud Run access
PROJECT_NUMBER=$(gcloud projects describe bhuveshportfolio-resumebuilder --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# 3. Update Cloud Run to use secret
gcloud run services update bhuvesh-backend \
    --region us-central1 \
    --update-secrets="GEMINI_API_KEY=gemini-api-key:latest"
```

**✅ Pros:**

- Secure (encrypted at rest)
- Can rotate secrets easily
- Audit trail
- Best practice for production

**❌ Cons:**

- More setup required
- Slightly more complex

### Method 4: Cloud Build (Automatic Deployments)

When using Cloud Build triggers, set variables in `cloudbuild.yaml`:

```yaml
- '--set-env-vars'
- 'ENVIRONMENT=production,GEMINI_API_KEY=${_GEMINI_API_KEY}'
```

Then set `_GEMINI_API_KEY` in Cloud Build trigger substitution variables.

## 📋 Verify Current Environment Variables

```bash
# List all environment variables
gcloud run services describe bhuvesh-backend \
    --region us-central1 \
    --format="get(spec.template.spec.containers[0].env)"

# View in Cloud Console
# https://console.cloud.google.com/run/detail/us-central1/bhuvesh-backend?project=bhuveshportfolio-resumebuilder
```

## 🔄 How Environment Variables Persist

Once set in Cloud Run:

- ✅ They persist across all new deployments
- ✅ They persist when you update the service
- ✅ They persist when you create new revisions
- ❌ They are NOT included in Docker images (good for security)

## 🚨 Important Notes

1. **Current Setup**: Your environment variables are already configured and will persist
2. **Updates**: When you update the service, environment variables are preserved unless explicitly changed
3. **Security**: For production, consider using Secret Manager for sensitive values
4. **Rotation**: You can update environment variables anytime without redeploying code

## 📝 Quick Reference

```bash
# View current env vars
gcloud run services describe bhuvesh-backend --region us-central1 \
    --format="get(spec.template.spec.containers[0].env)"

# Update env vars
gcloud run services update bhuvesh-backend --region us-central1 \
    --update-env-vars "KEY1=value1,KEY2=value2"

# Remove env var
gcloud run services update bhuvesh-backend --region us-central1 \
    --remove-env-vars "KEY1"

# Use secrets instead
gcloud run services update bhuvesh-backend --region us-central1 \
    --update-secrets="GEMINI_API_KEY=secret-name:latest"
```
