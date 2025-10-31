"""
Compatibility layer for Python version differences
Handles importlib.metadata compatibility issues
"""

import sys
from typing import Any

# Handle importlib.metadata compatibility
if sys.version_info >= (3, 8):
    try:
        from importlib.metadata import packages_distributions
    except AttributeError:
        # Fallback for older versions
        try:
            from importlib_metadata import packages_distributions
        except ImportError:
            # If neither is available, create a dummy function
            def packages_distributions() -> dict[str, list[str]]:
                return {}

else:
    # For Python < 3.8, use importlib_metadata
    try:
        from importlib_metadata import packages_distributions
    except ImportError:

        def packages_distributions() -> dict[str, list[str]]:
            return {}


def safe_importlib_metadata() -> bool:
    """Check if importlib.metadata is working properly"""
    try:
        packages_distributions()
        return True
    except Exception:
        return False


def get_package_info(package_name: str) -> dict[str, Any] | None:
    """Get package information safely"""
    try:
        if sys.version_info >= (3, 8):
            from importlib.metadata import metadata
        else:
            from importlib_metadata import metadata

        return metadata(package_name)
    except Exception:
        return None
