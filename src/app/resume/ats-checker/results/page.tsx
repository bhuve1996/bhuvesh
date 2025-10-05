'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { ImprovementPlan } from '@/components/resume';
import type {
  ImprovementItem,
  ImprovementSummary,
} from '@/components/resume/ImprovementPlan';
import { Button, Card } from '@/components/ui';
import type {
  AnalysisResult,
  Education,
  ProjectDetail,
  WorkExperience,
} from '@/types/ats';

// Note: Metadata must be defined in a separate layout.tsx file for client components
// See src/app/resume/ats-checker/results/layout.tsx

export default function ATSResultsPage() {
  const router = useRouter();
  const [analysisData, setAnalysisData] = React.useState<AnalysisResult | null>(
    null
  );
  const [improvementPlan, setImprovementPlan] = React.useState<{
    improvements: ImprovementItem[];
    summary: ImprovementSummary;
    quick_wins: ImprovementItem[];
  } | null>(null);
  const [loadingImprovements, setLoadingImprovements] = React.useState(false);

  const fetchImprovementPlan = React.useCallback(
    async (result: AnalysisResult) => {
      if (!result.extraction_details) return;

      setLoadingImprovements(true);
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/upload/improvement-plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            analysis_result: result,
            extracted_data: result.extraction_details,
            job_description: null, // Can add later if available
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setImprovementPlan(data.data);
          }
        }
      } catch {
        // Silently fail - improvement plan is optional
      } finally {
        setLoadingImprovements(false);
      }
    },
    []
  );

  React.useEffect(() => {
    // Get data from sessionStorage (passed from upload page)
    const storedData = sessionStorage.getItem('ats_analysis_result');
    if (storedData) {
      const parsed = JSON.parse(storedData) as AnalysisResult;
      setAnalysisData(parsed);

      // Fetch improvement plan
      fetchImprovementPlan(parsed);
    } else {
      // No data found, redirect back
      router.push('/resume/ats-checker');
    }
  }, [router, fetchImprovementPlan]);

  const handleTryAgain = () => {
    sessionStorage.removeItem('ats_analysis_result');
    router.push('/resume/ats-checker');
  };

  if (!analysisData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto'></div>
          <p className='mt-4 text-gray-400'>Loading results...</p>
        </div>
      </div>
    );
  }

  const { atsScore, extraction_details, jobType } = analysisData;
  const categorized = extraction_details?.categorized_resume || {};
  const contact = categorized.contact_info;
  const education = categorized.education || [];
  const experience = categorized.work_experience || [];
  const skills = extraction_details?.skills_found || {};
  const hobbies = categorized.hobbies_interests || [];
  const languages = categorized.languages || [];
  const achievements = categorized.achievements || [];
  const formattingAnalysis = categorized.formatting_analysis || {};

  return (
    <div className='container mx-auto px-4 max-w-7xl py-20'>
      {/* Header with Actions */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-4xl font-bold text-cyan-400 mb-2'>
            Resume Analysis Results
          </h1>
          <p className='text-gray-400'>
            Detailed extraction and ATS score for your resume
          </p>
        </div>
        <div className='flex gap-4'>
          <Button
            onClick={handleTryAgain}
            className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
          >
            📄 Upload New Resume
          </Button>
        </div>
      </div>

      {/* ATS Score Card */}
      <Card className='p-8 mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-cyan-500/30'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-white mb-4'>
            ATS Compatibility Score
          </h2>
          <div className='flex items-center justify-center gap-8'>
            <div className='relative'>
              <svg className='w-40 h-40 transform -rotate-90'>
                <circle
                  cx='80'
                  cy='80'
                  r='70'
                  stroke='currentColor'
                  strokeWidth='12'
                  fill='none'
                  className='text-gray-700'
                />
                <circle
                  cx='80'
                  cy='80'
                  r='70'
                  stroke='currentColor'
                  strokeWidth='12'
                  fill='none'
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - atsScore / 100)}`}
                  className='text-cyan-400 transition-all duration-1000'
                  strokeLinecap='round'
                />
              </svg>
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-5xl font-bold text-white'>
                  {atsScore}
                </span>
              </div>
            </div>
            <div className='text-left'>
              <p className='text-xl text-gray-300 mb-2'>
                <span className='font-semibold text-cyan-400'>Job Type:</span>{' '}
                {jobType}
              </p>
              <p className='text-gray-400'>
                {atsScore >= 80 &&
                  '🎉 Excellent! Your resume is highly ATS-compatible'}
                {atsScore >= 60 &&
                  atsScore < 80 &&
                  '👍 Good! Some improvements recommended'}
                {atsScore < 60 && '⚠️ Needs work to improve ATS compatibility'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Improvement Plan Section */}
      {loadingImprovements && (
        <Card className='p-8 mb-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto'></div>
            <p className='mt-4 text-gray-400'>
              Generating personalized improvement suggestions...
            </p>
          </div>
        </Card>
      )}

      {improvementPlan && !loadingImprovements && (
        <div className='mb-8'>
          <ImprovementPlan
            improvements={improvementPlan.improvements}
            summary={improvementPlan.summary}
            quick_wins={improvementPlan.quick_wins}
            currentScore={atsScore}
          />
        </div>
      )}

      {/* Contact Information */}
      <Card className='p-6 mb-6'>
        <h3 className='text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2'>
          👤 Contact Information
        </h3>
        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-sm font-semibold text-gray-400 uppercase mb-2'>
              Name Details
            </h4>
            <div className='space-y-2'>
              <p className='text-white'>
                <span className='text-gray-400'>Full Name:</span>{' '}
                {contact?.full_name}
              </p>
              <p className='text-white'>
                <span className='text-gray-400'>First Name:</span>{' '}
                {contact?.first_name}
              </p>
              {contact?.middle_name && (
                <p className='text-white'>
                  <span className='text-gray-400'>Middle Name:</span>{' '}
                  {contact?.middle_name}
                </p>
              )}
              <p className='text-white'>
                <span className='text-gray-400'>Last Name:</span>{' '}
                {contact?.last_name}
              </p>
            </div>
          </div>
          <div>
            <h4 className='text-sm font-semibold text-gray-400 uppercase mb-2'>
              Contact Details
            </h4>
            <div className='space-y-2'>
              <p className='text-white'>
                <span className='text-gray-400'>Email:</span> {contact?.email}
              </p>
              <p className='text-white'>
                <span className='text-gray-400'>Phone:</span>{' '}
                {contact?.phone?.raw}
                {contact?.phone?.country_code && (
                  <span className='text-gray-500 ml-2'>
                    ({contact?.phone.country_code})
                  </span>
                )}
              </p>
              {contact?.linkedin?.url && (
                <p className='text-white'>
                  <span className='text-gray-400'>LinkedIn:</span>{' '}
                  {contact?.linkedin.username || contact?.linkedin.url}
                </p>
              )}
              {contact?.github?.url && (
                <p className='text-white'>
                  <span className='text-gray-400'>GitHub:</span>{' '}
                  {contact?.github.username || contact?.github.url}
                </p>
              )}
            </div>
          </div>
          <div>
            <h4 className='text-sm font-semibold text-gray-400 uppercase mb-2'>
              Location
            </h4>
            <div className='space-y-2'>
              <p className='text-white'>
                <span className='text-gray-400'>Full:</span>{' '}
                {contact?.location?.full}
              </p>
              {contact?.location?.city && (
                <p className='text-white'>
                  <span className='text-gray-400'>City:</span>{' '}
                  {contact?.location.city}
                </p>
              )}
              {contact?.location?.state && (
                <p className='text-white'>
                  <span className='text-gray-400'>State:</span>{' '}
                  {contact?.location.state}
                </p>
              )}
              {contact?.location?.country && (
                <p className='text-white'>
                  <span className='text-gray-400'>Country:</span>{' '}
                  {contact?.location.country}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Education */}
      {education.length > 0 && (
        <Card className='p-6 mb-6'>
          <h3 className='text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2'>
            🎓 Education
          </h3>
          {education.map((edu: Education, index: number) => (
            <div
              key={index}
              className='mb-6 pb-6 border-b border-gray-700 last:border-0'
            >
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <h4 className='text-lg font-semibold text-white mb-2'>
                    {edu.degree_full}
                  </h4>
                  <p className='text-gray-400'>
                    <span className='font-semibold'>Type:</span>{' '}
                    {edu.degree_type}
                  </p>
                  {edu.major && (
                    <p className='text-gray-400'>
                      <span className='font-semibold'>Major:</span> {edu.major}
                    </p>
                  )}
                </div>
                <div>
                  <p className='text-white mb-1'>
                    <span className='text-gray-400'>Institution:</span>{' '}
                    {edu.institution?.name}
                  </p>
                  {edu.institution?.type && (
                    <p className='text-gray-400 text-sm'>
                      Type: {edu.institution.type}
                    </p>
                  )}
                </div>
                <div>
                  <p className='text-white mb-1'>
                    <span className='text-gray-400'>Duration:</span>{' '}
                    {edu.duration?.start_year} - {edu.duration?.end_year}
                    {edu.duration?.total_years !== undefined &&
                      edu.duration.total_years > 0 && (
                        <span className='text-gray-500 ml-2'>
                          ({edu.duration.total_years} years)
                        </span>
                      )}
                  </p>
                </div>
                <div>
                  {edu.grade?.value && (
                    <p className='text-white mb-1'>
                      <span className='text-gray-400'>Grade:</span>{' '}
                      {edu.grade.value}
                      {edu.grade.scale && ` / ${edu.grade.scale}`}{' '}
                      {edu.grade.type}
                    </p>
                  )}
                  {edu.grade?.percentile && (
                    <p className='text-cyan-400 text-sm'>
                      Top {edu.grade.percentile}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <Card className='p-6 mb-6'>
          <h3 className='text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2'>
            💼 Work Experience
          </h3>
          {experience.map((exp: WorkExperience, index: number) => (
            <div
              key={index}
              className='mb-8 pb-8 border-b border-gray-700 last:border-0'
            >
              <div className='mb-4'>
                <h4 className='text-xl font-semibold text-white mb-2'>
                  {exp.company}
                </h4>
                <p className='text-cyan-400 font-medium'>{exp.role}</p>
                <div className='flex flex-wrap gap-4 mt-2 text-sm text-gray-400'>
                  <span>📍 {exp.location}</span>
                  <span>📅 {exp.duration}</span>
                  {exp.duration_formatted && (
                    <span className='text-cyan-400'>
                      ⏱️ {exp.duration_formatted}
                    </span>
                  )}
                </div>
              </div>

              {exp.projects && exp.projects.length > 0 && (
                <div className='ml-4 space-y-4'>
                  <h5 className='text-lg font-semibold text-gray-300'>
                    Projects:
                  </h5>
                  {exp.projects.map(
                    (project: ProjectDetail, pIndex: number) => (
                      <div
                        key={pIndex}
                        className='bg-gray-800/30 p-4 rounded-lg'
                      >
                        <h6 className='text-white font-medium mb-1'>
                          {project.name}
                        </h6>
                        {project.type && (
                          <p className='text-gray-400 text-sm mb-2'>
                            {project.type}
                          </p>
                        )}
                        {project.technologies &&
                          project.technologies.length > 0 && (
                            <div className='flex flex-wrap gap-2 mb-2'>
                              {project.technologies.map(
                                (tech: string, tIndex: number) => (
                                  <span
                                    key={tIndex}
                                    className='px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs'
                                  >
                                    {tech}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        {project.description && (
                          <p className='text-gray-400 text-sm mt-2'>
                            {project.description}
                          </p>
                        )}
                        {project.achievements &&
                          project.achievements.length > 0 && (
                            <ul className='mt-2 space-y-1'>
                              {project.achievements.map(
                                (achievement: string, aIndex: number) => (
                                  <li
                                    key={aIndex}
                                    className='text-gray-400 text-sm flex items-start gap-2'
                                  >
                                    <span className='text-cyan-400'>•</span>
                                    <span>{achievement}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </Card>
      )}

      {/* Skills - Universal (18 Categories) */}
      {Object.keys(skills).length > 0 && (
        <Card className='p-6 mb-6'>
          <h3 className='text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2'>
            💼 Skills & Expertise
          </h3>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Object.entries(skills)
              .filter(
                ([, skillList]) =>
                  Array.isArray(skillList) && skillList.length > 0
              )
              .map(([category, skillList]) => (
                <div key={category} className='bg-gray-800/30 p-4 rounded-lg'>
                  <h4 className='text-sm font-semibold text-cyan-400 uppercase mb-3 flex items-center gap-2'>
                    {category === 'technical_programming' && '🖥️'}
                    {category === 'business_management' && '💼'}
                    {category === 'financial_accounting' && '💰'}
                    {category === 'creative_design' && '🎨'}
                    {category === 'medical_clinical' && '🏥'}
                    {category === 'teaching_training' && '📚'}
                    {category === 'sales_marketing' && '📈'}
                    {category === 'customer_service' && '🤝'}
                    {category === 'manufacturing_operations' && '🏭'}
                    {category === 'hospitality_food' && '🏨'}
                    {category === 'travel_tourism' && '✈️'}
                    {category === 'legal_regulatory' && '⚖️'}
                    {category === 'hr_recruitment' && '👥'}
                    {category === 'fashion_styling' && '👗'}
                    {category === 'construction_civil' && '🏗️'}
                    {category === 'mechanical_electrical' && '🔧'}
                    {category === 'soft_skills' && '🤝'}
                    {category === 'tools_software' && '🛠️'}
                    {![
                      'technical_programming',
                      'business_management',
                      'financial_accounting',
                      'creative_design',
                      'medical_clinical',
                      'teaching_training',
                      'sales_marketing',
                      'customer_service',
                      'manufacturing_operations',
                      'hospitality_food',
                      'travel_tourism',
                      'legal_regulatory',
                      'hr_recruitment',
                      'fashion_styling',
                      'construction_civil',
                      'mechanical_electrical',
                      'soft_skills',
                      'tools_software',
                    ].includes(category) && '✨'}
                    {category.replace(/_/g, ' ')}
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {(skillList as string[]).map(
                      (skill: string, index: number) => (
                        <span
                          key={index}
                          className='px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs'
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Show message if no skills detected */}
          {Object.entries(skills).filter(
            ([, list]) => Array.isArray(list) && list.length > 0
          ).length === 0 && (
            <p className='text-gray-400 text-center py-8'>
              No specific skills detected. Add relevant skills to your resume
              for better ATS compatibility.
            </p>
          )}
        </Card>
      )}

      {/* Additional Info Grid */}
      <div className='grid md:grid-cols-3 gap-6 mb-8'>
        {/* Languages */}
        {languages.length > 0 && (
          <Card className='p-6'>
            <h3 className='text-xl font-semibold text-cyan-400 mb-3 flex items-center gap-2'>
              🗣️ Languages
            </h3>
            <ul className='space-y-2'>
              {languages.map((lang: string, index: number) => (
                <li
                  key={index}
                  className='text-gray-300 flex items-center gap-2'
                >
                  <span className='text-cyan-400'>•</span> {lang}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Hobbies */}
        {hobbies.length > 0 && (
          <Card className='p-6'>
            <h3 className='text-xl font-semibold text-cyan-400 mb-3 flex items-center gap-2'>
              🎯 Hobbies & Interests
            </h3>
            <ul className='space-y-2'>
              {hobbies.map((hobby: string, index: number) => (
                <li
                  key={index}
                  className='text-gray-300 flex items-center gap-2'
                >
                  <span className='text-cyan-400'>•</span> {hobby}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <Card className='p-6'>
            <h3 className='text-xl font-semibold text-cyan-400 mb-3 flex items-center gap-2'>
              🏆 Achievements
            </h3>
            <ul className='space-y-2'>
              {achievements.map((achievement: string, index: number) => (
                <li
                  key={index}
                  className='text-gray-300 text-sm flex items-start gap-2'
                >
                  <span className='text-cyan-400 mt-1'>✓</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Formatting Analysis */}
      {formattingAnalysis?.ats_compatibility && (
        <Card className='p-6 mb-6'>
          <h3 className='text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2'>
            📋 Formatting Analysis
          </h3>
          <div className='grid md:grid-cols-2 gap-6'>
            {/* ATS Formatting Score */}
            <div className='col-span-2'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='text-3xl font-bold text-cyan-400'>
                  {formattingAnalysis.ats_compatibility.score}/100
                </div>
                <div>
                  <p className='text-white font-semibold'>
                    ATS Formatting Score
                  </p>
                  <p className='text-gray-400 text-sm'>
                    Structure and readability assessment
                  </p>
                </div>
              </div>
            </div>

            {/* Bullet Points */}
            {formattingAnalysis.bullet_points?.detected && (
              <div>
                <h4 className='text-white font-semibold mb-2'>
                  📝 Bullet Points
                </h4>
                <p className='text-gray-400 text-sm'>
                  Count: {formattingAnalysis.bullet_points.count}
                </p>
                <p className='text-gray-400 text-sm'>
                  Types:{' '}
                  {formattingAnalysis.bullet_points.types_used?.join(', ')}
                </p>
                <p className='text-gray-400 text-sm'>
                  Consistent:{' '}
                  {formattingAnalysis.bullet_points.consistent ? '✓' : '✗'}
                </p>
              </div>
            )}

            {/* Structure */}
            {formattingAnalysis.structure && (
              <div>
                <h4 className='text-white font-semibold mb-2'>🏗️ Structure</h4>
                <p className='text-gray-400 text-sm'>
                  Sections:{' '}
                  {formattingAnalysis.structure?.sections_detected?.length || 0}
                </p>
                {(formattingAnalysis.structure?.sections_detected?.length ||
                  0) > 0 && (
                  <div className='flex flex-wrap gap-1 mt-2'>
                    {formattingAnalysis.structure?.sections_detected?.map(
                      (section: string, idx: number) => (
                        <span
                          key={idx}
                          className='px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs'
                        >
                          {section}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Length */}
            {formattingAnalysis.length_analysis && (
              <div>
                <h4 className='text-white font-semibold mb-2'>📊 Length</h4>
                <p className='text-gray-400 text-sm'>
                  Words: {formattingAnalysis.length_analysis.total_words}
                </p>
                <p className='text-gray-400 text-sm'>
                  Pages: ~{formattingAnalysis.length_analysis.estimated_pages}
                </p>
                <p className='text-gray-400 text-sm'>
                  Appropriate:{' '}
                  {formattingAnalysis.length_analysis.appropriate_length
                    ? '✓'
                    : '✗'}
                </p>
              </div>
            )}

            {/* Issues & Recommendations */}
            <div className='col-span-2'>
              {(formattingAnalysis.ats_compatibility?.issues?.length || 0) >
                0 && (
                <div className='mb-4'>
                  <h4 className='text-red-400 font-semibold mb-2'>
                    ⚠️ Issues to Fix
                  </h4>
                  <ul className='space-y-1'>
                    {formattingAnalysis.ats_compatibility?.issues?.map(
                      (issue: string, idx: number) => (
                        <li
                          key={idx}
                          className='text-red-300 text-sm flex items-start gap-2'
                        >
                          <span>•</span>
                          <span>{issue}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {(formattingAnalysis.ats_compatibility?.warnings?.length || 0) >
                0 && (
                <div className='mb-4'>
                  <h4 className='text-yellow-400 font-semibold mb-2'>
                    ⚡ Warnings
                  </h4>
                  <ul className='space-y-1'>
                    {formattingAnalysis.ats_compatibility?.warnings?.map(
                      (warning: string, idx: number) => (
                        <li
                          key={idx}
                          className='text-yellow-300 text-sm flex items-start gap-2'
                        >
                          <span>•</span>
                          <span>{warning}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {(formattingAnalysis.ats_compatibility?.recommendations?.length ||
                0) > 0 && (
                <div>
                  <h4 className='text-green-400 font-semibold mb-2'>
                    ✓ Recommendations
                  </h4>
                  <ul className='space-y-1'>
                    {formattingAnalysis.ats_compatibility?.recommendations?.map(
                      (rec: string, idx: number) => (
                        <li
                          key={idx}
                          className='text-green-300 text-sm flex items-start gap-2'
                        >
                          <span>•</span>
                          <span>{rec}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Actions Footer */}
      <div className='flex justify-center gap-4 mb-12'>
        <Button
          onClick={handleTryAgain}
          className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-3'
        >
          📄 Analyze Another Resume
        </Button>
      </div>
    </div>
  );
}
