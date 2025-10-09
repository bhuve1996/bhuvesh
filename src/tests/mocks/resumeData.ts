// ============================================================================
// MOCK RESUME DATA - Test data for development and testing
// ============================================================================

import {
  AnalysisResult,
  ContactInfo,
  Education,
  SkillsFound,
  StructuredExperience,
  WorkExperience,
} from '@/shared/types/ats';

// ============================================================================
// MOCK CONTACT INFO
// ============================================================================

export const mockContactInfo: ContactInfo = {
  full_name: 'John Doe',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@email.com',
  phone: {
    raw: '+1 (555) 123-4567',
    country_code: '+1',
    number: '5551234567',
    formatted: '+1 (555) 123-4567',
  },
  linkedin: {
    url: 'https://linkedin.com/in/johndoe',
    username: 'johndoe',
  },
  github: {
    url: 'https://github.com/johndoe',
    username: 'johndoe',
  },
  portfolio: {
    url: 'https://johndoe.dev',
    platform: 'personal',
  },
  location: {
    full: 'San Francisco, CA',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    postal_code: '94105',
  },
};

// ============================================================================
// MOCK WORK EXPERIENCE
// ============================================================================

export const mockWorkExperience: WorkExperience[] = [
  {
    id: 'exp_1',
    company: 'Tech Corp',
    company_info: {
      industry: 'Technology',
      size: '1000+ employees',
      location: 'San Francisco, CA',
      website: 'https://techcorp.com',
    },
    positions: [
      {
        id: 'pos_1',
        title: 'Senior Software Engineer',
        level: 'senior',
        department: 'Engineering',
        location: 'San Francisco, CA',
        duration: '2 years 6 months',
        start_date: '01/2022',
        end_date: 'Present',
        is_current: true,
        responsibilities: [
          'Led development of microservices architecture',
          'Mentored junior developers',
          'Collaborated with cross-functional teams',
        ],
        achievements: [
          'Improved system performance by 40%',
          'Reduced deployment time by 60%',
          'Led team of 5 developers',
        ],
        skills_used: ['Python', 'React', 'AWS', 'Docker', 'Kubernetes'],
        technologies: [
          'Python',
          'React',
          'AWS',
          'Docker',
          'Kubernetes',
          'PostgreSQL',
        ],
        team_size: 8,
        reporting_to: 'Engineering Manager',
        direct_reports: 3,
      },
    ],
    total_experience_years: 2.5,
    current: true,
    start_date: '01/2022',
    end_date: 'Present',
    location: 'San Francisco, CA',
    employment_type: 'full-time',
    remote: false,
    hybrid: true,
  },
  {
    id: 'exp_2',
    company: 'StartupXYZ',
    company_info: {
      industry: 'Fintech',
      size: '50-100 employees',
      location: 'Austin, TX',
    },
    positions: [
      {
        id: 'pos_2',
        title: 'Full Stack Developer',
        level: 'mid',
        department: 'Engineering',
        location: 'Austin, TX',
        duration: '1 year 8 months',
        start_date: '05/2020',
        end_date: '12/2021',
        is_current: false,
        responsibilities: [
          'Developed web applications using React and Node.js',
          'Implemented RESTful APIs',
          'Worked with databases and cloud services',
        ],
        achievements: [
          'Built scalable payment processing system',
          'Increased user engagement by 25%',
          'Reduced API response time by 30%',
        ],
        skills_used: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
        technologies: [
          'JavaScript',
          'React',
          'Node.js',
          'MongoDB',
          'AWS',
          'Express',
        ],
        team_size: 4,
      },
    ],
    total_experience_years: 1.7,
    current: false,
    start_date: '05/2020',
    end_date: '12/2021',
    location: 'Austin, TX',
    employment_type: 'full-time',
    remote: true,
    hybrid: false,
  },
];

// ============================================================================
// MOCK EDUCATION
// ============================================================================

