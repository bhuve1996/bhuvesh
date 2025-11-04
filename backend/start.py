#!/usr/bin/env python3
"""
Startup script for Cloud Run deployment
Handles graceful loading of ML models and services
"""

import logging
import os
import sys

# Import deployment configuration
from app.core.deployment_config import deployment_config, get_platform_info

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

    # Get configuration from deployment config
    platform_info = get_platform_info()
    port = deployment_config.port
    host = deployment_config.host

    logger.info(f"📡 Server will start on {host}:{port}")
    logger.info(
        f"🔧 Platform: {platform_info['platform_name']} ({platform_info['platform']})"
    )
    logger.info(f"🔧 Environment: {platform_info['environment']}")
    logger.info(f"🔧 CORS Origins: {platform_info['cors_origins_count']} configured")

    # Preload models in background (non-blocking)
    import threading

    model_thread = threading.Thread(target=preload_models, daemon=True)
    model_thread.start()

    # Start the server
    try:
        import uvicorn

        from app.main import app

        logger.info("🌐 Starting Uvicorn server...")
        uvicorn_config = deployment_config.get_uvicorn_config()
        uvicorn.run(app, **uvicorn_config)

    except Exception as e:
        logger.exception("❌ Failed to start server")
        sys.exit(1)


if __name__ == "__main__":
    main()
