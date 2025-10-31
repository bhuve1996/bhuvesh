# ============================================================================
# COMMON TYPES - Reusable type definitions to replace Any
# ============================================================================

from datetime import datetime
from typing import Any, Optional, Union

from typing_extensions import TypedDict

# ============================================================================
# BASIC TYPES
# ============================================================================

# String values that can be empty
StringValue = str
OptionalString = Optional[str]

# Numeric types
Score = int  # 0-100 scores
Percentage = float  # 0.0-1.0 percentages
WordCount = int
Year = int

# ============================================================================
# CONTACT INFORMATION TYPES
# ============================================================================


class ContactInfo(TypedDict, total=False):
    """Contact information structure"""

    full_name: StringValue
    first_name: StringValue
    middle_name: StringValue
    last_name: StringValue
    email: StringValue
    phone: dict[str, StringValue]  # {raw, country_code, number}
    linkedin: dict[str, StringValue]  # {url, username}
    github: dict[str, StringValue]  # {url, username}
    website: StringValue
    location: StringValue


# ============================================================================
# EDUCATION TYPES
# ============================================================================


class InstitutionInfo(TypedDict, total=False):
    """Institution information"""

    name: StringValue
    type: StringValue  # University, College, Institute
    location: StringValue


class DurationInfo(TypedDict, total=False):
    """Duration information"""

    start_year: StringValue
    end_year: StringValue
    total_years: int


class EducationEntry(TypedDict, total=False):
    """Single education entry"""

    degree_full: StringValue
    degree_short: StringValue
    field_of_study: StringValue
    specialization: StringValue
    institution: InstitutionInfo
    duration: DurationInfo
    gpa: StringValue
    honors: list[StringValue]
    achievements: list[StringValue]
    degree: StringValue  # Added missing field
    institution_name: StringValue  # Added missing field (renamed to avoid conflict)
    description: StringValue  # Added missing field


# ============================================================================
# WORK EXPERIENCE TYPES
# ============================================================================


class CompanyInfo(TypedDict, total=False):
    """Company information"""

    name: StringValue
    industry: StringValue
    size: StringValue
    location: StringValue


class PositionInfo(TypedDict, total=False):
    """Position information"""

    title: StringValue
    level: StringValue  # Entry, Mid, Senior, etc.
    department: StringValue
    employment_type: StringValue  # Full-time, Contract, etc.


class WorkExperienceEntry(TypedDict, total=False):
    """Single work experience entry"""

    company: CompanyInfo
    position: PositionInfo
    duration: DurationInfo
    description: StringValue
    achievements: list[StringValue]
    skills_used: list[StringValue]
    technologies: list[StringValue]
    projects: list[StringValue]
    start_date: StringValue  # Added missing fields
    end_date: StringValue
    company_name: StringValue  # Alternative field name
    job_title: StringValue  # Alternative field name
    title: StringValue  # Added missing field
    responsibilities: list[StringValue]  # Added missing field


# ============================================================================
# SKILLS TYPES
# ============================================================================

SkillsDict = dict[str, list[StringValue]]  # {category: [skills]}

# ============================================================================
# ANALYSIS RESULT TYPES
# ============================================================================


class ValidationResult(TypedDict, total=False):
    """Validation result structure"""

    is_valid: bool
    errors: list[StringValue]
    warnings: list[StringValue]
    completeness_score: float  # Changed to float to match actual usage
    total_skills: int
    categories: list[StringValue]
    word_count: int
    character_count: int
    degrees_count: int
    companies_count: int
    total_years: int
    file_info: dict[str, Union[str, int, None]]  # Added file_info field


class AnalysisMetadata(TypedDict, total=False):
    """Analysis metadata"""

    extraction_method: StringValue
    confidence_score: float
    processing_time: float
    version: StringValue
    analysis_date: datetime


class KeywordAnalysis(TypedDict, total=False):
    """Keyword analysis results"""

    matched_keywords: list[StringValue]
    missing_keywords: list[StringValue]
    keyword_score: Score
    semantic_score: Score
    total_keywords: int


class FormatAnalysis(TypedDict, total=False):
    """Format analysis results"""

    structure_score: Score
    ats_compatibility: Score
    bullet_points: dict[str, Union[bool, int, list[StringValue]]]
    spacing: dict[str, Union[bool, int, list[StringValue]]]
    consistency: bool
    recommendations: list[StringValue]


class ATSAnalysisResult(TypedDict, total=False):
    """Complete ATS analysis result"""

    ats_score: Score
    keyword_matches: KeywordAnalysis
    missing_keywords: list[StringValue]
    suggestions: list[StringValue]
    strengths: list[StringValue]
    weaknesses: list[StringValue]
    detailed_scores: dict[str, Score]
    format_analysis: FormatAnalysis
    metadata: AnalysisMetadata
    extraction_details: dict[str, Any]  # Added missing field
    word_count: int  # Added missing field
    jobType: StringValue  # Added missing field
    keywordMatches: list[StringValue]  # Added missing field
    missingKeywords: list[StringValue]  # Added missing field


# ============================================================================
# API RESPONSE TYPES
# ============================================================================


class APIResponse(TypedDict, total=False):
    """Standard API response structure"""

    success: bool
    data: Optional[dict[str, Union[str, int, float, bool, list, dict]]]
    message: Optional[StringValue]
    error: Optional[StringValue]


class FileInfo(TypedDict, total=False):
    """File information structure"""

    name: StringValue
    size: int
    type: StringValue
    extension: StringValue
    path: StringValue


class ExtractionResult(TypedDict, total=False):
    """Resume extraction result"""

    contact_info: ContactInfo
    work_experience: list[WorkExperienceEntry]
    education: list[EducationEntry]
    skills: SkillsDict
    projects: list[StringValue]
    summary: StringValue
    summary_profile: StringValue  # Added missing field
    metadata: AnalysisMetadata
    formatting_analysis: dict[str, Any]  # Added missing field


# ============================================================================
# IMPROVEMENT PLAN TYPES
# ============================================================================


class ImprovementItem(TypedDict, total=False):
    """Single improvement item"""

    category: StringValue
    title: StringValue
    description: StringValue
    priority: StringValue  # High, Medium, Low
    effort: StringValue  # Easy, Medium, Hard
    impact: StringValue  # High, Medium, Low


class ImprovementPlan(TypedDict, total=False):
    """Complete improvement plan"""

    improvements: list[ImprovementItem]
    summary: StringValue
    quick_wins: list[StringValue]
    long_term_goals: list[StringValue]
    estimated_improvement: Score


# ============================================================================
# JOB DESCRIPTION TYPES
# ============================================================================


class JobRequirements(TypedDict, total=False):
    """Job requirements structure"""

    required_skills: list[StringValue]
    preferred_skills: list[StringValue]
    experience_level: StringValue
    education_requirements: list[StringValue]
    certifications: list[StringValue]


class JobDescription(TypedDict, total=False):
    """Job description structure"""

    title: StringValue
    company: StringValue
    location: StringValue
    description: StringValue
    requirements: JobRequirements
    benefits: list[StringValue]
    salary_range: StringValue
