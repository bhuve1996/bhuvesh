"""
Job Description Generator Service

Generates specific, realistic job descriptions for detected job types
to provide accurate ATS scoring instead of using generic descriptions.
"""

import os
from typing import Dict, Any, Optional

# Try to import Google Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
    # Try to configure with API key from environment
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key and api_key != 'your_api_key_here' and len(api_key) > 20:
        genai.configure(api_key=api_key)
        print("✅ Job Description Generator: Google Gemini configured")
    else:
        GEMINI_AVAILABLE = False
        print("ℹ️  Job Description Generator: Google Gemini available but no valid API key set")
except ImportError:
    GEMINI_AVAILABLE = False
    print("ℹ️  Job Description Generator: Google Gemini not installed")


class JobDescriptionGenerator:
    """
    Generates specific job descriptions for detected job types
    """
    
    def __init__(self):
        self.model = None
        global GEMINI_AVAILABLE
        if GEMINI_AVAILABLE:
            try:
                self.model = genai.GenerativeModel('gemini-1.5-flash')
            except Exception as e:
                print(f"⚠️  Failed to initialize Gemini model: {e}")
                GEMINI_AVAILABLE = False
    
    def generate_job_description(self, job_type: str, experience_level: str = "mid-level") -> str:
        """
        Generate a specific job description for the detected job type
        
        Args:
            job_type: The detected job type (e.g., "DevOps Engineer", "Software Engineer")
            experience_level: Experience level (entry-level, mid-level, senior-level)
            
        Returns:
            A specific job description for ATS analysis
        """
        if not GEMINI_AVAILABLE or not self.model:
            raise Exception("AI job description generation is required. Please configure GEMINI_API_KEY in .env file")
        
        try:
            prompt = self._create_generation_prompt(job_type, experience_level)
            response = self.model.generate_content(prompt)
            
            if response and response.text:
                return self._clean_generated_jd(response.text)
            else:
                return self._get_fallback_job_description(job_type, experience_level)
                
        except Exception as e:
            print(f"⚠️  Error generating job description with AI: {e}")
            return self._get_fallback_job_description(job_type, experience_level)
    
    def _create_generation_prompt(self, job_type: str, experience_level: str) -> str:
        """Create a prompt for generating job descriptions"""
        return f"""
Generate a realistic, comprehensive job description for a {experience_level} {job_type} position.

Requirements:
1. Include 8-12 specific technical requirements relevant to {job_type}
2. Include 4-6 soft skills and behavioral requirements
3. Include 2-3 years of experience requirements appropriate for {experience_level}
4. Include specific technologies, tools, and frameworks commonly used in {job_type} roles
5. Include responsibilities that are typical for {job_type} positions
6. Make it realistic and industry-standard
7. Focus on keywords that ATS systems would look for
8. Keep it professional and detailed

Format the response as a clean job description without any meta-commentary or explanations.
Start directly with the job title and requirements.
"""
    
    def _clean_generated_jd(self, generated_text: str) -> str:
        """Clean and format the generated job description"""
        # Remove any markdown formatting or extra text
        lines = generated_text.strip().split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            # Skip empty lines and meta-commentary
            if line and not line.startswith('**') and not line.startswith('*') and not line.startswith('#'):
                cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines)
    
    def _get_fallback_job_description(self, job_type: str, experience_level: str) -> str:
        """
        Fallback job descriptions when AI is not available
        """
        job_descriptions = {
            "DevOps Engineer": f"""
{job_type} - {experience_level.title()}

We are seeking a {experience_level} {job_type} to join our team.

Requirements:
- 3+ years of experience in DevOps, infrastructure, and automation
- Strong proficiency in cloud platforms (AWS, Azure, GCP)
- Experience with containerization (Docker, Kubernetes)
- Knowledge of CI/CD pipelines and automation tools
- Experience with Infrastructure as Code (Terraform, CloudFormation)
- Proficiency in scripting languages (Python, Bash, PowerShell)
- Experience with monitoring and logging tools
- Knowledge of security best practices
- Strong problem-solving and communication skills
- Experience with version control systems (Git)
- Knowledge of Linux/Unix systems administration
- Experience with configuration management tools
""",
            
            "Software Engineer": f"""
{job_type} - {experience_level.title()}

We are looking for a {experience_level} {job_type} to develop and maintain software applications.

Requirements:
- 3+ years of software development experience
- Strong proficiency in programming languages (Java, Python, JavaScript, C++)
- Experience with web development frameworks
- Knowledge of databases (SQL, NoSQL)
- Experience with version control systems (Git)
- Understanding of software development lifecycle
- Experience with testing frameworks and methodologies
- Knowledge of cloud platforms and services
- Strong problem-solving and analytical skills
- Experience with agile development methodologies
- Knowledge of API development and integration
- Strong communication and teamwork skills
""",
            
            "Data Scientist": f"""
{job_type} - {experience_level.title()}

We are seeking a {experience_level} {job_type} to analyze data and build predictive models.

Requirements:
- 3+ years of experience in data science and analytics
- Strong proficiency in Python and R
- Experience with machine learning frameworks (scikit-learn, TensorFlow, PyTorch)
- Knowledge of statistical analysis and modeling
- Experience with data visualization tools
- Proficiency in SQL and database management
- Experience with big data technologies
- Knowledge of cloud platforms for data processing
- Strong analytical and problem-solving skills
- Experience with data preprocessing and feature engineering
- Knowledge of business intelligence tools
- Strong communication skills for presenting insights
""",
            
            "Product Manager": f"""
{job_type} - {experience_level.title()}

We are looking for a {experience_level} {job_type} to lead product development and strategy.

Requirements:
- 3+ years of product management experience
- Strong understanding of product development lifecycle
- Experience with agile methodologies and frameworks
- Knowledge of market research and competitive analysis
- Experience with user research and customer feedback
- Strong analytical and data-driven decision making
- Experience with project management tools
- Knowledge of business strategy and planning
- Strong communication and leadership skills
- Experience with cross-functional team collaboration
- Knowledge of product metrics and KPIs
- Understanding of technology and development processes
""",
            
            "UX/UI Designer": f"""
{job_type} - {experience_level.title()}

We are seeking a {experience_level} {job_type} to create user-centered design solutions.

Requirements:
- 3+ years of UX/UI design experience
- Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)
- Experience with user research and usability testing
- Knowledge of design systems and component libraries
- Experience with prototyping and wireframing
- Understanding of user-centered design principles
- Knowledge of accessibility standards and guidelines
- Experience with responsive and mobile design
- Strong visual design and typography skills
- Experience with design collaboration tools
- Knowledge of front-end development basics
- Strong communication and presentation skills
"""
        }
        
        # Return specific JD if available, otherwise generic
        if job_type in job_descriptions:
            return job_descriptions[job_type]
        else:
            return f"""
{job_type} - {experience_level.title()}

We are seeking a {experience_level} {job_type} to join our team.

Requirements:
- 3+ years of relevant experience in {job_type.lower()}
- Strong technical skills and domain expertise
- Experience with industry-standard tools and technologies
- Knowledge of best practices and methodologies
- Strong problem-solving and analytical skills
- Excellent communication and teamwork abilities
- Experience with project management and delivery
- Continuous learning and adaptability
- Attention to detail and quality focus
- Leadership and mentoring capabilities
"""
    
    def determine_experience_level(self, resume_text: str) -> str:
        """
        Determine experience level based on resume content
        """
        text_lower = resume_text.lower()
        
        # Look for seniority indicators
        senior_indicators = ['senior', 'lead', 'principal', 'staff', 'architect', 'director', 'manager']
        entry_indicators = ['junior', 'entry', 'associate', 'intern', 'trainee']
        
        # Count years of experience mentions
        import re
        years_pattern = r'(\d+)\+?\s*years?\s*(?:of\s*)?experience'
        years_matches = re.findall(years_pattern, text_lower)
        
        total_years = 0
        for match in years_matches:
            try:
                total_years += int(match)
            except ValueError:
                pass
        
        # Determine level based on indicators and years
        if any(indicator in text_lower for indicator in senior_indicators) or total_years >= 7:
            return "senior-level"
        elif any(indicator in text_lower for indicator in entry_indicators) or total_years <= 2:
            return "entry-level"
        else:
            return "mid-level"


# Global instance
job_description_generator = JobDescriptionGenerator()
