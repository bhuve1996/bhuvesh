"""
Main FastAPI application file
This is like the main server file in Node.js/Express
"""

import time

# Load environment variables
from dotenv import load_dotenv

# Import compatibility layer early to fix importlib.metadata issues
try:
    from app.utils.compatibility import safe_importlib_metadata

    if not safe_importlib_metadata():
        print("⚠️  importlib.metadata compatibility issue detected - using fallback")
except ImportError:
    print("⚠️  Compatibility layer not available")

# Import FastAPI (like importing Express in Node.js)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Import our API routes with error handling
try:
    from app.api.upload import router as upload_router

    UPLOAD_ROUTER_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Upload router not available: {e}")
    UPLOAD_ROUTER_AVAILABLE = False

# Create FastAPI app instance (like const app = express())
app = FastAPI(
    title="ATS Resume Checker API",
    description="Advanced ATS resume analysis and scoring system",
    version="1.0.0",
)

# Configure CORS (Cross-Origin Resource Sharing)
# This allows our Next.js frontend to talk to this Python backend
from app.core.deployment_config import deployment_config, get_cors_origins

# Get CORS origins from deployment configuration
# Automatically includes platform-specific origins (Cloud Run)
origins = get_cors_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Define a route (like app.get() in Express)
@app.get("/api")
async def api_root():
    """
    API root endpoint - like a health check
    Returns a simple message to test if the API is working
    """
    return {"message": "ATS Resume Checker API is running!"}


# Startup endpoint
@app.get("/startup")
async def startup_check():
    """
    Startup endpoint for deployment
    Returns immediately to verify the app is starting
    """
    return {
        "status": "ready",
        "message": "Application is ready to accept requests",
        "timestamp": time.time(),
        "version": "1.0.0",
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    Returns the status of our API
    """
    import os
    import time

    # Basic health check - just verify the app is running
    # Don't load heavy ML models here to avoid timeout
    return {
        "status": "healthy",
        "message": "API is running successfully",
        "version": "1.0.0",
        "timestamp": time.time(),
        "environment": deployment_config.environment,
        "platform": deployment_config.get_platform_name(),
    }


# Root healthcheck endpoint
@app.get("/")
async def root_health():
    """
    Root healthcheck endpoint - responds immediately
    """
    return {"status": "ok", "message": "Service is running"}


# Include API routes if available
if UPLOAD_ROUTER_AVAILABLE:
    app.include_router(upload_router)
else:
    # Add a fallback route if upload router is not available
    @app.get("/api/upload/quick-analyze")
    async def fallback_analyze():
        return {
            "success": False,
            "message": "Analysis service temporarily unavailable. Please try again later.",
            "error": "Service dependencies not available",
        }


# This is like the app.listen() in Node.js
# But we'll run it with uvicorn command instead
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
