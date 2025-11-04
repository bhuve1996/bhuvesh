"""
Intelligent Job Type Detection using Semantic Embeddings
Detects ANY job role, not just predefined ones
Uses parallel execution for Gemini + Semantic for best results
"""

import re
from concurrent.futures import ThreadPoolExecutor

# Import centralized AI configuration
from app.core.ai_config import ai_config, is_embeddings_available, is_gemini_available

# Try to import sentence-transformers
try:
    from sentence_transformers import SentenceTransformer, util

    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False

# Try to import Google Gemini
try:
    import google.generativeai as genai

    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


class JobTypeDetector:
    """
    Intelligent job type detector using semantic embeddings
    Can detect ANY job role, including rare ones
    """

    def __init__(self):
        """Initialize the detector with embedding model"""
        # Initialize AI configuration
        _gemini_available, _embeddings_available = ai_config.initialize()
        # Comprehensive job titles database (200+ roles)
        self.job_database = [
            # Technology - Software Engineering
            "Software Engineer",
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "Mobile Developer",
            "iOS Developer",
            "Android Developer",
            "React Developer",
            "Vue Developer",
            "Angular Developer",
            "Node.js Developer",
            "Python Developer",
            "Java Developer",
            "C++ Developer",
            "Go Developer",
            "Rust Developer",
            # Technology - DevOps & Cloud
            "DevOps Engineer",
            "Cloud Engineer",
            "Cloud Architect",
            "Solutions Architect",
            "AWS Engineer",
            "Azure Engineer",
            "GCP Engineer",
            "Site Reliability Engineer",
            "Platform Engineer",
            "Infrastructure Engineer",
            "Kubernetes Engineer",
            "Docker Specialist",
            "CI/CD Engineer",
            # Technology - Data & AI
            "Data Scientist",
            "Data Engineer",
            "Machine Learning Engineer",
            "AI Engineer",
            "Generative AI Engineer",
            "Prompt Engineer",
            "NLP Engineer",
            "Computer Vision Engineer",
            "AI Safety Researcher",
            "MLOps Engineer",
            "Data Architect",
            "Big Data Engineer",
            "Deep Learning Engineer",
            "Research Scientist",
            # Technology - Security
            "Security Engineer",
            "Cybersecurity Analyst",
            "Penetration Tester",
            "Security Architect",
            "Information Security Analyst",
            "Application Security Engineer",
            "Network Security Engineer",
            "Ethical Hacker",
            "Security Operations Analyst",
            "CISO",
            # Technology - Emerging Tech
            "Blockchain Developer",
            "Web3 Developer",
            "Smart Contract Developer",
            "Cryptocurrency Developer",
            "DeFi Developer",
            "NFT Developer",
            "IoT Engineer",
            "IoT Security Architect",
            "Embedded Systems Engineer",
            "Robotics Engineer",
            "Quantum Computing Engineer",
            "AR/VR Developer",
            "Metaverse Developer",
            "Game Developer",
            # Technology - Quality & Testing
            "QA Engineer",
            "Test Automation Engineer",
            "SDET",
            "Quality Assurance Analyst",
            "Test Engineer",
            "Performance Tester",
            # Data & Analytics
            "Business Analyst",
            "Data Analyst",
            "Business Intelligence Analyst",
            "Analytics Engineer",
            "Quantitative Analyst",
            "Financial Analyst",
            "Marketing Analyst",
            "Operations Analyst",
            "Systems Analyst",
            "Insights Analyst",
            "Revenue Analyst",
            "Pricing Analyst",
            # Product & Design
            "Product Manager",
            "Technical Product Manager",
            "Product Owner",
            "Senior Product Manager",
            "Group Product Manager",
            "VP of Product",
            "UX Designer",
            "UI Designer",
            "Product Designer",
            "UX Researcher",
            "Interaction Designer",
            "Visual Designer",
            "UI/UX Designer",
            "Experience Designer",
            "Service Designer",
            "Design Systems Designer",
            "Motion Designer",
            # Marketing & Growth
            "Marketing Manager",
            "Digital Marketing Specialist",
            "SEO Specialist",
            "Content Strategist",
            "Social Media Manager",
            "Growth Marketer",
            "Content Marketing Manager",
            "Email Marketing Specialist",
            "Marketing Automation Specialist",
            "Brand Manager",
            "Performance Marketing Manager",
            "Demand Generation Manager",
            "Community Manager",
            "Influencer Marketing Manager",
            "Growth Hacker",
            "Conversion Rate Optimizer",
            # Sales & Business Development
            "Sales Manager",
            "Account Executive",
            "Sales Engineer",
            "Sales Development Representative",
            "Business Development Manager",
            "Partnerships Manager",
            "Account Manager",
            "Customer Success Manager",
            "Sales Operations Manager",
            "Inside Sales Representative",
            "Territory Sales Manager",
            "Enterprise Sales Executive",
            # Operations & Management
            "Operations Manager",
            "Project Manager",
            "Program Manager",
            "Scrum Master",
            "Agile Coach",
            "Technical Program Manager",
            "Operations Analyst",
            "Supply Chain Manager",
            "Logistics Manager",
            "Process Improvement Manager",
            "Change Manager",
            "Revenue Operations Manager",
            "Business Operations Manager",
            # Finance & Accounting
            "Accountant",
            "Financial Analyst",
            "Investment Analyst",
            "Risk Analyst",
            "Compliance Officer",
            "Auditor",
            "Cloud FinOps Analyst",
            "Financial Controller",
            "Treasury Analyst",
            "Tax Analyst",
            "Budget Analyst",
            "Credit Analyst",
            "Portfolio Manager",
            "Investment Banking Analyst",
            "Financial Planning Analyst",
            "Management Accountant",
            # Healthcare & Medical
            "Registered Nurse",
            "Physician",
            "Medical Doctor",
            "Healthcare Administrator",
            "Clinical Research Coordinator",
            "Pharmacist",
            "Physical Therapist",
            "Medical Lab Technician",
            "Nurse Practitioner",
            "Physician Assistant",
            "Medical Coder",
            "Healthcare Data Analyst",
            "Clinical Analyst",
            "Medical Writer",
            "Radiologist",
            "Surgeon",
            "Dentist",
            "Veterinarian",
            # Education & Training
            "Teacher",
            "Professor",
            "Academic Advisor",
            "Instructional Designer",
            "Education Coordinator",
            "Training Specialist",
            "Corporate Trainer",
            "E-Learning Developer",
            "Curriculum Developer",
            "Educational Consultant",
            # Customer Success & Support
            "Customer Success Manager",
            "Support Engineer",
            "Technical Support Specialist",
            "Customer Service Representative",
            "Customer Experience Manager",
            "Implementation Specialist",
            "Onboarding Specialist",
            # Human Resources
            "Recruiter",
            "HR Manager",
            "Talent Acquisition Specialist",
            "HR Business Partner",
            "Compensation Analyst",
            "Benefits Administrator",
            "People Operations Manager",
            "Organizational Development Specialist",
            "Diversity and Inclusion Manager",
            "Employee Relations Specialist",
            # Legal & Compliance
            "Legal Counsel",
            "Paralegal",
            "Contract Manager",
            "Corporate Lawyer",
            "Intellectual Property Attorney",
            "Compliance Analyst",
            "Regulatory Affairs Specialist",
            # Content & Creative
            "Technical Writer",
            "Documentation Specialist",
            "Content Writer",
            "Copywriter",
            "Editor",
            "Video Producer",
            "Graphic Designer",
            "Creative Director",
            "Art Director",
            "Illustrator",
            "Photographer",
            "Videographer",
            "3D Artist",
            # Sustainability & Climate Tech
            "Climate Tech Engineer",
            "Sustainability Analyst",
            "Carbon Analyst",
            "Environmental Engineer",
            "Renewable Energy Engineer",
            "ESG Analyst",
            "Sustainability Manager",
            # Other Specialized Roles
            "Management Consultant",
            "Strategy Consultant",
            "Real Estate Analyst",
            "Urban Planner",
            "Research Associate",
            "Lab Technician",
            "Manufacturing Engineer",
            "Industrial Engineer",
            "Mechanical Engineer",
            "Electrical Engineer",
            "Civil Engineer",
            "Chemical Engineer",
            "Aerospace Engineer",
            "Biomedical Engineer",
        ]

        # Load embedding model if available
        if is_embeddings_available():
            try:
                self.model = SentenceTransformer("all-MiniLM-L6-v2")
                # Pre-compute embeddings for job database
                self.job_embeddings = self.model.encode(
                    self.job_database, convert_to_tensor=True
                )
                self.use_embeddings = True
                print(f"✅ Job detector loaded with {len(self.job_database)} job titles")
            except Exception as e:
                print(f"Warning: Could not load embedding model: {e}")
                self.use_embeddings = False
        else:
            self.use_embeddings = False

    def detect_job_type(self, resume_text: str) -> tuple[str, float]:
        """
        Detect job type using PARALLEL execution for best accuracy
        - Runs Gemini + Semantic simultaneously
        - Compares results for validation
        - Returns best result with metadata

        Returns:
            Tuple of (job_title, confidence_score)
            Note: In future, this could return Dict with alternatives
        """
        # Run both detection methods in parallel
        with ThreadPoolExecutor(max_workers=2) as executor:
            # Submit both tasks
            gemini_future = executor.submit(self._safe_gemini_detection, resume_text)
            semantic_future = executor.submit(
                self._semantic_and_keyword_detection, resume_text
            )

            # Wait for both to complete
            gemini_result = gemini_future.result()
            semantic_result = semantic_future.result()

        # Combine and choose best result
        return self._combine_results(gemini_result, semantic_result)

    def _safe_gemini_detection(self, resume_text: str) -> tuple[str | None, float]:
        """
        Safely call Gemini detection with error handling
        """
        if not is_gemini_available():
            return None, 0.0

        try:
            return self._gemini_detection(resume_text)
        except Exception as e:
            print(f"Gemini detection failed: {e}")
            return None, 0.0

    def _semantic_and_keyword_detection(self, resume_text: str) -> tuple[str, float]:
        """
        Combined semantic + keyword detection
        """
        # If embeddings not available, use keyword only
        if not self.use_embeddings:
            return self._keyword_based_detection(resume_text)

        try:
            # Extract relevant sections for job detection
            relevant_text = self._extract_relevant_sections(resume_text)

            # Encode the resume text
            resume_embedding = self.model.encode(relevant_text, convert_to_tensor=True)

            # Calculate similarities with all job titles
            similarities = util.cos_sim(resume_embedding, self.job_embeddings)[0]

            # Get top match
            top_idx = similarities.argmax()
            best_job = self.job_database[top_idx]
            best_score = similarities[top_idx].item()

            # If confidence is low, try keyword detection
            if best_score < 0.4:
                keyword_job, keyword_conf = self._keyword_based_detection(resume_text)
                if keyword_conf > best_score:
                    return keyword_job, keyword_conf

            return best_job, best_score

        except Exception as e:
            print(f"Error in semantic job detection: {e}")
            return self._keyword_based_detection(resume_text)

    def _combine_results(
        self,
        gemini_result: tuple[str | None, float],
        semantic_result: tuple[str, float],
    ) -> tuple[str, float]:
        """
        Intelligently combine results from Gemini and semantic detection
        """
        gemini_job, gemini_conf = gemini_result
        semantic_job, semantic_conf = semantic_result

        # If Gemini failed, use semantic
        if gemini_job is None:
            print(f"📊 Using semantic detection: {semantic_job} ({semantic_conf:.2f})")
            return semantic_job, semantic_conf

        # Check if they agree (similar job titles)
        if self._jobs_are_similar(gemini_job, semantic_job):
            # Both agree! High confidence
            print(f"✅ Validated by both AI: {gemini_job} (confidence: 0.95)")
            return gemini_job, 0.95

        # They disagree - trust Gemini more (it's smarter)
        # But boost confidence if semantic also found something reasonable
        if semantic_conf >= 0.5:
            # Both found decent matches but different
            print(
                f"🤔 AI disagree: Gemini={gemini_job} ({gemini_conf:.2f}), Semantic={semantic_job} ({semantic_conf:.2f})"
            )
            print("   → Using Gemini result (more accurate)")
            # Slight confidence penalty for disagreement
            return gemini_job, max(0.7, gemini_conf * 0.9)

        # Semantic had low confidence, trust Gemini fully
        print(f"🎯 Using Gemini: {gemini_job} ({gemini_conf:.2f})")
        return gemini_job, gemini_conf

    def _jobs_are_similar(self, job1: str, job2: str) -> bool:
        """
        Check if two job titles are similar enough to be considered the same
        """
        j1_lower = job1.lower()
        j2_lower = job2.lower()

        # Exact match
        if j1_lower == j2_lower:
            return True

        # Check for common variations
        # E.g., "Software Engineer" vs "Software Developer"
        j1_words = set(j1_lower.split())
        j2_words = set(j2_lower.split())

        # If they share major keywords
        overlap = j1_words & j2_words
        if len(overlap) >= 2:  # At least 2 words in common
            return True

        # Check for synonyms
        synonyms = {
            frozenset(["engineer", "developer"]),
            frozenset(["manager", "lead"]),
            frozenset(["analyst", "specialist"]),
            frozenset(["designer", "architect"]),
        }

        for syn_set in synonyms:
            if any(w in j1_lower for w in syn_set) and any(
                w in j2_lower for w in syn_set
            ):
                # Check if rest of the words match
                j1_remaining = j1_words - syn_set
                j2_remaining = j2_words - syn_set
                if j1_remaining & j2_remaining:
                    return True

        return False

    def _extract_relevant_sections(self, resume_text: str) -> str:
        """
        Extract sections most relevant for job type detection
        """
        text_lower = resume_text.lower()

        # Look for job titles in common patterns
        patterns = [
            r"(?:senior|junior|lead|principal|staff)?\s*(?:software|data|machine learning|ai|ml|cloud|security|devops|backend|frontend|full.?stack)\s+(?:engineer|developer|scientist|analyst|architect)",
            r"(?:product|project|program|engineering)\s+manager",
            r"(?:ux|ui|product)\s+designer",
            r"(?:business|data|systems|security|financial)\s+analyst",
            r"\b(?:registered\s+nurse|physician|doctor|pharmacist|therapist)\b",
        ]

        # Extract lines with job titles
        relevant_lines = []
        for line in resume_text.split("\n")[:20]:  # Focus on top of resume
            for pattern in patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    relevant_lines.append(line)
                    break

        # If found specific mentions, use those
        if relevant_lines:
            return " ".join(relevant_lines)

        # Otherwise return first few lines
        return " ".join(resume_text.split("\n")[:10])

    def _keyword_based_detection(self, resume_text: str) -> tuple[str, float]:
        """
        Keyword-based job detection (AI-only system)
        """
        text_lower = resume_text.lower()

        # Define keyword patterns for common roles
        role_keywords = {
            "Software Engineer": [
                "software engineer",
                "developer",
                "programming",
                "coding",
            ],
            "Data Scientist": [
                "data scientist",
                "machine learning",
                "data analysis",
                "statistics",
            ],
            "Product Manager": [
                "product manager",
                "product owner",
                "roadmap",
                "stakeholders",
            ],
            "DevOps Engineer": [
                "devops",
                "infrastructure",
                "ci/cd",
                "kubernetes",
                "docker",
            ],
            "Frontend Developer": [
                "frontend",
                "react",
                "vue",
                "angular",
                "ui development",
            ],
            "Backend Developer": [
                "backend",
                "api",
                "database",
                "server",
                "microservices",
            ],
            "Data Engineer": [
                "data engineer",
                "etl",
                "data pipeline",
                "data warehouse",
            ],
            "Marketing Manager": [
                "marketing",
                "campaigns",
                "branding",
                "market research",
            ],
            "UX Designer": [
                "ux designer",
                "user experience",
                "wireframes",
                "prototypes",
            ],
            "Business Analyst": [
                "business analyst",
                "requirements",
                "process improvement",
            ],
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

        # AI is required - no fallback
        raise Exception(
            "AI job detection is required. Please configure GEMINI_API_KEY environment variable"
        )

    def _gemini_detection(self, resume_text: str) -> tuple[str, float]:
        """
        Use Google Gemini LLM to detect job type
        FREE tier: 15 requests/minute, 1500 requests/day
        """
        if not is_gemini_available():
            raise Exception(
                "AI job detection is required. Please configure GEMINI_API_KEY environment variable"
            )

        try:
            # Create model
            model = genai.GenerativeModel("gemini-2.0-flash")

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
                ),
            )

            # Extract job title
            job_title = response.text.strip()

            # Clean up the response
            job_title = job_title.replace('"', "").replace("'", "").strip()

            # Remove common prefixes/suffixes
            for prefix in [
                "Senior",
                "Junior",
                "Lead",
                "Principal",
                "Staff",
                "Entry-Level",
            ]:
                if job_title.startswith(prefix):
                    job_title = job_title[len(prefix) :].strip()

            # Validate it's a reasonable job title (not too long)
            if len(job_title) > 50 or len(job_title) < 3:
                raise Exception(
                    "AI generated invalid job title. Please check GEMINI_API_KEY configuration"
                )

            # Return with high confidence since LLM should be accurate
            return job_title, 0.85

        except Exception as e:
            print(f"❌ Gemini detection error: {e}")
            raise Exception(f"AI job detection failed: {e}")


# Create global instance
job_detector = JobTypeDetector()


def get_job_detector() -> JobTypeDetector:
    """Get the global job detector instance"""
    return job_detector
