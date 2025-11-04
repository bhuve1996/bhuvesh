# GitHub to Cloud Run Automatic Deployment Setup

This guide will help you set up automatic deployments from GitHub to Cloud Run.

## 📋 Prerequisites

- ✅ Google Cloud Project: `bhuveshportfolio-resumebuilder`
- ✅ Cloud Build API enabled
- ✅ Cloud Run API enabled
- ✅ GitHub repository: `bhuve1996/bhuvesh`
- ✅ Dockerfile in `backend/Dockerfile`
- ✅ Environment variables already configured in Cloud Run

## 🚀 Quick Setup (Using Script)

```bash
# Run the setup script
./backend/scripts/setup-github-trigger.sh
```

## 📝 Manual Setup Steps

### Step 1: Connect GitHub Repository

1. Go to Cloud Build Triggers:

   ```
   https://console.cloud.google.com/cloud-build/triggers?project=bhuveshportfolio-resumebuilder
   ```

2. Click **"Connect Repository"**

3. Select **"GitHub (Cloud Build GitHub App)"**

4. Click **"Install Google Cloud Build"** if prompted

5. Authorize access to your GitHub account

6. Select repository: **`bhuve1996/bhuvesh`**

7. Click **"Connect"**

### Step 2: Create Build Trigger

1. In the Cloud Build Triggers page, click **"Create Trigger"**

2. Configure the trigger:
   - **Name**: `bhuvesh-backend-deploy`
   - **Event**: `Push to a branch`
   - **Source**: Select `bhuve1996/bhuvesh`
   - **Branch**: `^main$` (regex pattern)
   - **Configuration**: `Cloud Build configuration file (yaml or json)`
   - **Location**: `backend/cloudbuild.yaml`

3. Click **"Create"**

### Step 3: Verify Setup

```bash
# List triggers
gcloud builds triggers list --project=bhuveshportfolio-resumebuilder

# Test by pushing to main
git push origin main

# Watch builds
gcloud builds list --limit=5
```

## 🔧 Configuration Details

### Build Configuration (`backend/cloudbuild.yaml`)

The build configuration:

- Builds Docker image from `backend/Dockerfile`
- Pushes to Google Container Registry
- Deploys to Cloud Run service `bhuvesh-backend`
- Preserves existing environment variables automatically

### Environment Variables

**Important**: Environment variables are already set in Cloud Run:

- `GEMINI_API_KEY` ✅
- `ENVIRONMENT=production` ✅

These will **automatically persist** across all deployments. No need to set them in the build config.

### What Happens on Push

1. **Push to `main` branch** → Triggers Cloud Build
2. **Cloud Build**:
   - Clones your repository
   - Builds Docker image from `backend/Dockerfile`
   - Pushes image to Container Registry
   - Deploys new revision to Cloud Run
   - Preserves all existing environment variables
3. **Cloud Run**:
   - Creates new revision
   - Routes traffic to new revision
   - Keeps old revision for rollback

## 🔍 Monitoring Deployments

### View Build History

```bash
# List recent builds
gcloud builds list --limit=10

# View specific build
gcloud builds describe BUILD_ID

# Stream build logs
gcloud builds log-stream BUILD_ID
```

### Cloud Console

- **Builds**: https://console.cloud.google.com/cloud-build/builds?project=bhuveshportfolio-resumebuilder
- **Triggers**: https://console.cloud.google.com/cloud-build/triggers?project=bhuveshportfolio-resumebuilder
- **Cloud Run**: https://console.cloud.google.com/run?project=bhuveshportfolio-resumebuilder

### View Service Logs

```bash
# View recent logs
gcloud run services logs read bhuvesh-backend --region us-central1 --limit=50

# Stream logs
gcloud run services logs tail bhuvesh-backend --region us-central1
```

## 🛠️ Troubleshooting

### Build Fails

1. **Check build logs**:

   ```bash
   gcloud builds list --limit=1
   gcloud builds log BUILD_ID
   ```

2. **Common issues**:
   - Dockerfile path incorrect
   - Missing dependencies
   - Build timeout
   - Insufficient permissions

### Deployment Fails

1. **Check Cloud Run logs**:

   ```bash
   gcloud run services logs read bhuvesh-backend --region us-central1
   ```

2. **Verify environment variables**:
   ```bash
   gcloud run services describe bhuvesh-backend --region us-central1 \
     --format="get(spec.template.spec.containers[0].env)"
   ```

### Trigger Not Firing

1. **Verify branch pattern**: Should match `^main$`
2. **Check repository connection**: Ensure GitHub repo is connected
3. **Verify file path**: `backend/cloudbuild.yaml` must exist
4. **Check permissions**: Ensure Cloud Build has necessary permissions

## 🔐 Security Best Practices

1. **Use Secret Manager** for sensitive values:

   ```bash
   # Instead of storing in build config, use secrets
   gcloud secrets create gemini-api-key --data-file=-
   ```

2. **Limit trigger scope**: Only trigger on `main` branch

3. **Review build logs**: Regularly check for security issues

4. **IAM Permissions**: Follow principle of least privilege

## 📝 Update Configuration

To update the build configuration:

1. Edit `backend/cloudbuild.yaml`
2. Commit and push to `main`
3. Next build will use new configuration

## 🔄 Rollback

If a deployment fails:

```bash
# List revisions
gcloud run revisions list --service bhuvesh-backend --region us-central1

# Rollback to previous revision
gcloud run services update-traffic bhuvesh-backend \
  --region us-central1 \
  --to-revisions=PREVIOUS_REVISION=100
```

## ✅ Verification Checklist

- [ ] GitHub repository connected
- [ ] Cloud Build trigger created
- [ ] Build configuration file exists (`backend/cloudbuild.yaml`)
- [ ] Dockerfile exists (`backend/Dockerfile`)
- [ ] Environment variables set in Cloud Run
- [ ] Test deployment successful
- [ ] Monitoring setup

## 🎉 Success!

Once set up, every push to `main` will automatically:

1. Build your Docker image
2. Deploy to Cloud Run
3. Preserve environment variables
4. Keep your service updated

No manual deployments needed! 🚀
