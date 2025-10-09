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
    AI-enhanced project and experience extraction
    Uses LLM to intelligently parse resume structure
    """
    
    def __init__(self):
        """Initialize the project extractor"""
        self.use_ai = GEMINI_AVAILABLE
        
    def extract_structured_experience(self, resume_text: str) -> Dict[str, Any]:
        """
        Extract structured work experience with proper project association using AI
        
        Returns:
            Dictionary with structured experience data
        """
        if not self.use_ai:
            raise Exception("AI extraction is required. Please configure GEMINI_API_KEY in .env file")
        
        return self._ai_enhanced_extraction(resume_text)
    
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
      "positions": [
        {{
          "title": "Job Title",
          "location": "City, Country", 
          "duration": "MM/YYYY - MM/YYYY or Present",
          "start_date": "MM/YYYY",
          "end_date": "MM/YYYY or Present"
        }}
      ],
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
      ],
      "skills_used": ["skill1", "skill2", "skill3"],
      "total_experience_years": 2.5,
      "current": false
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

CRITICAL RULES FOR PROPER GROUPING:
1. **GROUP BY COMPANY**: If someone worked at the same company in multiple roles, create ONE entry per company
2. **MULTIPLE POSITIONS**: Use "positions" array to list all roles at the same company with their dates
3. **SMART CATEGORIZATION**: 
   - "responsibilities" = general job duties and day-to-day tasks
   - "projects" = specific projects, initiatives, or deliverables
   - "achievements" = quantified results, awards, or measurable impacts
4. **TECHNOLOGY EXTRACTION**: Extract all technologies, tools, and skills used at each company
5. **EXPERIENCE CALCULATION**: Calculate total years of experience and add to each company entry
6. **CURRENT COMPANY**: Mark the most recent company as "current": true
7. **PROPER PARSING**: 
   - Parse dates correctly (MM/YYYY format)
   - Extract locations properly
   - Don't treat bullet points as separate companies
8. **COMPREHENSIVE GROUPING**: All work done at the same company should be under one entry
9. Return valid JSON only, no additional text

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
        job_title = None
        
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            
            # Detect job title line (contains job titles like Engineer, Architect, etc.)
            if self._is_job_title_line(line_stripped):
                job_title = line_stripped
                continue
            
            # Detect date/location line (contains dates and location)
            if self._is_date_location_line(line_stripped):
                if job_title:
                    # Save previous job
                    if current_job:
                        work_experience.append(current_job)
                    
                    # Create new job with title and date/location info
                    current_job = self._parse_job_with_title_and_date(job_title, line_stripped)
                    job_title = None
                continue
            
            # Detect project/achievement line
            if current_job and self._is_project_line(line_stripped):
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
    
    def _is_job_title_line(self, line: str) -> bool:
        """Check if line represents a job title"""
        job_title_patterns = [
            r'\b(?:Senior|Staff|Principal|Lead|DevOps|AWS|Linux|Admin|Engineer|Architect|Developer|Manager|Analyst|Specialist|Consultant|Director)\b.*?(?:Engineer|Architect|Developer|Manager|Analyst|Specialist|Consultant|Director)',
            r'\b(?:Engineer|Architect|Developer|Manager|Analyst|Specialist|Consultant|Director)\b.*?(?:Equinix|Abinbev|Cerner|TCS|Infosys)',
        ]
        
        return any(re.search(pattern, line, re.IGNORECASE) for pattern in job_title_patterns)
    
    def _is_date_location_line(self, line: str) -> bool:
        """Check if line represents a date and location"""
        date_pattern = r'\d{1,2}/\d{4}\s*[-–]\s*(?:\d{1,2}/\d{4}|present)'
        location_pattern = r'\|\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*'
        
        return re.search(date_pattern, line, re.IGNORECASE) and re.search(location_pattern, line)
    
    def _parse_job_with_title_and_date(self, job_title: str, date_location: str) -> Dict[str, Any]:
        """Parse job with title and date/location info"""
        # Extract dates
        date_match = re.search(r'(\d{1,2}/\d{4})\s*[-–]\s*(?:(\d{1,2}/\d{4})|(present))', date_location, re.IGNORECASE)
        
        # Extract location
        location_match = re.search(r'\|\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)', date_location)
        
        # Extract company from job title
        company = ''
        position = job_title
        
        # Look for company patterns in the job title
        company_match = re.search(r',\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)', job_title)
        if company_match:
            company = company_match.group(1)
            position = job_title.replace(company_match.group(0), '').strip()
        
        return {
            'company': company,
            'position': position,
            'location': location_match.group(0).replace('|', '').strip() if location_match else '',
            'duration': date_match.group(0) if date_match else '',
            'start_date': date_match.group(1) if date_match else '',
            'end_date': date_match.group(2) or date_match.group(3) if date_match else '',
            'responsibilities': [],
            'projects': [],
            'achievements': []
        }
    
    def _is_job_line(self, line: str) -> bool:
        """Check if line represents a job/company"""
        # Look for company patterns
        company_patterns = [
            r'\b(?:inc|corp|ltd|llc|pvt|company|technologies|solutions|services|systems|equinix|abinbev|cerner|tcs|infosys)\b',
            r'\b(?:engineer|developer|manager|analyst|specialist|architect|consultant|director|lead|senior|junior|staff|principal)\b'
        ]
        
        # Check for date patterns
        date_pattern = r'\d{1,2}/\d{4}\s*[-–]\s*(?:\d{1,2}/\d{4}|present)'
        
        # More flexible matching - either company pattern OR date pattern
        has_company = any(re.search(pattern, line, re.IGNORECASE) for pattern in company_patterns)
        has_date = re.search(date_pattern, line, re.IGNORECASE)
        
        return has_company or has_date
    
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
        
        # Extract location - look for "| City, Country" pattern
        location_match = re.search(r'\|\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)', line)
        
        # Extract company and position
        company = ''
        position = ''
        
        # Handle different formats
        if ',' in line:
            parts = line.split(',')
            company = parts[0].strip()
            if len(parts) > 1:
                position = parts[1].strip()
        else:
            # Look for job title patterns
            job_title_match = re.search(r'\b(?:Senior|Staff|Principal|Lead|DevOps|AWS|Linux|Admin|Engineer|Architect|Developer|Manager|Analyst|Specialist|Consultant|Director)\b.*?(?=,|\|)', line, re.IGNORECASE)
            if job_title_match:
                position = job_title_match.group(0).strip()
                company = line.replace(position, '').strip()
            else:
                company = line.strip()
        
        return {
            'company': company,
            'position': position,
            'location': location_match.group(0).replace('|', '').strip() if location_match else '',
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
        
        # Extract location - look for common city, country patterns
        location_patterns = [
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*(India|USA|United States|UK|United Kingdom|Canada|Australia|Germany|France|Japan|China)',
            r'(Bangalore|Mumbai|Delhi|Chennai|Hyderabad|Pune|Kolkata|Ahmedabad|Gurgaon|Noida),\s*(India)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
        ]
        
        for pattern in location_patterns:
            location_match = re.search(pattern, resume_text)
            if location_match:
                contact_info['location'] = location_match.group(0)
                break
        
        return contact_info


# Create global instance
project_extractor = ProjectExtractor()
