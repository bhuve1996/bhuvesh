"""
Main FastAPI application file
This is like the main server file in Node.js/Express
"""

# Import FastAPI (like importing Express in Node.js)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import our API routes
from app.api.upload import router as upload_router

# Create FastAPI app instance (like const app = express())
app = FastAPI(
    title="ATS Resume Checker API",
    description="Advanced ATS resume analysis and scoring system",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
# This allows our Next.js frontend to talk to this Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Our Next.js app
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
        "version": "1.0.0"
    }

# Include API routes
app.include_router(upload_router)

# This is like the app.listen() in Node.js
# But we'll run it with uvicorn command instead
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
