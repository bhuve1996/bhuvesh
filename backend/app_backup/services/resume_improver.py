"""
Resume Improvement Service
Generates specific, actionable suggestions to boost ATS score
"""

import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


class ResumeImprover:
    """Generate specific, actionable resume improvement suggestions"""

    def generate_improvement_plan(
        self,
        analysis_result: dict[str, Any],
        extracted_data: dict[str, Any],
        job_description: Optional[str] = None,
    ) -> dict[str, Any]:
        """
        Generate comprehensive improvement plan

        Args:
            analysis_result: ATS analysis results
            extracted_data: Extracted resume data
            job_description: Optional job description for targeted suggestions

        Returns:
            Dictionary with improvements, summary, and quick wins
        """
        try:
            improvements = []

            # 1. Keyword Improvements
            improvements.extend(
                self._generate_keyword_improvements(analysis_result, job_description)
            )

            # 2. Formatting Improvements
            improvements.extend(
                self._generate_formatting_improvements(
                    extracted_data.get("formatting_analysis", {})
                )
            )

            # 3. Content Improvements
            improvements.extend(
                self._generate_content_improvements(extracted_data, analysis_result)
            )

            # 4. Structure Improvements
            improvements.extend(self._generate_structure_improvements(extracted_data))

            # 5. ATS Compatibility Improvements
            improvements.extend(
                self._generate_ats_improvements(
                    extracted_data.get("formatting_analysis", {})
                )
            )

            # Sort by priority
            priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
            improvements.sort(key=lambda x: priority_order[x["priority"]])

            # Generate summary
            summary = self._generate_summary(improvements)

            # Identify quick wins
            quick_wins = self._identify_quick_wins(improvements)

            return {
                "improvements": improvements,
                "summary": summary,
                "quick_wins": quick_wins,
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
        self, formatting_analysis: dict
    ) -> list[dict]:
        """Generate formatting-specific improvements"""
        improvements = []

        # Check bullet points
        bullet_points = formatting_analysis.get("bullet_points", {})
        if not bullet_points.get("detected"):
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

    def _generate_content_improvements(
        self, extracted_data: dict, analysis_result: dict
    ) -> list[dict]:
        """Generate content-specific improvements"""
        improvements = []
        work_experience = extracted_data.get("work_experience", [])

        # Check for quantifiable achievements
        has_numbers = False
        if work_experience:
            for exp in work_experience:
                projects = exp.get("projects", [])
                if projects:
                    for project in projects:
                        desc = str(project.get("description", ""))
                        if any(char.isdigit() for char in desc):
                            has_numbers = True
                            break
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

        # Check resume length
        word_count = analysis_result.get("word_count", 0)
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

    def _generate_structure_improvements(self, extracted_data: dict) -> list[dict]:
        """Generate structure-specific improvements"""
        improvements = []

        # Check if summary exists
        summary = extracted_data.get("summary_profile")
        if not summary or len(str(summary).strip()) < 50:
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

        # Check contact info completeness
        contact = extracted_data.get("contact_info", {})
        missing_contact = []
        if not contact.get("email"):
            missing_contact.append("email")
        if not contact.get("phone"):
            missing_contact.append("phone")
        if not contact.get("location"):
            missing_contact.append("location (city, state)")

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

        # Check for LinkedIn profile
        if not contact.get("linkedin"):
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

    def _generate_ats_improvements(self, formatting_analysis: dict) -> list[dict]:
        """Generate ATS-specific improvements"""
        improvements = []

        ats_compat = formatting_analysis.get("ats_compatibility", {})
        ats_score = ats_compat.get("score", 100)

        # Critical ATS issues
        if ats_score < 70:
            improvements.append(
                {
                    "id": "ats-001",
                    "category": "ats",
                    "priority": "critical",
                    "title": "Critical ATS Compatibility Issues Detected",
                    "description": f"Your resume has an ATS compatibility score of {ats_score}/100. This may prevent it from being parsed correctly by applicant tracking systems, causing automatic rejection.",
                    "score_impact": 20,
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
                    "title": "Improve ATS Compatibility",
                    "description": f"Your resume has an ATS score of {ats_score}/100. Some improvements will help ensure better parsing.",
                    "score_impact": 10,
                    "action_steps": [
                        "Simplify formatting and layout",
                        "Use standard section headings",
                        "Avoid complex tables or graphics",
                        "Use simple bullet points",
                    ],
                }
            )

        # Check for specific ATS warnings
        warnings = ats_compat.get("warnings", [])
        for idx, warning in enumerate(warnings[:2]):  # Top 2 warnings
            improvements.append(
                {
                    "id": f"ats-wrn-{idx + 1}",
                    "category": "ats",
                    "priority": "medium",
                    "title": "ATS Parsing Warning",
                    "description": warning,
                    "score_impact": 3,
                    "action_steps": [
                        "Address the warning above",
                        "Simplify formatting if needed",
                        "Use standard, clean layout",
                    ],
                }
            )

        return improvements

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

    def _identify_quick_wins(self, improvements: list[dict]) -> list[dict]:
        """Identify top 3 quick wins (high impact, easy to fix)"""
        # Quick wins: critical/high priority + high score impact
        quick_wins = [
            i
            for i in improvements
            if i["priority"] in ["critical", "high"] and i["score_impact"] >= 8
        ]
        # Sort by score impact (highest first)
        return sorted(quick_wins, key=lambda x: -x["score_impact"])[:3]
