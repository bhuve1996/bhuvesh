# Environment Variables Configuration

## Overview

All sensitive configuration and secrets are stored in environment variables, not in code. This keeps your API keys secure and makes deployment easier.

---

## Required Variables

### 🔑 Google Gemini API Key

**Variable:** `GEMINI_API_KEY`
**Value:** Your Google Gemini API key
**Required:** ✅ YES
**Purpose:** Powers AI-based job role detection (Tier 3 fallback)

**How to get:**

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

**Current Key (for your reference):**

```
AIzaSy************************************Zqs
```

**⚠️ Security:** Never commit this to GitHub! Always use environment variables.

---

## Optional Variables

### 🌐 Frontend URL

**Variable:** `FRONTEND_URL`
**Value:** Additional frontend domain(s) to allow
**Required:** ❌ NO (defaults are already set)
**Purpose:** Allow CORS from additional custom domains

**Default allowed domains (already configured):**

- `http://localhost:3000` (local dev)
- `https://bhuvesh.vercel.app` (Vercel)
- `https://www.bhuvesh.com` (your custom domain)
- `https://bhuvesh.com` (your custom domain without www)

**Single domain example:**

```
FRONTEND_URL=https://staging.bhuvesh.com
```

**Multiple domains example (comma-separated):**

```
FRONTEND_URL=https://staging.bhuvesh.com,https://beta.bhuvesh.com,https://dev.bhuvesh.com
```

**Note:** You can add as many domains as you want, separated by commas. Spaces are automatically trimmed.

---

### 🚀 Server Configuration

**Variable:** `PORT`
**Value:** Port number for server
**Required:** ❌ NO (Railway sets this automatically)
**Purpose:** Configure which port the server listens on

**Default:** `8000` (local), Railway sets `$PORT` automatically

---

### 🏗️ Environment

**Variable:** `ENVIRONMENT`
**Value:** `development`, `staging`, or `production`
**Required:** ❌ NO
**Purpose:** Configure behavior based on environment (future use)

**Default:** `production`

---

## Setting Environment Variables

### Local Development (.env file)

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual values:

   ```bash
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=8000
   ENVIRONMENT=development
   ```

3. Make sure `.env` is in `.gitignore` (already done! ✅)

---

### Railway Deployment

1. Go to your Railway service
2. Click "Variables" tab
3. Click "New Variable"
4. Add each variable:

| Variable Name    | Value                             |
| ---------------- | --------------------------------- |
| `GEMINI_API_KEY` | `your_actual_gemini_api_key_here` |
| `ENVIRONMENT`    | `production`                      |

**Note:** Railway automatically sets `PORT` - don't add it manually!

---

### Vercel (Frontend)

Your Next.js frontend also needs environment variables:

1. Go to Vercel project settings
2. Click "Environment Variables"
3. Add:

| Variable Name         | Value                          | Environments                     |
| --------------------- | ------------------------------ | -------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://your-app.railway.app` | Production, Preview, Development |

**Note:** Variables starting with `NEXT_PUBLIC_` are exposed to the browser.

---

## Security Best Practices

### ✅ DO:

- Store all secrets in environment variables
- Use `.env` for local development
- Add `.env` to `.gitignore`
- Use different API keys for dev/staging/prod if possible
- Rotate API keys periodically
- Use `.env.example` to document required variables (without actual values)

### ❌ DON'T:

- Commit `.env` to Git
- Hardcode API keys in source code
- Share API keys in Slack/Discord/etc.
- Use production keys in development
- Commit files with secrets

---

## Checking Configuration

### Verify Environment Variables are Loaded

When your backend starts, you should see in logs:

```
✅ Google Gemini configured (fallback for unknown roles)
```

If you see:

```
ℹ️  Google Gemini available but no API key set
```

**Fix:** Check that environment variables are set correctly.

### Test in Code

```python
import os

# Check if Gemini key is set
gemini_key = os.getenv('GEMINI_API_KEY')
if gemini_key:
    print(f"✅ Gemini key found: {gemini_key[:10]}...")
else:
    print("❌ Gemini key not found!")
```

---

## Troubleshooting

### Issue: "API key not found" error

**Solution:**

1. Check `.env` file exists in `backend/` directory
2. Check variable names match exactly (case-sensitive)
3. Restart your server after adding `.env`
4. On Railway: Check Variables tab has the keys

### Issue: "CORS error" from frontend

**Solution:**

1. Check frontend domain is in allowed `origins` list
2. Add `FRONTEND_URL` environment variable if using custom domain
3. Restart backend after adding domain

### Issue: ".env file not loading"

**Solution:**

1. Make sure you're using `python-dotenv` (already in requirements.txt)
2. Check `.env` is in the same directory as where you run the server
3. For Railway: Don't use `.env`, use the Variables tab instead

---

## Environment Variable Precedence

1. **System environment variables** (highest priority)
2. **Railway/Vercel Variables tab**
3. **`.env` file** (local development only)
4. **Default values in code** (lowest priority)

---

## Summary Table

| Variable         | Required | Purpose                   | Where to Set        |
| ---------------- | -------- | ------------------------- | ------------------- |
| `GEMINI_API_KEY` | ✅ YES   | AI job detection          | Railway Variables   |
| `PORT`           | ❌ NO    | Server port               | Auto-set by Railway |
| `FRONTEND_URL`   | ❌ NO    | Additional CORS domain(s) | Railway Variables   |
| `ENVIRONMENT`    | ❌ NO    | Environment type          | Railway Variables   |

---

## Your Current Setup

**Production (Railway):**

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
ENVIRONMENT=production
# PORT is auto-set by Railway
# FRONTEND_URL is optional (defaults already include your domains)
```

**Allowed CORS Origins:**

- ✅ `http://localhost:3000`
- ✅ `https://bhuvesh.vercel.app`
- ✅ `https://www.bhuvesh.com`
- ✅ `https://bhuvesh.com`

---

## Need Help?

- **Railway Docs:** https://docs.railway.app/develop/variables
- **Python dotenv:** https://github.com/theskumar/python-dotenv
- **FastAPI Config:** https://fastapi.tiangolo.com/advanced/settings/

---

**Last Updated:** October 5, 2025
**Security:** All secrets managed via environment variables ✅
