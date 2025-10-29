'use client';

import React, { useState } from 'react';

import { ResumeActionsMenu } from '@/components/layout/ResumeActionsMenu';
import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import { Icons } from '@/components/ui/SVG/SVG';
import { useMultiResumeStore } from '@/store/multiResumeStore';

interface ResumeDropdownContentProps {
  onResumeSelect: (groupId: string, variantId: string) => void;
  onClose: () => void;
}

export const ResumeDropdownContent: React.FC<ResumeDropdownContentProps> = ({
  onResumeSelect,
  onClose,
}) => {
  // Use global state
  const { groups, currentResume, addGroup, loadGroups } = useMultiResumeStore();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleCreateGroup = (name: string, description?: string) => {
    try {
      addGroup(name, description);
      setShowCreateGroup(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleResumeAction = () => {
    // Refresh groups after any action
    loadGroups();
  };

  return (
    <div className='p-4'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
          My Resumes
        </h3>
        <button
          onClick={() => setShowCreateGroup(true)}
          className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors'
        >
          + New Group
        </button>
      </div>

      {/* Groups List */}
      <div className='space-y-2 max-h-96 overflow-y-auto'>
        {groups.length === 0 ? (
          <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
            <div className='text-4xl mb-2'>📄</div>
            <p className='font-medium'>No resumes yet</p>
            <p className='text-sm'>Create your first resume group</p>
          </div>
        ) : (
          groups.map(group => (
            <div
              key={group.id}
              className='border border-gray-200 dark:border-gray-600 rounded-lg'
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className='w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg'
              >
                <div className='text-left'>
                  <div className='font-medium text-gray-900 dark:text-white'>
                    {group.name}
                  </div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    {group.variants.length} resume
                    {group.variants.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <Icons.ChevronDown
                  className={`w-4 h-4 transition-transform text-gray-400 ${
                    expandedGroups.has(group.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Group Variants */}
              {expandedGroups.has(group.id) && (
                <div className='border-t border-gray-200 dark:border-gray-600'>
                  {group.variants.length === 0 ? (
                    <div className='p-3 text-center text-gray-500 dark:text-gray-400 text-sm'>
                      No resumes in this group
                    </div>
                  ) : (
                    group.variants.map(variant => (
                      <div
                        key={variant.id}
                        className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors ${
                          currentResume?.id === variant.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500'
                            : ''
                        }`}
                        onClick={() => onResumeSelect(group.id, variant.id)}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex-1 min-w-0'>
                            <div className='font-medium text-gray-900 dark:text-white truncate'>
                              {variant.name}
                            </div>
                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                              Updated{' '}
                              {new Date(variant.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className='flex items-center space-x-2 ml-2'>
                            {variant.bestScore && (
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  variant.bestScore >= 80
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                    : variant.bestScore >= 60
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                }`}
                              >
                                {variant.bestScore}%
                              </span>
                            )}
                            <ResumeActionsMenu
                              groupId={group.id}
                              variantId={variant.id}
                              onClose={onClose}
                              onAction={handleResumeAction}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
};
