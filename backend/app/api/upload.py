"""
File upload API endpoints
Enhanced with job description comparison and semantic matching
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Dict, Any, Optional
from pydantic import BaseModel
import sys
import os

# Add the parent directory to the path so we can import our utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.file_parser import file_parser
from app.services.ats_analyzer import ats_analyzer
from app.services.resume_improver import ResumeImprover

# Initialize services
resume_improver = ResumeImprover()

# Pydantic models for request/response validation
class JobDescriptionRequest(BaseModel):
    """Request model for job description comparison"""
    job_description: str
    resume_text: Optional[str] = None

class ImprovementPlanRequest(BaseModel):
    """Request model for improvement plan generation"""
    analysis_result: Dict[str, Any]
    extracted_data: Dict[str, Any]
    job_description: Optional[str] = None

# Create a router (like Express router)
router = APIRouter(prefix="/api/upload", tags=["upload"])

@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)) -> Dict[str, Any]:
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
        file_extension = file.filename.lower().split('.')[-1]
        if file_extension not in ['pdf', 'docx', 'doc', 'txt']:
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files."
            )
        
        # Read file content
        file_content = await file.read()
        
        # Check file size (limit to 10MB)
        if len(file_content) > 10 * 1024 * 1024:  # 10MB in bytes
            raise HTTPException(
                status_code=400, 
                detail="File too large. Maximum size is 10MB."
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
                "text": parsed_content.get('text', ''),
                "word_count": parsed_content.get('word_count', 0),
                "character_count": parsed_content.get('character_count', 0),
                "formatting_analysis": parsed_content.get('formatting_analysis', {}),
                "parsed_content": parsed_content
            },
            "message": "Resume parsed successfully"
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle other exceptions
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing file: {str(e)}"
        )

@router.post("/quick-analyze")
async def quick_analyze_resume(
    file: UploadFile = File(...)
) -> Dict[str, Any]:
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
        file_extension = file.filename.lower().split('.')[-1]
        if file_extension not in ['pdf', 'docx', 'doc', 'txt']:
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files."
            )
        
        # Read and parse file
        file_content = await file.read()
        
        # Check file size
        if len(file_content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, 
                detail="File too large. Maximum size is 10MB."
            )
        
        # Parse the resume
        parsed_resume = file_parser.parse_file(file_content, file.filename)
        
        # Detect job type using AI
        from app.services.job_detector import JobDetector
        job_detector = JobDetector()
        job_detection_result = job_detector.detect_job_type(parsed_resume.get('text', ''))
        
        if not job_detection_result.get('job_type'):
            raise HTTPException(
                status_code=400, 
                detail="Could not detect job type from resume. Please try again or provide a custom job description."
            )
        
        # Generate specific job description for detected job type
        from app.services.job_description_generator import JobDescriptionGenerator
        jd_generator = JobDescriptionGenerator()
        
        # Determine experience level from resume
        experience_level = "mid-level"  # Default
        if "senior" in job_detection_result.get('job_type', '').lower():
            experience_level = "senior-level"
        elif "junior" in job_detection_result.get('job_type', '').lower() or "entry" in job_detection_result.get('job_type', '').lower():
            experience_level = "entry-level"
        
        generated_job_description = jd_generator.generate_job_description(
            job_detection_result['job_type'], 
            experience_level
        )
        
        # Extract structured experience data
        structured_experience = ats_analyzer.extract_structured_experience(parsed_resume.get('text', ''))
        
        # Perform comprehensive ATS analysis with generated job description
        analysis_result = ats_analyzer.analyze_resume_with_job_description(
            parsed_resume, 
            generated_job_description
        )
        
        # Add job detection results and generated job description
        analysis_result.update({
            "detected_job_type": job_detection_result['job_type'],
            "job_detection_confidence": job_detection_result.get('confidence', 0.0),
            "structured_experience": structured_experience,
            "filename": file.filename,
            "file_size": len(file_content),
            "jd_length": len(generated_job_description),
            "job_description": generated_job_description,  # Include the AI-generated job description
        })
        
        return {
            "success": True,
            "data": analysis_result,
            "message": "Quick analysis completed successfully with AI-generated job description"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error during quick analysis: {str(e)}"
        )

@router.post("/analyze")
async def analyze_resume_with_jd(
    file: UploadFile = File(...),
    job_description: str = Form(...)
) -> Dict[str, Any]:
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
                detail="Job description is too short. Please provide a detailed job description (at least 50 characters)."
            )
        
        # Check file type
        file_extension = file.filename.lower().split('.')[-1]
        if file_extension not in ['pdf', 'docx', 'doc', 'txt']:
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files."
            )
        
        # Read and parse file
        file_content = await file.read()
        
        # Check file size
        if len(file_content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, 
                detail="File too large. Maximum size is 10MB."
            )
        
        # Parse the resume
        parsed_resume = file_parser.parse_file(file_content, file.filename)
        
        # Extract structured experience data
        structured_experience = ats_analyzer.extract_structured_experience(parsed_resume.get('text', ''))
        
        # Perform comprehensive ATS analysis with job description
        analysis_result = ats_analyzer.analyze_resume_with_job_description(
            parsed_resume, 
            job_description
        )
        
        # Add structured experience and metadata
        analysis_result.update({
            "structured_experience": structured_experience,
            "filename": file.filename,
            "file_size": len(file_content),
            "jd_length": len(job_description),
            "job_description": job_description,  # Include the AI-generated job description
        })
        
        return {
            "success": True,
            "data": analysis_result,
            "message": "ATS analysis completed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error during analysis: {str(e)}"
        )

@router.post("/extract-experience")
async def extract_structured_experience(
    file: UploadFile = File(...)
) -> Dict[str, Any]:
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
        file_extension = file.filename.lower().split('.')[-1]
        if file_extension not in ['pdf', 'docx', 'doc', 'txt']:
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files."
            )
        
        # Read and parse file
        file_content = await file.read()
        
        # Check file size
        if len(file_content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, 
                detail="File too large. Maximum size is 10MB."
            )
        
        # Parse the resume
        parsed_resume = file_parser.parse_file(file_content, file.filename)
        
        # Extract structured experience
        structured_experience = ats_analyzer.extract_structured_experience(parsed_resume.get('text', ''))
        
        return {
            "success": True,
            "data": {
                "structured_experience": structured_experience,
                "filename": file.filename,
                "file_size": len(file_content),
                "raw_text": parsed_resume.get('text', '')[:500] + '...' if len(parsed_resume.get('text', '')) > 500 else parsed_resume.get('text', '')
            },
            "message": "Structured experience extracted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error extracting experience: {str(e)}"
        )

@router.post("/improvement-plan")
async def get_improvement_plan(request: ImprovementPlanRequest) -> Dict[str, Any]:
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
            job_description=request.job_description
        )
        
        return {
            "success": True,
            "data": plan,
            "message": "Improvement plan generated successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating improvement plan: {str(e)}"
        )

@router.get("/supported-formats")
async def get_supported_formats() -> Dict[str, Any]:
    """
    Get list of supported file formats
    """
    return {
        "supported_formats": file_parser.supported_formats,
        "max_file_size": "10MB",
        "description": "Supported resume file formats"
    }
