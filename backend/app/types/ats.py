# ============================================================================
# ATS TYPES - Type definitions for ATS analysis
# ============================================================================

from datetime import datetime
from enum import Enum
from typing import Optional, Union

from pydantic import BaseModel, Field

# ============================================================================
# ENUMS
# ============================================================================


class JobLevel(str, Enum):
    ENTRY = "entry"
    MID = "mid"
    SENIOR = "senior"
    LEAD = "lead"
    PRINCIPAL = "principal"
    DIRECTOR = "director"
    VP = "vp"
    C_LEVEL = "c-level"


class EmploymentType(str, Enum):
    FULL_TIME = "full-time"
    PART_TIME = "part-time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"


class DegreeLevel(str, Enum):
    ASSOCIATE = "associate"
    BACHELOR = "bachelor"
    MASTER = "master"
    DOCTORATE = "doctorate"
    CERTIFICATE = "certificate"
    DIPLOMA = "diploma"


class InstitutionType(str, Enum):
    UNIVERSITY = "university"
    COLLEGE = "college"
    INSTITUTE = "institute"
    SCHOOL = "school"


class ProjectType(str, Enum):
    PERSONAL = "personal"
    PROFESSIONAL = "professional"
    ACADEMIC = "academic"
    OPEN_SOURCE = "open-source"
    FREELANCE = "freelance"


class SkillCategory(str, Enum):
    TECHNICAL_PROGRAMMING = "technical_programming"
    TECHNICAL_TOOLS = "technical_tools"
    FRAMEWORKS_LIBRARIES = "frameworks_libraries"
    DATABASES = "databases"
    CLOUD_PLATFORMS = "cloud_platforms"
    DEVOPS_TOOLS = "devops_tools"
    BUSINESS_MANAGEMENT = "business_management"
    SOFT_SKILLS = "soft_skills"
    LANGUAGES_SPOKEN = "languages_spoken"
    TOOLS_SOFTWARE = "tools_software"
    CERTIFICATIONS = "certifications"


# ============================================================================
# CONTACT INFORMATION
# ============================================================================


class PhoneInfo(BaseModel):
    raw: str
    country_code: Optional[str] = None
    number: Optional[str] = None
    formatted: Optional[str] = None


class SocialMedia(BaseModel):
    url: str
    username: Optional[str] = None
    profile_id: Optional[str] = None


class Location(BaseModel):
    full: str
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    coordinates: Optional[dict[str, float]] = None


class ContactInfo(BaseModel):
    full_name: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    email: str
    phone: Optional[PhoneInfo] = None
    linkedin: Optional[SocialMedia] = None
    github: Optional[SocialMedia] = None
    portfolio: Optional[SocialMedia] = None
    website: Optional[str] = None
    location: Optional[Location] = None
    social_media: Optional[dict[str, str]] = None


# ============================================================================
# EDUCATION
# ============================================================================


class Institution(BaseModel):
    name: str
    institution_type: InstitutionType
    location: Optional[str] = None
    ranking: Optional[int] = None
    accreditation: Optional[list[str]] = None


class Duration(BaseModel):
    raw: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    total_years: Optional[float] = None
    is_current: Optional[bool] = None


class Grade(BaseModel):
    value: Union[str, float]
    grade_type: str  # 'gpa', 'percentage', 'grade', 'class'
    scale: Optional[str] = None
    percentile: Optional[float] = None
    honors: Optional[list[str]] = None


class Education(BaseModel):
    item_id: str
    degree_full: str
    degree_category: str
    degree_level: DegreeLevel
    major: Optional[str] = None
    specialization: Optional[str] = None
    minor: Optional[str] = None
    gpa: Optional[float] = None
    institution: Institution
    duration: Duration
    grade: Optional[Grade] = None
    achievements: Optional[list[str]] = None
    coursework: Optional[list[str]] = None
    thesis: Optional[dict[str, str]] = None


# ============================================================================
# WORK EXPERIENCE
# ============================================================================


class CompanyInfo(BaseModel):
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None


