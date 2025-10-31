# API Troubleshooting Guide: /api/upload/quick-analyze

## 🔴 Issue: Fetch Error on `/api/upload/quick-analyze`

The API endpoint `http://localhost:8000/api/upload/quick-analyze` is failing with a Fetch error.

## ✅ Solution Checklist

### 1. **Backend is NOT Running** ⚠️ (Most Common Issue)

The backend server must be running on port 8000 before you can use this API.

#### Start the Backend:

```bash
# Terminal 1: Start Backend
npm run dev:backend

# OR manually:
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

#### Verify Backend is Running:

```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy",...}
```

### 2. **Environment Variable Not Set**

Make sure `NEXT_PUBLIC_API_URL` is set in your frontend environment.

#### Check Current Value:

```bash
grep NEXT_PUBLIC_API_URL .env.local
```

#### Set the Variable:

Create or update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Restart Frontend (Hot reload may not pick up env changes):

```bash
npm run dev
```

### 3. **CORS (Cross-Origin Resource Sharing) Issue**

If backend is running but you get CORS error, check backend configuration.

#### Backend CORS is Already Configured:

The backend (`backend/app/main.py`) allows:

- `http://localhost:3000`
- `http://localhost:3009`
- `http://127.0.0.1:3000`

#### Verify CORS Headers:

```bash
curl -i -X OPTIONS http://localhost:8000/api/upload/quick-analyze
```

### 4. **Port Conflicts**

Port 8000 or 3000 might be in use by another process.

#### Find Process Using Port 8000:

```bash
# macOS/Linux
lsof -i :8000

# Windows
netstat -ano | findstr :8000
```

#### Kill Process (if needed):

```bash
# macOS/Linux
kill -9 <PID>

# Windows (run as admin)
taskkill /PID <PID> /F
```

## 🚀 Full Setup (Both Frontend & Backend)

### Terminal 1: Frontend

```bash
npm run dev
# Frontend runs on http://localhost:3000
```

### Terminal 2: Backend

```bash
npm run dev:backend
# Backend runs on http://localhost:8000
```

### Test Both Are Running:

```bash
# Frontend
curl http://localhost:3000
# Response: HTML page

# Backend
curl http://localhost:8000/health
# Response: {"status":"healthy",...}
```

## 📊 API Endpoint Details

**Endpoint:** `POST /api/upload/quick-analyze`

**Headers:**

```
Content-Type: multipart/form-data
```

**Request Body:**

```
- file: File (PDF, DOCX, DOC, or TXT)
  Max size: 10MB
```

**Response:**

```json
{
  "success": true,
  "data": {
    "ats_score": 75,
    "match_category": "Software Engineer",
    "keyword_matches": [...],
    "missing_keywords": [...],
    "suggestions": [...],
    "strengths": [...],
    "weaknesses": [...],
    "job_description": "...",
    "structured_experience": {...}
  },
  "message": "Quick analysis completed successfully..."
}
```

## 🐛 Common Errors & Solutions

### Error: `Fetch: Failed to fetch`

- **Cause:** Backend not running or wrong URL
- **Solution:** Start backend with `npm run dev:backend`

### Error: `CORS error - No 'Access-Control-Allow-Origin'`

- **Cause:** CORS not configured correctly
- **Solution:** Check backend CORS config in `backend/app/main.py`

### Error: `HTTP 500: Error during quick analysis`

- **Cause:** Backend dependencies not installed or AI service unavailable
- **Solution:**
  ```bash
  cd backend
  pip install -r requirements.txt
  ```

### Error: `HTTP 400: Could not detect job type from resume`

- **Cause:** Resume file is empty or not readable
- **Solution:** Try with a different resume file with more content

### Error: `HTTP 413: Payload Too Large`

- **Cause:** File size exceeds 10MB limit
- **Solution:** Upload a smaller resume file

## 🔧 Development Workflow

### Recommended Terminal Setup:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run dev:backend

# Terminal 3 (Optional): Monitor logs
npm run logs
```

### Or Run Both Together:

```bash
npm run dev:all
```

## 📝 Environment Configuration

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=https://bhuvesh.com
```

### Backend (.env in /backend)

```env
GEMINI_API_KEY=your_key_here
DATABASE_URL=your_database_url
```

## ✅ Verification Steps

1. **Backend is running:**

   ```bash
   curl -v http://localhost:8000/health
   ```

   Expected: 200 status, healthy response

2. **Frontend can reach backend:**

   ```bash
   curl -v http://localhost:3000
   # Check Network tab in browser DevTools
   ```

3. **API endpoint exists:**

   ```bash
   curl -v -X POST http://localhost:8000/api/upload/quick-analyze
   # Expected: 400 (missing file) or 422 (validation error)
   ```

4. **Frontend env var is set:**
   ```bash
   node -e "console.log(process.env.NEXT_PUBLIC_API_URL)"
   ```

## 🆘 Still Having Issues?

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for actual error message

2. **Check Network Tab:**
   - Open DevTools (F12)
   - Go to Network tab
   - Upload a resume and watch the request
   - Check the response for error details

3. **Check Backend Logs:**
   - Look at terminal running `npm run dev:backend`
   - Search for error traceback

4. **Check File Permissions:**
   ```bash
   ls -la backend/app/utils/
   ls -la backend/app/services/
   ```

---

**Last Updated:** October 30, 2025
**Related Files:**

- `src/lib/ats/api.ts` - Frontend API client
- `backend/app/api/upload.py` - Backend endpoint
- `backend/app/main.py` - CORS configuration
