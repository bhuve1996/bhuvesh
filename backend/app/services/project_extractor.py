"""
AI-Enhanced Project and Experience Extraction
Uses LLM to intelligently parse resume sections and distinguish between:
- Job positions and their responsibilities
- Project descriptions and achievements
- Properly associate projects with their parent jobs
"""

import re
import os
from typing import Dict, List, Any, Tuple, Optional
import json

# Try to import Google Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
    # Try to configure with API key from environment
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        genai.configure(api_key=api_key)
        print("✅ Project Extractor: Google Gemini configured")
    else:
        GEMINI_AVAILABLE = False
        print("ℹ️  Project Extractor: Google Gemini available but no API key set")
except ImportError:
    GEMINI_AVAILABLE = False
    print("ℹ️  Project Extractor: Google Gemini not installed")


class ProjectExtractor:
    """
    AI-enhanced project and experience extraction
    Uses LLM to intelligently parse resume structure
    """
    
    def __init__(self):
        """Initialize the project extractor"""
        self.use_ai = GEMINI_AVAILABLE
        
    def extract_structured_experience(self, resume_text: str) -> Dict[str, Any]:
        """
        Extract structured work experience with proper project association
        
        Returns:
            Dictionary with structured experience data
        """
        if self.use_ai:
            return self._ai_enhanced_extraction(resume_text)
        else:
            return self._fallback_extraction(resume_text)
    
    def _ai_enhanced_extraction(self, resume_text: str) -> Dict[str, Any]:
        """
        Use AI to extract and structure work experience
        """
        try:
            # Create model
            model = genai.GenerativeModel('gemini-pro')
            
            # Extract experience section (first 2000 chars should be enough)
            experience_text = self._extract_experience_section(resume_text)
            
            if not experience_text:
                return self._fallback_extraction(resume_text)
            
            # Create detailed prompt for structured extraction
            prompt = f"""Analyze this resume experience section and extract structured work experience data.
Return a JSON object with the following structure:

{{
  "work_experience": [
    {{
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, Country",
      "duration": "MM/YYYY - MM/YYYY or Present",
      "start_date": "MM/YYYY",
      "end_date": "MM/YYYY or Present",
      "responsibilities": [
        "Main responsibility 1",
        "Main responsibility 2"
      ],
      "projects": [
        {{
          "name": "Project Name",
          "description": "Project description",
          "technologies": ["tech1", "tech2"],
          "achievements": ["achievement1", "achievement2"]
        }}
      ],
      "achievements": [
        "Quantified achievement 1",
        "Quantified achievement 2"
      ]
    }}
  ],
  "contact_info": {{
    "full_name": "Full Name",
    "email": "email@domain.com",
    "phone": "phone number",
    "location": "City, Country",
    "linkedin": "linkedin username",
    "github": "github username"
  }}
}}

Rules:
1. Only extract actual work experience, not education or skills
2. Group project descriptions under their parent job
3. Extract quantified achievements (with numbers, percentages, etc.)
4. Identify technologies used in each project
5. Parse dates correctly (MM/YYYY format)
6. Extract contact information from the top of resume
7. Return valid JSON only, no additional text

Resume text:
{experience_text}

JSON:"""
            
            # Generate response
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=2000,
                    temperature=0.1,  # Low temperature for consistent results
                )
            )
            
            # Parse JSON response
            json_text = response.text.strip()
            
            # Clean up the response (remove markdown formatting if present)
            if json_text.startswith('```json'):
                json_text = json_text[7:]
            if json_text.endswith('```'):
                json_text = json_text[:-3]
            
            # Parse JSON
            try:
                structured_data = json.loads(json_text)
                print("✅ AI extraction successful")
                return structured_data
            except json.JSONDecodeError as e:
                print(f"JSON parsing error: {e}")
                print(f"Raw response: {json_text}")
                return self._fallback_extraction(resume_text)
                
        except Exception as e:
            print(f"AI extraction error: {e}")
            return self._fallback_extraction(resume_text)
    
    def _extract_experience_section(self, resume_text: str) -> str:
        """
        Extract the work experience section from resume
        """
        lines = resume_text.split('\n')
        experience_start = -1
        experience_end = len(lines)
        
        # Find experience section start
        for i, line in enumerate(lines):
            line_lower = line.strip().lower()
            if any(keyword in line_lower for keyword in [
                'professional experience', 'work experience', 'experience', 
                'employment', 'career', 'work history'
            ]) and len(line.strip()) < 50:  # Section header
                experience_start = i
                break
        
        # If no explicit section found, look for job patterns
        if experience_start == -1:
            for i, line in enumerate(lines):
                # Look for job title patterns
                if re.search(r'\b(?:engineer|developer|manager|analyst|specialist|architect|consultant|director|lead|senior|junior|staff|principal)\b', line, re.IGNORECASE):
                    # Check if next few lines have company patterns
                    for j in range(i, min(i+3, len(lines))):
                        if re.search(r'\b(?:inc|corp|ltd|llc|pvt|company|technologies|solutions|services|systems)\b', lines[j], re.IGNORECASE):
                            experience_start = i
                            break
                    if experience_start != -1:
                        break
        
        # Find experience section end
        if experience_start != -1:
            for i in range(experience_start + 1, len(lines)):
                line_lower = lines[i].strip().lower()
                if any(keyword in line_lower for keyword in [
                    'education', 'skills', 'certifications', 'projects', 
                    'awards', 'languages', 'hobbies', 'interests'
                ]) and len(lines[i].strip()) < 50:  # Next section header
                    experience_end = i
                    break
        
        # Extract the section
        if experience_start != -1:
            experience_lines = lines[experience_start:experience_end]
            return '\n'.join(experience_lines)
        
        # Fallback: return first 2000 characters
        return resume_text[:2000]
    
    def _fallback_extraction(self, resume_text: str) -> Dict[str, Any]:
        """
        Fallback extraction using regex patterns when AI is not available
        """
        lines = resume_text.split('\n')
        
        # Extract contact info
        contact_info = self._extract_contact_info_fallback(resume_text)
        
        # Extract work experience
        work_experience = []
        current_job = None
        
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            
            # Detect job/company line
            if self._is_job_line(line_stripped):
                # Save previous job
                if current_job:
                    work_experience.append(current_job)
                
                # Parse new job
                current_job = self._parse_job_line(line_stripped)
            
            # Detect project/achievement line
            elif current_job and self._is_project_line(line_stripped):
                if 'projects' not in current_job:
                    current_job['projects'] = []
                
                project = self._parse_project_line(line_stripped)
                current_job['projects'].append(project)
            
            # Detect responsibility line
            elif current_job and self._is_responsibility_line(line_stripped):
                if 'responsibilities' not in current_job:
                    current_job['responsibilities'] = []
                current_job['responsibilities'].append(line_stripped)
        
        # Add last job
        if current_job:
            work_experience.append(current_job)
        
        return {
            'work_experience': work_experience,
            'contact_info': contact_info
        }
    
    def _is_job_line(self, line: str) -> bool:
        """Check if line represents a job/company"""
        # Look for company patterns
        company_patterns = [
            r'\b(?:inc|corp|ltd|llc|pvt|company|technologies|solutions|services|systems)\b',
            r'\b(?:engineer|developer|manager|analyst|specialist|architect|consultant|director|lead|senior|junior|staff|principal)\b'
        ]
        
        # Check for date patterns
        date_pattern = r'\d{1,2}/\d{4}\s*[-–]\s*(?:\d{1,2}/\d{4}|present)'
        
        return (any(re.search(pattern, line, re.IGNORECASE) for pattern in company_patterns) and
                re.search(date_pattern, line, re.IGNORECASE))
    
    def _is_project_line(self, line: str) -> bool:
        """Check if line represents a project description"""
        project_indicators = [
            r'\b(?:developed|built|implemented|created|designed|integrated|engineered|architected|delivered|optimized)\b',
            r'\b(?:project|system|application|platform|tool|solution)\b',
            r'\([^)]*(?:react|angular|vue|python|java|aws|azure|docker|kubernetes)[^)]*\)'
        ]
        
        return any(re.search(pattern, line, re.IGNORECASE) for pattern in project_indicators)
    
    def _is_responsibility_line(self, line: str) -> bool:
        """Check if line represents a job responsibility"""
        responsibility_indicators = [
            r'\b(?:managed|led|coordinated|oversaw|supervised|directed)\b',
            r'\b(?:responsible for|in charge of|accountable for)\b',
            r'\b(?:collaborated|worked with|partnered with)\b'
        ]
        
        return any(re.search(pattern, line, re.IGNORECASE) for pattern in responsibility_indicators)
    
    def _parse_job_line(self, line: str) -> Dict[str, Any]:
        """Parse a job line into structured data"""
        # Extract dates
        date_match = re.search(r'(\d{1,2}/\d{4})\s*[-–]\s*(?:(\d{1,2}/\d{4})|(present))', line, re.IGNORECASE)
        
        # Extract location
        location_match = re.search(r'\|?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*$', line)
        
        return {
            'company': line.split(',')[0].strip() if ',' in line else line.strip(),
            'position': '',
            'location': location_match.group(1) if location_match else '',
            'duration': date_match.group(0) if date_match else '',
            'start_date': date_match.group(1) if date_match else '',
            'end_date': date_match.group(2) or date_match.group(3) if date_match else '',
            'responsibilities': [],
            'projects': [],
            'achievements': []
        }
    
    def _parse_project_line(self, line: str) -> Dict[str, Any]:
        """Parse a project line into structured data"""
        # Extract technologies from parentheses
        tech_match = re.search(r'\(([^)]+)\)', line)
        technologies = []
        if tech_match:
            tech_string = tech_match.group(1)
            technologies = [t.strip() for t in re.split(r'[,;/]', tech_string) if t.strip()]
        
        # Extract project name (first part before description)
        project_name = line.split('(')[0].strip() if '(' in line else line[:50] + '...'
        
        return {
            'name': project_name,
            'description': line,
            'technologies': technologies,
            'achievements': []
        }
    
    def _extract_contact_info_fallback(self, resume_text: str) -> Dict[str, Any]:
        """Extract contact information using regex patterns"""
        contact_info = {
            'full_name': '',
            'email': '',
            'phone': '',
            'location': '',
            'linkedin': '',
            'github': ''
        }
        
        lines = resume_text.split('\n')
        
        # Extract name (usually first line)
        if lines:
            contact_info['full_name'] = lines[0].strip()
        
        # Extract email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', resume_text)
        if email_match:
            contact_info['email'] = email_match.group(0)
        
        # Extract phone
        phone_match = re.search(r'([\+\d][\d\s\-\(\)]{8,})', resume_text)
        if phone_match:
            contact_info['phone'] = phone_match.group(0).strip()
        
        # Extract LinkedIn
        linkedin_match = re.search(r'linkedin\.com/in/([\w\-]+)', resume_text.lower())
        if linkedin_match:
            contact_info['linkedin'] = linkedin_match.group(1)
        
        # Extract GitHub
        github_match = re.search(r'github\.com/([\w\-]+)', resume_text.lower())
        if github_match:
            contact_info['github'] = github_match.group(1)
        
        # Extract location
        location_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)', resume_text)
        if location_match:
            contact_info['location'] = location_match.group(0)
        
        return contact_info


# Create global instance
project_extractor = ProjectExtractor()