class Position(BaseModel):
    item_id: str
    title: str
    level: Optional[JobLevel] = None
    department: Optional[str] = None
    location: str
    duration: str
    start_date: str
    end_date: str
    is_current: bool
    responsibilities: list[str]
    achievements: list[str]
    skills_used: list[str]
    technologies: list[str]
    team_size: Optional[int] = None
    reporting_to: Optional[str] = None
    direct_reports: Optional[int] = None
    budget_responsibility: Optional[float] = None
    key_projects: Optional[list[str]] = None


class WorkExperience(BaseModel):
    item_id: str
    company: str
    company_info: Optional[CompanyInfo] = None
    positions: list[Position]
    total_experience_years: float
    current: bool
    start_date: str
    end_date: Optional[str] = None
    location: Optional[str] = None
    employment_type: EmploymentType
    remote: bool = False
    hybrid: bool = False


# ============================================================================
# PROJECTS
# ============================================================================


class ProjectMetrics(BaseModel):
    users: Optional[int] = None
    revenue: Optional[float] = None
    performance: Optional[str] = None
    efficiency: Optional[str] = None


class ProjectDuration(BaseModel):
    start_date: str
    end_date: Optional[str] = None
    total_months: Optional[int] = None


class Project(BaseModel):
    item_id: str
    name: str
    project_type: ProjectType
    description: str
    technologies: list[str]
    achievements: list[str]
    challenges: list[str]
    solutions: list[str]
    results: list[str]
    metrics: Optional[ProjectMetrics] = None
    duration: Optional[ProjectDuration] = None
    team_size: Optional[int] = None
    role: str
    company: Optional[str] = None
    url: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    images: Optional[list[str]] = None
    status: str  # 'completed', 'in-progress', 'on-hold', 'cancelled'


# ============================================================================
# SKILLS
# ============================================================================


class SkillsFound(BaseModel):
    technical_programming: Optional[list[str]] = None
    technical_tools: Optional[list[str]] = None
    frameworks_libraries: Optional[list[str]] = None
    databases: Optional[list[str]] = None
    cloud_platforms: Optional[list[str]] = None
    devops_tools: Optional[list[str]] = None
    business_management: Optional[list[str]] = None
    financial_accounting: Optional[list[str]] = None
    creative_design: Optional[list[str]] = None
    media_content: Optional[list[str]] = None
    medical_clinical: Optional[list[str]] = None
    healthcare_admin: Optional[list[str]] = None
    teaching_training: Optional[list[str]] = None
    academic_research: Optional[list[str]] = None
    sales_marketing: Optional[list[str]] = None
    customer_service: Optional[list[str]] = None
    manufacturing_operations: Optional[list[str]] = None
    quality_control: Optional[list[str]] = None
    hospitality_food: Optional[list[str]] = None
    travel_tourism: Optional[list[str]] = None
    legal_regulatory: Optional[list[str]] = None
    hr_recruitment: Optional[list[str]] = None
    fashion_styling: Optional[list[str]] = None
    beauty_cosmetology: Optional[list[str]] = None
    construction_civil: Optional[list[str]] = None
    mechanical_electrical: Optional[list[str]] = None
    soft_skills: Optional[list[str]] = None
    languages_spoken: Optional[list[str]] = None
    tools_software: Optional[list[str]] = None
    certifications: Optional[list[str]] = None
    methodologies: Optional[list[str]] = None
    operating_systems: Optional[list[str]] = None
    version_control: Optional[list[str]] = None
    testing_tools: Optional[list[str]] = None
    monitoring_tools: Optional[list[str]] = None
    security_tools: Optional[list[str]] = None


class SkillCategoryInfo(BaseModel):
    name: str
    skills: list[str]
    proficiency: Optional[
        str
    ] = None  # 'beginner', 'intermediate', 'advanced', 'expert'
    years_experience: Optional[int] = None
    last_used: Optional[str] = None
    relevance_score: Optional[float] = None


# ============================================================================
# FORMATTING ANALYSIS
# ============================================================================


