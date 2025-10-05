# Frontend Environment Variables Setup

## 📋 Overview

The frontend uses environment variables to configure the backend API URL. This allows seamless switching between local development and production environments.

---

## 🔑 Environment Variables

### `NEXT_PUBLIC_API_URL`

**Purpose:** Backend API endpoint URL  
**Required:** ✅ YES (has default fallback)  
**Default:** `http://localhost:8000`

**Values by Environment:**

| Environment             | Value                             | Notes                              |
| ----------------------- | --------------------------------- | ---------------------------------- |
| **Local Development**   | `http://localhost:8000`           | Run backend locally with `uvicorn` |
| **Production (Vercel)** | `https://your-app.railway.app`    | Your Railway deployment URL        |
| **Staging**             | `https://staging-app.railway.app` | If you have a staging environment  |

---

## 🚀 Setup Instructions

### 1️⃣ Local Development Setup (1 minute)

1. **Create `.env.local` file** in the project root:

```bash
# In project root directory
touch .env.local
```

2. **Add the following content:**

```env
# Backend API URL - Local Development
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Start the backend server:**

```bash
cd backend
source venv/bin/activate  # or: venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

4. **Start the frontend:**

```bash
npm run dev
```

5. **Test it:**
   - Go to http://localhost:3000/resume/ats-checker
   - Upload a resume
   - Frontend will call `http://localhost:8000`

---

### 2️⃣ Production Setup (Vercel) - 2 minutes

#### Step 1: Get Your Railway URL

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your "bhuvesh" project
3. Click on "Settings" → "Generate Domain"
4. Copy the generated URL (e.g., `https://bhuvesh-production.up.railway.app`)

#### Step 2: Add Environment Variable to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your "bhuvesh" project
3. Go to "Settings" → "Environment Variables"
4. Add new variable:

| Variable Name         | Value                          | Environments                     |
| --------------------- | ------------------------------ | -------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://your-app.railway.app` | Production, Preview, Development |

**Example:**

```
NEXT_PUBLIC_API_URL=https://bhuvesh-production.up.railway.app
```

5. Click "Save"
6. Go to "Deployments"
7. Click "Redeploy" on the latest deployment

#### Step 3: Verify

1. Visit your production site: https://bhuvesh.com
2. Go to `/resume/ats-checker`
3. Upload a resume
4. Check browser console (F12) - should show requests to Railway URL

---

## 🔧 How It Works

### Code Implementation

**File:** `src/app/resume/ats-checker/page.tsx`

```typescript
const analyzeResumeWithBackend = async (
  file: File,
  jobDescription: string
): Promise<AnalysisResult> => {
  // Uses environment variable with fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const response = await fetch(`${API_URL}/api/upload/analyze`, {
    method: 'POST',
    body: formData,
  });
  // ...
};
```

### Environment Resolution

```
┌─────────────────────────────────────────────────────────────────┐
│ NEXT_PUBLIC_API_URL Resolution                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. Check .env.local (local development)                        │
│    ↓ If found → Use it                                         │
│                                                                 │
│ 2. Check Vercel Environment Variables (production)             │
│    ↓ If found → Use it                                         │
│                                                                 │
│ 3. Use fallback: http://localhost:8000                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### Test Local Development

```bash
# Terminal 1: Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Start frontend
npm run dev

# Browser: http://localhost:3000/resume/ats-checker
# Should call: http://localhost:8000/api/upload/analyze
```

### Test Production

```bash
# Check browser console (F12) on production site
# Network tab should show requests to:
# https://your-app.railway.app/api/upload/analyze
```

---

## 📁 File Structure

```
your-project/
├── .env.local              ← Local development (gitignored)
├── .env.example            ← Template for team members
├── FRONTEND_ENV_SETUP.md   ← This file
├── src/
│   └── app/
│       └── resume/
│           └── ats-checker/
│               └── page.tsx  ← Uses NEXT_PUBLIC_API_URL
└── backend/
    └── .env.local          ← Backend environment variables
```

---

## 🔒 Security Notes

### ✅ Safe to Expose

`NEXT_PUBLIC_*` variables are **publicly accessible** in the browser:

- ✅ API URLs are fine (they're public endpoints anyway)
- ✅ Public keys (e.g., Google Maps API key with domain restrictions)

### ❌ Never Expose

**DO NOT** prefix with `NEXT_PUBLIC_` if it's sensitive:

- ❌ API keys (OpenAI, AWS, etc.)
- ❌ Database credentials
- ❌ Secret tokens
- ❌ Private keys

**These should only be in backend `.env` files!**

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" error in production

**Solution:**

1. Check Railway backend is deployed and running
2. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
3. Check Railway logs for CORS errors
4. Ensure Railway domain is generated

### Issue: CORS error

**Solution:**

1. Backend `main.py` already allows:
   - `https://bhuvesh.com`
   - `https://www.bhuvesh.com`
   - `https://bhuvesh.vercel.app`
2. If using custom domain, add to backend CORS settings

### Issue: Environment variable not working locally

**Solution:**

1. Ensure `.env.local` exists in project root (not `src/`)
2. Restart Next.js dev server (`npm run dev`)
3. Clear `.next` cache: `rm -rf .next`

### Issue: Environment variable not working in production

**Solution:**

1. Re-check Vercel Environment Variables spelling
2. Redeploy from Vercel dashboard
3. Check Vercel deployment logs

---

## 📋 Checklist

### Local Development Setup

- [ ] Created `.env.local` in project root
- [ ] Added `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] Started backend server (`uvicorn app.main:app --reload`)
- [ ] Started frontend (`npm run dev`)
- [ ] Tested resume upload at http://localhost:3000/resume/ats-checker

### Production Setup

- [ ] Railway backend is deployed and running
- [ ] Generated Railway domain
- [ ] Copied Railway URL
- [ ] Added `NEXT_PUBLIC_API_URL` to Vercel
- [ ] Redeployed frontend from Vercel
- [ ] Tested resume upload on production site
- [ ] Verified in browser console - API calls go to Railway URL

---

## 📞 Quick Reference

| Task                   | Command / URL                                 |
| ---------------------- | --------------------------------------------- |
| Create local env file  | `touch .env.local`                            |
| Start backend locally  | `cd backend && uvicorn app.main:app --reload` |
| Start frontend locally | `npm run dev`                                 |
| Vercel Dashboard       | https://vercel.com/dashboard                  |
| Railway Dashboard      | https://railway.app/dashboard                 |
| Check Vercel logs      | Vercel Dashboard → Deployments → View Logs    |
| Check Railway logs     | Railway Dashboard → Deployments → View Logs   |

---

## 🎯 Summary

✅ **Local Development:**

- Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Run backend and frontend locally

✅ **Production:**

- Add `NEXT_PUBLIC_API_URL=https://your-app.railway.app` to Vercel
- Redeploy frontend

✅ **Code Changes:**

- Updated `src/app/resume/ats-checker/page.tsx` to use environment variable
- Falls back to `localhost:8000` if not set

---

**Need help?** Check the troubleshooting section or Railway/Vercel documentation.
