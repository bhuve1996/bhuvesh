"""
ATS (Applicant Tracking System) Analysis Engine
This analyzes resumes for ATS compatibility and provides scoring
"""

import re
from typing import Dict, List, Any, Tuple
from collections import Counter

class ATSAnalyzer:
    """
    Advanced ATS resume analyzer
    Analyzes resumes for keyword matching, format compliance, and ATS compatibility
    """
    
    def __init__(self):
        """
        Initialize the ATS analyzer with job profiles and scoring weights
        """
        # Scoring weights (must add up to 100)
        self.weights = {
            'keyword_matching': 40,    # 40% - Most important
            'format_compliance': 25,   # 25% - ATS-friendly formatting
            'content_quality': 20,     # 20% - Content structure and quality
            'ats_compatibility': 15    # 15% - General ATS compatibility
        }
        
        # Job profiles with keywords and requirements
        self.job_profiles = {
            'software_engineer': {
                'name': 'Software Engineer',
                'keywords': [
                    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
                    'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask',
                    'spring boot', 'asp.net', 'laravel', 'ruby on rails',
                    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
                    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
                    'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'devops'
                ],
                'skills': [
                    'programming', 'problem solving', 'algorithm design', 'data structures',
                    'software architecture', 'code review', 'testing', 'debugging',
                    'version control', 'ci/cd', 'cloud computing', 'database design'
                ],
                'experience_keywords': [
                    '2+ years', '3+ years', '5+ years', 'senior level', 'lead developer',
                    'full-stack development', 'backend development', 'frontend development'
                ]
            },
            'data_scientist': {
                'name': 'Data Scientist',
                'keywords': [
                    'python', 'r', 'sql', 'pandas', 'numpy', 'scikit-learn', 'tensorflow',
                    'pytorch', 'keras', 'jupyter', 'matplotlib', 'seaborn', 'plotly',
                    'apache spark', 'hadoop', 'kafka', 'airflow', 'mlflow',
                    'machine learning', 'deep learning', 'nlp', 'computer vision',
                    'statistics', 'probability', 'linear algebra', 'calculus',
                    'a/b testing', 'feature engineering', 'model deployment'
                ],
                'skills': [
                    'statistical analysis', 'machine learning', 'data visualization',
                    'data mining', 'predictive modeling', 'experimental design',
                    'business intelligence', 'data storytelling', 'critical thinking'
                ],
                'experience_keywords': [
                    '2+ years', '3+ years', '5+ years', 'phd', 'research experience',
                    'industry experience', 'academic background'
                ]
            },
            'marketing_manager': {
                'name': 'Marketing Manager',
                'keywords': [
                    'digital marketing', 'seo', 'sem', 'ppc', 'google ads', 'facebook ads',
                    'content marketing', 'social media marketing', 'email marketing',
                    'marketing automation', 'hubspot', 'salesforce', 'google analytics',
                    'adobe creative suite', 'canva', 'figma', 'wordpress',
                    'campaign management', 'brand management', 'market research',
                    'customer acquisition', 'lead generation', 'conversion optimization'
                ],
                'skills': [
                    'strategic planning', 'campaign management', 'brand development',
                    'market research', 'data analysis', 'creative direction',
                    'project management', 'team leadership', 'communication'
                ],
                'experience_keywords': [
                    '3+ years', '5+ years', 'management experience', 'team leadership',
                    'campaign management', 'brand management'
                ]
            }
        }
    
    def analyze_resume(self, parsed_content: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main analysis method that scores a resume
        
        Args:
            parsed_content: Parsed resume content from file parser
            
        Returns:
            Complete analysis results with score and recommendations
        """
        text = parsed_content.get('text', '').lower()
        word_count = parsed_content.get('word_count', 0)
        
        # Step 1: Detect job type
        job_type = self._detect_job_type(text)
        job_profile = self.job_profiles.get(job_type, self.job_profiles['software_engineer'])
        
        # Step 2: Analyze different aspects
        keyword_analysis = self._analyze_keywords(text, job_profile)
        format_analysis = self._analyze_format(parsed_content)
        content_analysis = self._analyze_content(text, word_count)
        ats_analysis = self._analyze_ats_compatibility(parsed_content)
        
        # Step 3: Calculate overall score
        overall_score = self._calculate_overall_score(
            keyword_analysis, format_analysis, content_analysis, ats_analysis
        )
        
        # Step 4: Generate recommendations
        recommendations = self._generate_recommendations(
            keyword_analysis, format_analysis, content_analysis, ats_analysis, job_profile
        )
        
        return {
            'job_type': job_profile['name'],
            'ats_score': overall_score,
            'keyword_matches': keyword_analysis['matched_keywords'],
            'missing_keywords': keyword_analysis['missing_keywords'],
            'suggestions': recommendations['suggestions'],
            'strengths': recommendations['strengths'],
            'weaknesses': recommendations['weaknesses'],
            'keyword_density': keyword_analysis['keyword_density'],
            'word_count': word_count,
            'character_count': parsed_content.get('character_count', 0),
            'detailed_analysis': {
                'keyword_score': keyword_analysis['score'],
                'format_score': format_analysis['score'],
                'content_score': content_analysis['score'],
                'ats_score': ats_analysis['score']
            }
        }
    
    def _detect_job_type(self, text: str) -> str:
        """
        Detect the most likely job type based on resume content
        """
        job_scores = {}
        
        for job_id, profile in self.job_profiles.items():
            score = 0
            
            # Check for job title mentions
            if profile['name'].lower() in text:
                score += 10
            
            # Check for keyword matches
            for keyword in profile['keywords']:
                if keyword in text:
                    score += 2
            
            # Check for skill matches
            for skill in profile['skills']:
                if skill in text:
                    score += 1
            
            job_scores[job_id] = score
        
        # Return job type with highest score
        return max(job_scores, key=job_scores.get)
    
    def _analyze_keywords(self, text: str, job_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze keyword matching and density
        """
        keywords = job_profile['keywords']
        matched_keywords = []
        missing_keywords = []
        keyword_density = {}
        
        # Check for keyword matches
        for keyword in keywords:
            if keyword in text:
                matched_keywords.append(keyword)
                # Calculate keyword density
                density = (text.count(keyword) / len(text.split())) * 100
                keyword_density[keyword] = round(density, 2)
            else:
                missing_keywords.append(keyword)
        
        # Calculate keyword score (0-100)
        keyword_score = (len(matched_keywords) / len(keywords)) * 100
        
        return {
            'matched_keywords': matched_keywords,
            'missing_keywords': missing_keywords[:10],  # Top 10 missing
            'keyword_density': keyword_density,
            'score': min(keyword_score, 100)
        }
    
    def _analyze_format(self, parsed_content: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze resume format compliance
        """
        text = parsed_content.get('text', '').lower()
        word_count = parsed_content.get('word_count', 0)
        score = 0
        
        # Check for required sections
        required_sections = ['experience', 'education', 'skills']
        found_sections = 0
        
        for section in required_sections:
            if section in text:
                found_sections += 1
        
        # Section score (0-40 points)
        section_score = (found_sections / len(required_sections)) * 40
        score += section_score
        
        # Word count score (0-30 points)
        if 400 <= word_count <= 800:
            score += 30  # Optimal length
        elif 300 <= word_count <= 1000:
            score += 20  # Good length
        elif 200 <= word_count <= 1200:
            score += 10  # Acceptable length
        
        # Contact info score (0-30 points)
        contact_keywords = ['email', 'phone', 'linkedin', 'github']
        contact_found = sum(1 for keyword in contact_keywords if keyword in text)
        contact_score = (contact_found / len(contact_keywords)) * 30
        score += contact_score
        
        return {
            'score': min(score, 100),
            'sections_found': found_sections,
            'word_count': word_count,
            'contact_info_score': contact_score
        }
    
    def _analyze_content(self, text: str, word_count: int) -> Dict[str, Any]:
        """
        Analyze content quality and structure
        """
        score = 0
        
        # Check for quantifiable achievements (0-40 points)
        numbers = re.findall(r'\d+', text)
        if len(numbers) >= 3:
            score += 40
        elif len(numbers) >= 1:
            score += 20
        
        # Check for action verbs (0-30 points)
        action_verbs = [
            'developed', 'implemented', 'designed', 'created', 'built', 'managed',
            'led', 'increased', 'improved', 'optimized', 'delivered', 'achieved'
        ]
        verb_count = sum(1 for verb in action_verbs if verb in text)
        verb_score = min((verb_count / len(action_verbs)) * 30, 30)
        score += verb_score
        
        # Check for professional language (0-30 points)
        professional_terms = [
            'collaborated', 'strategic', 'innovative', 'efficient', 'scalable',
            'robust', 'comprehensive', 'proven', 'expertise', 'proficiency'
        ]
        professional_count = sum(1 for term in professional_terms if term in text)
        professional_score = min((professional_count / len(professional_terms)) * 30, 30)
        score += professional_score
        
        return {
            'score': min(score, 100),
            'numbers_found': len(numbers),
            'action_verbs': verb_count,
            'professional_terms': professional_count
        }
    
    def _analyze_ats_compatibility(self, parsed_content: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze ATS compatibility factors
        """
        text = parsed_content.get('text', '')
        score = 0
        
        # Check for ATS-friendly formatting (0-50 points)
        # No special characters that might confuse ATS
        special_chars = ['@', '#', '$', '%', '^', '&', '*', '(', ')', '[', ']', '{', '}']
        special_char_count = sum(text.count(char) for char in special_chars)
        
        if special_char_count < 10:
            score += 50
        elif special_char_count < 20:
            score += 30
        else:
            score += 10
        
        # Check for standard section headers (0-30 points)
        standard_headers = [
            'experience', 'work history', 'employment',
            'education', 'academic background',
            'skills', 'technical skills', 'core competencies'
        ]
        header_count = sum(1 for header in standard_headers if header.lower() in text.lower())
        header_score = min((header_count / len(standard_headers)) * 30, 30)
        score += header_score
        
        # Check for consistent formatting (0-20 points)
        # Look for consistent bullet points or numbering
        bullet_points = text.count('•') + text.count('-') + text.count('*')
        if bullet_points >= 5:
            score += 20
        elif bullet_points >= 3:
            score += 10
        
        return {
            'score': min(score, 100),
            'special_char_count': special_char_count,
            'standard_headers': header_count,
            'bullet_points': bullet_points
        }
    
    def _calculate_overall_score(self, keyword_analysis: Dict, format_analysis: Dict, 
                                content_analysis: Dict, ats_analysis: Dict) -> int:
        """
        Calculate weighted overall ATS score
        """
        weighted_score = (
            keyword_analysis['score'] * self.weights['keyword_matching'] +
            format_analysis['score'] * self.weights['format_compliance'] +
            content_analysis['score'] * self.weights['content_quality'] +
            ats_analysis['score'] * self.weights['ats_compatibility']
        ) / 100
        
        return round(weighted_score)
    
    def _generate_recommendations(self, keyword_analysis: Dict, format_analysis: Dict,
                                 content_analysis: Dict, ats_analysis: Dict, 
                                 job_profile: Dict[str, Any]) -> Dict[str, List[str]]:
        """
        Generate actionable recommendations based on analysis
        """
        suggestions = []
        strengths = []
        weaknesses = []
        
        # Keyword recommendations
        if keyword_analysis['score'] < 70:
            suggestions.append(f"Add more {job_profile['name']} keywords: {', '.join(keyword_analysis['missing_keywords'][:5])}")
            weaknesses.append("Low keyword alignment with industry requirements")
        else:
            strengths.append("Good keyword coverage for the role")
        
        # Format recommendations
        if format_analysis['score'] < 70:
            suggestions.append("Improve resume structure with clear sections (Experience, Education, Skills)")
            weaknesses.append("Missing important resume sections")
        else:
            strengths.append("Well-structured resume format")
        
        # Content recommendations
        if content_analysis['score'] < 60:
            suggestions.append("Add more quantifiable achievements and metrics")
            weaknesses.append("Lack of measurable accomplishments")
        else:
            strengths.append("Strong content with quantifiable achievements")
        
        # ATS recommendations
        if ats_analysis['score'] < 70:
            suggestions.append("Simplify formatting for better ATS compatibility")
            weaknesses.append("Format may not be ATS-friendly")
        else:
            strengths.append("ATS-compatible formatting")
        
        # Word count recommendations
        word_count = format_analysis.get('word_count', 0)
        if word_count < 400:
            suggestions.append("Expand resume with more detailed descriptions")
        elif word_count > 800:
            suggestions.append("Consider condensing resume to focus on most relevant information")
        
        return {
            'suggestions': suggestions,
            'strengths': strengths,
            'weaknesses': weaknesses
        }

# Create global instance
ats_analyzer = ATSAnalyzer()