class BulletPoints(BaseModel):
    detected: bool
    count: int
    types_used: Optional[list[str]] = None
    consistent: bool
    recommendation: Optional[str] = None


class Spacing(BaseModel):
    line_spacing_consistent: bool
    excessive_whitespace: bool
    proper_section_breaks: bool
    margin_consistency: bool


class Structure(BaseModel):
    has_clear_sections: bool
    sections_detected: Optional[list[str]] = None
    logical_flow: bool
    chronological_order: bool
    section_headers_consistent: bool


class TextFormatting(BaseModel):
    all_caps_excessive: bool
    appropriate_capitalization: bool
    special_characters_count: int
    emoji_count: int
    font_consistency: bool
    font_size_consistency: bool


class LengthAnalysis(BaseModel):
    total_words: int
    total_lines: int
    average_line_length: float
    estimated_pages: float
    appropriate_length: bool
    section_word_distribution: dict[str, int]


class ATSCompatibilityFactors(BaseModel):
    file_format: bool
    text_extractable: bool
    no_images_text: bool
    standard_fonts: bool
    proper_headers: bool
    no_tables: bool
    no_columns: bool


class ATSCompatibility(BaseModel):
    score: int
    issues: Optional[list[str]] = None
    warnings: Optional[list[str]] = None
    recommendations: Optional[list[str]] = None
    compatibility_factors: ATSCompatibilityFactors


class FormattingAnalysis(BaseModel):
    bullet_points: Optional[BulletPoints] = None
    spacing: Optional[Spacing] = None
    structure: Optional[Structure] = None
    text_formatting: Optional[TextFormatting] = None
    length_analysis: Optional[LengthAnalysis] = None
    ats_compatibility: Optional[ATSCompatibility] = None


# ============================================================================
# ATS COMPATIBILITY
# ============================================================================


class ATSCompatibilityFactors(BaseModel):
    file_format_compatible: bool
    text_extractable: bool
    no_graphics_text: bool
    standard_fonts: bool
    proper_headers: bool
    no_tables: bool
    no_columns: bool
    appropriate_length: bool
    keyword_optimized: bool
    section_complete: bool


class ATSCompatibility(BaseModel):
    overall_score: int
    grade: str
    issues: list[str]
    warnings: list[str]
    recommendations: list[str]
    sections_found: list[str]
    contact_completeness: str
    bullet_consistency: bool
    word_count_optimal: bool
    format_score: int
    content_score: int
    keyword_score: int
    semantic_score: int
    compatibility_factors: ATSCompatibilityFactors


# ============================================================================
# FORMAT ANALYSIS
# ============================================================================


class SectionAnalysis(BaseModel):
    present: bool
    completeness: int
    issues: list[str]


class FormatAnalysis(BaseModel):
    grade: str
    score: int
    sections_found: int
    required_sections: int
    optional_sections_found: int
    contact_completeness: str
    has_professional_summary: bool
    section_headers_count: int
    issues: list[str]
    recommendations: list[str]
    section_analysis: dict[str, SectionAnalysis]


# ============================================================================
# DETAILED SCORES
# ============================================================================


class ScoreBreakdown(BaseModel):
    keyword_matching: int
    semantic_similarity: int
    format_compatibility: int
    content_quality: int
    experience_relevance: int
    skills_alignment: int
    education_match: int
    ats_optimization: int


class DetailedScores(BaseModel):
    keyword_score: int
    semantic_score: int
    format_score: int
    content_score: int
    experience_score: int
    skills_score: int
    education_score: int
    ats_score: int
    overall_score: int
    breakdown: ScoreBreakdown


# ============================================================================
# EXTRACTION DETAILS
# ============================================================================


class ExtractionMetadata(BaseModel):
    extracted_at: datetime
    file_name: str
    file_size: int
    file_format: str
    extraction_method: str
    confidence_score: float


