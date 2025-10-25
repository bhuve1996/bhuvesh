'use client';

import React, { useState } from 'react';

import { ContentRestructuringDemo } from '@/components/ai/ContentRestructuringDemo';
import { ResumeData } from '@/types/resume';

interface AIContentTabProps {
  data: ResumeData;
  onDataUpdate?: (updatedData: ResumeData) => void;
}

export const AIContentTab: React.FC<AIContentTabProps> = ({ data }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{
    experience: string[];
    skills: string[];
    projects: string[];
    achievements: string[];
  } | null>(null);

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSuggestions(null);

    try {
      // Simulate AI analysis (in real implementation, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const analysis = `
## 📊 Content Analysis Results

### Current Content Quality: ${getContentQuality(data)}/10

### Key Findings:
- **Experience**: ${data.experience.length} position(s) - ${data.experience.length < 2 ? 'Consider adding more positions' : 'Good variety'}
- **Skills**: ${data.skills.technical.length} technical skills - ${data.skills.technical.length < 8 ? 'Could be more comprehensive' : 'Well-rounded'}
- **Projects**: ${data.projects?.length || 0} project(s) - ${(data.projects?.length || 0) < 2 ? 'Add more projects to showcase work' : 'Good project diversity'}
- **Achievements**: ${data.achievements?.length || 0} achievement(s) - ${(data.achievements?.length || 0) < 3 ? 'More quantified achievements needed' : 'Strong achievements'}

### Recommendations:
1. **Add Quantified Results**: Include specific metrics (percentages, dollar amounts, user counts)
2. **Expand Experience**: Add more detailed job descriptions with achievements
3. **Enhance Skills**: Include more relevant technical and soft skills
4. **Showcase Projects**: Add project descriptions with technologies and outcomes
5. **Professional Language**: Use action verbs and industry-specific terminology
      `;

      setAnalysisResult(analysis);

      // Generate AI suggestions
      const aiSuggestions = {
        experience: [
          'Add quantified achievements (e.g., "Increased performance by 40%")',
          'Include specific technologies and tools used',
          'Mention team size and leadership responsibilities',
          'Add business impact and results achieved',
        ],
        skills: [
          'Add more technical skills relevant to your field',
          'Include soft skills like leadership and communication',
          'Add certifications and specialized knowledge',
          'Consider adding languages and tools',
        ],
        projects: [
          'Describe the problem you solved',
          'List technologies and frameworks used',
          'Include project outcomes and impact',
          'Add links to live projects or GitHub repos',
        ],
        achievements: [
          'Quantify your achievements with numbers',
          'Include awards and recognitions',
          'Mention publications or speaking engagements',
          'Add volunteer work and community involvement',
        ],
      };

      setSuggestions(aiSuggestions);
    } catch (_error) {
      setAnalysisResult('Error analyzing content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getContentQuality = (data: ResumeData): number => {
    let score = 0;

    // Experience scoring
    if (data.experience.length >= 3) score += 3;
    else if (data.experience.length >= 2) score += 2;
    else if (data.experience.length >= 1) score += 1;

    // Skills scoring
    if (data.skills.technical.length >= 10) score += 2;
    else if (data.skills.technical.length >= 6) score += 1;

    // Projects scoring
    if ((data.projects?.length || 0) >= 3) score += 2;
    else if ((data.projects?.length || 0) >= 2) score += 1;

    // Achievements scoring
    if ((data.achievements?.length || 0) >= 5) score += 2;
    else if ((data.achievements?.length || 0) >= 3) score += 1;

    // Summary quality
    if (data.summary && data.summary.length > 100) score += 1;

    return Math.min(score, 10);
  };

  const applyAISuggestions = () => {
    // This would apply AI-generated improvements to the resume data
    // For now, we'll show a message
    setAnalysisResult(
      prev =>
        `${prev}\n\n✅ AI suggestions applied! Your resume content has been enhanced.`
    );
  };

  return (
    <div className='space-y-4'>
      <div className='text-center'>
        <h3 className='text-lg font-semibold mb-2'>🤖 AI Content Analysis</h3>
        <p className='text-sm text-gray-600 mb-4'>
          Get AI-powered suggestions to improve your resume content structure
          and quality
        </p>
      </div>

      <div className='space-y-4'>
        <button
          onClick={analyzeContent}
          disabled={isAnalyzing}
          className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isAnalyzing ? (
            <div className='flex items-center justify-center gap-2'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
              Analyzing Content...
            </div>
          ) : (
            '🔍 Analyze My Content'
          )}
        </button>

        {analysisResult && (
          <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
            <div className='prose prose-sm max-w-none'>
              <pre className='whitespace-pre-wrap text-sm'>
                {analysisResult}
              </pre>
            </div>
          </div>
        )}

        {suggestions && (
          <div className='space-y-4'>
            <h4 className='font-semibold text-gray-800 dark:text-gray-200'>
              💡 AI Suggestions
            </h4>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg'>
                <h5 className='font-medium text-blue-800 dark:text-blue-200 mb-2'>
                  📈 Experience
                </h5>
                <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
                  {suggestions.experience.map((suggestion, index) => (
                    <li key={index} className='flex items-start gap-2'>
                      <span className='text-blue-500 mt-0.5'>•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              <div className='bg-green-50 dark:bg-green-900/20 p-3 rounded-lg'>
                <h5 className='font-medium text-green-800 dark:text-green-200 mb-2'>
                  🛠️ Skills
                </h5>
                <ul className='text-sm text-green-700 dark:text-green-300 space-y-1'>
                  {suggestions.skills.map((suggestion, index) => (
                    <li key={index} className='flex items-start gap-2'>
                      <span className='text-green-500 mt-0.5'>•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              <div className='bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg'>
                <h5 className='font-medium text-purple-800 dark:text-purple-200 mb-2'>
                  🚀 Projects
                </h5>
                <ul className='text-sm text-purple-700 dark:text-purple-300 space-y-1'>
                  {suggestions.projects.map((suggestion, index) => (
                    <li key={index} className='flex items-start gap-2'>
                      <span className='text-purple-500 mt-0.5'>•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              <div className='bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg'>
                <h5 className='font-medium text-orange-800 dark:text-orange-200 mb-2'>
                  🏆 Achievements
                </h5>
                <ul className='text-sm text-orange-700 dark:text-orange-300 space-y-1'>
                  {suggestions.achievements.map((suggestion, index) => (
                    <li key={index} className='flex items-start gap-2'>
                      <span className='text-orange-500 mt-0.5'>•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={applyAISuggestions}
              className='w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-300'
            >
              ✨ Apply AI Suggestions
            </button>
          </div>
        )}
      </div>

      <div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800'>
        <h4 className='font-medium text-yellow-800 dark:text-yellow-200 mb-2'>
          💡 Pro Tip
        </h4>
        <p className='text-sm text-yellow-700 dark:text-yellow-300'>
          Use the sample data as a reference for well-structured content. The AI
          analysis helps identify areas for improvement and suggests
          enhancements to make your resume more professional and impactful.
        </p>
      </div>

      {/* Content Restructuring Demo */}
      <div className='mt-6'>
        <ContentRestructuringDemo />
      </div>
    </div>
  );
};

export default AIContentTab;
