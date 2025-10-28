"""
File upload API endpoints
Enhanced with job description comparison and semantic matching
"""

import os
import sys
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

# Add the parent directory to the path so we can import our utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.ats_analyzer import get_ats_analyzer
from app.services.job_description_generator import JobDescriptionGenerator
from app.services.job_detector import job_detector
from app.services.resume_improver import ResumeImprover
from app.types import ImprovementPlanRequest
from app.utils.file_parser import file_parser

# Initialize services
resume_improver = ResumeImprover()


# Create a router (like Express router)
router = APIRouter(prefix="/api/upload", tags=["upload"])


@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)) -> dict[str, Any]:
    """
    Parse uploaded resume file

    Args:
        file: The uploaded file

    Returns:
        Parsed content and metadata
    """
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        # Check file extension
        file_extension = file.filename.lower().split(".")[-1]
        if file_extension not in ["pdf", "docx", "doc", "txt"]:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files.",
            )

        # Read file content
        file_content = await file.read()

        # Check file size (limit to 10MB)
        if len(file_content) > 10 * 1024 * 1024:  # 10MB in bytes
            raise HTTPException(
                status_code=400, detail="File too large. Maximum size is 10MB."
            )

        # Parse the file
        parsed_content = file_parser.parse_file(file_content, file.filename)

        # Return parsed content (client can then call analyze endpoint)
        return {
            "success": True,
            "data": {
                "filename": file.filename,
                "file_size": len(file_content),
                "file_type": file.content_type,
                "text": parsed_content.get("text", ""),
                "word_count": parsed_content.get("word_count", 0),
                "character_count": parsed_content.get("character_count", 0),
                "formatting_analysis": parsed_content.get("formatting_analysis", {}),
                "parsed_content": parsed_content,
            },
            "message": "Resume parsed successfully",
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle other exceptions
        raise HTTPException(status_code=500, detail=f"Error processing file: {e!s}")


@router.post("/quick-analyze")
async def quick_analyze_resume(file: UploadFile = File(...)) -> dict[str, Any]:
    """
    Quick ATS analysis: Parse resume, detect job type, generate job description, and analyze
    Uses AI to generate specific job description based on detected role

    Args:
        file: Resume file (PDF, DOCX, or TXT)

    Returns:
        Comprehensive ATS analysis with AI-generated job description
    """
    try:
        # Validate inputs
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        # Check file type
        file_extension = file.filename.lower().split(".")[-1]
        if file_extension not in ["pdf", "docx", "doc", "txt"]:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files.",
            )

        # Read and parse file
        file_content = await file.read()

        # Check file size
        if len(file_content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, detail="File too large. Maximum size is 10MB."
            )

        # Parse the resume
        parsed_resume = file_parser.parse_file(file_content, file.filename)

        # Detect job type using AI
        job_title, confidence = job_detector.detect_job_type(
            parsed_resume.get("text", "")
        )

        if not job_title:
            raise HTTPException(
                status_code=400,
                detail="Could not detect job type from resume. Please try again or provide a custom job description.",
            )

        # Generate specific job description for detected job type
        jd_generator = JobDescriptionGenerator()

        # Determine experience level from resume
        experience_level = "mid-level"  # Default
        if "senior" in job_title.lower():
            experience_level = "senior-level"
        elif "junior" in job_title.lower() or "entry" in job_title.lower():
            experience_level = "entry-level"

        generated_job_description = jd_generator.generate_job_description(
            job_title, experience_level
        )

        # Extract structured experience data
        ats_analyzer = get_ats_analyzer()
        structured_experience = ats_analyzer.extract_structured_experience(
            parsed_resume.get("text", "")
        )

        # Perform comprehensive ATS analysis with generated job description
        analysis_result = ats_analyzer.analyze_resume_with_job_description(
            parsed_resume, generated_job_description
        )

        # Add job detection results and generated job description
        analysis_result.update(
            {
                "detected_job_type": job_title,
                "job_detection_confidence": confidence,
                "structured_experience": structured_experience,
                "filename": file.filename,
                "file_size": len(file_content),
                "jd_length": len(generated_job_description),
                "job_description": generated_job_description,  # Include the AI-generated job description
            }
        )

        return {
            "success": True,
            "data": analysis_result,
            "message": "Quick analysis completed successfully with AI-generated job description",
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error during quick analysis: {e!s}"
        )