class CategorizedResume(BaseModel):
    contact_info: Optional[ContactInfo] = None
    education: Optional[list[Education]] = None
    work_experience: Optional[list[WorkExperience]] = None
    projects: Optional[list[Project]] = None
    skills: Optional[SkillsFound] = None
    hobbies_interests: Optional[list[str]] = None
    languages: Optional[list[str]] = None
    achievements: Optional[list[str]] = None
    summary_profile: Optional[str] = None
    certifications: Optional[list[str]] = None
    publications: Optional[list[str]] = None
    volunteer_work: Optional[list[str]] = None
    formatting_analysis: Optional[FormattingAnalysis] = None
    metadata: ExtractionMetadata


class ExtractionDetails(BaseModel):
    all_resume_keywords: Optional[list[str]] = None
    all_jd_keywords: Optional[list[str]] = None
    all_matched_keywords: Optional[list[str]] = None
    all_missing_keywords: Optional[list[str]] = None
    skills_found: Optional[SkillsFound] = None
    skills_required: Optional[SkillsFound] = None
    resume_text_sample: Optional[str] = None
    full_resume_text: Optional[str] = None
    total_resume_keywords: Optional[int] = None
    total_jd_keywords: Optional[int] = None
    total_matched_keywords: Optional[int] = None
    total_missing_keywords: Optional[int] = None
    categorized_resume: Optional[CategorizedResume] = None
    extraction_confidence: float
    extraction_method: str  # 'ai', 'rule-based', 'hybrid'
    processing_time: float
    word_count: int
    character_count: int
    language_detected: str
    encoding_detected: str


# ============================================================================
# STRUCTURED EXPERIENCE
# ============================================================================


class StructuredContactInfo(BaseModel):
    full_name: str
    email: str
    phone: str
    location: str
    linkedin: str
    github: str
    portfolio: Optional[str] = None
    website: Optional[str] = None


class StructuredWorkExperience(BaseModel):
    company: str
    company_info: Optional[CompanyInfo] = None
    positions: list[Position]
    responsibilities: list[str]
    projects: list[Project]
    achievements: list[str]
    skills_used: list[str]
    technologies: list[str]
    total_experience_years: float
    current: bool
    start_date: str
    end_date: Optional[str] = None
    location: Optional[str] = None
    employment_type: EmploymentType


class StructuredExperienceMetadata(BaseModel):
    total_experience_years: float
    current_company: Optional[str] = None
    career_level: str  # 'entry', 'mid', 'senior', 'lead', 'executive'
    industry_experience: list[str]
    skill_categories: list[str]


class StructuredExperience(BaseModel):
    work_experience: list[StructuredWorkExperience]
    contact_info: StructuredContactInfo
    education: list[Education]
    projects: list[Project]
    skills: SkillsFound
    summary: Optional[str] = None
    metadata: StructuredExperienceMetadata


# ============================================================================
# API RESPONSE MODELS
# ============================================================================


class AnalysisMetadata(BaseModel):
    analyzed_at: datetime
    file_name: str
    file_size: int
    processing_time: float
    analysis_version: str


class AnalysisResult(BaseModel):
    result_id: str
    job_type: str
    job_type_confidence: float
    ats_score: int
    keyword_matches: list[str]
    missing_keywords: list[str]
    suggestions: list[str]
    strengths: list[str]
    weaknesses: list[str]
    keyword_density: Optional[dict[str, float]] = None
    word_count: int
    character_count: int
    extraction_details: Optional[ExtractionDetails] = None
    ats_compatibility: Optional[ATSCompatibility] = None
    format_analysis: Optional[FormatAnalysis] = None
    detailed_scores: Optional[DetailedScores] = None
    semantic_similarity: Optional[float] = None
    match_category: Optional[str] = None
    ats_friendly: Optional[bool] = None
    formatting_issues: Optional[list[str]] = None
    structured_experience: Optional[StructuredExperience] = None
    categorized_resume: Optional[CategorizedResume] = None
    metadata: AnalysisMetadata


class ATSAnalysisResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: AnalysisResult
    timestamp: datetime = Field(default_factory=datetime.now)