export const mockEducation: Education[] = [
  {
    id: 'edu_1',
    degree_full: 'Bachelor of Science in Computer Science',
    degree_type: 'Bachelor',
    degree_level: 'bachelor',
    major: 'Computer Science',
    institution: {
      name: 'University of California, Berkeley',
      type: 'university',
      location: 'Berkeley, CA',
    },
    duration: {
      raw: '2016 - 2020',
      start_date: '09/2016',
      end_date: '05/2020',
      start_year: 2016,
      end_year: 2020,
      total_years: 4,
      is_current: false,
    },
    grade: {
      value: 3.7,
      type: 'gpa',
      scale: '4.0',
    },
    achievements: ["Dean's List", 'Computer Science Honor Society'],
  },
];

// ============================================================================
// MOCK SKILLS
// ============================================================================

export const mockSkills: SkillsFound = {
  technical_programming: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++'],
  technical_tools: ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS'],
  frameworks_libraries: ['React', 'Node.js', 'Express', 'Django', 'Flask'],
  databases: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'],
  cloud_platforms: ['AWS', 'Google Cloud', 'Azure'],
  devops_tools: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
  soft_skills: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork'],
  languages_spoken: ['English', 'Spanish'],
  certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
};

// ============================================================================
// MOCK STRUCTURED EXPERIENCE
// ============================================================================

export const mockStructuredExperience: StructuredExperience = {
  work_experience: [
    {
      company: 'Tech Corp',
      company_info: {
        industry: 'Technology',
        size: '1000+ employees',
        location: 'San Francisco, CA',
      },
      positions: [
        {
          id: 'pos_1',
          title: 'Senior Software Engineer',
          level: 'senior',
          department: 'Engineering',
          location: 'San Francisco, CA',
          duration: '2 years 6 months',
          start_date: '01/2022',
          end_date: 'Present',
          is_current: true,
          responsibilities: [
            'Led development of microservices architecture',
            'Mentored junior developers',
            'Collaborated with cross-functional teams',
          ],
          achievements: [
            'Improved system performance by 40%',
            'Reduced deployment time by 60%',
            'Led team of 5 developers',
          ],
          skills_used: ['Python', 'React', 'AWS', 'Docker', 'Kubernetes'],
          technologies: [
            'Python',
            'React',
            'AWS',
            'Docker',
            'Kubernetes',
            'PostgreSQL',
          ],
          team_size: 8,
          reporting_to: 'Engineering Manager',
          direct_reports: 3,
        },
      ],
      responsibilities: [
        'Led development of microservices architecture',
        'Mentored junior developers',
        'Collaborated with cross-functional teams',
      ],
      projects: [],
      achievements: [
        'Improved system performance by 40%',
        'Reduced deployment time by 60%',
        'Led team of 5 developers',
      ],
      skills_used: ['Python', 'React', 'AWS', 'Docker', 'Kubernetes'],
      technologies: [
        'Python',
        'React',
        'AWS',
        'Docker',
        'Kubernetes',
        'PostgreSQL',
      ],
      total_experience_years: 2.5,
      current: true,
      start_date: '01/2022',
      end_date: 'Present',
      location: 'San Francisco, CA',
      employment_type: 'full-time',
    },
  ],
  contact_info: {
    full_name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev',
  },
  education: mockEducation,
  projects: [],
  skills: mockSkills,
  summary:
    'Experienced software engineer with 4+ years of experience in full-stack development, cloud technologies, and team leadership.',
  metadata: {
    total_experience_years: 4.2,
    current_company: 'Tech Corp',
    career_level: 'senior',
    industry_experience: ['Technology', 'Fintech'],
    skill_categories: [
      'technical_programming',
      'cloud_platforms',
      'devops_tools',
    ],
  },
};

// ============================================================================
// MOCK ANALYSIS RESULT
// ============================================================================

