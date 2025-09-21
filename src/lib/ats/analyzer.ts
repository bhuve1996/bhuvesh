import {
  calculateKeywordDensity,
  extractKeywords,
  parseFile,
} from '../utils/fileParser';

import { JobProfile, jobProfiles } from './jobProfiles';

export interface AnalysisResult {
  jobType: string;
  atsScore: number;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  keywordDensity: { [key: string]: number };
  wordCount: number;
  characterCount: number;
}

export const analyzeResume = async (file: File): Promise<AnalysisResult> => {
  // Parse the file
  const parsedContent = await parseFile(file);

  // Extract keywords from the resume
  const resumeKeywords = extractKeywords(parsedContent.text);

  // Detect job type based on content
  const detectedJobType = detectJobType(parsedContent.text, resumeKeywords);

  // Get the job profile
  const jobProfile = jobProfiles.find(
    profile => profile.id === detectedJobType
  );

  if (!jobProfile) {
    throw new Error('Could not detect job type from resume content');
  }

  // Analyze keywords
  const keywordAnalysis = analyzeKeywords(parsedContent.text, jobProfile);

  // Calculate ATS score
  const atsScore = calculateATSScore(
    parsedContent,
    keywordAnalysis,
    jobProfile
  );

  // Generate suggestions
  const suggestions = generateSuggestions(
    parsedContent,
    keywordAnalysis,
    jobProfile
  );

  // Identify strengths and weaknesses
  const strengths = identifyStrengths(
    parsedContent,
    keywordAnalysis,
    jobProfile
  );
  const weaknesses = identifyWeaknesses(
    parsedContent,
    keywordAnalysis,
    jobProfile
  );

  return {
    jobType: jobProfile.name,
    atsScore,
    keywordMatches: keywordAnalysis.matchedKeywords,
    missingKeywords: keywordAnalysis.missingKeywords,
    suggestions,
    strengths,
    weaknesses,
    keywordDensity: keywordAnalysis.keywordDensity,
    wordCount: parsedContent.wordCount,
    characterCount: parsedContent.characterCount,
  };
};

const detectJobType = (text: string, keywords: string[]): string => {
  const textLower = text.toLowerCase();
  const keywordsLower = keywords.map(k => k.toLowerCase());

  // Score each job profile based on keyword matches
  const jobScores = jobProfiles.map(profile => {
    const profileKeywords = profile.keywords.map(k => k.toLowerCase());
    const profileSkills = profile.skills.map(s => s.toLowerCase());
    const profileExperience = profile.experience.map(e => e.toLowerCase());

    let score = 0;

    // Check for exact keyword matches
    profileKeywords.forEach(keyword => {
      if (textLower.includes(keyword) || keywordsLower.includes(keyword)) {
        score += 2;
      }
    });

    // Check for skill matches
    profileSkills.forEach(skill => {
      if (textLower.includes(skill)) {
        score += 1.5;
      }
    });

    // Check for experience matches
    profileExperience.forEach(exp => {
      if (textLower.includes(exp)) {
        score += 1;
      }
    });

    // Check for job title mentions
    if (textLower.includes(profile.name.toLowerCase())) {
      score += 3;
    }

    return { profile, score };
  });

  // Return the job profile with the highest score
  const bestMatch = jobScores.reduce((best, current) =>
    current.score > best.score ? current : best
  );

  return bestMatch.profile.id;
};

interface KeywordAnalysis {
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordDensity: { [key: string]: number };
}

const analyzeKeywords = (
  text: string,
  jobProfile: JobProfile
): KeywordAnalysis => {
  const textLower = text.toLowerCase();
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  const keywordDensity: { [key: string]: number } = {};

  // Check each keyword in the job profile
  jobProfile.keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const density = calculateKeywordDensity(text, keywordLower);

    if (textLower.includes(keywordLower)) {
      matchedKeywords.push(keyword);
      keywordDensity[keyword] = density;
    } else {
      missingKeywords.push(keyword);
    }
  });

  return {
    matchedKeywords,
    missingKeywords,
    keywordDensity,
  };
};

const calculateATSScore = (
  parsedContent: { text: string; wordCount: number; characterCount: number },
  keywordAnalysis: KeywordAnalysis,
  jobProfile: JobProfile
): number => {
  let score = 0;
  const maxScore = 100;

  // Keyword matching (40 points)
  const keywordScore =
    (keywordAnalysis.matchedKeywords.length / jobProfile.keywords.length) * 40;
  score += Math.min(keywordScore, 40);

  // Word count optimization (20 points)
  const wordCount = parsedContent.wordCount;
  if (wordCount >= 400 && wordCount <= 800) {
    score += 20; // Optimal word count
  } else if (wordCount >= 300 && wordCount <= 1000) {
    score += 15; // Good word count
  } else if (wordCount >= 200 && wordCount <= 1200) {
    score += 10; // Acceptable word count
  } else {
    score += 5; // Poor word count
  }

  // Skills section presence (15 points)
  const skillsKeywords = [
    'skills',
    'technical skills',
    'core competencies',
    'expertise',
  ];
  const hasSkillsSection = skillsKeywords.some(keyword =>
    parsedContent.text.toLowerCase().includes(keyword)
  );
  if (hasSkillsSection) {
    score += 15;
  }

  // Experience section presence (15 points)
  const experienceKeywords = [
    'experience',
    'work history',
    'employment',
    'career',
  ];
  const hasExperienceSection = experienceKeywords.some(keyword =>
    parsedContent.text.toLowerCase().includes(keyword)
  );
  if (hasExperienceSection) {
    score += 15;
  }

  // Education section presence (10 points)
  const educationKeywords = [
    'education',
    'degree',
    'university',
    'college',
    'certification',
  ];
  const hasEducationSection = educationKeywords.some(keyword =>
    parsedContent.text.toLowerCase().includes(keyword)
  );
  if (hasEducationSection) {
    score += 10;
  }

  return Math.min(Math.round(score), maxScore);
};

