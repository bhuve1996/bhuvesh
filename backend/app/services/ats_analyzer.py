"""
Advanced ATS (Applicant Tracking System) Analysis Engine
Uses semantic embeddings for concept matching, not just keywords
"""

import re
from typing import Dict, List, Any, Tuple, Optional
from collections import Counter
import numpy as np

# Import job detector
from app.services.job_detector import job_detector

# Try to import sentence-transformers, fall back to basic matching if not available
try:
    from sentence_transformers import SentenceTransformer, util
    EMBEDDINGS_AVAILABLE = True
except ImportError:
    EMBEDDINGS_AVAILABLE = False
    print("Warning: sentence-transformers not available. Using keyword-only matching.")

class ATSAnalyzer:
    """
    Production-grade ATS analyzer with semantic matching
    """
    
    def __init__(self):
        """Initialize with embeddings model if available"""
        # Load sentence transformer model for semantic matching
        if EMBEDDINGS_AVAILABLE:
            try:
                self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Lightweight, fast model
                self.use_embeddings = True
            except:
                self.use_embeddings = False
        else:
            self.use_embeddings = False
        
        # Scoring weights
        self.weights = {
            'keyword_matching': 35,      # Reduced from 40 since we have semantic now
            'semantic_matching': 15,     # NEW: Concept/semantic matching
            'format_compliance': 20,     # Format and structure
            'content_quality': 20,       # Content quality
            'ats_compatibility': 10      # ATS-friendly formatting
        }
    
    def analyze_resume_with_job_description(
        self, 
        parsed_resume: Dict[str, Any], 
        job_description: str
    ) -> Dict[str, Any]:
        """
        Complete ATS analysis comparing resume with job description
        
        Args:
            parsed_resume: Parsed resume from file_parser
            job_description: Job description text from user
            
        Returns:
            Comprehensive analysis with scores and recommendations
        """
        resume_text = parsed_resume.get('text', '').lower()
        jd_text = job_description.lower()
        
        # Extract keywords from job description
        jd_keywords = self._extract_keywords(jd_text)
        jd_requirements = self._extract_requirements(jd_text)
        
        # Perform all analyses
        keyword_analysis = self._analyze_keywords_vs_jd(resume_text, jd_keywords)
        semantic_analysis = self._analyze_semantic_match(resume_text, jd_text)
        format_analysis = self._analyze_format(parsed_resume)
        content_analysis = self._analyze_content(resume_text, parsed_resume.get('word_count', 0))
        ats_analysis = self._analyze_ats_compatibility(parsed_resume)
        
        # Calculate overall score
        overall_score = self._calculate_overall_score(
            keyword_analysis, 
            semantic_analysis,
            format_analysis, 
            content_analysis, 
            ats_analysis
        )
        
        # Detect job type using AI
        detected_job, job_confidence = job_detector.detect_job_type(resume_text)
        
        # Generate recommendations
        recommendations = self._generate_recommendations_with_jd(
            keyword_analysis,
            semantic_analysis,
            format_analysis,
            content_analysis,
            ats_analysis,
            jd_requirements
        )
        
        return {
            'ats_score': overall_score,
            'match_category': self._get_match_category(overall_score),
            'detected_job_type': detected_job,
            'job_detection_confidence': round(job_confidence, 2),
            'keyword_matches': keyword_analysis['matched_keywords'],
            'missing_keywords': keyword_analysis['missing_keywords'],
            'semantic_similarity': semantic_analysis['similarity_score'],
            'suggestions': recommendations['suggestions'],
            'strengths': recommendations['strengths'],
            'weaknesses': recommendations['weaknesses'],
            'formatting_issues': parsed_resume.get('formatting_analysis', {}).get('formatting_issues', []),
            'ats_friendly': parsed_resume.get('formatting_analysis', {}).get('ats_friendly', True),
            'word_count': parsed_resume.get('word_count', 0),
            'detailed_scores': {
                'keyword_score': round(keyword_analysis['score'], 1),
                'semantic_score': round(semantic_analysis['score'], 1),
                'format_score': round(format_analysis['score'], 1),
                'content_score': round(content_analysis['score'], 1),
                'ats_score': round(ats_analysis['score'], 1)
            },
            'requirements_met': jd_requirements
        }
    
    def _extract_keywords(self, text: str) -> List[str]:
        """
        Extract important keywords from job description
        """
        # Remove common words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
                     'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
                     'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
                     'can', 'could', 'may', 'might', 'must', 'shall'}
        
        # Extract words and phrases
        words = re.findall(r'\b[a-z]+\b', text)
        
        # Filter and count
        filtered_words = [w for w in words if w not in stop_words and len(w) > 2]
        word_freq = Counter(filtered_words)
        
        # Get top keywords (appearing more than once)
        keywords = [word for word, freq in word_freq.most_common(30) if freq > 1]
        
        # Also extract common tech/skill terms
        tech_patterns = [
            r'\b\w*(?:javascript|python|java|c\+\+|sql|aws|azure|docker|kubernetes)\w*\b',
            r'\b\d\+\s*years?\b',
            r'\b(?:bachelor|master|phd|degree)\b'
        ]
        
        for pattern in tech_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            keywords.extend([m.lower() for m in matches])
        
        return list(set(keywords))[:50]  # Return unique, limit to 50
    
    def _extract_requirements(self, jd_text: str) -> Dict[str, List[str]]:
        """
        Extract structured requirements from job description
        """
        requirements = {
            'must_have': [],
            'nice_to_have': [],
            'experience': [],
            'education': []
        }
        
        # Extract experience requirements
        exp_patterns = [
            r'(\d+)\+?\s*years?.*?experience',
            r'experience.*?(\d+)\+?\s*years?',
        ]
        for pattern in exp_patterns:
            matches = re.findall(pattern, jd_text, re.IGNORECASE)
            if matches:
                requirements['experience'].extend(matches)
        
        # Extract education requirements
        edu_patterns = [
            r'\b(bachelor|master|phd|degree).*?(computer science|engineering|business|mathematics|statistics)\b',
            r'\b(computer science|engineering|business|mathematics|statistics).*?(bachelor|master|phd|degree)\b'
        ]
        for pattern in edu_patterns:
            matches = re.findall(pattern, jd_text, re.IGNORECASE)
            if matches:
                requirements['education'].extend([' '.join(m) for m in matches])
        
        return requirements
    
    def _analyze_keywords_vs_jd(self, resume_text: str, jd_keywords: List[str]) -> Dict[str, Any]:
        """
        Analyze keyword matching between resume and JD
        """
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
            'matched_keywords': matched_keywords[:20],  # Top 20
            'missing_keywords': missing_keywords[:10],  # Top 10
            'match_percentage': round((len(matched_keywords) / max(len(jd_keywords), 1)) * 100, 1),
            'score': min(score, 100)
        }
    
    def _analyze_semantic_match(self, resume_text: str, jd_text: str) -> Dict[str, Any]:
        """
        Analyze semantic similarity using embeddings (concept matching)
        """
        if not self.use_embeddings:
            # Fallback to basic matching
            return {
                'similarity_score': 0,
                'score': 50,  # Neutral score
                'method': 'embeddings_unavailable'
            }
        
        try:
            # Split into sentences for better matching
            resume_sentences = [s.strip() for s in resume_text.split('.') if len(s.strip()) > 20][:10]
            jd_sentences = [s.strip() for s in jd_text.split('.') if len(s.strip()) > 20][:10]
            
            if not resume_sentences or not jd_sentences:
                return {'similarity_score': 0, 'score': 50, 'method': 'insufficient_text'}
            
            # Encode sentences
            resume_embeddings = self.model.encode(resume_sentences, convert_to_tensor=True)
            jd_embeddings = self.model.encode(jd_sentences, convert_to_tensor=True)
            
            # Calculate cosine similarity
            similarities = util.cos_sim(resume_embeddings, jd_embeddings)
            
            # Get max similarity for each resume sentence
            max_similarities = similarities.max(dim=1)[0]
            avg_similarity = max_similarities.mean().item()
            
            # Convert to score (0-100)
            score = avg_similarity * 100
            
            return {
                'similarity_score': round(avg_similarity, 3),
                'score': round(score, 1),
                'method': 'sentence_transformers'
            }
            
        except Exception as e:
            print(f"Error in semantic analysis: {e}")
            return {
                'similarity_score': 0,
                'score': 50,
                'method': 'error'
            }
    
    def _analyze_format(self, parsed_resume: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze resume format and structure
        """
        text = parsed_resume.get('text', '').lower()
        word_count = parsed_resume.get('word_count', 0)
        score = 0
        
        # Check for required sections (0-40 points)
        required_sections = ['experience', 'education', 'skills']
        found_sections = sum(1 for section in required_sections if section in text)
        section_score = (found_sections / len(required_sections)) * 40
        score += section_score
        
        # Word count score (0-30 points)
        if 400 <= word_count <= 800:
            score += 30  # Optimal
        elif 300 <= word_count <= 1000:
            score += 20
        elif 200 <= word_count <= 1200:
            score += 10
        
        # Contact info score (0-30 points)
        contact_keywords = ['email', 'phone', 'linkedin', 'github']
        contact_found = sum(1 for kw in contact_keywords if kw in text)
        contact_score = (contact_found / len(contact_keywords)) * 30
        score += contact_score
        
        return {
            'score': min(score, 100),
            'sections_found': found_sections,
            'word_count': word_count
        }
    
    def _analyze_content(self, text: str, word_count: int) -> Dict[str, Any]:
        """
        Analyze content quality
        """
        score = 0
        
        # Quantifiable achievements (0-40 points)
        numbers = re.findall(r'\d+', text)
        if len(numbers) >= 5:
            score += 40
        elif len(numbers) >= 3:
            score += 25
        elif len(numbers) >= 1:
            score += 10
        
        # Action verbs (0-30 points)
        action_verbs = [
            'developed', 'implemented', 'designed', 'created', 'built', 'managed',
            'led', 'increased', 'improved', 'optimized', 'delivered', 'achieved',
            'established', 'launched', 'executed', 'collaborated', 'coordinated'
        ]
        verb_count = sum(1 for verb in action_verbs if verb in text)
        verb_score = min((verb_count / 5) * 30, 30)
        score += verb_score
        
        # Professional language (0-30 points)
        professional_terms = [
            'strategic', 'innovative', 'efficient', 'scalable', 'robust',
            'comprehensive', 'proven', 'expertise', 'proficiency', 'excellence'
        ]
        prof_count = sum(1 for term in professional_terms if term in text)
        prof_score = min((prof_count / 3) * 30, 30)
        score += prof_score
        
        return {
            'score': min(score, 100),
            'metrics_count': len(numbers),
            'action_verbs_count': verb_count
        }
    
    def _analyze_ats_compatibility(self, parsed_resume: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze ATS-friendly formatting
        """
        formatting = parsed_resume.get('formatting_analysis', {})
        score = 100  # Start with perfect score
        
        # Deduct points for issues
        images_count = formatting.get('images_count', 0)
        if images_count > 0:
            score -= 30
        
        tables_detected = formatting.get('tables_detected', False)
        if tables_detected:
            score -= 20
        
        fonts_count = formatting.get('fonts_count', 1)
        if fonts_count > 3:
            score -= 15
        
        return {
            'score': max(score, 0),
            'ats_friendly': formatting.get('ats_friendly', True),
            'issues': formatting.get('formatting_issues', [])
        }
    
    def _calculate_overall_score(self, keyword_analysis: Dict, semantic_analysis: Dict,
                                format_analysis: Dict, content_analysis: Dict, 
                                ats_analysis: Dict) -> int:
        """
        Calculate weighted overall score
        """
        weighted_score = (
            keyword_analysis['score'] * self.weights['keyword_matching'] +
            semantic_analysis['score'] * self.weights['semantic_matching'] +
            format_analysis['score'] * self.weights['format_compliance'] +
            content_analysis['score'] * self.weights['content_quality'] +
            ats_analysis['score'] * self.weights['ats_compatibility']
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
    
    def _generate_recommendations_with_jd(self, keyword_analysis: Dict, 
                                         semantic_analysis: Dict,
                                         format_analysis: Dict,
                                         content_analysis: Dict,
                                         ats_analysis: Dict,
                                         requirements: Dict) -> Dict[str, List[str]]:
        """
        Generate actionable recommendations
        """
        suggestions = []
        strengths = []
        weaknesses = []
        
        # Keyword recommendations
        if keyword_analysis['score'] < 70:
            missing = keyword_analysis['missing_keywords'][:5]
            suggestions.append(f"Add these keywords from the job description: {', '.join(missing)}")
            weaknesses.append(f"Only {keyword_analysis['match_percentage']}% keyword match")
        else:
            strengths.append(f"Strong keyword match ({keyword_analysis['match_percentage']}%)")
        
        # Semantic recommendations
        if semantic_analysis['score'] < 60:
            suggestions.append("Rephrase experiences to better align with job description concepts")
            weaknesses.append("Low semantic similarity with job requirements")
        elif semantic_analysis['score'] > 70:
            strengths.append("Good conceptual alignment with role requirements")
        
        # Format recommendations
        if format_analysis['score'] < 70:
            suggestions.append("Add clear sections: Experience, Education, Skills")
            weaknesses.append("Missing important resume sections")
        else:
            strengths.append("Well-structured resume")
        
        # Content recommendations
        if content_analysis['metrics_count'] < 3:
            suggestions.append("Add quantifiable achievements (numbers, percentages, metrics)")
            weaknesses.append("Lacks measurable accomplishments")
        else:
            strengths.append(f"Good use of metrics ({content_analysis['metrics_count']} quantifiable results)")
        
        # ATS recommendations
        if not ats_analysis['ats_friendly']:
            for issue in ats_analysis['issues']:
                suggestions.append(f"Fix: {issue}")
            weaknesses.append("Format may not be ATS-compatible")
        else:
            strengths.append("ATS-friendly formatting")
        
        # Word count
        word_count = format_analysis['word_count']
        if word_count < 400:
            suggestions.append("Expand resume with more detailed descriptions (aim for 400-800 words)")
        elif word_count > 800:
            suggestions.append("Consider condensing to 400-800 words for optimal ATS parsing")
        
        return {
            'suggestions': suggestions,
            'strengths': strengths if strengths else ["Review suggestions to improve your resume"],
            'weaknesses': weaknesses if weaknesses else ["Good overall structure"]
        }

# Create global instance
ats_analyzer = ATSAnalyzer()