export const mockAnalysisResult: AnalysisResult = {
  id: 'analysis_123',
  jobType: 'Software Engineer',
  jobTypeConfidence: 0.95,
  atsScore: 78,
  keywordMatches: [
    'Python',
    'React',
    'AWS',
    'Docker',
    'Kubernetes',
    'JavaScript',
    'Node.js',
    'PostgreSQL',
    'Git',
    'Microservices',
    'API',
    'REST',
  ],
  missingKeywords: [
    'Machine Learning',
    'TensorFlow',
    'GraphQL',
    'Redis',
    'Elasticsearch',
    'CI/CD',
    'Agile',
    'Scrum',
    'TDD',
    'BDD',
  ],
  suggestions: [
    'Add more specific technical achievements with metrics',
    'Include machine learning experience if applicable',
    'Highlight leadership and mentoring experience',
    'Add more cloud platform certifications',
    'Include specific project outcomes and business impact',
  ],
  strengths: [
    'Strong technical skills in modern technologies',
    'Clear progression in career with increasing responsibilities',
    'Good mix of frontend and backend experience',
    'Cloud platform experience with AWS',
    'Leadership and mentoring experience',
  ],
  weaknesses: [
    'Limited machine learning experience',
    'Could benefit from more specific metrics in achievements',
    'Missing some modern development practices (TDD, BDD)',
    'Could include more business impact metrics',
    'Limited experience with newer technologies like GraphQL',
  ],
  wordCount: 450,
  characterCount: 2250,
  extraction_details: {
    all_resume_keywords: ['Python', 'React', 'AWS', 'Docker', 'Kubernetes'],
    all_jd_keywords: [
      'Python',
      'React',
      'AWS',
      'Machine Learning',
      'TensorFlow',
    ],
    all_matched_keywords: ['Python', 'React', 'AWS'],
    all_missing_keywords: ['Machine Learning', 'TensorFlow'],
    total_resume_keywords: 25,
    total_jd_keywords: 30,
    total_matched_keywords: 15,
    total_missing_keywords: 10,
    extraction_confidence: 0.92,
    extraction_method: 'ai',
    processing_time: 2.5,
    word_count: 450,
    character_count: 2250,
    language_detected: 'en',
    encoding_detected: 'utf-8',
  },
  ats_compatibility: {
    overall_score: 78,
    grade: 'B+',
    issues: [
      'Missing some modern development practices',
      'Could include more specific metrics',
    ],
    warnings: [
      'Consider adding more cloud certifications',
      'Include more business impact metrics',
    ],
    recommendations: [
      'Add specific project outcomes with numbers',
      'Include modern development practices',
      'Highlight business impact of technical decisions',
    ],
    sections_found: ['contact', 'experience', 'education', 'skills'],
    contact_completeness: 'Complete',
    bullet_consistency: true,
    word_count_optimal: true,
    format_score: 85,
    content_score: 75,
    keyword_score: 80,
    semantic_score: 82,
    compatibility_factors: {
      file_format_compatible: true,
      text_extractable: true,
      no_graphics_text: true,
      standard_fonts: true,
      proper_headers: true,
      no_tables: true,
      no_columns: true,
      appropriate_length: true,
      keyword_optimized: true,
      section_complete: true,
    },
  },
  format_analysis: {
    grade: 'B+',
    score: 78,
    sections_found: 4,
    required_sections: 4,
    optional_sections_found: 2,
    contact_completeness: 'Complete',
    has_professional_summary: true,
    section_headers_count: 4,
    issues: [
      'Could benefit from more specific metrics',
      'Consider adding more modern technologies',
    ],
    recommendations: [
      'Add quantifiable achievements',
      'Include more recent technologies',
      'Highlight leadership experience',
    ],
    section_analysis: {
      contact_info: { present: true, completeness: 100, issues: [] },
      summary: { present: true, completeness: 80, issues: [] },
      experience: { present: true, completeness: 85, issues: [] },
      education: { present: true, completeness: 90, issues: [] },
      skills: { present: true, completeness: 75, issues: [] },
      projects: {
        present: false,
        completeness: 0,
        issues: ['No projects section'],
      },
      certifications: { present: true, completeness: 60, issues: [] },
    },
  },
  detailed_scores: {
    keyword_score: 80,
    semantic_score: 82,
    format_score: 85,
    content_score: 75,
    experience_score: 78,
    skills_score: 72,
    education_score: 85,
    ats_score: 78,
    overall_score: 78,
    breakdown: {
      keyword_matching: 80,
      semantic_similarity: 82,
      format_compatibility: 85,
      content_quality: 75,
      experience_relevance: 78,
      skills_alignment: 72,
      education_match: 85,
      ats_optimization: 78,
    },
  },
  semantic_similarity: 0.82,
  match_category: 'Strong Match',
  ats_friendly: true,
  formatting_issues: [
    'Could use more specific metrics in achievements',
    'Consider adding more modern development practices',
  ],
  structured_experience: mockStructuredExperience,
  categorized_resume: {
    contact_info: mockContactInfo,
    education: mockEducation,
    work_experience: mockWorkExperience,
    skills: mockSkills,
    hobbies_interests: ['Hiking', 'Photography', 'Open Source'],
    languages: ['English', 'Spanish'],
    achievements: ["Dean's List", 'AWS Certified Developer'],
    summary_profile:
      'Experienced software engineer with 4+ years of experience in full-stack development, cloud technologies, and team leadership.',
    formatting_analysis: {
      bullet_points: {
        detected: true,
        count: 12,
        types_used: ['•', '-'],
        consistent: true,
        recommendation: 'Good use of consistent bullet points',
      },
      spacing: {
        line_spacing_consistent: true,
        excessive_whitespace: false,
        proper_section_breaks: true,
        margin_consistency: true,
      },
      structure: {
        has_clear_sections: true,
        sections_detected: ['Contact', 'Experience', 'Education', 'Skills'],
        logical_flow: true,
        chronological_order: true,
        section_headers_consistent: true,
      },
      text_formatting: {
        all_caps_excessive: false,
        appropriate_capitalization: true,
        special_characters_count: 5,
        emoji_count: 0,
        font_consistency: true,
        font_size_consistency: true,
      },
      length_analysis: {
        total_words: 450,
        total_lines: 45,
        average_line_length: 50,
        estimated_pages: 1.2,
        appropriate_length: true,
        section_word_distribution: {
          experience: 200,
          education: 80,
          skills: 100,
          contact: 70,
        },
      },
      ats_compatibility: {
        score: 78,
        issues: [],
        warnings: [],
        recommendations: [],
        compatibility_factors: {
          file_format: true,
          text_extractable: true,
          no_images_text: true,
          standard_fonts: true,
          proper_headers: true,
          no_tables: true,
          no_columns: true,
        },
      },
    },
    metadata: {
      extracted_at: new Date(),
      file_name: 'john_doe_resume.pdf',
      file_size: 245760,
      file_type: 'application/pdf',
      extraction_method: 'ai',
      confidence_score: 0.92,
    },
  },
  metadata: {
    analyzed_at: new Date(),
    file_name: 'john_doe_resume.pdf',
    file_size: 245760,
    processing_time: 2.5,
    analysis_version: '1.0.0',
  },
};

