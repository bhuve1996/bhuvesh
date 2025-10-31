# ============================================================================
# API TYPES - Request/Response models for API endpoints
# ============================================================================


from pydantic import BaseModel

from .common_types import ATSAnalysisResult, ExtractionResult


class JobDescriptionRequest(BaseModel):
    """Request model for job description comparison"""

    job_description: str
    resume_text: str | None = None


class ImprovementPlanRequest(BaseModel):
    """Request model for improvement plan generation"""

    analysis_result: ATSAnalysisResult
    extracted_data: ExtractionResult
    job_description: str | None = None


class FileUploadResponse(BaseModel):
    """Response model for file upload"""

    filename: str
    size: int
    file_type: str
    url: str | None = None


class AnalysisResponse(BaseModel):
    """Response model for resume analysis"""

    success: bool
    data: ExtractionResult | None = None
    message: str | None = None
    error: str | None = None


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
    details: dict[str, str] | None = None
    timestamp: str
    path: str | None = None
    method: str | None = None
