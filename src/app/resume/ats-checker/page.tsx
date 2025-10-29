'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { UnifiedWelcomeBar } from '@/components/layout/UnifiedWelcomeBar';
import { FileUpload } from '@/components/molecules/FileUpload/FileUpload';
import { ATSAnalysis } from '@/components/resume/ATSAnalysis';
import { ResultsDisplay } from '@/components/resume/ResultsDisplay';
import { Section } from '@/components/ui/Section';
import { useTheme } from '@/contexts/ThemeContext';
import { useAnalysisProgress } from '@/hooks/useAnalysisProgress';
import { atsApi } from '@/lib/ats/api';
import { ERROR_MESSAGES, formatErrorForUser } from '@/lib/utils/errorHandling';
import { useResumeActions, useResumeStore } from '@/store/resumeStore';
import type { AnalysisResult, StructuredExperience } from '@/types';
import { ResumeData, ResumeDataUtils } from '@/types/resume';

export default function ATSCheckerPage() {
  // Theme
  const { theme } = useTheme();

  // Use global state
  const analysisResult = useResumeStore(state => state.analysisResult);
  const resumeData = useResumeStore(state => state.resumeData);
  const isLoading = useResumeStore(state => state.isLoading);
  const error = useResumeStore(state => state.error);
  const uploadedFile = useResumeStore(state => state.uploadedFile);
  const activeTab = useResumeStore(state => state.activeTab);

  const {
    setAnalysisResult,
    setResumeData,
    setExtractedDataBackup,
    setError,
    setLoading,
    setUploadedFile,
    setActiveTab,
    clearAllData,
  } = useResumeActions();

  // Update activeTab when analysisResult changes
  useEffect(() => {
    if (analysisResult) {
      setActiveTab('analysis');
    }
  }, [analysisResult, setActiveTab]);

  // Progress tracking
  const {
    progress,
    startAnalysis,
    completeAnalysis,
    updateStep,
    resetProgress,
    setError: setProgressError,
  } = useAnalysisProgress();

  // Handle file upload and parse to ResumeData
  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      setUploadedFile(file);
      setLoading(true);
      setError(null);

      // Parse the file first
      const result = await atsApi.uploadFile(file);

      if (result.success && result.data) {
        // Create basic ResumeData from parsed content
        const resumeData: ResumeData = {
          personal: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            github: '',
            portfolio: '',
            jobTitle: '',
          },
          summary: result.data.text || '',
          experience: [],
          education: [],
          skills: {
            technical: [],
            business: [],
            soft: [],
            languages: [],
            certifications: [],
          },
          projects: [],
          achievements: [],
          certifications: [],
          hobbies: [],
        };

        // Clean the data using ResumeDataUtils
        const cleanedData = ResumeDataUtils.cleanResumeData(resumeData);

        // Set the cleaned ResumeData in the store
        setResumeData(cleanedData);
        setExtractedDataBackup(cleanedData);

        toast.success('Resume uploaded and parsed successfully!');
      } else {
        throw new Error(result.message || 'Failed to parse resume');
      }
    } catch (error) {
      const errorMessage = formatErrorForUser(error, ERROR_MESSAGES.UPLOAD);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle ATS analysis with job description
  const handleAnalysis = async (jobDescription: string) => {
    if (!uploadedFile) {
      toast.error('Please upload a resume first');
      return;
    }

    try {
      startAnalysis();
      setError(null);

      // Perform ATS analysis with progress tracking
      const result = await atsApi.analyzeResumeWithJobDescription(
        uploadedFile,
        jobDescription,
        (_step: string, progress: number) => {
          // Update progress in the store
          setProgressError('');

          // Use the progress number directly as step index since API now reports step indices
          const stepIndex = progress;

          // Update the current step
          updateStep(stepIndex, 'active');
        }
      );

      if (result.success && result.data) {
        // Convert backend response to AnalysisResult format
        const analysisResult: AnalysisResult = {
          jobType: result.data.match_category || 'Unknown',
          atsScore: result.data.ats_score || 0,
          keywordMatches: result.data.keyword_matches || [],
          missingKeywords: result.data.missing_keywords || [],
          suggestions: result.data.suggestions || [],
          strengths: result.data.strengths || [],
          weaknesses: result.data.weaknesses || [],
          wordCount: result.data.word_count || 0,
          characterCount: result.data.word_count * 5 || 0, // Rough estimate
          keywordDensity: {}, // TODO: Calculate keyword density from backend data
          job_description: result.data.job_description || '', // Add AI-generated job description
          structured_experience: (result.data
            .structured_experience as StructuredExperience) || {
            work_experience: [],
            contact_info: {
              full_name: '',
              email: '',
              phone: '',
              location: '',
              linkedin: '',
              github: '',
            },
          },
          detailed_scores: {
            keyword_score: result.data.detailed_scores?.keyword_score || 0,
            semantic_score: result.data.detailed_scores?.semantic_score || 0,
            format_score: result.data.detailed_scores?.format_score || 0,
            content_score: result.data.detailed_scores?.content_score || 0,
            ats_score: result.data.detailed_scores?.ats_score || 0,
          },
        };

        setAnalysisResult(analysisResult);

        // Convert structured experience data to ResumeData format
        if (analysisResult.structured_experience) {
          try {
            const structuredData = analysisResult.structured_experience;

            // Convert structured work experience to ResumeData format
            const workExperience =
              structuredData.work_experience?.map((exp, index) => ({
                id: `exp-${index}`,
                company: exp.company,
                position: exp.positions?.[0]?.title || 'Position',
                location: '', // Not available in structured data
                startDate: exp.positions?.[0]?.start_date || '',
                endDate: exp.positions?.[0]?.end_date || '',
                current: exp.current,
                description: exp.responsibilities?.join('\n• ') || '',
                achievements: exp.achievements || [],
                skills: exp.skills_used || [],
              })) || [];

            // Create ResumeData from structured experience
            const structuredResumeData: ResumeData = {
              personal: {
                fullName: structuredData.contact_info.full_name,
                email: structuredData.contact_info.email,
                phone: structuredData.contact_info.phone,
                location: structuredData.contact_info.location,
                linkedin: structuredData.contact_info.linkedin,
                github: structuredData.contact_info.github,
                portfolio: '',
                jobTitle: '', // Will be filled from work experience
              },
              summary: resumeData?.summary || '', // Keep existing summary
              experience: workExperience,
              education: [], // Not available in current structured data
              skills: {
                technical: workExperience.flatMap(exp => exp.skills) || [],
                business: [],
                soft: [],
                languages: [],
                certifications: [],
              },
              projects:
                structuredData.work_experience?.flatMap(
                  exp =>
                    exp.projects?.map((project, index) => ({
                      id: `project-${index}`,
                      name: project.name || '',
                      description: project.description || '',
                      technologies: project.technologies || [],
                      url: '',
                      github: '',
                      startDate: '',
                      endDate: '',
                    })) || []
                ) || [],
              achievements:
                structuredData.work_experience?.flatMap(
                  exp => exp.achievements
                ) || [],
              certifications: [],
              hobbies: [],
            };

            // Merge with existing resumeData to preserve any data that wasn't extracted
            const mergedResumeData: ResumeData = {
              ...resumeData, // Keep existing data as fallback
              ...structuredResumeData, // Override with structured data
              // Ensure we have a summary from the original text if structured data doesn't have one
              summary:
                structuredResumeData.summary || resumeData?.summary || '',
            };

            // Clean and validate the merged data
            const cleanedMappedData =
              ResumeDataUtils.cleanResumeData(mergedResumeData);

            // Update the global state with the structured resume data
            setResumeData(cleanedMappedData);
            setExtractedDataBackup(cleanedMappedData);

            // Debug logging disabled in production
            // console.log(
            //   '✅ Successfully converted ATS analysis to ResumeData:',
            //   cleanedMappedData
            // );
          } catch (_error) {
            // Debug logging disabled in production
            // console.error(
            //   '❌ Error converting ATS analysis to ResumeData:',
            //   error
            // );
            // Don't fail the analysis if conversion fails, just log the error
          }
        }

        completeAnalysis();
        setActiveTab('analysis');
        toast.success('ATS analysis completed successfully!');
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (error) {
      const errorMessage = formatErrorForUser(error, ERROR_MESSAGES.ANALYSIS);
      setError(errorMessage);
      setProgressError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Clear all data
  const handleClearData = () => {
    clearAllData();
    resetProgress();
    setActiveTab('upload');
    toast.success('All data cleared successfully');
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        theme === 'dark'
          ? 'from-slate-900 to-slate-800'
          : 'from-slate-50 to-blue-50'
      }`}
    >
      <UnifiedWelcomeBar
        currentPage='ats-checker'
        resumeData={resumeData}
        analysisResult={
          analysisResult
            ? {
                jobType: analysisResult.jobType,
                atsScore: analysisResult.atsScore?.toString(),
              }
            : null
        }
      />

      <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <Section className='mb-6 sm:mb-8'>
          <div className='text-center mb-6 sm:mb-8'>
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              ATS Resume Checker
            </h1>
            <p
              className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 sm:px-0 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Get your resume analyzed for ATS compatibility across all job
              profiles. Receive detailed feedback and optimization suggestions.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className='flex justify-center mb-6 sm:mb-8'>
            <div
              className={`inline-flex rounded-lg p-1 w-full max-w-md sm:w-auto ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 text-sm sm:text-base flex-1 sm:flex-none ${
                  activeTab === 'upload'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className='hidden sm:inline'>📄 Upload & Analyze</span>
                <span className='sm:hidden'>📄 Upload</span>
              </button>

              <button
                onClick={() => {
                  if (!resumeData) {
                    toast.error(
                      'Please upload a resume and complete analysis first!'
                    );
                    return;
                  }
                  setActiveTab('analysis');
                }}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 text-sm sm:text-base flex-1 sm:flex-none ${
                  activeTab === 'analysis'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : resumeData
                      ? 'text-gray-600 hover:text-gray-800'
                      : 'text-gray-400 cursor-not-allowed'
                }`}
                disabled={!resumeData}
              >
                <span className='hidden sm:inline'>📊 Analysis Results</span>
                <span className='sm:hidden'>📊 Results</span>
              </button>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div
              className={`rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 mx-4 sm:mx-0 ${
                theme === 'dark'
                  ? 'bg-red-900/20 border border-red-800 text-red-200'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <p className='text-sm sm:text-base'>{error}</p>
            </div>
          )}

          {/* Tab content */}
          {activeTab === 'upload' && (
            <div className='max-w-2xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0'>
              {/* Clear Data Button - Show when there are analysis results */}
              {analysisResult && (
                <div
                  className={`rounded-lg p-4 border ${
                    theme === 'dark'
                      ? 'bg-green-900/20 border-green-800'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            theme === 'dark'
                              ? 'text-green-200'
                              : 'text-green-800'
                          }`}
                        >
                          Analysis Complete
                        </p>
                        <p
                          className={`text-xs ${
                            theme === 'dark'
                              ? 'text-green-300'
                              : 'text-green-600'
                          }`}
                        >
                          Your resume has been analyzed successfully
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClearData}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        theme === 'dark'
                          ? 'border border-red-600 text-red-400 hover:bg-red-900/20 hover:border-red-500'
                          : 'border border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400'
                      }`}
                    >
                      Clear Data
                    </button>
                  </div>
                </div>
              )}

              <FileUpload
                key={`file-upload-${resumeData ? 'with-data' : 'empty'}`}
                onFileUpload={handleFileUpload}
                loading={isLoading}
                accept={'.pdf,.docx,.doc,.txt'}
                maxSize={10 * 1024 * 1024} // 10MB
              />

              {/* Job Description Input and Analyze Button - Only show when resume data exists */}
              {resumeData && uploadedFile && (
                <div className='space-y-3 sm:space-y-4'>
                  <ATSAnalysis
                    file={uploadedFile}
                    onAnalyze={handleAnalysis}
                    error={error}
                    progress={progress}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className='space-y-4 sm:space-y-6 px-4 sm:px-0'>
              {resumeData ? (
                analysisResult ? (
                  <ResultsDisplay result={analysisResult} />
                ) : (
                  <div className='text-center py-8 sm:py-12'>
                    <div className='max-w-md mx-auto'>
                      <div className='text-4xl sm:text-6xl mb-3 sm:mb-4'>
                        📊
                      </div>
                      <h3
                        className={`text-lg sm:text-xl font-semibold mb-2 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Analysis Results
                      </h3>
                      <p
                        className={`mb-4 sm:mb-6 text-sm sm:text-base ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        Complete the analysis in the Upload & Analyze tab to
                        view detailed results here.
                      </p>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                          theme === 'dark'
                            ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Go to Upload & Analyze
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className='text-center py-8 sm:py-12'>
                  <div className='max-w-md mx-auto'>
                    <div className='text-4xl sm:text-6xl mb-3 sm:mb-4'>📄</div>
                    <h3
                      className={`text-lg sm:text-xl font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Upload Resume First
                    </h3>
                    <p
                      className={`mb-4 sm:mb-6 text-sm sm:text-base ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Please upload a resume and complete the analysis to view
                      results here.
                    </p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                        theme === 'dark'
                          ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Upload Resume
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Section>
      </main>
    </div>
  );
}
