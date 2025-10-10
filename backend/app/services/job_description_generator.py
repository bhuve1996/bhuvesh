"""
Job Description Generator Service

Generates specific, realistic job descriptions for detected job types
to provide accurate ATS scoring instead of using generic descriptions.
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
    Generates specific job descriptions for detected job types
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
        Generate a specific job description for the detected job type

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
                return self._clean_generated_jd(response.text)
            else:
                raise Exception("AI failed to generate job description")

        except Exception as e:
            print(f"❌ Error generating job description with AI: {e}")
            # Fallback to template-based generation
            return self._generate_template_jd(job_type, experience_level)

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
            # Skip empty lines and meta-commentary
            if (
                line
                and not line.startswith("**")
                and not line.startswith("*")
                and not line.startswith("#")
            ):
                cleaned_lines.append(line)

        return "\n".join(cleaned_lines)

    def _generate_template_jd(self, job_type: str, experience_level: str) -> str:
        """Generate a template-based job description with specific technical requirements"""

        # Define specific technical requirements for common job types
        job_templates = {
            "Software Engineer": {
                "technologies": [
                    "Python",
                    "Java",
                    "JavaScript",
                    "React",
                    "Node.js",
                    "SQL",
                    "MongoDB",
                    "AWS",
                    "Docker",
                    "Kubernetes",
                    "Git",
                    "REST APIs",
                    "microservices",
                ],
                "skills": [
                    "Object-oriented programming",
                    "Database design",
                    "API development",
                    "Version control",
                    "Testing frameworks",
                    "Agile methodologies",
                ],
                "responsibilities": [
                    "Design and develop scalable software applications",
                    "Write clean, maintainable code following best practices",
                    "Collaborate with cross-functional teams to deliver features",
                    "Participate in code reviews and technical discussions",
                    "Debug and troubleshoot production issues",
                    "Implement automated testing and CI/CD pipelines",
                ],
            },
            "DevOps Engineer": {
                "technologies": [
                    "AWS",
                    "Azure",
                    "Docker",
                    "Kubernetes",
                    "Terraform",
                    "Jenkins",
                    "GitLab CI",
                    "Ansible",
                    "Python",
                    "Bash",
                    "Linux",
                    "Monitoring tools",
                ],
                "skills": [
                    "Infrastructure as Code",
                    "CI/CD pipelines",
                    "Cloud architecture",
                    "Container orchestration",
                    "Monitoring and logging",
                    "Security best practices",
                ],
                "responsibilities": [
                    "Design and implement cloud infrastructure solutions",
                    "Automate deployment and scaling processes",
                    "Monitor system performance and reliability",
                    "Implement security best practices and compliance",
                    "Collaborate with development teams on DevOps practices",
                    "Troubleshoot infrastructure and deployment issues",
                ],
            },
            "Data Scientist": {
                "technologies": [
                    "Python",
                    "R",
                    "SQL",
                    "Pandas",
                    "NumPy",
                    "Scikit-learn",
                    "TensorFlow",
                    "PyTorch",
                    "Jupyter",
                    "AWS",
                    "Docker",
                    "Git",
                ],
                "skills": [
                    "Machine learning",
                    "Statistical analysis",
                    "Data visualization",
                    "Feature engineering",
                    "Model deployment",
                    "A/B testing",
                ],
                "responsibilities": [
                    "Develop and implement machine learning models",
                    "Analyze large datasets to extract insights",
                    "Create data visualizations and reports",
                    "Collaborate with stakeholders to define business requirements",
                    "Deploy models to production environments",
                    "Monitor model performance and iterate on improvements",
                ],
            },
            "Cloud Architect": {
                "technologies": [
                    "AWS",
                    "Azure",
                    "GCP",
                    "Terraform",
                    "CloudFormation",
                    "Docker",
                    "Kubernetes",
                    "Python",
                    "Bash",
                    "Monitoring tools",
                    "Security tools",
                ],
                "skills": [
                    "Cloud architecture design",
                    "Infrastructure as Code",
                    "Security architecture",
                    "Cost optimization",
                    "Disaster recovery",
                    "Performance optimization",
                ],
                "responsibilities": [
                    "Design scalable and secure cloud architectures",
                    "Implement infrastructure as code solutions",
                    "Optimize cloud costs and performance",
                    "Ensure compliance and security standards",
                    "Mentor teams on cloud best practices",
                    "Evaluate and recommend cloud technologies",
                ],
            },
        }

        # Get template for the job type or use a generic one
        template = job_templates.get(job_type, job_templates["Software Engineer"])

        # Generate a more elaborate job description
        jd_parts = [
            f"{job_type} - {experience_level.title()}",
            "",
            "About the Role:",
            f"We are seeking a talented and experienced {experience_level} {job_type} to join our dynamic engineering team. The ideal candidate will have a strong foundation in modern software development practices and a passion for building scalable, high-quality solutions. You will work closely with cross-functional teams to design, develop, and maintain cutting-edge applications that serve millions of users.",
            "",
            "Key Responsibilities:",
        ]

        # Add detailed responsibilities
        for resp in template["responsibilities"]:
            jd_parts.append(f"• {resp}")

        jd_parts.extend(
            [
                "",
                "Required Technical Skills:",
            ]
        )

        # Add technical requirements with more detail
        for tech in template["technologies"][:10]:  # More technical skills
            jd_parts.append(f"• {tech}")

        jd_parts.extend(
            [
                "",
                "Preferred Qualifications:",
            ]
        )

        # Add additional technical skills
        additional_techs = (
            template["technologies"][10:] if len(template["technologies"]) > 10 else []
        )
        for tech in additional_techs[:5]:
            jd_parts.append(f"• {tech}")

        jd_parts.extend(
            [
                "",
                "Soft Skills & Behavioral Traits:",
            ]
        )

        # Add soft skills
        for skill in template["skills"]:
            jd_parts.append(f"• {skill}")

        jd_parts.extend(
            [
                "",
                "Experience Requirements:",
                f"• {experience_level.replace('-', ' ')} experience in software development or related field",
                "• Proven track record of delivering high-quality software solutions",
                "• Experience working in Agile/Scrum development environments",
                "• Strong understanding of software development lifecycle and best practices",
                "",
                "What We Offer:",
                "• Competitive salary and comprehensive benefits package",
                "• Opportunity to work with cutting-edge technologies and innovative projects",
                "• Collaborative and inclusive work environment",
                "• Professional development and career growth opportunities",
                "• Flexible work arrangements and work-life balance",
                "",
                "Join our team and help us build the next generation of software solutions that will impact millions of users worldwide.",
            ]
        )

        return "\n".join(jd_parts)

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


# Global instance
job_description_generator = JobDescriptionGenerator()
