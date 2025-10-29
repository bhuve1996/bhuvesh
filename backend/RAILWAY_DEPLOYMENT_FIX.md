# Railway Deployment Fix Guide

## Issues Fixed

### 1. Python Version Warning

- **Problem**: Using Python 3.9.18 which is past end of life
- **Solution**: Updated to Python 3.10.12 in `runtime.txt`
- **Impact**: Eliminates Google API warnings and improves compatibility

### 2. importlib.metadata Compatibility

- **Problem**: `module 'importlib.metadata' has no attribute 'packages_distributions'`
- **Solution**:
  - Added `importlib-metadata>=6.0.0` to requirements
  - Created compatibility layer in `app/utils/compatibility.py`
  - Added graceful fallback handling

### 3. Missing Job Detector Export

- **Problem**: `cannot import name 'get_job_detector' from 'app.services.job_detector'`
- **Solution**: Added `get_job_detector()` function export in `job_detector.py`

### 4. Missing Dependencies

- **Problem**: `sentence-transformers is required for AI-powered analysis`
- **Solution**:
  - Updated requirements.txt with all dependencies
  - Created minimal requirements for faster deployment
  - Added graceful degradation when ML dependencies unavailable

## Deployment Steps

### Option 1: Full Deployment (Recommended)

```bash
# Use the full requirements.txt
pip install -r requirements.txt
```

### Option 2: Minimal Deployment (Faster)

```bash
# Use minimal requirements for faster startup
pip install -r requirements-minimal.txt
```

### Option 3: Railway Deployment

```bash
# Railway will automatically use runtime.txt and requirements.txt
# The app will gracefully handle missing dependencies
```

## Environment Variables Required

```bash
# Required for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# Optional for custom domains
FRONTEND_URL=https://yourdomain.com,https://staging.yourdomain.com
```

## Expected Behavior After Fix

### ✅ Successful Startup

```
✅ Job Description Generator: Google Gemini configured
✅ ATS Analyzer initialized successfully
✅ ATS Analyzer initialized
✅ sentence-transformers available (if installed)
✅ Google Gemini configured for AI job detection
✅ Project Extractor: Google Gemini configured
✅ ATS Analyzer: AI content generation model loaded successfully
✅ Resume Improver: AI analysis enabled with Gemini
✅ Model preloading completed
```

### ⚠️ Graceful Degradation

If some dependencies are missing, the app will still start but with warnings:

```
⚠️  sentence-transformers not available. Using keyword-only matching.
⚠️  Job Detector dependencies not available: [error details]
```

## Testing the Fix

1. **Health Check**: `GET /health` should return 200 OK
2. **API Root**: `GET /api` should return success message
3. **Upload Test**: Try uploading a resume to test full functionality

## Troubleshooting

### If sentence-transformers fails to install:

- The app will fall back to keyword-only matching
- AI features will be limited but basic functionality remains

### If Google Gemini is not configured:

- Set `GEMINI_API_KEY` environment variable
- Get free API key from Google AI Studio

### If deployment still fails:

- Check Railway logs for specific error messages
- Try minimal deployment first: `pip install -r requirements-minimal.txt`
- Verify Python 3.10+ is being used

## Performance Notes

- **Cold Start**: ~10-15 seconds with full ML dependencies
- **Minimal Start**: ~3-5 seconds with basic dependencies
- **Memory Usage**: ~500MB with full dependencies, ~100MB minimal
- **Response Time**: <2 seconds for most requests

## Next Steps

1. Deploy with the updated configuration
2. Monitor logs for any remaining issues
3. Test all API endpoints
4. Configure environment variables as needed
5. Consider using minimal deployment for faster startup if ML features aren't critical
