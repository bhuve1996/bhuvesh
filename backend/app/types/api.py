# ============================================================================
# API TYPES - Request/Response models for API endpoints
# ============================================================================

from typing import Optional

from pydantic import BaseModel

from .common_types import ATSAnalysisResult, ExtractionResult


class JobDescriptionRequest(BaseModel):
    """Request model for job description comparison"""

    job_description: str
    resume_text: Optional[str] = None


class ImprovementPlanRequest(BaseModel):
    """Request model for improvement plan generation"""

    analysis_result: ATSAnalysisResult
    extracted_data: ExtractionResult
    job_description: Optional[str] = None


class FileUploadResponse(BaseModel):
    """Response model for file upload"""

    filename: str
    size: int
    file_type: str
    url: Optional[str] = None


class AnalysisResponse(BaseModel):
    """Response model for resume analysis"""

    success: bool
    data: Optional[ExtractionResult] = None
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
    details: Optional[dict[str, str]] = None
    timestamp: str
    path: Optional[str] = None
    method: Optional[str] = None
