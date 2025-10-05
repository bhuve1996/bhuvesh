"""
Intelligent Job Type Detection using Semantic Embeddings
Detects ANY job role, not just predefined ones
"""

import re
import os
from typing import List, Tuple, Optional
import numpy as np

# Try to import sentence-transformers
try:
    from sentence_transformers import SentenceTransformer, util
    EMBEDDINGS_AVAILABLE = True
except ImportError:
    EMBEDDINGS_AVAILABLE = False
    print("Warning: sentence-transformers not available for job detection")

# Try to import Google Gemini (optional, free tier)
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
    # Try to configure with API key from environment
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        genai.configure(api_key=api_key)
        print("✅ Google Gemini configured (fallback for unknown roles)")
    else:
        GEMINI_AVAILABLE = False
        print("ℹ️  Google Gemini available but no API key set. Add GEMINI_API_KEY to .env for LLM fallback")
except ImportError:
    GEMINI_AVAILABLE = False
    print("ℹ️  Google Gemini not installed. Run: pip install google-generativeai")


class JobTypeDetector:
    """
    Intelligent job type detector using semantic embeddings
    Can detect ANY job role, including rare ones
    """
    
    def __init__(self):
        """Initialize the detector with embedding model"""
        # Comprehensive job titles database (200+ roles)
        self.job_database = [
            # Technology - Software Engineering
            "Software Engineer", "Frontend Developer", "Backend Developer",
            "Full Stack Developer", "Mobile Developer", "iOS Developer",
            "Android Developer", "React Developer", "Vue Developer", "Angular Developer",
            "Node.js Developer", "Python Developer", "Java Developer",
            "C++ Developer", "Go Developer", "Rust Developer",
            
            # Technology - DevOps & Cloud
            "DevOps Engineer", "Cloud Engineer", "Cloud Architect", "Solutions Architect",
            "AWS Engineer", "Azure Engineer", "GCP Engineer",
            "Site Reliability Engineer", "Platform Engineer", "Infrastructure Engineer",
            "Kubernetes Engineer", "Docker Specialist", "CI/CD Engineer",
            
            # Technology - Data & AI
            "Data Scientist", "Data Engineer", "Machine Learning Engineer",
            "AI Engineer", "Generative AI Engineer", "Prompt Engineer",
            "NLP Engineer", "Computer Vision Engineer", "AI Safety Researcher",
            "MLOps Engineer", "Data Architect", "Big Data Engineer",
            "Deep Learning Engineer", "Research Scientist",
            
            # Technology - Security
            "Security Engineer", "Cybersecurity Analyst", "Penetration Tester",
            "Security Architect", "Information Security Analyst",
            "Application Security Engineer", "Network Security Engineer",
            "Ethical Hacker", "Security Operations Analyst", "CISO",
            
            # Technology - Emerging Tech
            "Blockchain Developer", "Web3 Developer", "Smart Contract Developer",
            "Cryptocurrency Developer", "DeFi Developer", "NFT Developer",
            "IoT Engineer", "IoT Security Architect", "Embedded Systems Engineer",
            "Robotics Engineer", "Quantum Computing Engineer",
            "AR/VR Developer", "Metaverse Developer", "Game Developer",
            
            # Technology - Quality & Testing
            "QA Engineer", "Test Automation Engineer", "SDET",
            "Quality Assurance Analyst", "Test Engineer", "Performance Tester",
            
            # Data & Analytics
            "Business Analyst", "Data Analyst", "Business Intelligence Analyst",
            "Analytics Engineer", "Quantitative Analyst", "Financial Analyst",
            "Marketing Analyst", "Operations Analyst", "Systems Analyst",
            "Insights Analyst", "Revenue Analyst", "Pricing Analyst",
            
            # Product & Design
            "Product Manager", "Technical Product Manager", "Product Owner",
            "Senior Product Manager", "Group Product Manager", "VP of Product",
            "UX Designer", "UI Designer", "Product Designer",
            "UX Researcher", "Interaction Designer", "Visual Designer",
            "UI/UX Designer", "Experience Designer", "Service Designer",
            "Design Systems Designer", "Motion Designer",
            
            # Marketing & Growth
            "Marketing Manager", "Digital Marketing Specialist", "SEO Specialist",
            "Content Strategist", "Social Media Manager", "Growth Marketer",
            "Content Marketing Manager", "Email Marketing Specialist",
            "Marketing Automation Specialist", "Brand Manager",
            "Performance Marketing Manager", "Demand Generation Manager",
            "Community Manager", "Influencer Marketing Manager",
            "Growth Hacker", "Conversion Rate Optimizer",
            
            # Sales & Business Development
            "Sales Manager", "Account Executive", "Sales Engineer",
            "Sales Development Representative", "Business Development Manager",
            "Partnerships Manager", "Account Manager", "Customer Success Manager",
            "Sales Operations Manager", "Inside Sales Representative",
            "Territory Sales Manager", "Enterprise Sales Executive",
            
            # Operations & Management
            "Operations Manager", "Project Manager", "Program Manager",
            "Scrum Master", "Agile Coach", "Technical Program Manager",
            "Operations Analyst", "Supply Chain Manager", "Logistics Manager",
            "Process Improvement Manager", "Change Manager",
            "Revenue Operations Manager", "Business Operations Manager",
            
            # Finance & Accounting
            "Accountant", "Financial Analyst", "Investment Analyst",
            "Risk Analyst", "Compliance Officer", "Auditor",
            "Cloud FinOps Analyst", "Financial Controller", "Treasury Analyst",
            "Tax Analyst", "Budget Analyst", "Credit Analyst",
            "Portfolio Manager", "Investment Banking Analyst",
            "Financial Planning Analyst", "Management Accountant",
            
            # Healthcare & Medical
            "Registered Nurse", "Physician", "Medical Doctor",
            "Healthcare Administrator", "Clinical Research Coordinator",
            "Pharmacist", "Physical Therapist", "Medical Lab Technician",
            "Nurse Practitioner", "Physician Assistant", "Medical Coder",
            "Healthcare Data Analyst", "Clinical Analyst", "Medical Writer",
            "Radiologist", "Surgeon", "Dentist", "Veterinarian",
            
            # Education & Training
            "Teacher", "Professor", "Academic Advisor",
            "Instructional Designer", "Education Coordinator",
            "Training Specialist", "Corporate Trainer", "E-Learning Developer",
            "Curriculum Developer", "Educational Consultant",
            
            # Customer Success & Support
            "Customer Success Manager", "Support Engineer", "Technical Support Specialist",
            "Customer Service Representative", "Customer Experience Manager",
            "Implementation Specialist", "Onboarding Specialist",
            
            # Human Resources
            "Recruiter", "HR Manager", "Talent Acquisition Specialist",
            "HR Business Partner", "Compensation Analyst", "Benefits Administrator",
            "People Operations Manager", "Organizational Development Specialist",
            "Diversity and Inclusion Manager", "Employee Relations Specialist",
            
            # Legal & Compliance
            "Legal Counsel", "Paralegal", "Contract Manager",
            "Corporate Lawyer", "Intellectual Property Attorney",
            "Compliance Analyst", "Regulatory Affairs Specialist",
            
            # Content & Creative
            "Technical Writer", "Documentation Specialist", "Content Writer",
            "Copywriter", "Editor", "Video Producer", "Graphic Designer",
            "Creative Director", "Art Director", "Illustrator",
            "Photographer", "Videographer", "3D Artist",
            
            # Sustainability & Climate Tech
            "Climate Tech Engineer", "Sustainability Analyst", "Carbon Analyst",
            "Environmental Engineer", "Renewable Energy Engineer",
            "ESG Analyst", "Sustainability Manager",
            
            # Other Specialized Roles
            "Management Consultant", "Strategy Consultant",
            "Real Estate Analyst", "Urban Planner",
            "Research Associate", "Lab Technician",
            "Manufacturing Engineer", "Industrial Engineer",
            "Mechanical Engineer", "Electrical Engineer",
            "Civil Engineer", "Chemical Engineer",
            "Aerospace Engineer", "Biomedical Engineer",
        ]
        
        # Load embedding model if available
        if EMBEDDINGS_AVAILABLE:
            try:
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                # Pre-compute embeddings for job database
                self.job_embeddings = self.model.encode(
                    self.job_database, 
                    convert_to_tensor=True
                )
                self.use_embeddings = True
                print(f"✅ Job detector loaded with {len(self.job_database)} job titles")
            except Exception as e:
                print(f"Warning: Could not load embedding model: {e}")
                self.use_embeddings = False
        else:
            self.use_embeddings = False
    
    def detect_job_type(self, resume_text: str) -> Tuple[str, float]:
        """
        Detect job type from resume using 3-tier approach:
        1. Semantic matching (fast, free)
        2. Keyword matching (fallback)
        3. Gemini LLM (fallback for unknown roles, free tier)
        
        Returns:
            Tuple of (job_title, confidence_score)
        """
        # Tier 1: Semantic matching with database
        if not self.use_embeddings:
            # Skip to Tier 2
            job, confidence = self._keyword_based_detection(resume_text)
            # If keyword detection has low confidence, try Gemini
            if confidence < 0.5 and GEMINI_AVAILABLE:
                return self._gemini_detection(resume_text)
            return job, confidence
        
        try:
            # Extract relevant sections for job detection
            relevant_text = self._extract_relevant_sections(resume_text)
            
            # Encode the resume text
            resume_embedding = self.model.encode(relevant_text, convert_to_tensor=True)
            
            # Calculate similarities with all job titles
            similarities = util.cos_sim(resume_embedding, self.job_embeddings)[0]
            
            # Get top 3 matches
            top_indices = similarities.argsort(descending=True)[:3]
            top_jobs = [(self.job_database[idx], similarities[idx].item()) 
                       for idx in top_indices]
            
            # Return best match with confidence
            best_job, best_score = top_jobs[0]
            
            # If confidence is medium to high, return it
            if best_score >= 0.4:
                return best_job, best_score
            
            # Tier 2: Low confidence - try keyword detection
            keyword_job, keyword_conf = self._keyword_based_detection(resume_text)
            
            # If keyword detection is better, use it
            if keyword_conf > best_score:
                best_job, best_score = keyword_job, keyword_conf
            
            # Tier 3: Still low confidence - try Gemini as last resort
            if best_score < 0.5 and GEMINI_AVAILABLE:
                try:
                    return self._gemini_detection(resume_text)
                except Exception as e:
                    print(f"Gemini fallback failed: {e}")
                    # Return best we have
                    return best_job, best_score
            
            return best_job, best_score
            
        except Exception as e:
            print(f"Error in semantic job detection: {e}")
            # Try Tier 2
            job, confidence = self._keyword_based_detection(resume_text)
            # Try Tier 3 if needed
            if confidence < 0.5 and GEMINI_AVAILABLE:
                try:
                    return self._gemini_detection(resume_text)
                except:
                    return job, confidence
            return job, confidence
    
    def _extract_relevant_sections(self, resume_text: str) -> str:
        """
        Extract sections most relevant for job type detection
        """
        text_lower = resume_text.lower()
        
        # Look for job titles in common patterns
        patterns = [
            r'(?:senior|junior|lead|principal|staff)?\s*(?:software|data|machine learning|ai|ml|cloud|security|devops|backend|frontend|full.?stack)\s+(?:engineer|developer|scientist|analyst|architect)',
            r'(?:product|project|program|engineering)\s+manager',
            r'(?:ux|ui|product)\s+designer',
            r'(?:business|data|systems|security|financial)\s+analyst',
            r'\b(?:registered\s+nurse|physician|doctor|pharmacist|therapist)\b',
        ]
        
        # Extract lines with job titles
        relevant_lines = []
        for line in resume_text.split('\n')[:20]:  # Focus on top of resume
            for pattern in patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    relevant_lines.append(line)
                    break
        
        # If found specific mentions, use those
        if relevant_lines:
            return ' '.join(relevant_lines)
        
        # Otherwise return first few lines
        return ' '.join(resume_text.split('\n')[:10])
    
    def _keyword_based_detection(self, resume_text: str) -> Tuple[str, float]:
        """
        Fallback: keyword-based job detection
        """
        text_lower = resume_text.lower()
        
        # Define keyword patterns for common roles
        role_keywords = {
            "Software Engineer": ["software engineer", "developer", "programming", "coding"],
            "Data Scientist": ["data scientist", "machine learning", "data analysis", "statistics"],
            "Product Manager": ["product manager", "product owner", "roadmap", "stakeholders"],
            "DevOps Engineer": ["devops", "infrastructure", "ci/cd", "kubernetes", "docker"],
            "Frontend Developer": ["frontend", "react", "vue", "angular", "ui development"],
            "Backend Developer": ["backend", "api", "database", "server", "microservices"],
            "Data Engineer": ["data engineer", "etl", "data pipeline", "data warehouse"],
            "Marketing Manager": ["marketing", "campaigns", "branding", "market research"],
            "UX Designer": ["ux designer", "user experience", "wireframes", "prototypes"],
            "Business Analyst": ["business analyst", "requirements", "process improvement"],
        }
        
        # Score each role
        role_scores = {}
        for role, keywords in role_keywords.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > 0:
                role_scores[role] = score / len(keywords)
        
        if role_scores:
            best_role = max(role_scores, key=role_scores.get)
            confidence = role_scores[best_role]
            return best_role, confidence
        
        # Default if nothing detected
        return "General Professional", 0.5
    
    def _gemini_detection(self, resume_text: str) -> Tuple[str, float]:
        """
        Use Google Gemini LLM to detect job type (fallback for unknown roles)
        FREE tier: 15 requests/minute, 1500 requests/day
        """
        if not GEMINI_AVAILABLE:
            return "General Professional", 0.5
        
        try:
            # Create model
            model = genai.GenerativeModel('gemini-pro')
            
            # Extract first 1000 characters for analysis
            resume_sample = resume_text[:1000]
            
            # Create prompt
            prompt = f"""Analyze this resume excerpt and identify the person's primary job role.
Return ONLY the job title as a 2-4 word phrase (e.g., "Software Engineer", "Marketing Manager", "Data Scientist").
Do not include seniority levels or extra words. Just the core role.

Resume excerpt:
{resume_sample}

Job Title:"""
            
            # Generate response
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=20,
                    temperature=0.1,  # Low temperature for consistent results
                )
            )
            
            # Extract job title
            job_title = response.text.strip()
            
            # Clean up the response
            job_title = job_title.replace('"', '').replace("'", '').strip()
            
            # Remove common prefixes/suffixes
            for prefix in ['Senior', 'Junior', 'Lead', 'Principal', 'Staff', 'Entry-Level']:
                if job_title.startswith(prefix):
                    job_title = job_title[len(prefix):].strip()
            
            # Validate it's a reasonable job title (not too long)
            if len(job_title) > 50 or len(job_title) < 3:
                return "General Professional", 0.5
            
            # Return with high confidence since LLM should be accurate
            return job_title, 0.85
            
        except Exception as e:
            print(f"Gemini detection error: {e}")
            return "General Professional", 0.5


# Create global instance
job_detector = JobTypeDetector()

