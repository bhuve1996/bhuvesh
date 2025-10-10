# ============================================================================
# API TYPES - Request/Response models for API endpoints
# ============================================================================

from typing import Any, Optional

from pydantic import BaseModel


class JobDescriptionRequest(BaseModel):
    """Request model for job description comparison"""

    job_description: str
    resume_text: Optional[str] = None


class ImprovementPlanRequest(BaseModel):
    """Request model for improvement plan generation"""

    analysis_result: dict[str, Any]
    extracted_data: dict[str, Any]
    job_description: Optional[str] = None


class FileUploadResponse(BaseModel):
    """Response model for file upload"""

    filename: str
    size: int
    type: str
    url: Optional[str] = None


class AnalysisResponse(BaseModel):
    """Response model for resume analysis"""

    success: bool
    data: Optional[dict[str, Any]] = None
    message: Optional[str] = None
    error: Optional[str] = None


class HealthCheckResponse(BaseModel):
    """Response model for health check"""

    status: str
    timestamp: str
    version: str
    services: dict[str, bool]


class ErrorResponse(BaseModel):
    """Response model for errors"""

    error: str
    message: str
    details: Optional[dict[str, Any]] = None
    timestamp: str
    path: Optional[str] = None
    method: Optional[str] = None
