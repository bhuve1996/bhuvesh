# ============================================================================
# COMMON TYPES - Shared type definitions and utilities
# ============================================================================

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

# ============================================================================
# ENUMS
# ============================================================================


class Status(str, Enum):
    """Status enumeration for various operations"""

    IDLE = "idle"
    LOADING = "loading"
    SUCCESS = "success"
    ERROR = "error"


class FileType(str, Enum):
    """Supported file types"""

    PDF = "pdf"
    DOCX = "docx"
    DOC = "doc"
    TXT = "txt"


class MimeType(str, Enum):
    """Supported MIME types"""

    PDF = "application/pdf"
    DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    DOC = "application/msword"
    TXT = "text/plain"


# ============================================================================
# BASE MODELS
# ============================================================================


class BaseEntity(BaseModel):
    """Base entity with common fields"""

    entity_id: str
    created_at: datetime
    updated_at: datetime


class BaseResponse(BaseModel):
    """Base response model"""

    success: bool
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)


# ============================================================================
# FILE TYPES
# ============================================================================


class FileInfo(BaseModel):
    """File information model"""

    name: str
    size: int
    file_type: str
    last_modified: datetime
    content: Optional[str] = None


class FileValidation(BaseModel):
    """File validation result"""

    is_valid: bool
    errors: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


# ============================================================================
# ANALYSIS TYPES
# ============================================================================


class AnalysisProgress(BaseModel):
    """Analysis progress tracking"""

    current_step: int
    total_steps: int
    is_analyzing: bool
    current_step_name: str
    progress: int = Field(ge=0, le=100)  # 0-100
    error: Optional[str] = None


class AnalysisStep(BaseModel):
    """Analysis step information"""

    step_id: str
    name: str
    description: str
    status: str  # 'pending', 'active', 'completed', 'error'
    duration: Optional[float] = None


# ============================================================================
# SCORING TYPES
# ============================================================================


class ScoreBreakdown(BaseModel):
    """Detailed score breakdown"""

    keyword: int = Field(ge=0, le=100)
    semantic: int = Field(ge=0, le=100)
    file_format: int = Field(ge=0, le=100)
    content: int = Field(ge=0, le=100)
    experience: int = Field(ge=0, le=100)
    skills: int = Field(ge=0, le=100)
    education: int = Field(ge=0, le=100)
    overall: int = Field(ge=0, le=100)


class ScoreGrade(BaseModel):
    """Score grade information"""

    score: int
    grade: str
    label: str
    color: str
    description: str


# ============================================================================
# VALIDATION TYPES
# ============================================================================


class ValidationRule(BaseModel):
    """Validation rule definition"""

    field: str
    rule: str
    message: str
    severity: str  # 'error', 'warning', 'info'


class ValidationResult(BaseModel):
    """Validation result"""

    is_valid: bool
    errors: list[ValidationRule] = Field(default_factory=list)
    warnings: list[ValidationRule] = Field(default_factory=list)
    score: int = Field(ge=0, le=100)


# ============================================================================
# EXPORT TYPES
# ============================================================================


class ExportOptions(BaseModel):
    """Export configuration options"""

    export_format: str  # 'pdf', 'docx', 'html', 'json'
    include_analysis: bool = True
    include_improvements: bool = True
    include_raw_data: bool = False
    template: Optional[str] = None


class ExportResult(BaseModel):
    """Export result"""

    success: bool
    file_url: Optional[str] = None
    file_name: str
    file_size: int
    expires_at: datetime