@router.post("/parse-to-resume-data")
async def parse_resume_to_resume_data(file: UploadFile = File(...)) -> dict[str, Any]:
    """
    Parse uploaded resume file and return ResumeData format directly
    This eliminates the need for frontend conversion functions
    
    Args:
        file: The uploaded file
        
    Returns:
        ResumeData format ready for frontend use
    """
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        # Check file extension
        file_extension = file.filename.lower().split(".")[-1]
        if file_extension not in ["pdf", "docx", "doc", "txt"]:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files.",
            )

        # Read file content
        file_content = await file.read()

        # Check file size (limit to 10MB)
        if len(file_content) > 10 * 1024 * 1024:  # 10MB in bytes
            raise HTTPException(
                status_code=400, detail="File too large. Maximum size is 10MB."
            )

        # Parse the file
        parsed_content = file_parser.parse_file(file_content, file.filename)
        
        # Debug logging for parsed_content
        print(f"DEBUG: parsed_content type: {type(parsed_content)}")
        print(f"DEBUG: parsed_content keys: {parsed_content.keys() if isinstance(parsed_content, dict) else 'Not a dict'}")
        
        # Ensure parsed_content is a dictionary
        if not isinstance(parsed_content, dict):
            print(f"ERROR: parsed_content is not a dict, it's: {type(parsed_content)}")
            parsed_content = {"text": str(parsed_content) if parsed_content else ""}

        # Extract structured experience data
        ats_analyzer = get_ats_analyzer()
        structured_experience_result = ats_analyzer.extract_structured_experience(
            parsed_content.get("text", "")
        )
        
        # Handle the case where structured_experience might be a string or dict
        if isinstance(structured_experience_result, str):
            try:
                import json
                structured_experience = json.loads(structured_experience_result)
            except:
                structured_experience = {}
        else:
            structured_experience = structured_experience_result or {}

        # Debug logging
        print(f"DEBUG: parsed_content type: {type(parsed_content)}")
        print(f"DEBUG: structured_experience type: {type(structured_experience)}")
        print(f"DEBUG: structured_experience keys: {structured_experience.keys() if isinstance(structured_experience, dict) else 'Not a dict'}")
        
        # Convert to ResumeData format
        try:
            # Test basic access first
            print(f"Testing parsed_content access...")
            test_text = parsed_content.get("text", "") if isinstance(parsed_content, dict) else ""
            print(f"Successfully accessed text: {len(test_text)} characters")
            
            resume_data = convert_to_resume_data(parsed_content, structured_experience)
        except Exception as e:
            print(f"ERROR in convert_to_resume_data: {e}")
            print(f"parsed_content type: {type(parsed_content)}")
            print(f"parsed_content value: {parsed_content}")
            print(f"structured_experience type: {type(structured_experience)}")
            print(f"structured_experience value: {structured_experience}")
            raise HTTPException(status_code=500, detail=f"Error converting to ResumeData: {e!s}")

        return {
            "success": True,
            "data": resume_data,
            "message": "Resume parsed and converted to ResumeData format successfully",
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle other exceptions
        raise HTTPException(status_code=500, detail=f"Error processing file: {e!s}")


def convert_to_resume_data(parsed_content: dict, structured_experience: dict) -> dict:
    """
    Convert parsed content and structured experience to ResumeData format
    This function handles all the data cleaning and formatting
    """
    import re
    from datetime import datetime
    
    # Ensure we have valid dictionaries
    if not isinstance(parsed_content, dict):
        print(f"WARNING: parsed_content is not a dict in convert_to_resume_data: {type(parsed_content)}")
        parsed_content = {"text": str(parsed_content) if parsed_content else ""}
    if not isinstance(structured_experience, dict):
        print(f"WARNING: structured_experience is not a dict in convert_to_resume_data: {type(structured_experience)}")
        structured_experience = {}
    
    # Helper function to clean name (matches frontend ResumeDataUtils.cleanName)
    def clean_name(name: str) -> str:
        if not name:
            return ''
        cleaned = re.sub(r'^(hi,?\s*|hello,?\s*|i\'?m\s*|i am\s*)', '', name, flags=re.IGNORECASE)
        cleaned = re.sub(r'[.!?]+$', '', cleaned)
        return cleaned.strip() or name
    
    # Helper function to clean portfolio URL (matches frontend ResumeDataUtils.cleanPortfolio)
    def clean_portfolio(portfolio: str) -> str:
        if not portfolio:
            return ''
        invalid_patterns = [
            r'^gmail\.com$',
            r'^@',
            r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
            r'^www\.$',
            r'^http://$',
            r'^https://$',
        ]
        for pattern in invalid_patterns:
            if re.match(pattern, portfolio, re.IGNORECASE):
                return ''
        return portfolio
    
    # Helper function to capitalize skills (matches frontend ResumeDataUtils.capitalizeSkills)
    def capitalize_skills(skills: list) -> list:
        if not isinstance(skills, list):
            return []
        return [skill.capitalize() if skill else '' for skill in skills]
    
    # Helper function to clean email (matches frontend ResumeDataUtils.cleanEmail)
    def clean_email(email: str) -> str:
        if not email:
            return ''
        return email.lower().strip()
    
    # Helper function to clean phone (matches frontend ResumeDataUtils.cleanPhone)
    def clean_phone(phone: str) -> str:
        if not phone:
            return ''
        return re.sub(r'[^\d+]', '', phone).strip()
    
    # Helper function to clean location (matches frontend ResumeDataUtils.cleanLocation)
    def clean_location(location: str) -> str:
        if not location:
            return ''
        return location.strip()
    
    # Helper function to clean LinkedIn URL (matches frontend ResumeDataUtils.cleanLinkedIn)
    def clean_linkedin(linkedin: str) -> str:
        if not linkedin:
            return ''
        if linkedin.startswith('linkedin.com') or linkedin.startswith('www.linkedin.com'):
            return f"https://{linkedin}"
        return linkedin
    
    # Helper function to clean GitHub URL (matches frontend ResumeDataUtils.cleanGitHub)
    def clean_github(github: str) -> str:
        if not github:
            return ''
        if github.startswith('github.com') or github.startswith('www.github.com'):
            return f"https://{github}"
        return github
    
    # Helper function to clean project URL (matches frontend ResumeDataUtils.cleanProjectUrl)
    def clean_project_url(url: str) -> str:
        if not url:
            return ''
        if not url.startswith('http://') and not url.startswith('https://'):
            return f"https://{url}"
        return url
    
    # Helper function to generate unique ID (matches frontend ResumeDataUtils.generateId)
    def generate_id(prefix: str) -> str:
        return f"{prefix}-{int(datetime.now().timestamp())}-{hash(str(datetime.now())) % 10000}"
    
    # Extract personal information
    personal = {
        "fullName": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "github": "",
        "portfolio": "",
        "jobTitle": "",
    }
    
    # Use structured experience if available, otherwise fallback to parsed content
    if structured_experience and isinstance(structured_experience, dict) and structured_experience.get("contact_info"):
        contact_info = structured_experience["contact_info"]
        personal.update({
            "fullName": clean_name(contact_info.get("full_name", "")),
            "email": clean_email(contact_info.get("email", "")),
            "phone": clean_phone(contact_info.get("phone", "")),
            "location": clean_location(contact_info.get("location", "")),
            "linkedin": clean_linkedin(contact_info.get("linkedin", "")),
            "github": clean_github(contact_info.get("github", "")),
            "portfolio": clean_portfolio(contact_info.get("portfolio", "")),
        })
    
    # Extract current job title from work experience
    if structured_experience and isinstance(structured_experience, dict) and structured_experience.get("work_experience"):
        work_exp = structured_experience["work_experience"]
        if work_exp:
            # Find current job first
            current_job = next((exp for exp in work_exp if exp.get("current")), None)
            if current_job and current_job.get("positions"):
                personal["jobTitle"] = current_job["positions"][0].get("title", "")
            elif work_exp[0].get("positions"):
                personal["jobTitle"] = work_exp[0]["positions"][0].get("title", "")
    
    # Extract summary
    summary = ""
    if structured_experience and isinstance(structured_experience, dict) and structured_experience.get("summary"):
        summary = structured_experience["summary"]
    elif isinstance(parsed_content, dict) and parsed_content.get("summary_profile"):
        summary = parsed_content["summary_profile"]
    
    # Extract work experience
    experience = []
    if structured_experience and isinstance(structured_experience, dict) and structured_experience.get("work_experience"):
        for exp in structured_experience["work_experience"]:
            if exp.get("positions"):
                for pos in exp["positions"]:
                    experience.append({
                        "id": generate_id("exp"),
                        "company": exp.get("company", "").strip(),
                        "position": pos.get("title", "").strip(),
                        "location": clean_location(pos.get("location", "")),
                        "startDate": pos.get("start_date", ""),
                        "endDate": pos.get("end_date", ""),
                        "current": pos.get("is_current", False),
                        "description": " ".join(pos.get("responsibilities", [])),
                        "achievements": pos.get("achievements", []),
                        "technologies": capitalize_skills(pos.get("technologies", [])),
                    })
    
    # Extract education
    education = []
    if structured_experience and isinstance(structured_experience, dict) and structured_experience.get("education"):
        for edu in structured_experience["education"]:
            education.append({
                "id": generate_id("edu"),
                "institution": edu.get("institution", {}).get("name", "").strip(),
                "degree": edu.get("degree_full", "").strip(),
                "field": edu.get("major", "").strip(),
                "location": clean_location(edu.get("institution", {}).get("location", "")),
                "startDate": edu.get("duration", {}).get("start_date", ""),
                "endDate": edu.get("duration", {}).get("end_date", ""),
                "current": edu.get("duration", {}).get("is_current", False),
                "gpa": str(edu.get("gpa", "")) if edu.get("gpa") else "",
                "honors": edu.get("achievements", []),
            })
    
    # Extract skills
    skills = {
        "technical": [],
        "business": [],
        "soft": [],
        "languages": [],
        "certifications": [],
    }
    
    if structured_experience and isinstance(structured_experience, dict) and structured_experience.get("skills"):
        skills_data = structured_experience["skills"]
        skills.update({
            "technical": capitalize_skills(skills_data.get("technical_programming", []) + 
                                        skills_data.get("technical_tools", [])),
            "business": capitalize_skills(skills_data.get("business_management", [])),
            "soft": capitalize_skills(skills_data.get("soft_skills", [])),
            "languages": capitalize_skills(skills_data.get("languages_spoken", [])),
            "certifications": capitalize_skills(skills_data.get("certifications", [])),
        })
    
    # Extract projects
    projects = []
    if structured_experience and isinstance(structured_experience, dict) and structured_experience.get("projects"):
        for proj in structured_experience["projects"]:
            projects.append({
                "id": generate_id("proj"),
                "name": proj.get("name", "").strip(),
                "description": proj.get("description", "").strip(),
                "technologies": capitalize_skills(proj.get("technologies", [])),
                "url": clean_project_url(proj.get("url", "")),
                "github": clean_github(proj.get("github_url", "")),
                "startDate": proj.get("duration", {}).get("start_date", ""),
                "endDate": proj.get("duration", {}).get("end_date", ""),
                "achievements": proj.get("achievements", []),
            })
    
    # Extract achievements and hobbies
    achievements = []
    hobbies = []
    
    if structured_experience and isinstance(structured_experience, dict):
        achievements = structured_experience.get("achievements", [])
        hobbies = structured_experience.get("hobbies_interests", [])
    
    return {
        "personal": personal,
        "summary": summary,
        "experience": experience,
        "education": education,
        "skills": skills,
        "projects": projects,
        "achievements": achievements,
        "hobbies": hobbies,
    }


@router.post("/analyze")
async def analyze_resume_with_jd(
    file: UploadFile = File(...), job_description: str = Form(...)
) -> dict[str, Any]:
    """
    Complete ATS analysis: Parse resume and compare with job description
    Uses semantic embeddings for concept matching

    Args:
        file: Resume file (PDF, DOCX, or TXT)
        job_description: Job description text

    Returns:
        Comprehensive ATS analysis with scores and recommendations
    """
    try:
        # Validate inputs
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        if not job_description or len(job_description.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Job description is too short. Please provide a detailed job description (at least 50 characters).",
            )

        # Check file type
        file_extension = file.filename.lower().split(".")[-1]
        if file_extension not in ["pdf", "docx", "doc", "txt"]:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files.",
            )

        # Read and parse file
        file_content = await file.read()

        # Check file size
        if len(file_content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, detail="File too large. Maximum size is 10MB."
            )

        # Parse the resume
        parsed_resume = file_parser.parse_file(file_content, file.filename)

        # Extract structured experience data
        ats_analyzer = get_ats_analyzer()
        structured_experience = ats_analyzer.extract_structured_experience(
            parsed_resume.get("text", "")
        )

        # Perform comprehensive ATS analysis with job description
        analysis_result = ats_analyzer.analyze_resume_with_job_description(
            parsed_resume, job_description
        )

        # Add structured experience and metadata
        analysis_result.update(
            {
                "structured_experience": structured_experience,
                "filename": file.filename,
                "file_size": len(file_content),
                "jd_length": len(job_description),
                "job_description": job_description,  # Include the AI-generated job description
            }
        )

        return {
            "success": True,
            "data": analysis_result,
            "message": "ATS analysis completed successfully",
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during analysis: {e!s}")


@router.post("/extract-experience")
async def extract_structured_experience(file: UploadFile = File(...)) -> dict[str, Any]:
    """
    Extract structured work experience with proper project association
    Uses AI to distinguish between job responsibilities and project descriptions

    Args:
        file: Resume file (PDF, DOCX, or TXT)

    Returns:
        Structured experience data with projects properly associated with jobs
    """
    try:
        # Validate inputs
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        # Check file type
        file_extension = file.filename.lower().split(".")[-1]
        if file_extension not in ["pdf", "docx", "doc", "txt"]:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files.",
            )

        # Read and parse file
        file_content = await file.read()

        # Check file size
        if len(file_content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, detail="File too large. Maximum size is 10MB."
            )

        # Parse the resume
        parsed_resume = file_parser.parse_file(file_content, file.filename)

        # Extract structured experience
        ats_analyzer = get_ats_analyzer()
        structured_experience = ats_analyzer.extract_structured_experience(
            parsed_resume.get("text", "")
        )

        return {
            "success": True,
            "data": {
                "structured_experience": structured_experience,
                "filename": file.filename,
                "file_size": len(file_content),
                "raw_text": (
                    parsed_resume.get("text", "")[:500] + "..."
                    if len(parsed_resume.get("text", "")) > 500
                    else parsed_resume.get("text", "")
                ),
            },
            "message": "Structured experience extracted successfully",
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error extracting experience: {e!s}"
        )


@router.post("/improvement-plan")
async def get_improvement_plan(request: ImprovementPlanRequest) -> dict[str, Any]:
    """
    Generate personalized improvement plan based on ATS analysis

    Args:
        request: ImprovementPlanRequest with analysis_result, extracted_data, and optional job_description

    Returns:
        Improvement plan with actionable suggestions, priorities, and score impacts
    """
    try:
        plan = resume_improver.generate_improvement_plan(
            analysis_result=request.analysis_result,
            extracted_data=request.extracted_data,
            job_description=request.job_description,
        )

        return {
            "success": True,
            "data": plan,
            "message": "Improvement plan generated successfully",
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating improvement plan: {e!s}"
        )


@router.get("/supported-formats")
async def get_supported_formats() -> dict[str, Any]:
    """
    Get list of supported file formats
    """
    return {
        "supported_formats": file_parser.supported_formats,
        "max_file_size": "10MB",
        "description": "Supported resume file formats",
    }
