"""
Centralized Deployment Configuration
Handles platform-specific settings for Cloud Run and local development
"""

import os

# Load environment variables
from dotenv import load_dotenv

load_dotenv()


class DeploymentConfig:
    """Centralized deployment configuration"""

    PLATFORMS = {
        "local": "Local Development",
        "cloud_run": "Google Cloud Run",
    }

    def __init__(self):
        self.platform = self._detect_platform()
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.port = int(os.getenv("PORT", "8000"))
        self.host = os.getenv("HOST", "0.0.0.0")

    def _detect_platform(self) -> str:
        """
        Auto-detect deployment platform
        Priority: DEPLOYMENT_PLATFORM > K_SERVICE (Cloud Run) > local
        """
        # Explicit platform override
        explicit_platform = os.getenv("DEPLOYMENT_PLATFORM", "").lower()
        if explicit_platform in self.PLATFORMS:
            return explicit_platform

        # Cloud Run detection (K_SERVICE or K_REVISION are set by Cloud Run)
        if os.getenv("K_SERVICE") or os.getenv("K_REVISION"):
            return "cloud_run"

        # Default to local
        return "local"

    def get_platform_name(self) -> str:
        """Get human-readable platform name"""
        return self.PLATFORMS.get(self.platform, "Unknown")

    def get_cors_origins(self) -> list[str]:
        """
        Get CORS origins based on platform and environment
        Removes duplicates automatically
        """
        origins = [
            # Local development (always included)
            "http://localhost:3000",
            "http://localhost:3009",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3009",
        ]

        # Cloud Run origins
        if self.platform == "cloud_run":
            origins.append("https://*.run.app")

        # Production origins (always add for production)
        if self.environment == "production":
            origins.extend(
                [
                    "https://bhuvesh.vercel.app",
                    "https://*.vercel.app",
                    "https://www.bhuvesh.com",
                    "https://bhuvesh.com",
                    "http://www.bhuvesh.com",
                    "http://bhuvesh.com",
                ]
            )

        # Custom domains from environment variable
        custom_domains = os.getenv("FRONTEND_URL", "")
        if custom_domains:
            origins.extend(
                [
                    domain.strip()
                    for domain in custom_domains.split(",")
                    if domain.strip()
                ]
            )

        # Remove duplicates while preserving order
        seen = set()
        return [
            origin for origin in origins if origin not in seen and not seen.add(origin)
        ]

    def get_platform_info(self) -> dict[str, any]:
        """Get platform information for logging/debugging"""
        return {
            "platform": self.platform,
            "platform_name": self.get_platform_name(),
            "environment": self.environment,
            "port": self.port,
            "host": self.host,
            "cors_origins_count": len(self.get_cors_origins()),
        }

    def get_uvicorn_config(self) -> dict[str, any]:
        """Get uvicorn configuration"""
        return {
            "host": self.host,
            "port": self.port,
            "workers": 1,
            "log_level": "info",
            "access_log": True,
            "loop": "asyncio",
        }


# Global deployment configuration instance
deployment_config = DeploymentConfig()


# Convenience functions
def get_platform() -> str:
    """Get current deployment platform"""
    return deployment_config.platform


def get_platform_name() -> str:
    """Get human-readable platform name"""
    return deployment_config.get_platform_name()


def get_cors_origins() -> list[str]:
    """Get CORS origins for current platform"""
    return deployment_config.get_cors_origins()


def get_platform_info() -> dict[str, any]:
    """Get platform information"""
    return deployment_config.get_platform_info()
