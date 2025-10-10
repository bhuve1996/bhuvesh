"""
Job Description Generator Service

Generates specific, realistic job descriptions for detected job types
using AI only - no predefined templates.
"""

import os
import re

# Try to import Google Gemini
try:
    import google.generativeai as genai

    GEMINI_AVAILABLE = True
    # Try to configure with API key from environment
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key != "your_api_key_here" and len(api_key) > 20:
        genai.configure(api_key=api_key)
        print("✅ Job Description Generator: Google Gemini configured")
    else:
        GEMINI_AVAILABLE = False
        print(
            "ℹ️  Job Description Generator: Google Gemini available but no valid API key set"
        )
except ImportError:
    GEMINI_AVAILABLE = False
    print("ℹ️  Job Description Generator: Google Gemini not installed")


class JobDescriptionGenerator:
    """
    Generates specific job descriptions for detected job types using AI only
    """

    def __init__(self):
        self.model = None
        global GEMINI_AVAILABLE
        if GEMINI_AVAILABLE:
            try:
                self.model = genai.GenerativeModel("gemini-2.0-flash")
            except Exception as e:
                print(f"⚠️  Failed to initialize Gemini model: {e}")
                GEMINI_AVAILABLE = False

    def generate_job_description(
        self, job_type: str, experience_level: str = "mid-level"
    ) -> str:
        """
        Generate a specific job description for the detected job type using AI only

        Args:
            job_type: The detected job type (e.g., "DevOps Engineer", "Software Engineer")
            experience_level: Experience level (entry-level, mid-level, senior-level)

        Returns:
            A specific job description for ATS analysis
        """
        if not GEMINI_AVAILABLE or not self.model:
            raise Exception(
                "AI job description generation is required. Please configure GEMINI_API_KEY in .env file"
            )

        try:
            prompt = self._create_generation_prompt(job_type, experience_level)
            response = self.model.generate_content(prompt)

            if response and response.text:
                cleaned_jd = self._clean_generated_jd(response.text)
                if cleaned_jd.strip():  # Ensure we have actual content
                    return cleaned_jd
                else:
                    raise Exception("AI generated empty content after cleaning")
            else:
                raise Exception("AI failed to generate job description")

        except Exception as e:
            print(f"❌ Error generating job description with AI: {e}")
            # Return a minimal fallback instead of template
            return f"Job Description for {job_type} ({experience_level}):\n\nThis position requires expertise in {job_type.lower()} with {experience_level} experience. Please configure GEMINI_API_KEY for detailed AI-generated job descriptions."

    def _create_generation_prompt(self, job_type: str, experience_level: str) -> str:
        """Create a prompt for generating job descriptions"""
        return f"""
You are an expert technical recruiter and hiring manager. Generate a comprehensive, realistic job description for a {experience_level} {job_type} position that would be posted on LinkedIn, Indeed, or company career pages.

JOB DESCRIPTION STRUCTURE:
1. **Job Title & Company Overview** (2-3 sentences)
2. **Key Responsibilities** (6-8 detailed bullet points)
3. **Required Technical Skills** (12-15 specific technologies)
4. **Preferred Qualifications** (5-7 additional skills)
5. **Experience Requirements** (2-3 specific requirements)
6. **Soft Skills & Behavioral Traits** (4-5 qualities)
7. **What We Offer** (3-4 benefits/opportunities)

CRITICAL REQUIREMENTS:
- Make it 400-600 words long (comprehensive but not overwhelming)
- Include SPECIFIC technologies, tools, and frameworks (not just categories)
- Use realistic industry terminology and job market language
- Include specific cloud services, databases, and development tools
- Mention actual methodologies, practices, and industry standards
- Include version numbers where relevant (e.g., "React 18+", "Python 3.9+")
- Use action verbs and specific technical language
- Make it sound like a real job posting from a tech company

TECHNICAL DEPTH FOR {job_type}:
- **Programming Languages**: Include 3-4 specific languages with proficiency levels
- **Frameworks & Libraries**: Mention 4-5 specific frameworks with use cases
- **Databases**: Include 2-3 specific databases with experience levels
- **Cloud Platforms**: Specify actual services (AWS S3, EC2, Lambda, etc.)
- **DevOps & Tools**: Include specific CI/CD, containerization, and monitoring tools
- **APIs & Protocols**: Mention specific protocols and integration experience
- **Testing**: Include specific testing frameworks and methodologies
- **Architecture**: Mention specific patterns, design principles, and best practices

EXAMPLE TECHNICAL REQUIREMENTS FOR {job_type}:
- "3+ years of experience with Python 3.9+ and Django/Flask frameworks"
- "Proficiency in React 18+ with TypeScript and modern state management (Redux Toolkit)"
- "Experience with AWS services including EC2, S3, RDS, and Lambda functions"
- "Strong knowledge of PostgreSQL and Redis for data storage and caching"
- "Experience with Docker containerization and Kubernetes orchestration"
- "Familiarity with RESTful APIs, GraphQL, and microservices architecture"
- "Proficiency in Git version control and CI/CD pipelines using Jenkins or GitLab"

IMPORTANT GUIDELINES:
- Do NOT use placeholder text like "[Insert...]" or generic statements
- Write in present tense, active voice
- Use specific, measurable requirements where possible
- Include realistic salary ranges or experience levels
- Make it sound professional but engaging
- Focus on what the candidate will actually DO, not just what they should know
- Include both hard technical skills and practical experience requirements

Generate a complete, ready-to-post job description that sounds like it came from a real tech company.
"""

    def _clean_generated_jd(self, generated_text: str) -> str:
        """Clean and format the generated job description"""
        # Remove any markdown formatting or extra text
        lines = generated_text.strip().split("\n")
        cleaned_lines = []

        for line in lines:
            line = line.strip()
            # Skip empty lines and meta-commentary, but keep content lines
            if (
                line
                and not line.startswith("#")  # Only skip markdown headers
                and not line.startswith("```")  # Skip code blocks
                and not line.startswith("---")  # Skip separators
                and not line.lower().startswith("here's")  # Skip AI meta-commentary
                and not line.lower().startswith("i'll")  # Skip AI meta-commentary
            ):
                # Clean up markdown formatting but keep the content
                cleaned_line = line.replace("**", "").replace("*", "•")
                cleaned_lines.append(cleaned_line)

        return "\n".join(cleaned_lines)

    def determine_experience_level(self, resume_text: str) -> str:
        """
        Determine experience level based on resume content
        """
        text_lower = resume_text.lower()

        # Look for seniority indicators
        senior_indicators = [
            "senior",
            "lead",
            "principal",
            "staff",
            "architect",
            "director",
            "manager",
        ]
        entry_indicators = ["junior", "entry", "associate", "intern", "trainee"]

        # Count years of experience mentions
        years_pattern = r"(\d+)\+?\s*years?\s*(?:of\s*)?experience"
        years_matches = re.findall(years_pattern, text_lower)

        total_years = 0
        for match in years_matches:
            try:
                total_years += int(match)
            except ValueError:
                pass

        # Determine level based on indicators and years
        if (
            any(indicator in text_lower for indicator in senior_indicators)
            or total_years >= 7
        ):
            return "senior-level"
        elif (
            any(indicator in text_lower for indicator in entry_indicators)
            or total_years <= 2
        ):
            return "entry-level"
        else:
            return "mid-level"


# Create global instance
jd_generator = JobDescriptionGenerator()
