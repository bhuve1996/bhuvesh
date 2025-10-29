'use client';

import React, { useState, useEffect } from 'react';

import { multiResumeStorage } from '@/lib/resume/multiResumeStorage';
import { ResumeVariant } from '@/types/multiResume';
import { useResumeStore } from '@/store/resumeStore';

interface ResumeComparisonProps {
  groupId: string;
  onUpdate?: () => void;
}

export const ResumeComparison: React.FC<ResumeComparisonProps> = ({
  groupId,
  onUpdate,
}) => {
  const [variants, setVariants] = useState<ResumeVariant[]>([]);
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>('');
  const [availableJobCategories, setAvailableJobCategories] = useState<string[]>([]);

  useEffect(() => {
    const group = multiResumeStorage.getResumeGroups().find(g => g.id === groupId);
    if (group) {
      setVariants(group.variants);
      
      // Extract unique job categories from all analyses
      const categories = new Set<string>();
      group.variants.forEach(variant => {
        variant.analyses.forEach(analysis => {
          categories.add(analysis.jobCategory);
        });
      });
      setAvailableJobCategories(Array.from(categories));
    }
  }, [groupId]);

  const filteredVariants = selectedJobCategory
    ? variants.filter(v => v.analyses.some(a => a.jobCategory === selectedJobCategory))
    : variants;

  const sortedVariants = filteredVariants.sort((a, b) => {
    if (selectedJobCategory) {
      const aScore = a.analyses.find(analysis => analysis.jobCategory === selectedJobCategory)?.atsScore || 0;
      const bScore = b.analyses.find(analysis => analysis.jobCategory === selectedJobCategory)?.atsScore || 0;
      return bScore - aScore;
    }
    return (b.bestScore || 0) - (a.bestScore || 0);
  });

  const handleResumeSelect = (variant: ResumeVariant) => {
    useResumeStore.getState().setResumeData(variant.data);
    // You could also navigate to a specific page or show a modal
  };

  const handleResumeDelete = (variantId: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      multiResumeStorage.deleteResumeVariant(groupId, variantId);
      setVariants(prev => prev.filter(v => v.id !== variantId));
      onUpdate?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Resume Comparison
        </h3>
        
        {/* Job Category Filter */}
        {availableJobCategories.length > 0 && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by job category:
            </label>
            <select
              value={selectedJobCategory}
              onChange={(e) => setSelectedJobCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Categories</option>
              {availableJobCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {sortedVariants.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p>No resumes to compare</p>
          {selectedJobCategory && (
            <p className="text-sm">No resumes have been analyzed for {selectedJobCategory}</p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-medium text-gray-900 dark:text-white">
                  Resume Name
                </th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-medium text-gray-900 dark:text-white">
                  Best Score
                </th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-medium text-gray-900 dark:text-white">
                  Job Category
                </th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-medium text-gray-900 dark:text-white">
                  Analyses
                </th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-medium text-gray-900 dark:text-white">
                  Last Updated
                </th>
                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedVariants.map((variant, index) => {
                const relevantAnalysis = selectedJobCategory
                  ? variant.analyses.find(a => a.jobCategory === selectedJobCategory)
                  : variant.analyses.reduce((best, current) => 
                      current.atsScore > best.atsScore ? current : best, 
                      variant.analyses[0] || { atsScore: 0, jobCategory: 'N/A' }
                    );

                return (
                  <tr 
                    key={variant.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      index === 0 ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <td className="border border-gray-300 dark:border-gray-600 p-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {variant.name}
                          {index === 0 && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 px-2 py-1 rounded">
                              Best
                            </span>
                          )}
                        </div>
                        {variant.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {variant.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3">
                      {relevantAnalysis ? (
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          relevantAnalysis.atsScore >= 80 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                          relevantAnalysis.atsScore >= 60 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {relevantAnalysis.atsScore}%
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">No analysis</span>
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {relevantAnalysis?.jobCategory || 'N/A'}
                      </span>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {variant.analyses.length} analysis{variant.analyses.length !== 1 ? 'es' : ''}
                      </span>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(variant.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleResumeSelect(variant)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handleResumeDelete(variant.id)}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Best Resume Recommendation */}
      {sortedVariants.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Recommendation
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            {selectedJobCategory ? (
              <>
                Best resume for <strong>{selectedJobCategory}</strong>: <strong>{sortedVariants[0]?.name}</strong> 
                {sortedVariants[0]?.analyses.find(a => a.jobCategory === selectedJobCategory)?.atsScore && 
                  ` (${sortedVariants[0].analyses.find(a => a.jobCategory === selectedJobCategory)?.atsScore}% match)`
                }
              </>
            ) : (
              <>
                Your strongest resume overall: <strong>{sortedVariants[0]?.name}</strong> 
                {sortedVariants[0]?.bestScore && ` (${sortedVariants[0].bestScore}% best score)`}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