// ============================================================================
// MOCK JOB DESCRIPTIONS
// ============================================================================

export const mockJobDescriptions = {
  softwareEngineer: `
Software Engineer - Full Stack Developer

We are looking for a talented Software Engineer to join our growing team. The ideal candidate will have experience in full-stack development and modern web technologies.

Requirements:
- 3+ years of experience in software development
- Strong proficiency in JavaScript, TypeScript, Python
- Experience with React, Node.js, and modern web frameworks
- Knowledge of cloud platforms (AWS, Google Cloud, Azure)
- Experience with databases (PostgreSQL, MongoDB)
- Understanding of microservices architecture
- Experience with Docker and Kubernetes
- Strong problem-solving skills
- Excellent communication skills
- Bachelor's degree in Computer Science or related field

Responsibilities:
- Develop and maintain web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Mentor junior developers
- Contribute to technical architecture decisions

Nice to have:
- Experience with machine learning frameworks
- Knowledge of GraphQL
- Experience with CI/CD pipelines
- Agile/Scrum experience
- Open source contributions
`,

  dataScientist: `
Data Scientist - Machine Learning Engineer

We are seeking a Data Scientist with strong machine learning experience to join our data team.

Requirements:
- Master's degree in Data Science, Statistics, or related field
- 2+ years of experience in machine learning
- Proficiency in Python, R, SQL
- Experience with TensorFlow, PyTorch, scikit-learn
- Knowledge of statistical analysis and modeling
- Experience with data visualization tools
- Strong analytical and problem-solving skills
- Experience with cloud platforms (AWS, GCP)
- Knowledge of big data technologies (Spark, Hadoop)

Responsibilities:
- Develop machine learning models
- Analyze large datasets
- Create data visualizations
- Collaborate with engineering teams
- Present findings to stakeholders
- Maintain and improve existing models
`,

  productManager: `
Product Manager - Technical Products

We are looking for a Product Manager to lead our technical product initiatives.

Requirements:
- 4+ years of product management experience
- Technical background or experience working with engineering teams
- Strong analytical and problem-solving skills
- Experience with agile development methodologies
- Excellent communication and leadership skills
- Bachelor's degree in Business, Engineering, or related field
- Experience with product analytics and user research
- Knowledge of modern software development practices

Responsibilities:
- Define product strategy and roadmap
- Work closely with engineering and design teams
- Conduct user research and market analysis
- Define product requirements and specifications
- Monitor product performance and metrics
- Coordinate with stakeholders across the organization
`,
};

