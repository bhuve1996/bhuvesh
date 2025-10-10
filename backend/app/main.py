"""
Main FastAPI application file
This is like the main server file in Node.js/Express
"""

# Load environment variables
from dotenv import load_dotenv

# Import FastAPI (like importing Express in Node.js)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Import our API routes
from app.api.upload import router as upload_router

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
@app.get("/")
async def root():
    """
    Root endpoint - like a health check
    Returns a simple message to test if the API is working
    """
    return {"message": "ATS Resume Checker API is running!"}


# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    Returns the status of our API
    """
    return {
        "status": "healthy",
        "message": "API is running successfully",
        "version": "1.0.0",
    }


# Include API routes
app.include_router(upload_router)

# This is like the app.listen() in Node.js
# But we'll run it with uvicorn command instead
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
