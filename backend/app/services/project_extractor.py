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
            # Enhanced prompt with proper time calculation
            prompt = f"""Extract ALL work experience from this resume. Calculate exact time periods and identify current company. Return ONLY valid JSON.

CRITICAL RULES:
1. Extract EVERY company and position mentioned in the resume - do not miss any
2. Calculate total_experience_years as decimal (e.g., 2.5 for 2 years 6 months)
3. Mark current company with "current": true (look for "Present", "Current", or most recent dates)
4. Use exact dates from resume for start_date and end_date
5. Group multiple positions at same company under one entry
6. Extract all technologies and skills used at each company
7. Include ALL work experience entries, even if they seem less relevant
8. Extract ALL sections: Summary, Contact Info, Skills (with proficiency), Education, Certifications, Awards, Automations
9. For skills, include proficiency levels (Beginner, Intermediate, Advanced, Expert) when mentioned
10. Extract all certifications with issuer and dates
11. Extract all awards and recognitions
12. Extract automation projects and their impact

{{
  "summary": "Professional summary or objective from the top of resume",
  "contact_info": {{
    "full_name": "Full Name",
    "email": "email@domain.com", 
    "phone": "phone number",
    "location": "City, Country",
    "linkedin": "username",
    "github": "username",
    "portfolio": "portfolio website"
  }},
  "skills": [
    {{
      "category": "Technical Skills",
      "skills": [
        {{
          "name": "Python",
          "proficiency": "Advanced"
        }},
        {{
          "name": "AWS",
          "proficiency": "Expert"
        }}
      ]
    }}
  ],
  "work_experience": [
    {{
      "company": "Company Name",
      "positions": [
        {{
          "title": "Job Title", 
          "location": "City, Country", 
          "duration": "MM/YYYY - MM/YYYY or Present", 
          "start_date": "MM/YYYY", 
          "end_date": "MM/YYYY or Present"
        }}
      ],
      "responsibilities": ["responsibility 1"],
      "projects": [
        {{
          "name": "Project Name", 
          "description": "description", 
          "technologies": ["tech1"], 
          "achievements": ["achievement1"]
        }}
      ],
      "achievements": ["achievement 1"],
      "skills_used": ["skill1", "skill2"],
      "total_experience_years": 2.5,
      "current": false
    }}
  ],
  "education": [
    {{
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University Name",
      "location": "City, Country",
      "graduation_year": "2020",
      "gpa": "3.8",
      "relevant_coursework": ["course1", "course2"]
    }}
  ],
  "certifications": [
    {{
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "date": "2023",
      "expiry": "2026"
    }}
  ],
  "awards": [
    {{
      "name": "Employee of the Year",
      "issuer": "Company Name",
      "date": "2023",
      "description": "Recognition for outstanding performance"
    }}
  ],
  "automations": [
    {{
      "name": "CI/CD Pipeline Automation",
      "description": "Automated deployment process",
      "technologies": ["Jenkins", "Docker"],
      "impact": "Reduced deployment time by 60%"
    }}
  ]
}}

Resume text:
{resume_text}"""

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
                work_exp_count = len(structured_data.get('work_experience', []))
                print(f"✅ AI extraction successful - Found {work_exp_count} work experience entries")
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
