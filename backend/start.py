#!/usr/bin/env python3
"""
Startup script for Railway deployment
Handles graceful loading of ML models and services
"""

import logging
import os
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def preload_models():
    """Preload ML models in the background to avoid cold start issues"""
    try:
        logger.info("Starting model preloading...")

        # Import and initialize services that load ML models
        try:
            # Only try to load if dependencies are available
            from app.services.ats_analyzer import get_ats_analyzer

            ats_analyzer = get_ats_analyzer()
            logger.info("✅ ATS Analyzer initialized")
        except ImportError as e:
            logger.warning(f"⚠️  ATS Analyzer dependencies not available: {e}")
        except Exception as e:
            logger.warning(f"⚠️  ATS Analyzer initialization failed: {e}")

        try:
            # Only try to load if dependencies are available
            from app.services.job_detector import get_job_detector

            job_detector = get_job_detector()
            logger.info("✅ Job Detector initialized")
        except ImportError as e:
            logger.warning(f"⚠️  Job Detector dependencies not available: {e}")
        except Exception as e:
            logger.warning(f"⚠️  Job Detector initialization failed: {e}")

        logger.info("✅ Model preloading completed (with warnings)")
        return True

    except Exception as e:
        logger.exception("❌ Error preloading models")
        # Don't fail startup if models can't be loaded
        # They'll be loaded on first request
        return False


def main():
    """Main startup function"""
    logger.info("🚀 Starting ATS Resume Checker API...")

    # Get port from environment (Railway sets this)
    port = int(os.getenv("PORT", "8000"))
    host = "0.0.0.0"

    logger.info(f"📡 Server will start on {host}:{port}")
    logger.info(f"🔧 Environment: {os.getenv('RAILWAY_ENVIRONMENT', 'development')}")

    # Preload models in background (non-blocking)
    import threading

    model_thread = threading.Thread(target=preload_models, daemon=True)
    model_thread.start()

    # Start the server
    try:
        import uvicorn

        from app.main import app

        logger.info("🌐 Starting Uvicorn server...")
        uvicorn.run(
            app,
            host=host,
            port=port,
            workers=1,  # Single worker for Railway
            log_level="info",
            access_log=True,
            loop="asyncio",  # Use asyncio loop for better compatibility
        )

    except Exception as e:
        logger.exception("❌ Failed to start server")
        sys.exit(1)


if __name__ == "__main__":
    main()
