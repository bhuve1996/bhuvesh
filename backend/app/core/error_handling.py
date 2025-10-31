"""
Centralized Error Handling and Logging
Eliminates duplication across all services
"""

import logging
import traceback
from functools import wraps
from typing import Any

# Configure logging
logger = logging.getLogger(__name__)


class ServiceError(Exception):
    """Base exception for service errors"""

    def __init__(
        self,
        message: str,
        error_code: str = "SERVICE_ERROR",
        details: dict[str, Any] | None = None,
    ):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class AIServiceError(ServiceError):
    """Exception for AI service errors"""

    def __init__(
        self,
        message: str,
        service: str = "AI",
        details: dict[str, Any] | None = None,
    ):
        super().__init__(message, f"AI_{service}_ERROR", details)


class ModelInitializationError(ServiceError):
    """Exception for model initialization errors"""

    def __init__(self, model_name: str, details: dict[str, Any] | None = None):
        super().__init__(
            f"Failed to initialize {model_name}", "MODEL_INIT_ERROR", details
        )


def handle_ai_error(func):
    """Decorator for handling AI service errors"""

    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"AI service error in {func.__name__}: {e!s}")
            logger.debug(traceback.format_exc())
            raise AIServiceError(f"AI service failed: {e!s}", func.__name__)

    return wrapper


def handle_model_initialization(model_name: str, required: bool = True):
    """Decorator for handling model initialization errors"""

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                error_msg = f"Failed to initialize {model_name}: {e!s}"
                logger.error(error_msg)
                logger.debug(traceback.format_exc())

                if required:
                    raise ModelInitializationError(model_name, {"error": str(e)})
                else:
                    logger.warning(
                        f"Optional model {model_name} failed to initialize: {e!s}"
                    )
                    return None

        return wrapper

    return decorator


def safe_ai_call(func, *args, **kwargs):
    """
    Safely call AI function with error handling

    Args:
        func: AI function to call
        *args: Function arguments
        **kwargs: Function keyword arguments

    Returns:
        Tuple[Any, bool]: (result, success)
    """
    try:
        result = func(*args, **kwargs)
        return result, True
    except Exception as e:
        logger.error(f"AI call failed: {e!s}")
        logger.debug(traceback.format_exc())
        return None, False


def log_service_operation(service_name: str, operation: str):
    """Log service operation start and completion"""

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger.info(f"Starting {service_name} operation: {operation}")
            try:
                result = func(*args, **kwargs)
                logger.info(f"Completed {service_name} operation: {operation}")
                return result
            except Exception as e:
                logger.error(f"Failed {service_name} operation: {operation} - {e!s}")
                raise

        return wrapper

    return decorator


def create_error_response(error: Exception, context: str = "") -> dict[str, Any]:
    """
    Create standardized error response

    Args:
        error: Exception that occurred
        context: Additional context about where error occurred

    Returns:
        Dict containing error information
    """
    error_info = {
        "success": False,
        "error": str(error),
        "error_type": type(error).__name__,
        "context": context,
        "timestamp": None,
    }

    # Add specific error details if available
    if isinstance(error, ServiceError):
        error_info.update({"error_code": error.error_code, "details": error.details})

    return error_info


def validate_api_key(api_key: str, service_name: str) -> bool:
    """
    Validate API key format and availability

    Args:
        api_key: API key to validate
        service_name: Name of service for logging

    Returns:
        bool: True if valid, False otherwise
    """
    if not api_key:
        logger.warning(f"No API key provided for {service_name}")
        return False

    if api_key == "your_api_key_here":
        logger.warning(f"Default API key detected for {service_name}")
        return False

    if len(api_key) < 20:
        logger.warning(f"API key too short for {service_name}")
        return False

    return True


def check_dependencies(required_modules: list, service_name: str) -> dict[str, bool]:
    """
    Check if required modules are available

    Args:
        required_modules: List of module names to check
        service_name: Name of service for logging

    Returns:
        Dict mapping module names to availability status
    """
    availability = {}

    for module in required_modules:
        try:
            __import__(module)
            availability[module] = True
        except ImportError:
            availability[module] = False
            logger.warning(f"Required module {module} not available for {service_name}")

    return availability