const generateSuggestions = (
  parsedContent: { text: string; wordCount: number; characterCount: number },
  keywordAnalysis: KeywordAnalysis,
  jobProfile: JobProfile
): string[] => {
  const suggestions: string[] = [];

  // Keyword suggestions
  if (keywordAnalysis.missingKeywords.length > 0) {
    const topMissing = keywordAnalysis.missingKeywords.slice(0, 5);
    suggestions.push(
      `Add these important ${jobProfile.name} keywords: ${topMissing.join(', ')}`
    );
  }

  // Word count suggestions
  if (parsedContent.wordCount < 400) {
    suggestions.push(
      'Expand your resume with more detailed descriptions and achievements'
    );
  } else if (parsedContent.wordCount > 800) {
    suggestions.push(
      'Consider condensing your resume to focus on the most relevant information'
    );
  }

  // Skills section suggestions
  const skillsKeywords = ['skills', 'technical skills', 'core competencies'];
  const hasSkillsSection = skillsKeywords.some(keyword =>
    parsedContent.text.toLowerCase().includes(keyword)
  );
  if (!hasSkillsSection) {
    suggestions.push(
      `Add a dedicated skills section to highlight your ${jobProfile.name} abilities`
    );
  }

  // Experience suggestions
  const experienceKeywords = ['experience', 'work history', 'employment'];
  const hasExperienceSection = experienceKeywords.some(keyword =>
    parsedContent.text.toLowerCase().includes(keyword)
  );
  if (!hasExperienceSection) {
    suggestions.push(
      'Include a clear work experience section with job titles and responsibilities'
    );
  }

  // Quantifiable achievements
  const hasNumbers = /\d+/.test(parsedContent.text);
  if (!hasNumbers) {
    suggestions.push(
      'Add quantifiable achievements and metrics to demonstrate your impact'
    );
  }

  return suggestions;
};

const identifyStrengths = (
  parsedContent: { text: string; wordCount: number; characterCount: number },
  keywordAnalysis: KeywordAnalysis,
  jobProfile: JobProfile
): string[] => {
  const strengths: string[] = [];

  // Keyword strength
  const keywordMatchRatio =
    keywordAnalysis.matchedKeywords.length / jobProfile.keywords.length;
  if (keywordMatchRatio > 0.7) {
    strengths.push('Excellent keyword alignment with industry standards');
  } else if (keywordMatchRatio > 0.5) {
    strengths.push('Good keyword coverage for the role');
  }

  // Word count strength
  if (parsedContent.wordCount >= 400 && parsedContent.wordCount <= 800) {
    strengths.push('Optimal resume length for ATS systems');
  }

  // Skills section strength
  const skillsKeywords = ['skills', 'technical skills', 'core competencies'];
  const hasSkillsSection = skillsKeywords.some(keyword =>
    parsedContent.text.toLowerCase().includes(keyword)
  );
  if (hasSkillsSection) {
    strengths.push('Clear skills section present');
  }

  // Experience strength
  const experienceKeywords = ['experience', 'work history', 'employment'];
  const hasExperienceSection = experienceKeywords.some(keyword =>
    parsedContent.text.toLowerCase().includes(keyword)
  );
  if (hasExperienceSection) {
    strengths.push('Well-structured experience section');
  }

  return strengths;
};

const identifyWeaknesses = (
  parsedContent: { text: string; wordCount: number; characterCount: number },
  keywordAnalysis: KeywordAnalysis,
  jobProfile: JobProfile
): string[] => {
  const weaknesses: string[] = [];

  // Keyword weaknesses
  const keywordMatchRatio =
    keywordAnalysis.matchedKeywords.length / jobProfile.keywords.length;
  if (keywordMatchRatio < 0.3) {
    weaknesses.push('Low keyword alignment with industry requirements');
  }

  // Word count weaknesses
  if (parsedContent.wordCount < 300) {
    weaknesses.push('Resume may be too brief for comprehensive evaluation');
  } else if (parsedContent.wordCount > 1000) {
    weaknesses.push('Resume may be too long for ATS systems');
  }

  // Missing sections
  const skillsKeywords = ['skills', 'technical skills', 'core competencies'];
  const hasSkillsSection = skillsKeywords.some(keyword =>
    parsedContent.text.toLowerCase().includes(keyword)
  );
  if (!hasSkillsSection) {
    weaknesses.push('Missing dedicated skills section');
  }

  const experienceKeywords = ['experience', 'work history', 'employment'];
  const hasExperienceSection = experienceKeywords.some(keyword =>
    parsedContent.text.toLowerCase().includes(keyword)
  );
  if (!hasExperienceSection) {
    weaknesses.push('Missing clear work experience section');
  }

  // Quantifiable achievements
  const hasNumbers = /\d+/.test(parsedContent.text);
  if (!hasNumbers) {
    weaknesses.push('Lack of quantifiable achievements and metrics');
  }

  return weaknesses;
};
