"""
Main FastAPI application file
This is like the main server file in Node.js/Express
"""

import time

# Load environment variables
from dotenv import load_dotenv

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
import os

# Allow multiple origins for production and development
origins = [
    "http://localhost:3000",  # Local development
    "http://localhost:3009",  # Local development (alternative port)
    "http://127.0.0.1:3000",  # Local development (alternative)
    "http://127.0.0.1:3009",  # Local development (alternative port)
    "https://bhuvesh.vercel.app",  # Your Vercel deployment
    "https://*.vercel.app",  # Any Vercel preview deployments
    "https://www.bhuvesh.com",  # Your custom domain (HTTPS)
    "https://bhuvesh.com",  # Your custom domain without www (HTTPS)
    "http://www.bhuvesh.com",  # Your custom domain (HTTP)
    "http://bhuvesh.com",  # Your custom domain without www (HTTP)
]

# Add additional custom domains from environment variable
# Supports multiple domains separated by commas
# Example: FRONTEND_URL=https://staging.bhuvesh.com,https://beta.bhuvesh.com
custom_domains = os.getenv("FRONTEND_URL")
if custom_domains:
    # Split by comma and add each domain
    additional_domains = [
        domain.strip() for domain in custom_domains.split(",") if domain.strip()
    ]
    origins.extend(additional_domains)

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


# Startup endpoint for Railway
@app.get("/startup")
async def startup_check():
    """
    Startup endpoint for Railway deployment
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
        "environment": os.getenv("RAILWAY_ENVIRONMENT", "development"),
    }


# Railway-specific healthcheck endpoint (faster response)
@app.get("/")
async def railway_health():
    """
    Railway healthcheck endpoint - responds immediately
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
