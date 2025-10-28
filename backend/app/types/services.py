# ============================================================================
# SERVICE TYPES - Types for service layer operations
# ============================================================================

from typing import Any, Optional

from pydantic import BaseModel, Field

from .ats import ATSCompatibility, DetailedScores, FormatAnalysis
from .common_types import ExtractionResult


class JobDetectionResult(BaseModel):
    """Result of job detection analysis"""

    job_type: str
    confidence: float = Field(ge=0.0, le=1.0)
    keywords: list[str] = Field(default_factory=list)
    description: Optional[str] = None


class ResumeExtractionResult(BaseModel):
    """Result of resume text extraction"""

    text: str
    metadata: dict[str, str] = Field(default_factory=dict)
    sections: dict[str, str] = Field(default_factory=dict)
    word_count: int
    character_count: int


class ATSAnalysisResult(BaseModel):
    """Complete ATS analysis result"""

    ats_score: int = Field(ge=0, le=100)
    detected_job_type: str
    job_detection_confidence: float = Field(ge=0.0, le=1.0)
    keyword_matches: list[str] = Field(default_factory=list)
    missing_keywords: list[str] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    word_count: int
    extraction_details: dict[str, str] = Field(default_factory=dict)
    ats_compatibility: ATSCompatibility
    format_analysis: FormatAnalysis
    detailed_scores: DetailedScores
    semantic_similarity: float = Field(ge=0.0, le=1.0)
    match_category: str
    ats_friendly: bool
    formatting_issues: list[str] = Field(default_factory=list)
    structured_experience: ExtractionResult = Field(default_factory=dict)
    job_description: str


class ImprovementPlanResult(BaseModel):
    """Result of improvement plan generation"""

    improvements: list[dict[str, str]] = Field(default_factory=list)
    summary: str
    quick_wins: list[str] = Field(default_factory=list)
    estimated_impact: int = Field(ge=0, le=100)
    estimated_time: str


class ProjectExtractionResult(BaseModel):
    """Result of project extraction from resume"""

    projects: list[dict[str, Any]] = Field(default_factory=list)
    technologies: list[str] = Field(default_factory=list)
    methodologies: list[str] = Field(default_factory=list)
    achievements: list[str] = Field(default_factory=list)


class ResumeImprovementResult(BaseModel):
    """Result of resume improvement suggestions"""

    improved_sections: dict[str, str] = Field(default_factory=dict)
    suggestions: list[str] = Field(default_factory=list)
    before_after_comparison: dict[str, Any] = Field(default_factory=dict)
    improvement_score: int = Field(ge=0, le=100)
