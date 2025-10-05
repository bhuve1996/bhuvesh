# 🚂 Railway Deployment Guide - Step by Step

## ✅ Prerequisites Checklist

Before you start, make sure you have:

- [x] GitHub account
- [x] Your code pushed to GitHub (DONE ✅)
- [x] Google Gemini API key (get yours from https://makersuite.google.com/app/apikey)

---

## 🚀 Step-by-Step Deployment (5 minutes)

### Step 1: Sign Up for Railway (30 seconds)

1. Go to: **https://railway.app**
2. Click **"Start a New Project"** or **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your repositories

---

### Step 2: Create New Project (1 minute)

1. Once logged in, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your repo: **`bhuve1996/bhuvesh`**
4. Railway will scan your repo and detect Python

---

### Step 3: Configure Service (2 minutes)

Railway might auto-detect your app, but let's configure it properly:

#### Option A: If Railway Creates Service Automatically

1. Click on the service card
2. Go to **"Settings"** tab
3. Set these values:

**Root Directory:**

```
backend
```

**Build Command:** (leave default or set to)

```
pip install -r requirements.txt
```

**Start Command:**

```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### Option B: If You Need to Create Service Manually

1. Click **"+ New"** → **"Service"**
2. Choose **"Deploy from GitHub repo"**
3. Select your repo
4. Follow Option A settings above

---

### Step 4: Add Environment Variables (1 minute)

This is CRITICAL for your app to work!

1. In your service, go to **"Variables"** tab
2. Click **"Add Variable"** or **"New Variable"**
3. Add these variables:

| Variable Name    | Value                                            |
| ---------------- | ------------------------------------------------ |
| `GEMINI_API_KEY` | `your_actual_gemini_api_key_here`                |
| `ENVIRONMENT`    | `production` (optional)                          |
| `PORT`           | `8000` (Railway usually sets this automatically) |

**Screenshot of what it should look like:**

```
GEMINI_API_KEY = your_actual_gemini_api_key_here
ENVIRONMENT = production
```

**Note:** You only need `GEMINI_API_KEY` - we simplified it to use just one variable!

4. Click **"Add"** or **"Save"**

---

### Step 5: Deploy! (2-5 minutes)

1. Railway will automatically start deploying
2. Watch the build logs in the **"Deployments"** tab
3. You'll see:
   ```
   Installing dependencies...
   Downloading torch...
   Installing sentence-transformers...
   Build successful!
   Starting server...
   ```

**⏱️ Build time:** ~3-5 minutes (downloading ML libraries)

---

### Step 6: Get Your Backend URL (10 seconds)

Once deployed:

1. Go to **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"**
4. Railway will give you a URL like:
   ```
   https://bhuvesh-backend-production.up.railway.app
   ```
   or
   ```
   https://your-app-name.railway.app
   ```

**⭐ COPY THIS URL - YOU'LL NEED IT!**

---

### Step 7: Test Your Backend (30 seconds)

1. Open your Railway URL in a browser:

   ```
   https://your-app.railway.app
   ```

2. You should see:

   ```json
   {
     "message": "ATS Resume Checker API is running!"
   }
   ```

3. Test the health endpoint:

   ```
   https://your-app.railway.app/health
   ```

4. Test the API docs (Swagger UI):

   ```
   https://your-app.railway.app/docs
   ```

   You should see an interactive API documentation page!

✅ **If you see these pages, your backend is LIVE!** 🎉

---

## 🔧 What We Prepared for Railway

I've already created these files for you:

1. ✅ `railway.json` - Railway configuration (root)
2. ✅ `backend/railway.toml` - Alternative Railway config
3. ✅ `backend/Procfile` - Start command
4. ✅ Updated CORS in `backend/app/main.py` - Allows production domains

---

## 📊 Expected Build Output

Your Railway logs should look like this:

```
#1 Preparing build environment
#2 Installing Python 3.9
#3 Installing dependencies from requirements.txt
#4 Downloading torch (750 MB) ⏳
#5 Installing transformers (200 MB)
#6 Installing sentence-transformers (150 MB)
#7 Installing other dependencies
#8 Build completed successfully! ✅
#9 Starting uvicorn server
#10 Application startup complete
#11 Uvicorn running on 0.0.0.0:8000
```

**Total time:** 3-5 minutes

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Railway dashboard shows "Active" status (green dot)
- [ ] Can access: `https://your-app.railway.app`
- [ ] Can access: `https://your-app.railway.app/health`
- [ ] Can access: `https://your-app.railway.app/docs`
- [ ] Logs show: "Application startup complete"
- [ ] No errors in deployment logs

---

## 🎯 Next Steps: Connect Frontend to Backend

After Railway deployment succeeds:

### Option 1: Environment Variable (Recommended for Production)

1. In your Next.js project, create/update `.env.local`:

   ```bash
   NEXT_PUBLIC_API_URL=https://your-app.railway.app
   ```

2. Update your frontend code to use it:

   ```typescript
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
   ```

3. Deploy to Vercel (Vercel will auto-deploy from GitHub)

### Option 2: Hardcode for Testing

Update `src/app/resume/ats-checker/page.tsx`:

```typescript
const API_URL = 'https://your-app.railway.app'; // Your Railway URL
```

---

## 💰 Railway Pricing

**Free Tier:**

- $5 credit per month
- ~500 hours of uptime
- ~20 days of 24/7 runtime
- Perfect for hobby projects!

**After free credit runs out:**

- Pay as you go: ~$0.000463/hour
- Estimated: $3-4/month for hobby use
- Can set spending limits

---

## 🔥 Common Issues & Solutions

### Issue 1: Build Failed - "Module not found"

**Solution:** Make sure `requirements.txt` is in `/backend` directory

### Issue 2: Build Timeout

**Solution:**

- Railway free tier has build limits
- Your ML dependencies are large (~1.2GB)
- First build might be slow, subsequent builds are cached

### Issue 3: Application Error / Won't Start

**Solution:** Check these:

1. Environment variables set correctly?
2. Start command correct? `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Check logs for specific error

### Issue 4: CORS Error from Frontend

**Solution:** We already fixed this! But if you see CORS errors:

1. Check `backend/app/main.py` has your Vercel domain
2. Add your custom domain to the `origins` list

### Issue 5: 404 on API endpoints

**Solution:** Make sure you're using correct URL structure:

- ✅ `https://your-app.railway.app/api/upload/parse`
- ❌ `https://your-app.railway.app/parse`

---

## 📝 Railway Configuration Details

### What Railway Does Automatically:

1. ✅ Detects Python project
2. ✅ Installs dependencies from `requirements.txt`
3. ✅ Sets `$PORT` environment variable
4. ✅ Provides HTTPS domain
5. ✅ Auto-redeploys on GitHub push (if enabled)
6. ✅ Health checks on `/health` endpoint
7. ✅ Automatic restarts on failure

### What You Control:

- Root directory (`backend`)
- Start command (`uvicorn app.main:app...`)
- Environment variables (Gemini API key)
- Custom domains (optional)
- Resource limits (optional)

---

## 🎉 Success Metrics

Your deployment is successful when:

1. ✅ Railway shows "Active" status
2. ✅ Can access `/`, `/health`, `/docs` endpoints
3. ✅ Logs show: "✅ Google Gemini configured"
4. ✅ Logs show: "✅ Job detector loaded with 200 job titles"
5. ✅ No errors in logs
6. ✅ Can upload resume via Swagger UI at `/docs`

---

## 🔄 Continuous Deployment (Optional)

Want auto-deploy on every GitHub push?

1. In Railway, go to service **"Settings"**
2. Find **"Deploy Triggers"**
3. Enable **"Automatic Deploys"**
4. Choose branch: `feature/ats-checker-foundation` or `main`

Now every push to GitHub = automatic Railway deployment! 🚀

---

## 📚 Useful Railway Commands

### View Logs:

```bash
# In Railway dashboard, click "View Logs"
# Or use Railway CLI (optional):
railway logs
```

### Restart Service:

```bash
# In Railway dashboard:
# Settings → Restart
```

### Check Variables:

```bash
# In Railway dashboard:
# Variables tab
```

---

## 🆘 Need Help?

If stuck:

1. **Check Railway Logs:** Most errors are shown there
2. **Railway Docs:** https://docs.railway.app
3. **Railway Discord:** https://discord.gg/railway
4. **Our docs:** See `backend/README_ENHANCED.md`

---

## 🎯 Quick Summary

**What you need to do:**

1. Go to railway.app
2. Login with GitHub
3. Deploy from your repo (bhuve1996/bhuvesh)
4. Set root directory: `backend`
5. Add environment variables (Gemini API key)
6. Wait 3-5 minutes
7. Get your URL
8. Test it
9. Update frontend to use Railway URL
10. Deploy frontend to Vercel

**Total time:** ~10 minutes (5 min work + 5 min waiting)

---

## ✅ Deployment Checklist

- [ ] Sign up for Railway
- [ ] Connect GitHub
- [ ] Create new project from repo
- [ ] Set root directory to `backend`
- [ ] Add `GEMINI_API_KEY` environment variable
- [ ] Add `GOOGLE_GEMINI_API_KEY` environment variable
- [ ] Deploy and wait for build
- [ ] Generate domain
- [ ] Test `/`, `/health`, `/docs` endpoints
- [ ] Copy Railway URL
- [ ] Update frontend to use Railway URL
- [ ] Push changes to GitHub
- [ ] Vercel auto-deploys frontend
- [ ] Test end-to-end

---

**Ready to deploy? Let's do it! 🚀**

Just follow the steps above and you'll have your backend live in ~10 minutes!
