"""
Simplified Project Extractor Service - AI Only
"""

import os
import json
from typing import Dict, Any, Optional

# Try to import Google Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
    # Try to configure with API key from environment
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key and api_key != 'your_api_key_here' and len(api_key) > 20:
        genai.configure(api_key=api_key)
        print("✅ Project Extractor: Google Gemini configured")
    else:
        GEMINI_AVAILABLE = False
        print("ℹ️  Project Extractor: Google Gemini available but no valid API key set")
except ImportError:
    GEMINI_AVAILABLE = False
    print("ℹ️  Project Extractor: Google Gemini not installed")


class ProjectExtractor:
    """
    Simplified AI-only work experience extractor
    """
    
    def __init__(self):
        self.model = None
        global GEMINI_AVAILABLE
        if GEMINI_AVAILABLE:
            try:
                self.model = genai.GenerativeModel('gemini-2.0-flash')
            except Exception as e:
                print(f"⚠️  Failed to initialize Gemini model: {e}")
                GEMINI_AVAILABLE = False
    
    def extract_structured_experience(self, resume_text: str) -> Dict[str, Any]:
        """
        Use AI to extract and structure work experience
        """
        if not GEMINI_AVAILABLE or not self.model:
            raise Exception("AI work experience extraction is required. Please configure GEMINI_API_KEY in .env file")
        
        try:
            # Simple prompt
            prompt = f"""Extract work experience from this resume. Return ONLY valid JSON.

{{
  "work_experience": [
    {{
      "company": "Company Name",
      "positions": [{{"title": "Job Title", "location": "City, Country", "duration": "MM/YYYY - MM/YYYY", "start_date": "MM/YYYY", "end_date": "MM/YYYY"}}],
      "responsibilities": ["responsibility 1"],
      "projects": [{{"name": "Project Name", "description": "description", "technologies": ["tech1"], "achievements": ["achievement1"]}}],
      "achievements": ["achievement 1"],
      "skills_used": ["skill1", "skill2"],
      "total_experience_years": 2.5,
      "current": false
    }}
  ],
  "contact_info": {{
    "full_name": "Full Name",
    "email": "email@domain.com", 
    "phone": "phone number",
    "location": "City, Country",
    "linkedin": "username",
    "github": "username"
  }}
}}

Resume text:
{resume_text[:2000]}"""

            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                raise Exception("AI failed to generate response")
            
            json_text = response.text.strip()
            
            # Clean JSON
            if json_text.startswith('```json'):
                json_text = json_text[7:]
            if json_text.startswith('```'):
                json_text = json_text[3:]
            if json_text.endswith('```'):
                json_text = json_text[:-3]
            
            json_text = json_text.strip()
            
            # Parse JSON
            try:
                structured_data = json.loads(json_text)
                print("✅ AI extraction successful")
                return structured_data
            except json.JSONDecodeError as e:
                print(f"❌ JSON parsing error: {e}")
                print(f"Raw response: {json_text[:500]}...")
                raise Exception(f"AI generated invalid JSON: {e}")
                
        except Exception as e:
            print(f"❌ AI extraction error: {e}")
            raise Exception(f"AI work experience extraction failed: {e}")


# Create global instance
project_extractor = ProjectExtractor()