// ============================================================================
// MOCK IMPROVEMENT PLANS
// ============================================================================

export const mockImprovementPlan = {
  improvements: [
    {
      id: 'imp_1',
      category: 'keyword',
      priority: 'high',
      title: 'Add Machine Learning Keywords',
      description:
        'Include machine learning and AI-related keywords to match job requirements',
      impact: 85,
      effort: 'medium',
      examples: ['Machine Learning', 'TensorFlow', 'PyTorch', 'Data Science'],
      resources: ['Machine Learning courses', 'AI certification programs'],
      completed: false,
    },
    {
      id: 'imp_2',
      category: 'content',
      priority: 'high',
      title: 'Add Quantifiable Achievements',
      description: 'Include specific metrics and numbers in your achievements',
      impact: 90,
      effort: 'low',
      examples: [
        'Increased performance by 40%',
        'Reduced costs by $50K',
        'Improved user engagement by 25%',
      ],
      resources: ['How to quantify achievements guide'],
      completed: false,
    },
    {
      id: 'imp_3',
      category: 'format',
      priority: 'medium',
      title: 'Add Projects Section',
      description: 'Include a dedicated projects section to showcase your work',
      impact: 70,
      effort: 'medium',
      examples: [
        'Personal projects',
        'Open source contributions',
        'Side projects',
      ],
      resources: ['Project portfolio templates'],
      completed: false,
    },
  ],
  summary: {
    totalImprovements: 3,
    highPriority: 2,
    estimatedImpact: 82,
    estimatedTime: '2-3 hours',
  },
  quickWins: [
    {
      id: 'qw_1',
      category: 'keyword',
      priority: 'high',
      title: 'Add Missing Technical Keywords',
      description:
        'Quickly add missing technical keywords from the job description',
      impact: 75,
      effort: 'low',
      examples: ['GraphQL', 'Redis', 'Elasticsearch'],
      resources: [],
      completed: false,
    },
  ],
  currentScore: 78,
  targetScore: 90,
};

// ============================================================================
// MOCK API RESPONSES
// ============================================================================

export const mockApiResponses = {
  successfulAnalysis: {
    success: true,
    data: mockAnalysisResult,
    message: 'Analysis completed successfully',
    timestamp: new Date().toISOString(),
  },

  errorResponse: {
    success: false,
    error: 'File processing failed',
    message: 'Unable to process the uploaded file',
    timestamp: new Date().toISOString(),
  },

  validationError: {
    success: false,
    error: 'VALIDATION_ERROR',
    message: 'File type not supported',
    details: {
      supportedTypes: ['pdf', 'docx', 'doc', 'txt'],
      receivedType: 'jpg',
    },
    timestamp: new Date().toISOString(),
  },
};
