"""
Advanced ATS (Applicant Tracking System) Analysis Engine
Uses semantic embeddings for concept matching, not just keywords
"""

import re
from collections import Counter
from typing import Any

from app.services.job_description_generator import job_description_generator

# Import job detector and project extractor
from app.services.job_detector import job_detector
from app.services.project_extractor import project_extractor

# Import sentence-transformers - required for AI-powered analysis
try:
    from sentence_transformers import SentenceTransformer, util

    EMBEDDINGS_AVAILABLE = True
except ImportError:
    EMBEDDINGS_AVAILABLE = False
    print(
        "❌ ERROR: sentence-transformers is required for AI-powered analysis. Please install it."
    )


class ATSAnalyzer:
    """
    Production-grade ATS analyzer with semantic matching
    """

    def __init__(self):
        """Initialize with embeddings model - required for AI analysis"""
        if not EMBEDDINGS_AVAILABLE:
            raise Exception(
                "AI-powered analysis requires sentence-transformers. Please install it."
            )

        try:
            self.model = SentenceTransformer(
                "all-MiniLM-L6-v2"
            )  # Lightweight, fast model
            self.use_embeddings = True
            print("✅ ATS Analyzer: AI embeddings model loaded successfully")
        except Exception as e:
            raise Exception(f"Failed to load AI embeddings model: {e}")

        # Enhanced scoring weights based on industry standards
        self.weights = {
            "keyword_matching": 40,  # Industry standard: 30-50% weight
            "semantic_matching": 15,  # AI-powered concept matching
            "format_compliance": 20,  # Structure and sections
            "content_quality": 15,  # Achievements and metrics
            "ats_compatibility": 10,  # Formatting compatibility
        }

        # Industry-standard ATS compatibility rules
        self.ats_standards = {
            "preferred_fonts": ["arial", "calibri", "times new roman", "helvetica"],
            "max_fonts": 3,
            "standard_sections": [
                "experience",
                "education",
                "skills",
                "summary",
                "contact",
            ],
            "optimal_word_count": (400, 800),
            "acceptable_word_count": (300, 1000),
            "max_images": 0,
            "max_tables": 0,
            "standard_bullets": ["•", "-", "*"],
            "date_formats": [r"\d{1,2}/\d{4}", r"\d{4}", r"\d{1,2}-\d{4}"],
        }

    def extract_structured_experience(self, resume_text: str) -> dict[str, Any]:
        """
        Extract structured work experience with proper project association
        """
        return project_extractor.extract_structured_experience(resume_text)

    def analyze_resume_with_job_description(
        self, parsed_resume: dict[str, Any], job_description: str
    ) -> dict[str, Any]:
        """
        Complete ATS analysis comparing resume with job description

        Args:
            parsed_resume: Parsed resume from file_parser
            job_description: Job description text from user

        Returns:
            Comprehensive analysis with scores and recommendations
        """
        resume_text = parsed_resume.get("text", "").lower()

        # Detect job type first
        detected_job, job_confidence = job_detector.detect_job_type(resume_text)

        # Generate specific job description based on detected job type
        experience_level = job_description_generator.determine_experience_level(
            resume_text
        )
        specific_jd = job_description_generator.generate_job_description(
            detected_job, experience_level
        )

        # Use the generated specific JD for analysis instead of the provided one
        analysis_jd = specific_jd if detected_job != "Unknown" else job_description
        jd_text = analysis_jd.lower()

        # Extract keywords from the analysis job description
        jd_keywords = self._extract_keywords(jd_text)
        jd_requirements = self._extract_requirements(jd_text)

        # Perform all analyses
        keyword_analysis = self._analyze_keywords_vs_jd(resume_text, jd_keywords)
        semantic_analysis = self._analyze_semantic_match(resume_text, jd_text)

        format_analysis = self._analyze_format(parsed_resume)
        content_analysis = self._analyze_content(
            resume_text, parsed_resume.get("word_count", 0)
        )
        ats_analysis = self._analyze_ats_compatibility(parsed_resume)

        # Calculate overall score
        overall_score = self._calculate_overall_score(
            keyword_analysis,
            semantic_analysis,
            format_analysis,
            content_analysis,
            ats_analysis,
        )

        # Job type already detected above

        # Generate recommendations
        recommendations = self._generate_recommendations_with_jd(
            keyword_analysis,
            semantic_analysis,
            format_analysis,
            content_analysis,
            ats_analysis,
            jd_requirements,
        )

        return {
            "ats_score": overall_score,
            "match_category": self._get_match_category(overall_score),
            "detected_job_type": detected_job,
            "job_detection_confidence": round(job_confidence, 2),
            "keyword_matches": keyword_analysis["matched_keywords"],
            "missing_keywords": keyword_analysis["missing_keywords"],
            "semantic_similarity": semantic_analysis["similarity_score"],
            "suggestions": recommendations["suggestions"],
            "strengths": recommendations["strengths"],
            "weaknesses": recommendations["weaknesses"],
            "formatting_issues": ats_analysis.get("issues", []),
            "ats_friendly": ats_analysis.get("ats_friendly", True),
            "word_count": parsed_resume.get("word_count", 0),
            "detailed_scores": {
                "keyword_score": round(keyword_analysis["score"], 1),
                "semantic_score": round(semantic_analysis["score"], 1),
                "format_score": round(format_analysis["score"], 1),
                "content_score": round(content_analysis["score"], 1),
                "ats_score": round(ats_analysis["score"], 1),
            },
            "requirements_met": jd_requirements,
            # Enhanced analysis results
            "ats_compatibility": {
                "grade": ats_analysis.get("compatibility_grade", "N/A"),
                "issues": ats_analysis.get("issues", []),
                "warnings": ats_analysis.get("warnings", []),
                "recommendations": ats_analysis.get("recommendations", []),
                "sections_found": ats_analysis.get("sections_found", []),
                "contact_completeness": ats_analysis.get("contact_completeness", "N/A"),
                "bullet_consistency": ats_analysis.get("bullet_consistency", False),
                "word_count_optimal": ats_analysis.get("word_count_optimal", False),
            },
            "format_analysis": {
                "grade": format_analysis.get("format_grade", "N/A"),
                "sections_found": format_analysis.get("sections_found", 0),
                "optional_sections_found": format_analysis.get(
                    "optional_sections_found", 0
                ),
                "contact_completeness": format_analysis.get(
                    "contact_completeness", "N/A"
                ),
                "has_professional_summary": format_analysis.get(
                    "has_professional_summary", False
                ),
                "section_headers_count": format_analysis.get(
                    "section_headers_count", 0
                ),
                "issues": format_analysis.get("issues", []),
                "recommendations": format_analysis.get("recommendations", []),
            },
            # COMPLETE EXTRACTION & MATCHING DATA
            "extraction_details": {
                # ALL keywords extracted (not limited)
                "all_resume_keywords": keyword_analysis.get("resume_keywords", []),
                "all_jd_keywords": jd_keywords,
                "all_matched_keywords": keyword_analysis[
                    "matched_keywords"
                ],  # All matches, not limited
                "all_missing_keywords": keyword_analysis[
                    "missing_keywords"
                ],  # All missing, not limited
                # Skills & Technologies specifically identified
                "skills_found": self._extract_skills(parsed_resume.get("text", "")),
                "skills_required": self._extract_skills(job_description),
                # COMPREHENSIVE RESUME CATEGORIZATION
                "categorized_resume": self._categorize_resume(
                    parsed_resume.get("text", "")
                ),
                # Text samples for verification
                "resume_text_sample": (
                    parsed_resume.get("text", "")[:1000] + "..."
                    if len(parsed_resume.get("text", "")) > 1000
                    else parsed_resume.get("text", "")
                ),
                "full_resume_text": parsed_resume.get(
                    "text", ""
                ),  # Complete text for advanced analysis
                # Statistics
                "total_resume_keywords": len(
                    keyword_analysis.get("resume_keywords", [])
                ),
                "total_jd_keywords": len(jd_keywords),
                "total_matched": len(keyword_analysis["matched_keywords"]),
                "total_missing": len(keyword_analysis["missing_keywords"]),
                "match_percentage": round(
                    (
                        len(keyword_analysis["matched_keywords"])
                        / max(len(jd_keywords), 1)
                    )
                    * 100,
                    2,
                ),
                # Validation flags
                "extraction_successful": bool(parsed_resume.get("text", "").strip()),
                "has_sufficient_content": len(parsed_resume.get("text", "").split())
                >= 50,
            },
        }

    def _extract_keywords(self, text: str) -> list[str]:
        """
        Enhanced keyword extraction based on industry ATS standards
        """
        # Industry-standard stop words (expanded)
        stop_words = {
            "the",
            "a",
            "an",
            "and",
            "or",
            "but",
            "in",
            "on",
            "at",
            "to",
            "for",
            "of",
            "with",
            "by",
            "from",
            "is",
            "are",
            "was",
            "were",
            "be",
            "been",
            "have",
            "has",
            "had",
            "do",
            "does",
            "did",
            "will",
            "would",
            "should",
            "can",
            "could",
            "may",
            "might",
            "must",
            "shall",
            "this",
            "that",
            "these",
            "those",
            "i",
            "you",
            "he",
            "she",
            "it",
            "we",
            "they",
            "me",
            "him",
            "her",
            "us",
            "them",
            "my",
            "your",
            "his",
            "her",
            "its",
            "our",
            "their",
            "am",
            "being",
            "been",
            "get",
            "got",
            "getting",
        }

        # Extract words and phrases with better patterns
        words = re.findall(r"\b[a-z]+\b", text)

        # Filter and count with minimum length of 3
        filtered_words = [w for w in words if w not in stop_words and len(w) >= 3]
        word_freq = Counter(filtered_words)

        # Get keywords with frequency-based scoring
        keywords = []

        # High-frequency keywords (appearing 2+ times)
        high_freq = [word for word, freq in word_freq.most_common(50) if freq >= 2]
        keywords.extend(high_freq)

        # Industry-specific patterns with higher priority
        industry_patterns = [
            # Technical skills
            r"\b(?:javascript|python|java|c\+\+|c#|ruby|php|swift|kotlin|go|rust|typescript|react|angular|vue|node|django|flask|spring|sql|mongodb|postgresql|mysql|redis|aws|azure|gcp|docker|kubernetes|jenkins|git|github|gitlab|jira|confluence|agile|scrum|devops|ci/cd|microservices|api|rest|graphql|machine learning|ai|data science|tensorflow|pytorch|pandas|numpy|scikit-learn)\b",
            # Experience patterns
            r"\b\d+\+?\s*years?\s*(?:of\s*)?(?:experience|exp)\b",
            r"\b(?:entry|junior|mid|senior|lead|principal|architect|manager|director|vp|cto)\s*level\b",
            # Education patterns
            r"\b(?:bachelor|master|phd|doctorate|b\.?e\.?|b\.?tech|m\.?e\.?|m\.?tech|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|mba|diploma|certification|certified)\b",
            # Soft skills
            r"\b(?:leadership|communication|teamwork|problem solving|analytical|collaboration|time management|critical thinking|adaptability|creativity|attention to detail|multitasking|decision making|conflict resolution|negotiation|presentation|interpersonal|organizational|self-motivated|flexible|reliable)\b",
            # Business terms
            r"\b(?:project management|strategic planning|business analysis|stakeholder management|budgeting|forecasting|business development|operations management|process improvement|change management|vendor management|contract negotiation|pmp|six sigma|lean|prince2|scrum master|product management)\b",
        ]

        for pattern in industry_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            keywords.extend([m.lower() for m in matches])

        # Remove duplicates and return top keywords
        unique_keywords = list(set(keywords))

        # Prioritize by industry relevance and frequency
        prioritized_keywords = []

        # Add high-priority technical terms first
        tech_priority = [
            "python",
            "javascript",
            "java",
            "react",
            "aws",
            "docker",
            "kubernetes",
            "sql",
            "git",
            "agile",
        ]
        for tech in tech_priority:
            if tech in unique_keywords:
                prioritized_keywords.append(tech)

        # Add remaining keywords
        for keyword in unique_keywords:
            if keyword not in prioritized_keywords:
                prioritized_keywords.append(keyword)

        return prioritized_keywords[:60]  # Increased limit for better coverage

    def _extract_requirements(self, jd_text: str) -> dict[str, list[str]]:
        """
        Extract structured requirements from job description
        """
        requirements: dict[str, list[str]] = {
            "must_have": [],
            "nice_to_have": [],
            "experience": [],
            "education": [],
        }

        # Extract experience requirements
        exp_patterns = [
            r"(\d+)\+?\s*years?.*?experience",
            r"experience.*?(\d+)\+?\s*years?",
        ]
        for pattern in exp_patterns:
            matches = re.findall(pattern, jd_text, re.IGNORECASE)
            if matches:
                requirements["experience"].extend(matches)

        # Extract education requirements
        edu_patterns = [
            r"\b(bachelor|master|phd|degree).*?(computer science|engineering|business|mathematics|statistics)\b",
            r"\b(computer science|engineering|business|mathematics|statistics).*?(bachelor|master|phd|degree)\b",
        ]
        for pattern in edu_patterns:
            matches = re.findall(pattern, jd_text, re.IGNORECASE)
            if matches:
                requirements["education"].extend([" ".join(m) for m in matches])

        return requirements

    def _analyze_keywords_vs_jd(
        self, resume_text: str, jd_keywords: list[str]
    ) -> dict[str, Any]:
        """
        Analyze keyword matching between resume and JD
        """
        # Extract keywords from resume for comparison
        resume_keywords = self._extract_keywords(resume_text)

        matched_keywords = []
        missing_keywords = []

        for keyword in jd_keywords:
            if keyword in resume_text:
                matched_keywords.append(keyword)
            else:
                missing_keywords.append(keyword)

        # Calculate score
        if len(jd_keywords) > 0:
            score = (len(matched_keywords) / len(jd_keywords)) * 100
        else:
            score = 50  # Default if no keywords extracted

        return {
            "matched_keywords": matched_keywords,  # ALL matched keywords (not limited)
            "missing_keywords": missing_keywords,  # ALL missing keywords (not limited)
            "match_percentage": round(
                (len(matched_keywords) / max(len(jd_keywords), 1)) * 100, 1
            ),
            "score": min(score, 100),
            "resume_keywords": resume_keywords,  # All keywords found in resume
        }

    def _analyze_semantic_match(self, resume_text: str, jd_text: str) -> dict[str, Any]:
        """
        Analyze semantic similarity using embeddings (concept matching)
        """
        # AI embeddings are required - no fallback
        if not self.use_embeddings:
            raise Exception("AI embeddings are required for semantic analysis")

        try:
            # Split into sentences for better matching
            resume_sentences = [
                s.strip() for s in resume_text.split(".") if len(s.strip()) > 20
            ][:10]
            jd_sentences = [
                s.strip() for s in jd_text.split(".") if len(s.strip()) > 20
            ][:10]

            if not resume_sentences or not jd_sentences:
                return {
                    "similarity_score": 0,
                    "score": 50,
                    "method": "insufficient_text",
                }

            # Encode sentences
            resume_embeddings = self.model.encode(
                resume_sentences, convert_to_tensor=True
            )
            jd_embeddings = self.model.encode(jd_sentences, convert_to_tensor=True)

            # Calculate cosine similarity
            similarities = util.cos_sim(resume_embeddings, jd_embeddings)

            # Get max similarity for each resume sentence
            max_similarities = similarities.max(dim=1)[0]
            avg_similarity = max_similarities.mean().item()

            # Convert to score (0-100)
            score = avg_similarity * 100

            return {
                "similarity_score": round(avg_similarity, 3),
                "score": round(score, 1),
                "method": "sentence_transformers",
            }

        except Exception as e:
            print(f"Error in semantic analysis: {e}")
            return {"similarity_score": 0, "score": 50, "method": "error"}

    def _analyze_format(self, parsed_resume: dict[str, Any]) -> dict[str, Any]:
        """
        Enhanced format analysis based on industry ATS standards
        """
        text = parsed_resume.get("text", "").lower()
        word_count = parsed_resume.get("word_count", 0)
        score: float = 0.0
        issues = []
        recommendations = []

        # 1. Required sections analysis (40 points)
        required_sections = ["experience", "education", "skills"]
        optional_sections = [
            "summary",
            "profile",
            "objective",
            "contact",
            "certifications",
            "projects",
        ]

        found_required = sum(1 for section in required_sections if section in text)
        found_optional = sum(1 for section in optional_sections if section in text)

        section_score = (found_required / len(required_sections)) * 40
        score += section_score

        if found_required < len(required_sections):
            missing = [s for s in required_sections if s not in text]
            issues.append(f"Missing required sections: {', '.join(missing)}")
            recommendations.append(
                "Include all required sections: Experience, Education, Skills."
            )

        # Bonus for optional sections (up to 10 points)
        if found_optional > 0:
            score += min(found_optional * 2, 10)

        # 2. Word count optimization (25 points)
        optimal_range = self.ats_standards["optimal_word_count"]
        acceptable_range = self.ats_standards["acceptable_word_count"]

        if optimal_range[0] <= word_count <= optimal_range[1]:
            score += 25  # Optimal
        elif acceptable_range[0] <= word_count <= acceptable_range[1]:
            score += 15  # Acceptable
        elif 200 <= word_count <= 1200:
            score += 10  # Poor but workable
        else:
            if word_count < 200:
                issues.append(
                    f"Resume too short ({word_count} words). Minimum 200 words recommended."
                )
                recommendations.append(
                    "Add more detailed descriptions of your experience and skills."
                )
            elif word_count > 1200:
                issues.append(
                    f"Resume too long ({word_count} words). Consider condensing to 1-2 pages."
                )
                recommendations.append(
                    "Focus on most relevant experience and achievements."
                )

        # 3. Contact information completeness (20 points)
        essential_contact = ["email", "phone"]
        additional_contact = ["linkedin", "github", "portfolio", "website"]

        essential_found = sum(1 for contact in essential_contact if contact in text)
        additional_found = sum(1 for contact in additional_contact if contact in text)

        contact_score = (essential_found / len(essential_contact)) * 15
        score += contact_score

        # Bonus for additional contact info
        if additional_found > 0:
            score += min(additional_found * 2, 5)

        if essential_found < len(essential_contact):
            missing_essential = [c for c in essential_contact if c not in text]
            issues.append(
                f"Missing essential contact info: {', '.join(missing_essential)}"
            )
            recommendations.append(
                "Include email and phone number at the top of your resume."
            )

        # 4. Section ordering and structure (15 points)
        lines = text.split("\n")
        section_order_score = 0

        # Check if contact info appears early (first 10 lines)
        contact_in_header = any(
            contact in " ".join(lines[:10]) for contact in essential_contact
        )
        if contact_in_header:
            section_order_score += 8
        else:
            issues.append("Contact information should appear at the top of the resume.")
            recommendations.append("Place contact information in the header section.")

        # Check for clear section headers
        section_headers = []
        for line in lines:
            line_stripped = line.strip()
            if len(line_stripped) < 30 and any(
                section in line_stripped
                for section in required_sections + optional_sections
            ):
                section_headers.append(line_stripped)

        if len(section_headers) >= 3:
            section_order_score += 7
        else:
            issues.append("Missing clear section headers.")
            recommendations.append(
                "Use clear section headings like 'EXPERIENCE', 'EDUCATION', 'SKILLS'."
            )

        score += section_order_score

        # 5. Professional summary presence (bonus 5 points)
        summary_keywords = ["summary", "profile", "objective", "about"]
        has_summary = any(keyword in text for keyword in summary_keywords)
        if has_summary:
            score += 5
            recommendations.append("✓ Professional summary present.")
        else:
            recommendations.append("Consider adding a professional summary section.")

        return {
            "score": min(score, 100),
            "sections_found": found_required,
            "optional_sections_found": found_optional,
            "word_count": word_count,
            "word_count_optimal": optimal_range[0] <= word_count <= optimal_range[1],
            "contact_completeness": f"{essential_found}/{len(essential_contact)} essential, {additional_found} additional",
            "has_professional_summary": has_summary,
            "section_headers_count": len(section_headers),
            "issues": issues,
            "recommendations": recommendations,
            "format_grade": self._get_format_grade(min(score, 100)),
        }

    def _get_format_grade(self, score: int) -> str:
        """Get format analysis grade"""
        if score >= 90:
            return "A+ (Excellent Structure)"
        elif score >= 80:
            return "A (Very Good Structure)"
        elif score >= 70:
            return "B (Good Structure)"
        elif score >= 60:
            return "C (Fair Structure)"
        elif score >= 50:
            return "D (Poor Structure)"
        else:
            return "F (Very Poor Structure)"

    def _analyze_content(self, text: str, word_count: int) -> dict[str, Any]:
        """
        Analyze content quality
        """
        score: float = 0.0

        # Quantifiable achievements (0-40 points)
        numbers = re.findall(r"\d+", text)
        if len(numbers) >= 5:
            score += 40
        elif len(numbers) >= 3:
            score += 25
        elif len(numbers) >= 1:
            score += 10

        # Action verbs (0-30 points)
        action_verbs = [
            "developed",
            "implemented",
            "designed",
            "created",
            "built",
            "managed",
            "led",
            "increased",
            "improved",
            "optimized",
            "delivered",
            "achieved",
            "established",
            "launched",
            "executed",
            "collaborated",
            "coordinated",
        ]
        verb_count = sum(1 for verb in action_verbs if verb in text)
        verb_score = min((verb_count / 5) * 30, 30)
        score += verb_score

        # Professional language (0-30 points)
        professional_terms = [
            "strategic",
            "innovative",
            "efficient",
            "scalable",
            "robust",
            "comprehensive",
            "proven",
            "expertise",
            "proficiency",
            "excellence",
        ]
        prof_count = sum(1 for term in professional_terms if term in text)
        prof_score = min((prof_count / 3) * 30, 30)
        score += prof_score

        return {
            "score": min(score, 100),
            "metrics_count": len(numbers),
            "action_verbs_count": verb_count,
        }

    def _analyze_ats_compatibility(
        self, parsed_resume: dict[str, Any]
    ) -> dict[str, Any]:
        """
        Enhanced ATS compatibility analysis based on industry standards
        """
        formatting = parsed_resume.get("formatting_analysis", {})
        text = parsed_resume.get("text", "").lower()
        score: float = 100.0  # Start with perfect score
        issues = []
        warnings = []
        recommendations = []

        # Industry-standard ATS compatibility checks

        # 1. Images (Major ATS blocker)
        images_count = formatting.get("images_count", 0)
        if images_count > self.ats_standards["max_images"]:
            score -= 40
            issues.append(f"Contains {images_count} image(s). ATS cannot parse images.")
            recommendations.append(
                "Remove all images, logos, and graphics for ATS compatibility."
            )

        # 2. Tables (Major ATS blocker)
        tables_detected = formatting.get("tables_detected", False)
        if tables_detected:
            score -= 35
            issues.append("Contains tables. ATS may not parse table content correctly.")
            recommendations.append("Convert table content to simple text format.")

        # 3. Font compatibility
        fonts_count = formatting.get("fonts_count", 1)
        if fonts_count > self.ats_standards["max_fonts"]:
            score -= 20
            issues.append(
                f"Uses {fonts_count} different fonts. Stick to 1-2 standard fonts."
            )
            recommendations.append("Use only Arial, Calibri, or Times New Roman fonts.")

        # 4. File format check (if available)
        file_format = parsed_resume.get("file_format", "")
        if file_format and file_format.lower() not in ["docx", "doc"]:
            score -= 15
            warnings.append(
                f"File format: {file_format}. .docx is preferred for ATS compatibility."
            )

        # 5. Section structure validation
        standard_sections = self.ats_standards["standard_sections"]
        found_sections = []
        for section in standard_sections:
            if section in text:
                found_sections.append(section)

        if len(found_sections) < 3:
            score -= 25
            issues.append(
                f"Missing standard sections. Found: {', '.join(found_sections)}"
            )
            recommendations.append(
                "Include clear sections: Experience, Education, Skills, Summary."
            )

        # 6. Contact information completeness
        contact_required = ["email", "phone"]
        contact_found = sum(1 for contact in contact_required if contact in text)
        if contact_found < len(contact_required):
            score -= 15
            issues.append("Missing essential contact information.")
            recommendations.append(
                "Include email and phone number at the top of resume."
            )

        # 7. Bullet point consistency
        bullet_patterns = ["•", "●", "◦", "▪", "▸", "→", "-", "*", "✓", "►"]
        bullet_counts: dict[str, int] = {}
        lines = text.split("\n")
        for line in lines:
            line_stripped = line.strip()
            for bullet in bullet_patterns:
                if line_stripped.startswith(bullet):
                    bullet_counts[bullet] = bullet_counts.get(bullet, 0) + 1

        if len(bullet_counts) > 2:
            score -= 10
            warnings.append(
                f"Using {len(bullet_counts)} different bullet types. Use 1-2 for consistency."
            )
            recommendations.append("Use consistent bullet points (• or -) throughout.")

        # 8. Text formatting issues
        # Check for excessive caps
        caps_words = [word for word in text.split() if word.isupper() and len(word) > 1]
        if len(caps_words) > len(text.split()) * 0.15:  # More than 15% all caps
            score -= 10
            warnings.append(
                "Excessive use of ALL CAPS. Use title case for better readability."
            )

        # Check for special characters that might confuse ATS
        special_chars = re.findall(r"[^\w\s\.,\-\(\)\[\]\/\@\#\&]", text)
        if len(special_chars) > 20:
            score -= 5
            warnings.append(
                "High number of special characters may confuse ATS parsing."
            )

        # 9. Word count optimization
        word_count = parsed_resume.get("word_count", 0)
        optimal_range = self.ats_standards["optimal_word_count"]
        acceptable_range = self.ats_standards["acceptable_word_count"]

        if optimal_range[0] <= word_count <= optimal_range[1]:
            recommendations.append("✓ Optimal word count for ATS parsing.")
        elif acceptable_range[0] <= word_count <= acceptable_range[1]:
            warnings.append("Word count is acceptable but could be optimized.")
        else:
            score -= 15
            if word_count < acceptable_range[0]:
                issues.append(
                    f"Resume too short ({word_count} words). Add more details."
                )
                recommendations.append(
                    "Expand resume to 400-800 words for better ATS evaluation."
                )
            else:
                issues.append(
                    f"Resume too long ({word_count} words). Consider condensing."
                )
                recommendations.append(
                    "Condense resume to 400-800 words for optimal ATS parsing."
                )

        # 10. Date format consistency
        date_formats_found = []
        for pattern in self.ats_standards["date_formats"]:
            if re.search(pattern, text):
                date_formats_found.append(pattern)

        if len(date_formats_found) > 2:
            score -= 5
            warnings.append(
                "Multiple date formats detected. Use consistent MM/YYYY format."
            )
            recommendations.append(
                "Use consistent date format (MM/YYYY) throughout resume."
            )

        # Calculate final score and determine ATS friendliness
        final_score = max(score, 0)
        ats_friendly = final_score >= 70

        return {
            "score": final_score,
            "ats_friendly": ats_friendly,
            "issues": issues,
            "warnings": warnings,
            "recommendations": recommendations,
            "compatibility_grade": self._get_compatibility_grade(final_score),
            "sections_found": found_sections,
            "contact_completeness": f"{contact_found}/{len(contact_required)}",
            "bullet_consistency": len(bullet_counts) <= 2,
            "word_count_optimal": optimal_range[0] <= word_count <= optimal_range[1],
        }

    def _get_compatibility_grade(self, score: int) -> str:
        """Get ATS compatibility grade"""
        if score >= 90:
            return "A+ (Excellent)"
        elif score >= 80:
            return "A (Very Good)"
        elif score >= 70:
            return "B (Good)"
        elif score >= 60:
            return "C (Fair)"
        elif score >= 50:
            return "D (Poor)"
        else:
            return "F (Very Poor)"

    def _calculate_overall_score(
        self,
        keyword_analysis: dict,
        semantic_analysis: dict,
        format_analysis: dict,
        content_analysis: dict,
        ats_analysis: dict,
    ) -> int:
        """
        Calculate weighted overall score
        """
        weighted_score = (
            keyword_analysis["score"] * self.weights["keyword_matching"]
            + semantic_analysis["score"] * self.weights["semantic_matching"]
            + format_analysis["score"] * self.weights["format_compliance"]
            + content_analysis["score"] * self.weights["content_quality"]
            + ats_analysis["score"] * self.weights["ats_compatibility"]
        ) / 100

        return round(weighted_score)

    def _get_match_category(self, score: int) -> str:
        """
        Categorize the match score
        """
        if score >= 80:
            return "Excellent Match"
        elif score >= 70:
            return "Good Match"
        elif score >= 60:
            return "Fair Match"
        elif score >= 50:
            return "Needs Improvement"
        else:
            return "Poor Match"

    def _generate_recommendations_with_jd(
        self,
        keyword_analysis: dict,
        semantic_analysis: dict,
        format_analysis: dict,
        content_analysis: dict,
        ats_analysis: dict,
        requirements: dict,
    ) -> dict[str, list[str]]:
        """
        Generate actionable recommendations
        """
        suggestions = []
        strengths = []
        weaknesses = []

        # Keyword recommendations
        if keyword_analysis["score"] < 70:
            missing = keyword_analysis["missing_keywords"][:5]
            suggestions.append(
                f"Add these keywords from the job description: {', '.join(missing)}"
            )
            weaknesses.append(
                f"Only {keyword_analysis['match_percentage']}% keyword match"
            )
        else:
            strengths.append(
                f"Strong keyword match ({keyword_analysis['match_percentage']}%)"
            )

        # Semantic recommendations
        if semantic_analysis["score"] < 60:
            suggestions.append(
                "Rephrase experiences to better align with job description concepts"
            )
            weaknesses.append("Low semantic similarity with job requirements")
        elif semantic_analysis["score"] > 70:
            strengths.append("Good conceptual alignment with role requirements")

        # Format recommendations
        if format_analysis["score"] < 70:
            suggestions.append("Add clear sections: Experience, Education, Skills")
            weaknesses.append("Missing important resume sections")
        else:
            strengths.append("Well-structured resume")

        # Content recommendations
        if content_analysis["metrics_count"] < 3:
            suggestions.append(
                "Add quantifiable achievements (numbers, percentages, metrics)"
            )
            weaknesses.append("Lacks measurable accomplishments")
        else:
            strengths.append(
                f"Good use of metrics ({content_analysis['metrics_count']} quantifiable results)"
            )

        # ATS recommendations
        if not ats_analysis["ats_friendly"]:
            for issue in ats_analysis["issues"]:
                suggestions.append(f"Fix: {issue}")
            weaknesses.append("Format may not be ATS-compatible")
        else:
            strengths.append("ATS-friendly formatting")

        # Word count
        word_count = format_analysis["word_count"]
        if word_count < 400:
            suggestions.append(
                "Expand resume with more detailed descriptions (aim for 400-800 words)"
            )
        elif word_count > 800:
            suggestions.append(
                "Consider condensing to 400-800 words for optimal ATS parsing"
            )

        return {
            "suggestions": suggestions,
            "strengths": (
                strengths
                if strengths
                else ["Review suggestions to improve your resume"]
            ),
            "weaknesses": weaknesses if weaknesses else ["Good overall structure"],
        }

    def _categorize_resume(self, text: str) -> dict[str, Any]:
        """
        Comprehensive categorization of ALL resume sections
        Extracts: contact info, education, work experience, skills, hobbies, etc.
        """
        text_lower = text.lower()
        lines = text.split("\n")

        categorized = {
            "contact_info": self._extract_contact_info(text),
            "education": self._extract_education(text),
            "work_experience": self._extract_work_experience(text),
            "certifications": self._extract_certifications(text),
            "hobbies_interests": self._extract_hobbies(text),
            "languages": self._extract_languages(text),
            "achievements": self._extract_achievements(text),
            "summary_profile": self._extract_summary(text),
            "formatting_analysis": self._analyze_formatting(text, lines),
        }

        return categorized

    def _analyze_formatting(self, text: str, lines: list[str]) -> dict[str, Any]:
        """
        Detailed formatting analysis for ATS compatibility
        Checks: bullets, spacing, consistency, structure, etc.
        """
        analysis = {
            "bullet_points": {
                "detected": False,
                "count": 0,
                "types_used": [],
                "consistent": True,
                "recommendation": "",
            },
            "spacing": {
                "line_spacing_consistent": True,
                "excessive_whitespace": False,
                "proper_section_breaks": True,
            },
            "structure": {
                "has_clear_sections": False,
                "sections_detected": [],
                "logical_flow": True,
                "chronological_order": True,
            },
            "text_formatting": {
                "all_caps_excessive": False,
                "appropriate_capitalization": True,
                "special_characters_count": 0,
                "emoji_count": 0,
            },
            "length_analysis": {
                "total_words": len(text.split()),
                "total_lines": len([l for l in lines if l.strip()]),
                "average_line_length": 0,
                "estimated_pages": 0,
                "appropriate_length": True,
            },
            "ats_compatibility": {
                "score": 0,
                "issues": [],
                "warnings": [],
                "recommendations": [],
            },
        }

        # Detect bullet points
        bullet_patterns = ["•", "●", "◦", "▪", "▸", "→", "-", "*", "✓", "►"]
        bullet_counts: dict[str, int] = {}

        for line in lines:
            line_stripped = line.strip()
            for bullet in bullet_patterns:
                if line_stripped.startswith(bullet):
                    bullet_counts[bullet] = bullet_counts.get(bullet, 0) + 1
                    analysis["bullet_points"]["detected"] = True

        if bullet_counts:
            analysis["bullet_points"]["count"] = sum(bullet_counts.values())
            analysis["bullet_points"]["types_used"] = list(bullet_counts.keys())

            # Check consistency (should use max 2 types)
            if len(bullet_counts) > 2:
                analysis["bullet_points"]["consistent"] = False
                analysis["ats_compatibility"]["warnings"].append(
                    f"Using {len(bullet_counts)} different bullet types. Stick to 1-2 for consistency."
                )

        # Check spacing
        empty_line_count = sum(1 for line in lines if not line.strip())
        non_empty_count = len([l for l in lines if l.strip()])

        if empty_line_count > non_empty_count * 0.3:
            analysis["spacing"]["excessive_whitespace"] = True
            analysis["ats_compatibility"]["issues"].append(
                "Excessive whitespace detected. ATS may parse incorrectly."
            )

        # Detect sections
        common_sections = [
            "summary",
            "objective",
            "profile",
            "experience",
            "work experience",
            "employment",
            "education",
            "skills",
            "certifications",
            "projects",
            "achievements",
            "awards",
            "languages",
            "hobbies",
            "interests",
            "references",
            "publications",
            "volunteer",
        ]

        for line in lines:
            line_lower = line.strip().lower()
            for section in common_sections:
                if line_lower == section or line_lower == section + ":":
                    analysis["structure"]["sections_detected"].append(section.title())
                    analysis["structure"]["has_clear_sections"] = True

        # Check for excessive caps
        caps_words = [word for word in text.split() if word.isupper() and len(word) > 1]
        if len(caps_words) > len(text.split()) * 0.1:  # More than 10% all caps
            analysis["text_formatting"]["all_caps_excessive"] = True
            analysis["ats_compatibility"]["warnings"].append(
                "Excessive use of ALL CAPS. Use title case for better ATS readability."
            )

        # Count special characters and emojis
        special_chars = re.findall(r"[^\w\s\.,\-\(\)\[\]\/\@\#]", text)
        analysis["text_formatting"]["special_characters_count"] = len(special_chars)

        # Detect emojis (basic check)
        emoji_pattern = re.compile(
            "["
            "\U0001f600-\U0001f64f"  # emoticons
            "\U0001f300-\U0001f5ff"  # symbols & pictographs
            "\U0001f680-\U0001f6ff"  # transport & map symbols
            "\U0001f1e0-\U0001f1ff"  # flags
            "]+",
            flags=re.UNICODE,
        )
        emojis = emoji_pattern.findall(text)
        analysis["text_formatting"]["emoji_count"] = len(emojis)

        if len(emojis) > 0:
            analysis["ats_compatibility"]["warnings"].append(
                f"Found {len(emojis)} emoji(s). Some ATS may not parse emojis correctly."
            )

        # Length analysis
        non_empty_lines = [l for l in lines if l.strip()]
        if non_empty_lines:
            avg_length = sum(len(l) for l in non_empty_lines) / len(non_empty_lines)
            analysis["length_analysis"]["average_line_length"] = round(avg_length, 1)

        word_count = analysis["length_analysis"]["total_words"]
        analysis["length_analysis"]["estimated_pages"] = max(1, round(word_count / 350))

        # Appropriate length check
        if word_count < 200:
            analysis["length_analysis"]["appropriate_length"] = False
            analysis["ats_compatibility"]["issues"].append(
                "Resume is too short (< 200 words). Add more details about experience and skills."
            )
        elif word_count > 1500:
            analysis["length_analysis"]["appropriate_length"] = False
            analysis["ats_compatibility"]["warnings"].append(
                "Resume is lengthy (> 1500 words). Consider condensing to 1-2 pages."
            )

        # Calculate ATS compatibility score
        score: float = 100.0

        # Deduct for issues
        if analysis["spacing"]["excessive_whitespace"]:
            score -= 10
        if not analysis["structure"]["has_clear_sections"]:
            score -= 15
            analysis["ats_compatibility"]["issues"].append(
                "No clear section headings detected. Add sections like 'Experience', 'Education', 'Skills'."
            )
        if analysis["text_formatting"]["all_caps_excessive"]:
            score -= 10
        if len(analysis["structure"]["sections_detected"]) < 3:
            score -= 10
            analysis["ats_compatibility"]["warnings"].append(
                f"Only {len(analysis['structure']['sections_detected'])} sections detected. Standard resumes have 4-6 sections."
            )
        if not analysis["bullet_points"]["detected"]:
            score -= 5
            analysis["ats_compatibility"]["recommendations"].append(
                "Use bullet points to list achievements and responsibilities for better readability."
            )
        if (
            not analysis["bullet_points"]["consistent"]
            and analysis["bullet_points"]["detected"]
        ):
            score -= 5

        analysis["ats_compatibility"]["score"] = max(0, score)

        # Add positive recommendations
        if (
            analysis["bullet_points"]["detected"]
            and analysis["bullet_points"]["consistent"]
        ):
            analysis["ats_compatibility"]["recommendations"].append(
                "✓ Good use of consistent bullet points."
            )
        if (
            analysis["structure"]["has_clear_sections"]
            and len(analysis["structure"]["sections_detected"]) >= 4
        ):
            analysis["ats_compatibility"]["recommendations"].append(
                "✓ Well-structured with clear section headings."
            )
        if 300 <= word_count <= 800:
            analysis["ats_compatibility"]["recommendations"].append(
                "✓ Optimal length for 1-page resume."
            )

        return analysis

    def _extract_contact_info(self, text: str) -> dict[str, Any]:
        """Extract detailed contact information"""
        contact = {
            "full_name": "",
            "first_name": "",
            "middle_name": "",
            "last_name": "",
            "email": "",
            "phone": {"raw": "", "country_code": "", "number": ""},
            "linkedin": {"url": "", "username": ""},
            "github": {"url": "", "username": ""},
            "portfolio": "",
            "location": {"full": "", "city": "", "state": "", "country": ""},
        }

        # Extract full name (usually first line)
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        if lines:
            full_name = lines[0]
            contact["full_name"] = full_name

            # Parse name into parts
            name_parts = full_name.split()
            if len(name_parts) >= 2:
                contact["first_name"] = name_parts[0]
                contact["last_name"] = name_parts[-1]
                if len(name_parts) > 2:
                    contact["middle_name"] = " ".join(name_parts[1:-1])
            elif len(name_parts) == 1:
                contact["first_name"] = name_parts[0]

        # Extract email
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        if email_match:
            contact["email"] = email_match.group(0)

        # Extract phone with detailed parsing
        phone_match = re.search(r"([\+\d][\d\s\-\(\)]{8,})", text)
        if phone_match:
            phone_raw = phone_match.group(0).strip()
            contact["phone"]["raw"] = phone_raw

            # Extract country code
            country_code_match = re.search(r"^\+(\d{1,3})", phone_raw)
            if country_code_match:
                contact["phone"]["country_code"] = "+" + country_code_match.group(1)
                # Remove country code to get number
                contact["phone"]["number"] = re.sub(
                    r"^\+\d{1,3}\s*[-\s]*", "", phone_raw
                )
            else:
                contact["phone"]["number"] = phone_raw

        # Extract LinkedIn with username
        if "linkedin" in text.lower():
            linkedin_match = re.search(r"linkedin\.com/in/([\w\-]+)", text.lower())
            if linkedin_match:
                contact["linkedin"]["username"] = linkedin_match.group(1)
                contact["linkedin"][
                    "url"
                ] = f"linkedin.com/in/{linkedin_match.group(1)}"
            else:
                contact["linkedin"]["url"] = "Found (URL not extracted)"

        # Extract GitHub with username
        if "github" in text.lower():
            github_match = re.search(r"github\.com/([\w\-]+)", text.lower())
            if github_match:
                contact["github"]["username"] = github_match.group(1)
                contact["github"]["url"] = f"github.com/{github_match.group(1)}"
            else:
                contact["github"]["url"] = "Found (URL not extracted)"

        # Extract portfolio/website
        portfolio_patterns = [
            r"(https?://)?(?:www\.)?([\w\-]+\.(?:com|dev|io|net|org|in))",
            r"portfolio\s*:?\s*([\w\-]+\.[\w\-]+)",
        ]
        for pattern in portfolio_patterns:
            match = re.search(pattern, text.lower())
            if (
                match
                and "linkedin" not in match.group(0)
                and "github" not in match.group(0)
            ):
                contact["portfolio"] = match.group(0)
                break

        # Extract detailed location
        # Pattern 1: City, State/Country
        location_match = re.search(
            r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
            text,
        )
        if location_match:
            contact["location"]["full"] = location_match.group(0)
            contact["location"]["city"] = location_match.group(1)
            location_second = location_match.group(2)

            # Determine if it's state or country
            indian_states = [
                "Haryana",
                "Karnataka",
                "Punjab",
                "Delhi",
                "Maharashtra",
                "Gujarat",
            ]
            if location_second in indian_states:
                contact["location"]["state"] = location_second
                contact["location"]["country"] = "India"
            else:
                contact["location"]["country"] = location_second

        # Pattern 2: Just city name
        city_patterns = [
            r"\b(Gurugram|Bengaluru|Chandigarh|Delhi|Mumbai|Pune|Hyderabad|Chennai|Noida|Gurgaon)\b"
        ]
        if not contact["location"]["full"]:
            for pattern in city_patterns:
                match = re.search(pattern, text)
                if match:
                    contact["location"]["city"] = match.group(1)
                    contact["location"]["country"] = "India"
                    contact["location"]["full"] = f"{match.group(1)}, India"
                    break

        return contact

    def _extract_education(self, text: str) -> list[dict[str, Any]]:
        """Extract detailed education information"""
        education_list = []

        # Look for education section
        lines = text.split("\n")
        in_education = False
        current_edu: dict[str, str] = {}

        for i, line in enumerate(lines):
            line_stripped = line.strip()
            line_lower = line_stripped.lower()

            # Detect education section start
            if (
                re.search(r"\b(education|academic|qualification)\b", line_lower)
                and len(line_stripped) < 30
            ):
                in_education = True
                continue

            # Stop at next major section
            if (
                in_education
                and re.search(
                    r"\b(experience|work|skills|projects|certifications|languages|hobbies)\b",
                    line_lower,
                )
                and len(line_stripped) < 30
            ):
                if current_edu:
                    education_list.append(current_edu)
                break

            if in_education and line_stripped:
                # Extract degree
                degree_match = re.search(
                    r"(bachelor|master|phd|doctorate|b\.?e\.?|b\.?tech|m\.?e\.?|m\.?tech|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|mba|diploma)",
                    line_lower,
                )
                if degree_match and not current_edu.get("degree"):
                    # Parse degree details
                    degree_full = line_stripped
                    degree_type = ""
                    major = ""
                    specialization = ""

                    # Extract degree type
                    if (
                        "bachelor" in line_lower
                        or "b.e." in line_lower
                        or "b.tech" in line_lower
                        or "b.s." in line_lower
                    ):
                        degree_type = "Bachelor"
                    elif (
                        "master" in line_lower
                        or "m.e." in line_lower
                        or "m.tech" in line_lower
                        or "m.s." in line_lower
                        or "mba" in line_lower
                    ):
                        degree_type = "Master"
                    elif "phd" in line_lower or "doctorate" in line_lower:
                        degree_type = "Doctorate"
                    elif "diploma" in line_lower:
                        degree_type = "Diploma"

                    # Extract major/field
                    majors = [
                        "computer science",
                        "engineering",
                        "information technology",
                        "electronics",
                        "mechanical",
                        "civil",
                        "business",
                        "commerce",
                        "arts",
                        "science",
                    ]
                    for maj in majors:
                        if maj in line_lower:
                            major = maj.title()
                            break

                    current_edu = {
                        "degree_full": degree_full,
                        "degree_type": degree_type,
                        "major": major,
                        "specialization": specialization,
                        "institution": {
                            "name": "",
                            "type": "",  # University, College, Institute
                            "location": "",
                        },
                        "duration": {
                            "start_year": "",
                            "end_year": "",
                            "total_years": 0,
                        },
                        "grade": {
                            "value": "",
                            "type": "",  # CGPA, GPA, Percentage
                            "scale": "",
                            "percentile": "",
                        },
                    }

                # Extract institution
                if current_edu and (
                    "university" in line_lower
                    or "college" in line_lower
                    or "institute" in line_lower
                    or "school" in line_lower
                ):
                    current_edu["institution"]["name"] = line_stripped

                    # Determine institution type
                    if "university" in line_lower:
                        current_edu["institution"]["type"] = "University"
                    elif "college" in line_lower:
                        current_edu["institution"]["type"] = "College"
                    elif "institute" in line_lower:
                        current_edu["institution"]["type"] = "Institute"
                    elif "school" in line_lower:
                        current_edu["institution"]["type"] = "School"

                # Extract year with detailed parsing
                year_match = re.search(r"(19|20)(\d{2})\s*[-–]\s*(19|20)(\d{2})", line)
                if current_edu and year_match:
                    start_year = year_match.group(1) + year_match.group(2)
                    end_year = year_match.group(3) + year_match.group(4)

                    current_edu["duration"]["start_year"] = start_year
                    current_edu["duration"]["end_year"] = end_year
                    current_edu["duration"]["total_years"] = int(end_year) - int(
                        start_year
                    )

                # Extract grade with detailed parsing
                if current_edu:
                    # CGPA pattern
                    cgpa_match = re.search(
                        r"(\d+\.?\d*)\s*(?:out of|/)?\s*(\d+\.?\d*)?\s*(cgpa|gpa)",
                        line_lower,
                    )
                    if cgpa_match:
                        current_edu["grade"]["value"] = cgpa_match.group(1)
                        current_edu["grade"]["type"] = cgpa_match.group(3).upper()
                        if cgpa_match.group(2):
                            current_edu["grade"]["scale"] = cgpa_match.group(2)

                    # Percentage pattern
                    percentage_match = re.search(
                        r"(\d+\.?\d*)\s*(?:%|percentage)", line_lower
                    )
                    if percentage_match and not current_edu["grade"]["value"]:
                        current_edu["grade"]["value"] = percentage_match.group(1)
                        current_edu["grade"]["type"] = "Percentage"
                        current_edu["grade"]["scale"] = "100"

                    # Percentile pattern
                    percentile_match = re.search(
                        r"top\s+(\d+)\s*%|(\d+)(?:st|nd|rd|th)?\s*percentile",
                        line_lower,
                    )
                    if percentile_match:
                        percentile_val = percentile_match.group(
                            1
                        ) or percentile_match.group(2)
                        current_edu["grade"]["percentile"] = percentile_val

        if current_edu and current_edu not in education_list:
            education_list.append(current_edu)

        return education_list

    def _extract_work_experience(self, text: str) -> list[dict[str, Any]]:
        """
        Extract detailed work experience including:
        - Company name and location
        - Job role/title
        - Duration (start date - end date)
        - Projects with descriptions and skills used
        """
        experiences: list[dict[str, str]] = []
        lines = text.split("\n")

        in_experience = False
        current_job = None
        current_project = None

        for i, line in enumerate(lines):
            line_stripped = line.strip()
            line_lower = line_stripped.lower()

            # Detect work experience section start
            if (
                re.search(
                    r"\b(work experience|experience|employment|professional experience)\b",
                    line_lower,
                )
                and len(line_stripped) < 50
            ):
                in_experience = True
                continue

            # Stop at next major section
            if (
                in_experience
                and re.search(r"\b(education|skills|certification)\b", line_lower)
                and len(line_stripped) < 30
            ):
                if current_project and current_job:
                    current_job["projects"].append(current_project)
                if current_job:
                    experiences.append(current_job)
                break

            if in_experience and line_stripped:
                # Detect company name (usually has location pattern or is followed by date)
                # Look ahead to see if next few lines have date pattern
                has_date_nearby = False
                for j in range(i, min(i + 3, len(lines))):
                    if re.search(
                        r"\d{2}/\d{4}\s*[-–]\s*(\d{2}/\d{4}|present)", lines[j].lower()
                    ):
                        has_date_nearby = True
                        break

                if has_date_nearby and (
                    re.search(r",\s*[A-Z][a-z]+", line)
                    or line.isupper()
                    or len(line_stripped) < 60
                ):
                    # Save previous job
                    if current_project and current_job:
                        current_job["projects"].append(current_project)
                        current_project = None
                    if current_job:
                        experiences.append(current_job)

                    # Extract location from company line
                    location_match = re.search(
                        r",\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)", line
                    )
                    location = location_match.group(1) if location_match else ""

                    current_job = {
                        "company": line_stripped,
                        "location": location,
                        "role": "",
                        "duration": "",
                        "start_date": "",
                        "end_date": "",
                        "total_duration_months": 0,
                        "projects": [],
                    }
                    continue

                # Detect job role/title
                if (
                    current_job
                    and not current_job["role"]
                    and re.search(
                        r"(engineer|developer|manager|analyst|designer|architect|consultant|specialist|lead|senior|junior|software|frontend|backend)",
                        line_lower,
                    )
                ):
                    # Make sure it's not a project description
                    if not re.search(
                        r"(developed|built|implemented|created|designed|integrated|engineered|architected)",
                        line_lower,
                    ):
                        current_job["role"] = line_stripped
                        continue

                # Detect duration with dates
                date_match = re.search(
                    r"(\d{2})/(\d{4})\s*[-–]\s*(?:(\d{2})/(\d{4})|(present|current))",
                    line_lower,
                )
                if current_job and date_match:
                    current_job["duration"] = date_match.group(0)

                    # Parse start and end dates
                    start_month, start_year = date_match.group(1), date_match.group(2)
                    current_job["start_date"] = f"{start_month}/{start_year}"

                    if date_match.group(5):  # present/current
                        current_job["end_date"] = "Present"
                        # Calculate duration to present
                        from datetime import datetime

                        start = datetime(int(start_year), int(start_month), 1)
                        now = datetime.now()
                        months = (now.year - start.year) * 12 + (
                            now.month - start.month
                        )
                        current_job["total_duration_months"] = months
                    else:
                        end_month, end_year = date_match.group(3), date_match.group(4)
                        current_job["end_date"] = f"{end_month}/{end_year}"
                        # Calculate duration
                        months = (int(end_year) - int(start_year)) * 12 + (
                            int(end_month) - int(start_month)
                        )
                        current_job["total_duration_months"] = months

                    current_job["duration_formatted"] = self._format_duration(
                        current_job["total_duration_months"]
                    )
                    continue

                # Detect project name (usually starts with company name in parentheses or is a header)
                project_match = re.search(
                    r"^\s*([A-Z][^(]+?)(?:\s*\(([^)]+)\))?$", line_stripped
                )
                if (
                    current_job
                    and project_match
                    and len(line_stripped) > 10
                    and len(line_stripped) < 100
                ):
                    # Check if it looks like a project header (not a sentence)
                    if not re.search(
                        r"(developed|built|implemented|created|designed|integrated|with|and|the)",
                        line_lower,
                    ):
                        # Save previous project
                        if current_project:
                            current_job["projects"].append(current_project)

                        project_name = project_match.group(1).strip()
                        project_type = (
                            project_match.group(2).strip()
                            if project_match.group(2)
                            else ""
                        )

                        current_project = {
                            "name": project_name,
                            "type": project_type,
                            "description": "",
                            "technologies": [],
                            "achievements": [],
                        }
                        continue

                # Extract technologies from parentheses (Next.js, React, SCSS, etc.)
                tech_match = re.search(r"\(([^)]+)\)$", line_stripped)
                if current_project and tech_match:
                    tech_string = tech_match.group(1)
                    # Split by common separators
                    technologies = [
                        t.strip() for t in re.split(r"[,;/]", tech_string) if t.strip()
                    ]
                    current_project["technologies"].extend(technologies)

                    # Also add the description (text before the parentheses)
                    desc_text = line_stripped[: line_stripped.rfind("(")].strip()
                    if desc_text and len(desc_text) > 10:
                        current_project["description"] += desc_text + " "
                    continue

                # Detect project description/achievements
                if current_project and line_stripped and len(line_stripped) > 20:
                    # If it starts with a bullet or dash, it's likely a description
                    clean_line = re.sub(r"^[-•●▪▸◦]\s*", "", line_stripped)
                    if clean_line != line_stripped or re.search(
                        r"(developed|built|implemented|created|designed|integrated|engineered|architected|delivered|optimized)",
                        line_lower,
                    ):
                        current_project["achievements"].append(clean_line)

        # Save last project and job
        if current_project and current_job:
            current_job["projects"].append(current_project)
        if current_job:
            experiences.append(current_job)

        return experiences

    def _format_duration(self, months: int) -> str:
        """Format duration in months to human-readable format"""
        if months < 12:
            return f"{months} month{'s' if months != 1 else ''}"
        years = months // 12
        remaining_months = months % 12
        if remaining_months == 0:
            return f"{years} year{'s' if years != 1 else ''}"
        return f"{years} year{'s' if years != 1 else ''} {remaining_months} month{'s' if remaining_months != 1 else ''}"

    def _extract_certifications(self, text: str) -> list[str]:
        """Extract certifications"""
        certifications = []
        lines = text.split("\n")

        in_cert_section = False
        for line in lines:
            line_lower = line.lower()

            if (
                re.search(
                    r"\b(certification|certificate|licensed|credential)\b", line_lower
                )
                and len(line.strip()) < 40
            ):
                in_cert_section = True
                continue

            if (
                in_cert_section
                and re.search(
                    r"\b(education|skills|experience|languages)\b", line_lower
                )
                and len(line.strip()) < 30
            ):
                break

            if in_cert_section and line.strip() and len(line.strip()) > 5:
                certifications.append(line.strip())

        return certifications

    def _extract_hobbies(self, text: str) -> list[str]:
        """Extract hobbies and interests"""
        hobbies = []
        lines = text.split("\n")

        for i, line in enumerate(lines):
            line_lower = line.lower()

            if (
                re.search(r"\b(hobbies|interests|activities)\b", line_lower)
                and len(line.strip()) < 30
            ):
                # Get next few lines
                for j in range(i + 1, min(i + 5, len(lines))):
                    next_line = lines[j].strip()
                    if next_line and not re.search(
                        r"\b(education|experience|skills)\b", next_line.lower()
                    ):
                        # Split by common separators
                        hobby_items = re.split(r"[,;|]", next_line)
                        hobbies.extend([h.strip() for h in hobby_items if h.strip()])
                break

        return hobbies

    def _extract_languages(self, text: str) -> list[str]:
        """Extract spoken languages"""
        languages = []
        lines = text.split("\n")

        for i, line in enumerate(lines):
            line_lower = line.lower()

            if (
                re.search(r"\b(languages?|linguistic)\b", line_lower)
                and len(line.strip()) < 30
            ):
                # Get next few lines
                for j in range(i + 1, min(i + 3, len(lines))):
                    next_line = lines[j].strip()
                    if next_line and not re.search(
                        r"\b(hobbies|education|skills)\b", next_line.lower()
                    ):
                        # Split by common separators
                        lang_items = re.split(r"[,;|]", next_line)
                        languages.extend([l.strip() for l in lang_items if l.strip()])
                break

        return languages

    def _extract_achievements(self, text: str) -> list[str]:
        """Extract achievements and awards"""
        achievements = []

        # Look for achievement indicators
        achievement_patterns = [
            r"top\s+\d+\s*%",
            r"ranked\s+\d+",
            r"award",
            r"achievement",
            r"recognition",
            r"winner",
            r"first place",
            r"percentile",
        ]

        lines = text.split("\n")
        for line in lines:
            line_lower = line.lower()
            for pattern in achievement_patterns:
                if re.search(pattern, line_lower):
                    achievements.append(line.strip())
                    break

        return achievements

    def _extract_summary(self, text: str) -> str:
        """Extract summary/profile section"""
        lines = text.split("\n")
        summary = ""

        in_summary = False
        for i, line in enumerate(lines):
            line_lower = line.lower()

            if (
                re.search(r"\b(summary|profile|objective|about)\b", line_lower)
                and len(line.strip()) < 30
            ):
                in_summary = True
                continue

            if in_summary:
                if (
                    re.search(r"\b(experience|education|skills|work)\b", line_lower)
                    and len(line.strip()) < 30
                ):
                    break
                if line.strip():
                    summary += line.strip() + " "

        return summary.strip()

    def _extract_skills(self, text: str) -> dict[str, list[str]]:
        """
        UNIVERSAL skill extraction for ANY profession
        Tech, Non-Tech, Creative, Medical, Education, Business, etc.
        """
        text_lower = text.lower()

        skills: dict[str, list[str]] = {
            # Technical Skills (IT/Software)
            "technical_programming": [],
            "technical_tools": [],
            # Business & Management
            "business_management": [],
            "financial_accounting": [],
            # Creative & Design
            "creative_design": [],
            "media_content": [],
            # Medical & Healthcare
            "medical_clinical": [],
            "healthcare_admin": [],
            # Education & Training
            "teaching_training": [],
            "academic_research": [],
            # Sales & Marketing
            "sales_marketing": [],
            "customer_service": [],
            # Manufacturing & Operations
            "manufacturing_operations": [],
            "quality_control": [],
            # Hospitality & Tourism
            "hospitality_food": [],
            "travel_tourism": [],
            # Legal & Compliance
            "legal_regulatory": [],
            # HR & Recruitment
            "hr_recruitment": [],
            # Fashion & Beauty
            "fashion_styling": [],
            "beauty_cosmetology": [],
            # Construction & Engineering
            "construction_civil": [],
            "mechanical_electrical": [],
            # Soft Skills (Universal)
            "soft_skills": [],
            # Languages
            "languages_spoken": [],
            # Certifications & Tools (General)
            "tools_software": [],
            "certifications": [],
        }

        # === TECHNICAL / IT SKILLS ===
        tech_programming = [
            "python",
            "javascript",
            "java",
            "c\\+\\+",
            "c#",
            "ruby",
            "php",
            "swift",
            "kotlin",
            "go",
            "rust",
            "typescript",
            "react",
            "angular",
            "vue",
            "node",
            "django",
            "flask",
            "spring",
            "sql",
            "mongodb",
            "aws",
            "azure",
            "docker",
            "kubernetes",
            "git",
            "agile",
            "devops",
            "machine learning",
            "ai",
            "data science",
        ]
        for skill in tech_programming:
            if re.search(r"\b" + skill.replace("+", "\\+") + r"\b", text_lower):
                skills["technical_programming"].append(skill.replace("\\+", "+"))

        # === BUSINESS & MANAGEMENT ===
        business = [
            "project management",
            "strategic planning",
            "business analysis",
            "stakeholder management",
            "budgeting",
            "forecasting",
            "business development",
            "operations management",
            "process improvement",
            "change management",
            "vendor management",
            "contract negotiation",
            "pmp",
            "six sigma",
            "lean",
            "prince2",
            "scrum master",
            "product management",
        ]
        for skill in business:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["business_management"].append(skill.title())

        # === FINANCIAL & ACCOUNTING ===
        finance = [
            "accounting",
            "bookkeeping",
            "financial reporting",
            "tax",
            "audit",
            "payroll",
            "accounts payable",
            "accounts receivable",
            "quickbooks",
            "sap",
            "oracle financials",
            "financial analysis",
            "budgeting",
            "forecasting",
            "cpa",
            "cfa",
            "excel",
            "tally",
            "gaap",
            "ifrs",
            "financial modeling",
            "valuation",
        ]
        for skill in finance:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["financial_accounting"].append(skill.title())

        # === CREATIVE & DESIGN ===
        creative = [
            "adobe photoshop",
            "illustrator",
            "indesign",
            "after effects",
            "premiere pro",
            "figma",
            "sketch",
            "canva",
            "graphic design",
            "ui/ux",
            "web design",
            "logo design",
            "branding",
            "typography",
            "video editing",
            "motion graphics",
            "3d modeling",
            "blender",
            "maya",
            "autocad",
            "coreldraw",
            "final cut pro",
        ]
        for skill in creative:
            if re.search(r"\b" + skill.replace("/", "\\/") + r"\b", text_lower):
                skills["creative_design"].append(skill.title())

        # === MEDICAL & HEALTHCARE ===
        medical = [
            "patient care",
            "diagnosis",
            "treatment planning",
            "surgery",
            "emergency care",
            "icu",
            "cardiology",
            "pediatrics",
            "oncology",
            "radiology",
            "nursing",
            "phlebotomy",
            "ehr",
            "epic",
            "cerner",
            "medical coding",
            "icd-10",
            "cpt",
            "hipaa",
            "clinical research",
            "pharmacology",
            "anatomy",
            "physiology",
        ]
        for skill in medical:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["medical_clinical"].append(skill.title())

        # === EDUCATION & TRAINING ===
        education = [
            "teaching",
            "curriculum development",
            "lesson planning",
            "classroom management",
            "student assessment",
            "tutoring",
            "training",
            "instructional design",
            "e-learning",
            "lms",
            "moodle",
            "blackboard",
            "zoom",
            "google classroom",
            "child development",
            "special education",
            "tesol",
            "tefl",
        ]
        for skill in education:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["teaching_training"].append(skill.title())

        # === SALES & MARKETING ===
        sales_marketing = [
            "sales",
            "business development",
            "lead generation",
            "cold calling",
            "crm",
            "salesforce",
            "hubspot",
            "digital marketing",
            "seo",
            "sem",
            "social media marketing",
            "content marketing",
            "email marketing",
            "ppc",
            "google ads",
            "facebook ads",
            "marketing automation",
            "brand management",
            "market research",
            "copywriting",
        ]
        for skill in sales_marketing:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["sales_marketing"].append(skill.title())

        # === CUSTOMER SERVICE ===
        customer_service = [
            "customer service",
            "customer support",
            "technical support",
            "help desk",
            "call center",
            "ticketing",
            "zendesk",
            "freshdesk",
            "complaint resolution",
            "chat support",
            "phone support",
            "email support",
            "customer satisfaction",
        ]
        for skill in customer_service:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["customer_service"].append(skill.title())

        # === MANUFACTURING & OPERATIONS ===
        manufacturing = [
            "manufacturing",
            "production",
            "assembly",
            "quality control",
            "quality assurance",
            "iso",
            "lean manufacturing",
            "continuous improvement",
            "supply chain",
            "inventory management",
            "logistics",
            "warehouse",
            "forklift",
            "cnc",
            "welding",
            "plc",
            "automation",
            "maintenance",
        ]
        for skill in manufacturing:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["manufacturing_operations"].append(skill.title())

        # === HOSPITALITY & FOOD ===
        hospitality = [
            "hotel management",
            "front desk",
            "concierge",
            "housekeeping",
            "room service",
            "food service",
            "cooking",
            "chef",
            "baking",
            "pastry",
            "culinary",
            "restaurant management",
            "menu planning",
            "food safety",
            "haccp",
            "bartending",
            "sommelier",
            "catering",
            "banquet",
        ]
        for skill in hospitality:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["hospitality_food"].append(skill.title())

        # === TRAVEL & TOURISM ===
        travel = [
            "travel planning",
            "tour guide",
            "ticketing",
            "gds",
            "amadeus",
            "sabre",
            "tourism",
            "hospitality",
            "visa processing",
            "itinerary planning",
            "destination knowledge",
            "customer relations",
        ]
        for skill in travel:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["travel_tourism"].append(skill.title())

        # === LEGAL ===
        legal = [
            "legal research",
            "contract law",
            "litigation",
            "compliance",
            "corporate law",
            "intellectual property",
            "labor law",
            "legal writing",
            "case management",
            "mediation",
            "arbitration",
            "due diligence",
            "regulatory compliance",
        ]
        for skill in legal:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["legal_regulatory"].append(skill.title())

        # === HR & RECRUITMENT ===
        hr = [
            "recruitment",
            "talent acquisition",
            "onboarding",
            "employee relations",
            "performance management",
            "hris",
            "workday",
            "bamboohr",
            "compensation",
            "benefits administration",
            "training and development",
            "hr policy",
            "labor relations",
            "interviewing",
            "sourcing",
            "linkedin recruiter",
        ]
        for skill in hr:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["hr_recruitment"].append(skill.title())

        # === FASHION & BEAUTY ===
        fashion = [
            "fashion design",
            "pattern making",
            "sewing",
            "tailoring",
            "merchandising",
            "fashion styling",
            "trend analysis",
            "textile",
            "garment construction",
            "fashion illustration",
            "makeup",
            "cosmetology",
            "hair styling",
            "manicure",
            "pedicure",
            "skincare",
            "beauty consultation",
            "bridal makeup",
        ]
        for skill in fashion:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["fashion_styling"].append(skill.title())

        # === CONSTRUCTION & CIVIL ===
        construction = [
            "construction",
            "civil engineering",
            "project coordination",
            "site management",
            "autocad",
            "revit",
            "structural design",
            "surveying",
            "estimation",
            "blueprints",
            "building codes",
            "safety compliance",
            "concrete",
            "steel",
        ]
        for skill in construction:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["construction_civil"].append(skill.title())

        # === MECHANICAL & ELECTRICAL ===
        mechanical = [
            "mechanical engineering",
            "electrical engineering",
            "hvac",
            "plumbing",
            "electronics",
            "circuit design",
            "cad",
            "solidworks",
            "matlab",
            "machinery",
            "troubleshooting",
            "preventive maintenance",
            "robotics",
        ]
        for skill in mechanical:
            if re.search(r"\b" + skill + r"\b", text_lower):
                skills["mechanical_electrical"].append(skill.title())

        # === SOFT SKILLS (Universal) ===
        soft = [
            "leadership",
            "communication",
            "teamwork",
            "problem solving",
            "analytical",
            "collaboration",
            "time management",
            "critical thinking",
            "adaptability",
            "creativity",
            "attention to detail",
            "multitasking",
            "decision making",
            "conflict resolution",
            "negotiation",
            "presentation",
            "interpersonal",
            "organizational",
            "self-motivated",
            "flexible",
            "reliable",
        ]
        for s in soft:
            if re.search(r"\b" + s + r"\b", text_lower):
                skills["soft_skills"].append(s.title())

        # === TOOLS & SOFTWARE (General) ===
        tools = [
            "microsoft office",
            "excel",
            "word",
            "powerpoint",
            "outlook",
            "teams",
            "google workspace",
            "sheets",
            "docs",
            "slides",
            "slack",
            "zoom",
            "trello",
            "asana",
            "jira",
            "confluence",
            "notion",
            "evernote",
        ]
        for tool in tools:
            if re.search(r"\b" + tool + r"\b", text_lower):
                skills["tools_software"].append(tool.title())

        # Remove duplicates and sort
        for category in skills:
            skills[category] = sorted(list(set(skills[category])))

        return skills


# Create global instance
ats_analyzer = ATSAnalyzer()
