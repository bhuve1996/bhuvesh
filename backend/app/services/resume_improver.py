"""
Resume Improvement Service
Generates specific, actionable suggestions to boost ATS score
"""

import logging
import os
import re
from typing import Optional

from ..types.common_types import ATSAnalysisResult, ExtractionResult

logger = logging.getLogger(__name__)

# Try to import Google Gemini for AI analysis
try:
    import google.generativeai as genai

    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("⚠️  Google Gemini not available for AI-powered analysis")


class ResumeImprover:
    """Generate specific, actionable resume improvement suggestions"""

    def __init__(self):
        """Initialize the resume improver with AI capabilities"""
        self.use_ai = GEMINI_AVAILABLE
        if self.use_ai:
            try:
                # Configure Gemini with API key from environment
                api_key = os.getenv("GEMINI_API_KEY")
                if api_key and api_key != "your_api_key_here" and len(api_key) > 20:
                    genai.configure(api_key=api_key)
                else:
                    raise Exception("GEMINI_API_KEY not properly configured")
                self.model = genai.GenerativeModel("gemini-pro")
                print("✅ Resume Improver: AI analysis enabled with Gemini")
            except Exception as e:
                print(f"⚠️  Failed to initialize Gemini: {e}")
                self.use_ai = False

    def generate_improvement_plan(
        self,
        analysis_result: ATSAnalysisResult,
        extracted_data: ExtractionResult,
        job_description: Optional[str] = None,
    ) -> dict[str, str]:
        """
        Generate comprehensive ATS-focused improvement plan

        Args:
            analysis_result: ATS analysis results
            extracted_data: Extracted resume data
            job_description: Optional job description for targeted suggestions

        Returns:
            Dictionary with improvements, summary, and quick wins
        """
        try:
            improvements = []

            # 1. ATS Compatibility Improvements (Highest Priority)
            improvements.extend(
                self._generate_ats_improvements(
                    extracted_data.get("formatting_analysis", {}), analysis_result
                )
            )

            # 2. Keyword Optimization (Critical for ATS)
            improvements.extend(
                self._generate_keyword_improvements(analysis_result, job_description)
            )

            # 3. Formatting Improvements (ATS Parsing)
            improvements.extend(
                self._generate_formatting_improvements(
                    extracted_data.get("formatting_analysis", {}),
                    extracted_data,
                    analysis_result,
                )
            )

            # 4. Content Quality (ATS + Human Readability)
            improvements.extend(
                self._generate_content_improvements(extracted_data, analysis_result)
            )

            # 5. Structure Improvements (ATS Navigation)
            improvements.extend(
                self._generate_structure_improvements(extracted_data, analysis_result)
            )

            # 6. AI-Powered Missing Elements Analysis
            improvements.extend(
                self._generate_ai_powered_improvements(analysis_result, extracted_data)
            )

            # Sort by ATS impact and priority
            priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
            improvements.sort(
                key=lambda x: (priority_order[x["priority"]], -x.get("score_impact", 0))
            )

            # Generate enhanced summary
            summary = self._generate_enhanced_summary(improvements, analysis_result)

            # Identify quick wins (ATS-focused)
            quick_wins = self._identify_ats_quick_wins(improvements)

            return {
                "improvements": improvements,
                "summary": summary,
                "quick_wins": quick_wins,
                "ai_analysis_available": self.use_ai,
                "analysis_method": "AI-powered"
                if self.use_ai
                else "Rule-based fallback",
            }

        except Exception as e:
            logger.exception("Error generating improvement plan")
            return {
                "improvements": [],
                "summary": {
                    "total_improvements": 0,
                    "by_priority": {"critical": 0, "high": 0, "medium": 0, "low": 0},
                    "estimated_total_boost": 0,
                },
                "quick_wins": [],
            }

    def _generate_keyword_improvements(
        self, analysis_result: dict, job_description: Optional[str] = None
    ) -> list[dict]:
        """Generate keyword-specific improvements"""
        improvements = []
        missing_keywords = analysis_result.get("missing_keywords", [])
        matched_keywords = analysis_result.get("keyword_matches", [])

        # Critical: Too many missing keywords
        if len(missing_keywords) > 10:
            improvements.append(
                {
                    "id": "kw-001",
                    "category": "keyword",
                    "priority": "critical",
                    "title": f"Add {len(missing_keywords)} Missing Keywords",
                    "description": f"Your resume is missing {len(missing_keywords)} important keywords from the job description. Focus on adding the top 10-15 most relevant ones naturally into your experience.",
                    "keywords": missing_keywords[:15],
                    "before": "Generic descriptions without key industry terms",
                    "after": "Descriptions include targeted keywords in context (e.g., 'Led React.js development team')",
                    "score_impact": 15,
                    "action_steps": [
                        "Review the missing keywords list below",
                        "Identify 10-15 most relevant to your actual experience",
                        "Integrate them naturally into your work experience bullets",
                        "Use keywords in context, not as a list (e.g., 'Developed Python APIs' not just 'Python')",
                        "Repeat important keywords 2-3 times across different sections",
                    ],
                }
            )
        elif len(missing_keywords) > 5:
            improvements.append(
                {
                    "id": "kw-001",
                    "category": "keyword",
                    "priority": "high",
                    "title": f"Add {len(missing_keywords)} Missing Keywords",
                    "description": f"Include these {len(missing_keywords)} relevant keywords to better match the job requirements.",
                    "keywords": missing_keywords,
                    "score_impact": 8,
                    "action_steps": [
                        "Review the keywords below",
                        "Add them naturally to relevant experience bullets",
                        "Ensure they reflect your actual skills",
                    ],
                }
            )

        # Check keyword density
        if matched_keywords and len(matched_keywords) < 5:
            improvements.append(
                {
                    "id": "kw-002",
                    "category": "keyword",
                    "priority": "high",
                    "title": "Increase Keyword Frequency",
                    "description": "You have few keyword matches. Repeat important keywords 2-3 times throughout your resume in different contexts.",
                    "score_impact": 8,
                    "action_steps": [
                        "Identify top 5 critical keywords for this role",
                        "Mention each keyword 2-3 times across different sections",
                        "Use variations (e.g., 'JavaScript' and 'JS', 'Machine Learning' and 'ML')",
                        "Include keywords in summary, experience, and skills sections",
                    ],
                }
            )

        return improvements

    def _generate_formatting_improvements(
        self,
        formatting_analysis: dict,
        extracted_data: dict = None,
        analysis_result: dict = None,
    ) -> list[dict]:
        """Generate formatting-specific improvements"""
        improvements = []

        # Check bullet points - use AI analysis if available
        bullet_points = formatting_analysis.get("bullet_points", {})
        bullet_detected = bullet_points.get("detected", False)

        # Get resume text for AI analysis
        resume_text = ""
        if analysis_result and analysis_result.get("extraction_details"):
            resume_text = analysis_result["extraction_details"].get(
                "full_resume_text", ""
            )

        if self.use_ai and resume_text:
            ai_analysis = self._ai_analyze_resume_content(resume_text, "bullet_points")
            bullet_detected = (
                ai_analysis.get("found", False)
                and ai_analysis.get("confidence", 0) > 70
            )
        else:
            # Fallback: look for bullet-like patterns in the work experience
            if not bullet_detected and extracted_data:
                bullet_detected = self._check_bullet_points_in_experience(
                    extracted_data
                )

        if not bullet_detected:
            improvements.append(
                {
                    "id": "fmt-001",
                    "category": "formatting",
                    "priority": "critical",
                    "title": "Add Bullet Points to Experience Section",
                    "description": "Your resume lacks bullet points. ATS systems and recruiters prefer clear, scannable bullet points over paragraphs.",
                    "before": "Worked on various projects involving frontend development and collaborated with team members to deliver solutions.",
                    "after": "• Led frontend development for 3 major projects using React and TypeScript\n• Collaborated with cross-functional team of 8 to deliver customer-facing features\n• Improved page load time by 40% through performance optimization",
                    "score_impact": 12,
                    "action_steps": [
                        "Convert paragraph descriptions to bullet points",
                        "Start each bullet with a strong action verb (Led, Developed, Implemented)",
                        "Keep bullets to 1-2 lines maximum for readability",
                        "Use consistent bullet style (• recommended for ATS compatibility)",
                        "Aim for 3-5 bullets per role",
                    ],
                }
            )
        elif not bullet_points.get("consistent"):
            types_used = bullet_points.get("types_used", [])
            improvements.append(
                {
                    "id": "fmt-002",
                    "category": "formatting",
                    "priority": "medium",
                    "title": "Fix Inconsistent Bullet Points",
                    "description": f"You're using mixed bullet styles: {', '.join(types_used)}. Stick to one consistent style throughout.",
                    "score_impact": 3,
                    "action_steps": [
                        "Choose one bullet style (• simple dot recommended)",
                        "Replace all other bullet types with your chosen style",
                        "Ensure consistent indentation across all bullets",
                    ],
                }
            )

        # Check spacing
        spacing = formatting_analysis.get("spacing", {})
        if spacing.get("excessive_whitespace"):
            improvements.append(
                {
                    "id": "fmt-003",
                    "category": "formatting",
                    "priority": "low",
                    "title": "Remove Excessive Whitespace",
                    "description": "Your resume has excessive blank lines or spacing that may confuse ATS parsers.",
                    "score_impact": 2,
                    "action_steps": [
                        "Remove extra blank lines between sections",
                        "Use consistent spacing (1 line between items, 1.5-2 lines between sections)",
                        "Avoid multiple consecutive spaces",
                    ],
                }
            )

        # Check ATS compatibility issues
        ats_compat = formatting_analysis.get("ats_compatibility", {})
        issues = ats_compat.get("issues", [])
        for idx, issue in enumerate(issues[:3]):  # Top 3 issues
            improvements.append(
                {
                    "id": f"fmt-ats-{idx + 1}",
                    "category": "ats",
                    "priority": "high",
                    "title": "Fix ATS Compatibility Issue",
                    "description": issue,
                    "score_impact": 5,
                    "action_steps": [
                        "Follow the recommendation above",
                        "Simplify formatting to improve ATS parsing",
                        "Test resume through ATS checker again after changes",
                    ],
                }
            )

        return improvements

    def _check_bullet_points_in_experience(self, extracted_data: dict) -> bool:
        """Check if bullet points exist in work experience sections"""
        work_experience = extracted_data.get("work_experience", [])
        bullet_patterns = ["•", "●", "◦", "▪", "▸", "→", "-", "*", "✓", "►"]

        for exp in work_experience:
            # Check project descriptions
            projects = exp.get("projects", [])
            for project in projects:
                desc = str(project.get("description", ""))
                for bullet in bullet_patterns:
                    if bullet in desc:
                        return True

            # Check responsibilities
            responsibilities = exp.get("responsibilities", [])
            for resp in responsibilities:
                resp_text = str(resp)
                for bullet in bullet_patterns:
                    if bullet in resp_text:
                        return True

            # Check role description
            role_desc = str(exp.get("description", ""))
            for bullet in bullet_patterns:
                if bullet in role_desc:
                    return True

        return False

    def _calculate_word_count_from_data(self, extracted_data: dict) -> int:
        """Calculate word count from extracted resume data"""
        word_count = 0

        # Count words in contact info
        contact = extracted_data.get("contact_info", {})
        if contact.get("full_name"):
            word_count += len(contact["full_name"].split())

        # Count words in summary
        summary = extracted_data.get("summary_profile", "")
        if summary:
            word_count += len(str(summary).split())

        # Count words in work experience
        work_experience = extracted_data.get("work_experience", [])
        for exp in work_experience:
            if exp.get("title"):
                word_count += len(str(exp["title"]).split())
            if exp.get("company"):
                word_count += len(str(exp["company"]).split())
            if exp.get("description"):
                word_count += len(str(exp["description"]).split())

            # Count project descriptions
            projects = exp.get("projects", [])
            for project in projects:
                if project.get("name"):
                    word_count += len(str(project["name"]).split())
                if project.get("description"):
                    word_count += len(str(project["description"]).split())

            # Count responsibilities
            responsibilities = exp.get("responsibilities", [])
            for resp in responsibilities:
                word_count += len(str(resp).split())

        # Count words in education
        education = extracted_data.get("education", [])
        for edu in education:
            if edu.get("degree"):
                word_count += len(str(edu["degree"]).split())
            if edu.get("institution"):
                word_count += len(str(edu["institution"]).split())
            if edu.get("description"):
                word_count += len(str(edu["description"]).split())

        # Count words in skills
        skills = extracted_data.get("skills", [])
        for skill_category in skills:
            if isinstance(skill_category, dict) and skill_category.get("skills"):
                for skill in skill_category["skills"]:
                    if isinstance(skill, dict) and skill.get("name"):
                        word_count += len(str(skill["name"]).split())
                    elif isinstance(skill, str):
                        word_count += len(skill.split())
            elif isinstance(skill_category, str):
                word_count += len(skill_category.split())

        # Count words in certifications
        certifications = extracted_data.get("certifications", [])
        for cert in certifications:
            if cert.get("name"):
                word_count += len(str(cert["name"]).split())
            if cert.get("issuer"):
                word_count += len(str(cert["issuer"]).split())
            if cert.get("description"):
                word_count += len(str(cert["description"]).split())

        # Count words in projects
        projects = extracted_data.get("projects", [])
        for project in projects:
            if project.get("name"):
                word_count += len(str(project["name"]).split())
            if project.get("description"):
                word_count += len(str(project["description"]).split())
            if project.get("technologies"):
                if isinstance(project["technologies"], list):
                    for tech in project["technologies"]:
                        word_count += len(str(tech).split())
                else:
                    word_count += len(str(project["technologies"]).split())

        return word_count

    def _ai_analyze_resume_content(self, resume_text: str, analysis_type: str) -> dict:
        """Use AI to analyze resume content for specific information"""
        if not self.use_ai or not resume_text:
            return {"found": False, "confidence": 0, "details": ""}

        try:
            if analysis_type == "contact_info":
                prompt = f"""
                Analyze this resume text and determine if it contains complete contact information.

                Resume text:
                {resume_text[:2000]}  # Limit to avoid token limits

                Check for:
                1. Email address (professional format)
                2. Phone number (with country code if international)
                3. Location (city, state/country)
                4. LinkedIn profile URL

                Respond with JSON format:
                {{
                    "found": true/false,
                    "confidence": 0-100,
                    "details": "Brief explanation of what was found or missing",
                    "email_found": true/false,
                    "phone_found": true/false,
                    "location_found": true/false,
                    "linkedin_found": true/false
                }}
                """

            elif analysis_type == "bullet_points":
                prompt = f"""
                Analyze this resume text and determine if it uses bullet points effectively in the experience section.

                Resume text:
                {resume_text[:2000]}

                Check for:
                1. Bullet points (•, -, *, etc.) in work experience
                2. Consistent bullet point usage
                3. Clear, scannable format for achievements

                Respond with JSON format:
                {{
                    "found": true/false,
                    "confidence": 0-100,
                    "details": "Brief explanation of bullet point usage",
                    "bullet_count": number,
                    "consistent_style": true/false
                }}
                """

            elif analysis_type == "quantified_achievements":
                prompt = f"""
                Analyze this resume text and determine if it contains quantified achievements with numbers, percentages, and metrics.

                Resume text:
                {resume_text[:2000]}

                Check for:
                1. Numbers, percentages, metrics in work experience
                2. Quantified results and achievements
                3. Specific measurements of impact

                Respond with JSON format:
                {{
                    "found": true/false,
                    "confidence": 0-100,
                    "details": "Brief explanation of quantified achievements found",
                    "metrics_count": number,
                    "examples": ["example1", "example2"]
                }}
                """

            elif analysis_type == "professional_summary":
                prompt = f"""
                Analyze this resume text and determine if it has a professional summary or objective section.

                Resume text:
                {resume_text[:2000]}

                Check for:
                1. Professional summary or objective at the top
                2. 2-3 sentences highlighting expertise
                3. Value proposition and key skills

                Respond with JSON format:
                {{
                    "found": true/false,
                    "confidence": 0-100,
                    "details": "Brief explanation of summary section",
                    "word_count": number,
                    "quality": "excellent/good/fair/poor"
                }}
                """

            else:
                return {
                    "found": False,
                    "confidence": 0,
                    "details": "Unknown analysis type",
                }

            response = self.model.generate_content(prompt)

            # Try to parse JSON response
            import json

            try:
                # Extract JSON from response
                response_text = response.text
                # Find JSON in the response
                json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                else:
                    return {
                        "found": False,
                        "confidence": 0,
                        "details": "Could not parse AI response",
                    }
            except json.JSONDecodeError:
                return {
                    "found": False,
                    "confidence": 0,
                    "details": "Invalid JSON response from AI",
                }

        except Exception as e:
            logger.warning(f"AI analysis failed for {analysis_type}: {e}")
            return {
                "found": False,
                "confidence": 0,
                "details": f"AI analysis error: {e!s}",
            }

    def _generate_content_improvements(
        self, extracted_data: dict, analysis_result: dict
    ) -> list[dict]:
        """Generate content-specific improvements"""
        improvements = []
        work_experience = extracted_data.get("work_experience", [])

        # Check for quantifiable achievements - use AI analysis if available
        has_numbers = False

        # Get resume text for AI analysis
        resume_text = ""
        if analysis_result and analysis_result.get("extraction_details"):
            resume_text = analysis_result["extraction_details"].get(
                "full_resume_text", ""
            )

        if self.use_ai and resume_text:
            ai_analysis = self._ai_analyze_resume_content(
                resume_text, "quantified_achievements"
            )
            has_numbers = (
                ai_analysis.get("found", False)
                and ai_analysis.get("confidence", 0) > 70
            )
        else:
            # Fallback to original logic
            if work_experience:
                for exp in work_experience:
                    # Check project descriptions
                    projects = exp.get("projects", [])
                    if projects:
                        for project in projects:
                            desc = str(project.get("description", ""))
                            if any(char.isdigit() for char in desc):
                                has_numbers = True
                                break

                    # Also check role description and responsibilities
                    if not has_numbers:
                        role_desc = str(exp.get("description", ""))
                        responsibilities = exp.get("responsibilities", [])
                        for resp in responsibilities:
                            if any(char.isdigit() for char in str(resp)):
                                has_numbers = True
                                break
                        if not has_numbers and any(
                            char.isdigit() for char in role_desc
                        ):
                            has_numbers = True

                    if has_numbers:
                        break

        if not has_numbers:
            improvements.append(
                {
                    "id": "cnt-001",
                    "category": "content",
                    "priority": "high",
                    "title": "Quantify Your Achievements with Numbers",
                    "description": "Add specific numbers, percentages, and metrics to demonstrate measurable impact. Quantified achievements are 40% more likely to get interviews.",
                    "before": "Improved system performance and user experience",
                    "after": "Improved system performance by 45%, reducing page load time from 3.2s to 1.8s, resulting in 23% increase in user engagement",
                    "score_impact": 10,
                    "action_steps": [
                        "Review each bullet point in your experience section",
                        "Add specific numbers: team size, revenue, users, time saved",
                        "Use 'by X%' or 'from X to Y' format to show improvement",
                        "Include metrics: transactions processed, bugs fixed, features delivered",
                        "If exact numbers are confidential, use ranges (e.g., '20-30%')",
                    ],
                }
            )

        # Check resume length - also calculate from extracted data if not available
        word_count = analysis_result.get("word_count", 0)
        if word_count == 0:
            # Try to get word count from analysis result's length analysis
            if (
                analysis_result.get("extraction_details", {})
                .get("length_analysis", {})
                .get("total_words")
            ):
                word_count = analysis_result["extraction_details"]["length_analysis"][
                    "total_words"
                ]
            elif extracted_data:
                # Calculate word count from extracted data as fallback
                word_count = self._calculate_word_count_from_data(extracted_data)

        if word_count < 300:
            improvements.append(
                {
                    "id": "cnt-002",
                    "category": "content",
                    "priority": "high",
                    "title": "Expand Your Resume Content",
                    "description": f"Your resume has only {word_count} words. Aim for 400-600 words for mid-level, 600-800 for senior roles to provide sufficient detail.",
                    "score_impact": 7,
                    "action_steps": [
                        "Add more details to each work experience role",
                        "Include 3-5 bullet points per position",
                        "Add a professional summary (2-3 sentences)",
                        "Include relevant projects, certifications, or achievements",
                        "Describe your role, technologies used, and impact made",
                    ],
                }
            )
        elif word_count > 800:
            improvements.append(
                {
                    "id": "cnt-003",
                    "category": "content",
                    "priority": "medium",
                    "title": "Trim Resume Length for Better Impact",
                    "description": f"Your resume has {word_count} words. Keep it concise (400-600 words ideal) to maintain recruiter attention.",
                    "score_impact": 4,
                    "action_steps": [
                        "Remove outdated or irrelevant experience (>10-15 years old)",
                        "Consolidate similar bullet points",
                        "Keep only most impactful achievements",
                        "Aim for 1 page (0-5 years exp) or 2 pages max (5+ years)",
                        "Remove generic statements, focus on specific accomplishments",
                    ],
                }
            )

        # Check for action verbs
        improvements.append(
            {
                "id": "cnt-004",
                "category": "content",
                "priority": "medium",
                "title": "Use Strong Action Verbs",
                "description": "Replace weak phrases with powerful action verbs to make your accomplishments stand out.",
                "before": "Responsible for managing team and working on projects",
                "after": "Led cross-functional team of 8 engineers, architected scalable microservices",
                "score_impact": 6,
                "action_steps": [
                    "Replace 'Responsible for' with 'Led', 'Managed', 'Directed', 'Oversaw'",
                    "Replace 'Helped with' with 'Contributed', 'Collaborated', 'Facilitated'",
                    "Replace 'Worked on' with 'Developed', 'Built', 'Created', 'Implemented'",
                    "Start every bullet with a strong action verb",
                    "Use past tense for previous roles, present tense for current role",
                ],
                "suggested_verbs": [
                    "Led",
                    "Managed",
                    "Developed",
                    "Implemented",
                    "Designed",
                    "Architected",
                    "Optimized",
                    "Streamlined",
                    "Launched",
                    "Delivered",
                    "Spearheaded",
                    "Orchestrated",
                ],
            }
        )

        return improvements

    def _generate_structure_improvements(
        self, extracted_data: dict, analysis_result: dict = None
    ) -> list[dict]:
        """Generate structure-specific improvements"""
        improvements = []

        # Get resume text for AI analysis
        resume_text = ""
        if analysis_result and analysis_result.get("extraction_details"):
            resume_text = analysis_result["extraction_details"].get(
                "full_resume_text", ""
            )

        # Check if summary exists - use AI analysis if available
        summary = extracted_data.get("summary_profile")
        summary_exists = False

        if self.use_ai and resume_text:
            ai_analysis = self._ai_analyze_resume_content(
                resume_text, "professional_summary"
            )
            summary_exists = (
                ai_analysis.get("found", False)
                and ai_analysis.get("confidence", 0) > 70
            )
        else:
            # Fallback to original logic
            summary_exists = summary and len(str(summary).strip()) >= 50

        if not summary_exists:
            improvements.append(
                {
                    "id": "str-001",
                    "category": "structure",
                    "priority": "medium",
                    "title": "Add Professional Summary",
                    "description": "Include a compelling 2-3 sentence summary at the top highlighting your expertise and value proposition.",
                    "before": "No summary section",
                    "after": "Senior Software Engineer with 7+ years developing scalable web applications using React, Node.js, and AWS. Led teams of 5-8 engineers to deliver enterprise solutions serving 2M+ users. Passionate about performance optimization and clean architecture.",
                    "score_impact": 5,
                    "action_steps": [
                        "Write 2-3 sentences (50-80 words) about your professional identity",
                        "Mention years of experience and key role/title",
                        "Highlight 3-5 core skills or technologies",
                        "Include your biggest achievement or specialization",
                        "Keep it impactful and scannable",
                    ],
                }
            )

        # Check contact info completeness - use AI analysis if available
        contact = extracted_data.get("contact_info", {})
        missing_contact = []

        # First check the extracted data directly
        if not contact.get("email"):
            missing_contact.append("email")
        if not contact.get("phone", {}).get("raw") and not contact.get("phone", {}).get(
            "number"
        ):
            missing_contact.append("phone")
        if not contact.get("location", {}).get("full") and not contact.get(
            "location", {}
        ).get("city"):
            missing_contact.append("location (city, state)")

        # If AI is available and we found missing contact info, double-check with AI
        if self.use_ai and resume_text and missing_contact:
            ai_analysis = self._ai_analyze_resume_content(resume_text, "contact_info")
            if (
                ai_analysis.get("found", False)
                and ai_analysis.get("confidence", 0) > 70
            ):
                # AI found contact info, remove from missing list if AI confirms it exists
                if ai_analysis.get("email_found", False) and "email" in missing_contact:
                    missing_contact.remove("email")
                if ai_analysis.get("phone_found", False) and "phone" in missing_contact:
                    missing_contact.remove("phone")
                if (
                    ai_analysis.get("location_found", False)
                    and "location (city, state)" in missing_contact
                ):
                    missing_contact.remove("location (city, state)")

        if missing_contact:
            improvements.append(
                {
                    "id": "str-002",
                    "category": "structure",
                    "priority": "critical",
                    "title": f"Add Missing Contact Information: {', '.join(missing_contact)}",
                    "description": "Complete contact information is essential for recruiters to reach you. Missing contact details can result in immediate rejection.",
                    "score_impact": 10,
                    "action_steps": [
                        f"Add your {', '.join(missing_contact)} to the header",
                        "Include LinkedIn profile URL (linkedin.com/in/yourname)",
                        "Add GitHub or portfolio link if relevant to your field",
                        "Ensure email is professional (firstname.lastname@email.com)",
                        "Include phone with country code if applying internationally",
                    ],
                }
            )

        # Check for LinkedIn profile - use AI analysis if available
        linkedin_missing = False
        if self.use_ai and resume_text:
            ai_analysis = self._ai_analyze_resume_content(resume_text, "contact_info")
            linkedin_missing = not ai_analysis.get("linkedin_found", False)
        else:
            # Fallback to original logic
            linkedin_missing = not contact.get("linkedin", {}).get(
                "url"
            ) and not contact.get("linkedin", {}).get("username")

        if linkedin_missing:
            improvements.append(
                {
                    "id": "str-003",
                    "category": "structure",
                    "priority": "low",
                    "title": "Add LinkedIn Profile",
                    "description": "90% of recruiters check LinkedIn. Including your profile URL increases credibility.",
                    "score_impact": 3,
                    "action_steps": [
                        "Add LinkedIn URL to contact section",
                        "Use custom URL format: linkedin.com/in/yourname",
                        "Ensure your LinkedIn profile is up to date",
                        "Use the same professional photo on LinkedIn",
                    ],
                }
            )

        return improvements

    def _generate_ats_improvements(
        self, formatting_analysis: dict, analysis_result: dict
    ) -> list[dict]:
        """Generate comprehensive ATS-specific improvements"""
        improvements = []

        ats_compat = formatting_analysis.get("ats_compatibility", {})
        ats_score = ats_compat.get("score", 100)
        current_ats_score = analysis_result.get("atsScore", 0)

        # Critical ATS issues
        if ats_score < 70:
            improvements.append(
                {
                    "id": "ats-001",
                    "category": "ats",
                    "priority": "critical",
                    "title": "🚨 Critical ATS Compatibility Issues Detected",
                    "description": f"Your resume has an ATS compatibility score of {ats_score}/100. This may prevent it from being parsed correctly by applicant tracking systems, causing automatic rejection.",
                    "score_impact": 25,
                    "before": "Complex formatting with images, tables, headers/footers",
                    "after": "Clean, simple formatting with standard sections and fonts",
                    "action_steps": [
                        "Remove ALL images, logos, photos, and graphics",
                        "Avoid headers and footers (many ATS can't read them)",
                        "Use standard section headings (Experience, Education, Skills)",
                        "Avoid tables, text boxes, and multi-column layouts",
                        "Use a standard, ATS-friendly font (Arial, Calibri, Times New Roman)",
                        "Save as .docx or .pdf (not .pages or image files)",
                        "Don't use special characters or symbols for bullets",
                    ],
                }
            )
        elif ats_score < 85:
            improvements.append(
                {
                    "id": "ats-001",
                    "category": "ats",
                    "priority": "high",
                    "title": "🔧 Improve ATS Compatibility",
                    "description": f"Your resume has an ATS score of {ats_score}/100. Some improvements will help ensure better parsing and increase your chances of passing ATS screening.",
                    "score_impact": 15,
                    "before": "Mixed formatting with some ATS-unfriendly elements",
                    "after": "Clean, consistent formatting optimized for ATS parsing",
                    "action_steps": [
                        "Simplify formatting and layout",
                        "Use standard section headings",
                        "Avoid complex tables or graphics",
                        "Use simple bullet points (• recommended)",
                        "Ensure consistent font usage throughout",
                        "Remove any decorative elements",
                    ],
                }
            )

        # ATS Score Analysis
        if current_ats_score < 60:
            improvements.append(
                {
                    "id": "ats-002",
                    "category": "ats",
                    "priority": "critical",
                    "title": "📉 Low ATS Score - Immediate Action Required",
                    "description": f"Your current ATS score is {current_ats_score}/100. This is below the 60+ threshold that most recruiters use for initial screening. Focus on the highest-impact improvements first.",
                    "score_impact": 20,
                    "before": f"Current ATS Score: {current_ats_score}/100",
                    "after": "Target ATS Score: 75+/100",
                    "action_steps": [
                        "Complete all critical priority improvements first",
                        "Focus on keyword optimization and formatting",
                        "Ensure all contact information is complete",
                        "Use standard section headings and bullet points",
                        "Remove any ATS-blocking elements",
                        "Test your resume through multiple ATS checkers",
                    ],
                }
            )
        elif current_ats_score < 75:
            improvements.append(
                {
                    "id": "ats-002",
                    "category": "ats",
                    "priority": "high",
                    "title": "📈 Boost ATS Score to Competitive Level",
                    "description": f"Your ATS score of {current_ats_score}/100 is good but can be improved. Aim for 75+ to be in the top tier of candidates.",
                    "score_impact": 12,
                    "before": f"Current ATS Score: {current_ats_score}/100",
                    "after": "Target ATS Score: 80+/100",
                    "action_steps": [
                        "Complete high-priority improvements",
                        "Optimize keyword density and placement",
                        "Enhance content quality with quantified achievements",
                        "Ensure consistent formatting throughout",
                        "Add missing industry-relevant keywords",
                    ],
                }
            )

        # Check for specific ATS warnings
        warnings = ats_compat.get("warnings", [])
        for idx, warning in enumerate(warnings[:3]):  # Top 3 warnings
            improvements.append(
                {
                    "id": f"ats-wrn-{idx + 1}",
                    "category": "ats",
                    "priority": "medium",
                    "title": "⚠️ ATS Parsing Warning",
                    "description": warning,
                    "score_impact": 5,
                    "action_steps": [
                        "Address the warning above",
                        "Simplify formatting if needed",
                        "Use standard, clean layout",
                        "Test resume parsing after changes",
                    ],
                }
            )

        # ATS Keyword Density Analysis
        keyword_matches = analysis_result.get("keywordMatches", [])
        missing_keywords = analysis_result.get("missingKeywords", [])

        if len(keyword_matches) < 5:
            improvements.append(
                {
                    "id": "ats-003",
                    "category": "ats",
                    "priority": "high",
                    "title": "🔍 Low Keyword Density - ATS Visibility Issue",
                    "description": f"Only {len(keyword_matches)} keywords detected. ATS systems rely heavily on keyword matching. Increase keyword density to improve visibility.",
                    "score_impact": 12,
                    "before": f"Only {len(keyword_matches)} keywords found",
                    "after": "15-25 relevant keywords strategically placed",
                    "action_steps": [
                        "Add 10-15 missing keywords from the analysis",
                        "Repeat important keywords 2-3 times across sections",
                        "Use keyword variations (e.g., 'JavaScript' and 'JS')",
                        "Include keywords in summary, experience, and skills",
                        "Ensure keywords appear naturally in context",
                    ],
                }
            )

        return improvements

    def _generate_ai_powered_improvements(
        self, analysis_result: dict, extracted_data: dict
    ) -> list[dict]:
        """Generate AI-powered improvements based on missing elements and industry standards"""
        improvements = []

        # Analyze missing sections that are critical for ATS
        missing_sections = []
        if not extracted_data.get("summary_profile"):
            missing_sections.append("Professional Summary")
        if not extracted_data.get("skills"):
            missing_sections.append("Skills Section")
        if not extracted_data.get("education"):
            missing_sections.append("Education Section")

        if missing_sections:
            improvements.append(
                {
                    "id": "ai-001",
                    "category": "structure",
                    "priority": "high",
                    "title": "🤖 AI Analysis: Missing Critical Sections",
                    "description": f"Based on ATS analysis, your resume is missing: {', '.join(missing_sections)}. These sections are essential for ATS parsing and recruiter evaluation.",
                    "score_impact": 15,
                    "before": f"Missing: {', '.join(missing_sections)}",
                    "after": "Complete resume with all standard sections",
                    "action_steps": [
                        f"Add {missing_sections[0]} section with 2-3 sentences highlighting your expertise",
                        "Include a Skills section with relevant technical and soft skills",
                        "Add Education section with degree, institution, and graduation year",
                        "Use standard section headings for ATS compatibility",
                        "Ensure all sections are properly formatted with consistent styling",
                    ],
                }
            )

        # Analyze job type vs content alignment
        job_type = analysis_result.get("jobType", "")
        work_experience = extracted_data.get("work_experience", [])

        if job_type and work_experience:
            # Check if experience aligns with detected job type
            experience_text = " ".join(
                [exp.get("description", "") for exp in work_experience]
            ).lower()

            # Basic alignment check (can be enhanced with more sophisticated analysis)
            if job_type.lower() in ["software engineer", "developer", "programmer"]:
                tech_keywords = [
                    "code",
                    "develop",
                    "program",
                    "software",
                    "application",
                    "system",
                ]
                if not any(keyword in experience_text for keyword in tech_keywords):
                    improvements.append(
                        {
                            "id": "ai-002",
                            "category": "content",
                            "priority": "high",
                            "title": "🎯 AI Analysis: Job Type Mismatch",
                            "description": f"Your resume was detected as '{job_type}' but lacks typical technical experience descriptions. This may confuse ATS systems and recruiters.",
                            "score_impact": 10,
                            "before": "Generic experience descriptions without technical context",
                            "after": "Specific technical experience aligned with job type",
                            "action_steps": [
                                "Add specific technical details to your experience",
                                "Include programming languages, tools, and technologies used",
                                "Describe technical projects and their impact",
                                "Use industry-standard terminology for your field",
                                "Quantify technical achievements with metrics",
                            ],
                        }
                    )

        # Analyze content depth and specificity
        word_count = analysis_result.get("word_count", 0)
        if word_count < 400:
            improvements.append(
                {
                    "id": "ai-003",
                    "category": "content",
                    "priority": "medium",
                    "title": "📝 AI Analysis: Insufficient Content Depth",
                    "description": f"Your resume has only {word_count} words. ATS systems and recruiters prefer detailed resumes (400-600 words) that provide sufficient context for evaluation.",
                    "score_impact": 8,
                    "before": f"Only {word_count} words - too brief for comprehensive evaluation",
                    "after": "400-600 words with detailed, specific accomplishments",
                    "action_steps": [
                        "Expand each work experience with 3-5 detailed bullet points",
                        "Add specific projects, technologies, and achievements",
                        "Include quantified results and impact metrics",
                        "Describe your role, responsibilities, and contributions",
                        "Add relevant certifications, training, or side projects",
                    ],
                }
            )

        # Analyze keyword optimization opportunities
        missing_keywords = analysis_result.get("missingKeywords", [])
        if len(missing_keywords) > 8:
            improvements.append(
                {
                    "id": "ai-004",
                    "category": "keyword",
                    "priority": "high",
                    "title": "🔍 AI Analysis: Significant Keyword Gap",
                    "description": f"Your resume is missing {len(missing_keywords)} important keywords. This significantly impacts ATS visibility and ranking.",
                    "score_impact": 18,
                    "before": f"Missing {len(missing_keywords)} critical keywords",
                    "after": "Optimized keyword density with strategic placement",
                    "action_steps": [
                        "Prioritize the top 10-12 most relevant missing keywords",
                        "Integrate keywords naturally into experience descriptions",
                        "Use keyword variations and synonyms",
                        "Repeat important keywords 2-3 times across sections",
                        "Ensure keywords appear in context, not as lists",
                    ],
                    "keywords": missing_keywords[:12],  # Top 12 for action steps
                }
            )

        return improvements

    def _generate_enhanced_summary(
        self, improvements: list[dict], analysis_result: dict
    ) -> dict:
        """Generate enhanced summary with ATS focus"""
        total = len(improvements)
        by_priority = {
            "critical": len([i for i in improvements if i["priority"] == "critical"]),
            "high": len([i for i in improvements if i["priority"] == "high"]),
            "medium": len([i for i in improvements if i["priority"] == "medium"]),
            "low": len([i for i in improvements if i["priority"] == "low"]),
        }
        total_boost = sum(i.get("score_impact", 0) for i in improvements)
        current_score = analysis_result.get("atsScore", 0)
        projected_score = min(current_score + total_boost, 100)

        # Categorize improvements by type
        by_category = {}
        for improvement in improvements:
            category = improvement.get("category", "other")
            if category not in by_category:
                by_category[category] = 0
            by_category[category] += 1

        return {
            "total_improvements": total,
            "by_priority": by_priority,
            "by_category": by_category,
            "estimated_total_boost": min(total_boost, 40),  # Cap at realistic +40
            "current_score": current_score,
            "projected_score": projected_score,
            "score_improvement": projected_score - current_score,
            "high_priority": by_priority["critical"] + by_priority["high"],
            "estimated_time": self._estimate_completion_time(improvements),
        }

    def _estimate_completion_time(self, improvements: list[dict]) -> str:
        """Estimate time to complete all improvements"""
        total_time = 0
        for improvement in improvements:
            priority = improvement.get("priority", "medium")
            if priority == "critical":
                total_time += 30  # 30 minutes
            elif priority == "high":
                total_time += 20  # 20 minutes
            elif priority == "medium":
                total_time += 15  # 15 minutes
            else:
                total_time += 10  # 10 minutes

        if total_time < 60:
            return f"{total_time} minutes"
        else:
            hours = total_time // 60
            minutes = total_time % 60
            if minutes == 0:
                return f"{hours} hour{'s' if hours > 1 else ''}"
            else:
                return f"{hours}h {minutes}m"

    def _generate_summary(self, improvements: list[dict]) -> dict:
        """Generate summary statistics"""
        total = len(improvements)
        by_priority = {
            "critical": len([i for i in improvements if i["priority"] == "critical"]),
            "high": len([i for i in improvements if i["priority"] == "high"]),
            "medium": len([i for i in improvements if i["priority"] == "medium"]),
            "low": len([i for i in improvements if i["priority"] == "low"]),
        }
        total_boost = sum(i.get("score_impact", 0) for i in improvements)

        return {
            "total_improvements": total,
            "by_priority": by_priority,
            "estimated_total_boost": min(total_boost, 35),  # Cap at realistic +35
        }

    def _identify_ats_quick_wins(self, improvements: list[dict]) -> list[dict]:
        """Identify top 3 ATS-focused quick wins (high impact, easy to fix)"""
        # Quick wins: critical/high priority + high score impact + ATS-relevant
        ats_categories = ["ats", "keyword", "formatting"]
        quick_wins = [
            i
            for i in improvements
            if i["priority"] in ["critical", "high"]
            and i.get("score_impact", 0) >= 8
            and i.get("category", "") in ats_categories
        ]

        # If not enough ATS-specific quick wins, include other high-impact items
        if len(quick_wins) < 3:
            additional_wins = [
                i
                for i in improvements
                if i["priority"] in ["critical", "high"]
                and i.get("score_impact", 0) >= 10
                and i not in quick_wins
            ]
            quick_wins.extend(additional_wins)

        # Sort by score impact (highest first)
        return sorted(quick_wins, key=lambda x: -x.get("score_impact", 0))[:3]

    def _identify_quick_wins(self, improvements: list[dict]) -> list[dict]:
        """Legacy method - redirects to ATS-focused quick wins"""
        return self._identify_ats_quick_wins(improvements)
