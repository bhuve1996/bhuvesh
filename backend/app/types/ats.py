# ============================================================================
# ATS TYPES - Type definitions for ATS analysis
# ============================================================================

from datetime import datetime
from enum import Enum

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
    country_code: str | None = None
    number: str | None = None
    formatted: str | None = None


class SocialMedia(BaseModel):
    url: str
    username: str | None = None
    profile_id: str | None = None


class Location(BaseModel):
    full: str
    city: str | None = None
    state: str | None = None
    country: str | None = None
    postal_code: str | None = None
    coordinates: dict[str, float] | None = None


class ContactInfo(BaseModel):
    full_name: str
    first_name: str
    middle_name: str | None = None
    last_name: str
    email: str
    phone: PhoneInfo | None = None
    linkedin: SocialMedia | None = None
    github: SocialMedia | None = None
    portfolio: SocialMedia | None = None
    website: str | None = None
    location: Location | None = None
    social_media: dict[str, str] | None = None


# ============================================================================
# EDUCATION
# ============================================================================


class Institution(BaseModel):
    name: str
    institution_type: InstitutionType
    location: str | None = None
    ranking: int | None = None
    accreditation: list[str] | None = None


class Duration(BaseModel):
    raw: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    start_year: int | None = None
    end_year: int | None = None
    total_years: float | None = None
    is_current: bool | None = None


class Grade(BaseModel):
    value: str | float
    grade_type: str  # 'gpa', 'percentage', 'grade', 'class'
    scale: str | None = None
    percentile: float | None = None
    honors: list[str] | None = None


class Education(BaseModel):
    item_id: str
    degree_full: str
    degree_category: str
    degree_level: DegreeLevel
    major: str | None = None
    specialization: str | None = None
    minor: str | None = None
    gpa: float | None = None
    institution: Institution
    duration: Duration
    grade: Grade | None = None
    achievements: list[str] | None = None
    coursework: list[str] | None = None
    thesis: dict[str, str] | None = None


# ============================================================================
# WORK EXPERIENCE
# ============================================================================


class CompanyInfo(BaseModel):
    industry: str | None = None
    size: str | None = None
    location: str | None = None
    website: str | None = None
    description: str | None = None


class Position(BaseModel):
    item_id: str
    title: str
    level: JobLevel | None = None
    department: str | None = None
    location: str
    duration: str
    start_date: str
    end_date: str
    is_current: bool
    responsibilities: list[str]
    achievements: list[str]
    skills_used: list[str]
    technologies: list[str]
    team_size: int | None = None
    reporting_to: str | None = None
    direct_reports: int | None = None
    budget_responsibility: float | None = None
    key_projects: list[str] | None = None


class WorkExperience(BaseModel):
    item_id: str
    company: str
    company_info: CompanyInfo | None = None
    positions: list[Position]
    total_experience_years: float
    current: bool
    start_date: str
    end_date: str | None = None
    location: str | None = None
    employment_type: EmploymentType
    remote: bool = False
    hybrid: bool = False


# ============================================================================
# PROJECTS
# ============================================================================


class ProjectMetrics(BaseModel):
    users: int | None = None
    revenue: float | None = None
    performance: str | None = None
    efficiency: str | None = None


class ProjectDuration(BaseModel):
    start_date: str
    end_date: str | None = None
    total_months: int | None = None


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
    metrics: ProjectMetrics | None = None
    duration: ProjectDuration | None = None
    team_size: int | None = None
    role: str
    company: str | None = None
    url: str | None = None
    github_url: str | None = None
    demo_url: str | None = None
    images: list[str] | None = None
    status: str  # 'completed', 'in-progress', 'on-hold', 'cancelled'


# ============================================================================
# SKILLS
# ============================================================================


class SkillsFound(BaseModel):
    technical_programming: list[str] | None = None
    technical_tools: list[str] | None = None
    frameworks_libraries: list[str] | None = None
    databases: list[str] | None = None
    cloud_platforms: list[str] | None = None
    devops_tools: list[str] | None = None
    business_management: list[str] | None = None
    financial_accounting: list[str] | None = None
    creative_design: list[str] | None = None
    media_content: list[str] | None = None
    medical_clinical: list[str] | None = None
    healthcare_admin: list[str] | None = None
    teaching_training: list[str] | None = None
    academic_research: list[str] | None = None
    sales_marketing: list[str] | None = None
    customer_service: list[str] | None = None
    manufacturing_operations: list[str] | None = None
    quality_control: list[str] | None = None
    hospitality_food: list[str] | None = None
    travel_tourism: list[str] | None = None
    legal_regulatory: list[str] | None = None
    hr_recruitment: list[str] | None = None
    fashion_styling: list[str] | None = None
    beauty_cosmetology: list[str] | None = None
    construction_civil: list[str] | None = None
    mechanical_electrical: list[str] | None = None
    soft_skills: list[str] | None = None
    languages_spoken: list[str] | None = None
    tools_software: list[str] | None = None
    certifications: list[str] | None = None
    methodologies: list[str] | None = None
    operating_systems: list[str] | None = None
    version_control: list[str] | None = None
    testing_tools: list[str] | None = None
    monitoring_tools: list[str] | None = None
    security_tools: list[str] | None = None


