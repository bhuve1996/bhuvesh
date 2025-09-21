"""
File upload API endpoints
This handles file uploads and parsing
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any
import sys
import os

# Add the parent directory to the path so we can import our utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.file_parser import file_parser
from app.services.ats_analyzer import ats_analyzer

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
        
        # Perform ATS analysis
        analysis_result = ats_analyzer.analyze_resume(parsed_content)
        
        # Add file metadata to analysis result
        analysis_result.update({
            "filename": file.filename,
            "file_size": len(file_content),
            "file_type": file.content_type,
            "parsed_content": parsed_content
        })
        
        return {
            "success": True,
            "data": analysis_result,
            "message": "Resume analyzed successfully"
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