class SkillCategoryInfo(BaseModel):
    name: str
    skills: list[str]
    proficiency: str | None = None  # 'beginner', 'intermediate', 'advanced', 'expert'
    years_experience: int | None = None
    last_used: str | None = None
    relevance_score: float | None = None


# ============================================================================
# FORMATTING ANALYSIS
# ============================================================================


class BulletPoints(BaseModel):
    detected: bool
    count: int
    types_used: list[str] | None = None
    consistent: bool
    recommendation: str | None = None


class Spacing(BaseModel):
    line_spacing_consistent: bool
    excessive_whitespace: bool
    proper_section_breaks: bool
    margin_consistency: bool


class Structure(BaseModel):
    has_clear_sections: bool
    sections_detected: list[str] | None = None
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
# FORMATTING ANALYSIS
# ============================================================================


class FormattingAnalysis(BaseModel):
    """Detailed formatting analysis results"""

    structure: Structure
    text_formatting: TextFormatting
    spacing: Spacing
    bullet_points: BulletPoints
    length_analysis: LengthAnalysis
    ats_compatibility: ATSCompatibility


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
    contact_info: ContactInfo | None = None
    education: list[Education] | None = None
    work_experience: list[WorkExperience] | None = None
    projects: list[Project] | None = None
    skills: SkillsFound | None = None
    hobbies_interests: list[str] | None = None
    languages: list[str] | None = None
    achievements: list[str] | None = None
    summary_profile: str | None = None
    certifications: list[str] | None = None
    publications: list[str] | None = None
    volunteer_work: list[str] | None = None
    formatting_analysis: FormattingAnalysis | None = None
    metadata: ExtractionMetadata


class ExtractionDetails(BaseModel):
    all_resume_keywords: list[str] | None = None
    all_jd_keywords: list[str] | None = None
    all_matched_keywords: list[str] | None = None
    all_missing_keywords: list[str] | None = None
    skills_found: SkillsFound | None = None
    skills_required: SkillsFound | None = None
    resume_text_sample: str | None = None
    full_resume_text: str | None = None
    total_resume_keywords: int | None = None
    total_jd_keywords: int | None = None
    total_matched_keywords: int | None = None
    total_missing_keywords: int | None = None
    categorized_resume: CategorizedResume | None = None
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
    portfolio: str | None = None
    website: str | None = None


class StructuredWorkExperience(BaseModel):
    company: str
    company_info: CompanyInfo | None = None
    positions: list[Position]
    responsibilities: list[str]
    projects: list[Project]
    achievements: list[str]
    skills_used: list[str]
    technologies: list[str]
    total_experience_years: float
    current: bool
    start_date: str
    end_date: str | None = None
    location: str | None = None
    employment_type: EmploymentType


class StructuredExperienceMetadata(BaseModel):
    total_experience_years: float
    current_company: str | None = None
    career_level: str  # 'entry', 'mid', 'senior', 'lead', 'executive'
    industry_experience: list[str]
    skill_categories: list[str]


class StructuredExperience(BaseModel):
    work_experience: list[StructuredWorkExperience]
    contact_info: StructuredContactInfo
    education: list[Education]
    projects: list[Project]
    skills: SkillsFound
    summary: str | None = None
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
    keyword_density: dict[str, float] | None = None
    word_count: int
    character_count: int
    extraction_details: ExtractionDetails | None = None
    ats_compatibility: ATSCompatibility | None = None
    format_analysis: FormatAnalysis | None = None
    detailed_scores: DetailedScores | None = None
    semantic_similarity: float | None = None
    match_category: str | None = None
    ats_friendly: bool | None = None
    formatting_issues: list[str] | None = None
    structured_experience: StructuredExperience | None = None
    categorized_resume: CategorizedResume | None = None
    metadata: AnalysisMetadata


class ATSAnalysisResponse(BaseModel):
    success: bool
    message: str | None = None
    data: AnalysisResult
    timestamp: datetime = Field(default_factory=datetime.now)
