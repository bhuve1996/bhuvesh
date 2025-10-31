'use client';

import React, { useEffect, useState } from 'react';

import { UnifiedWelcomeBarWithResumeDropdown } from '@/components/layout/UnifiedWelcomeBarWithResumeDropdown';
import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import { multiResumeStorage } from '@/lib/resume/multiResumeStorage';
import { ResumeGroup } from '@/types/multiResume';
// import { ResumeComparison } from '@/components/resume/ResumeComparison';

export default function ResumeManagerPage() {
  const [groups, setGroups] = useState<ResumeGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    setGroups(multiResumeStorage.getResumeGroups());
  }, []);

  const handleCreateGroup = (name: string, description?: string) => {
    multiResumeStorage.createResumeGroup(name, description);
    setGroups(multiResumeStorage.getResumeGroups());
    setShowCreateGroup(false);
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(selectedGroup === groupId ? null : groupId);
  };

  const handleGroupsUpdate = () => {
    setGroups(multiResumeStorage.getResumeGroups());
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted'>
      <UnifiedWelcomeBarWithResumeDropdown currentPage='manager' />

      <main className='container mx-auto px-4 py-6'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Resume Groups
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                Organize and manage your resume variants
              </p>
            </div>
            <button
              onClick={() => setShowCreateGroup(true)}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              + New Group
            </button>
          </div>

          {/* Groups List */}
          {groups.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>📄</div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                No resume groups yet
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                Create your first resume group to get started
              </p>
              <button
                onClick={() => setShowCreateGroup(true)}
                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Create Your First Group
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {groups.map(group => (
                <ResumeGroupCard
                  key={group.id}
                  group={group}
                  isSelected={selectedGroup === group.id}
                  onSelect={() => handleGroupSelect(group.id)}
                  onUpdate={handleGroupsUpdate}
                />
              ))}
            </div>
          )}

          {/* Selected Group Details */}
          {selectedGroup && (
            <div>
              {/* <ResumeComparison
                groupId={selectedGroup}
                onUpdate={handleGroupsUpdate}
              /> */}
            </div>
          )}
        </div>
      </main>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
          existingGroupNames={groups.map(g => g.name)}
        />
      )}
    </div>
  );
}

// Resume Group Card Component
const ResumeGroupCard: React.FC<{
  group: ResumeGroup;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: () => void;
}> = ({ group, isSelected, onSelect, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [allGroups, setAllGroups] = useState<ResumeGroup[]>([]);
  const totalVariants = group.variants.length;
  // const hasAnalyses = group.variants.some(v => v.analyses.length > 0);
  const bestScore = Math.max(...group.variants.map(v => v.bestScore || 0), 0);

  const handleEditGroup = (name: string, description?: string) => {
    multiResumeStorage.updateResumeGroup(group.id, { name, description });
    onUpdate();
    setShowEditModal(false);
  };

  const handleDeleteGroup = () => {
    if (
      confirm(
        `Are you sure you want to delete "${group.name}" and all its resumes?`
      )
    ) {
      multiResumeStorage.deleteResumeGroup(group.id);
      onUpdate();
    }
  };

  return (
    <>
      <div
        className={`border rounded-lg p-6 cursor-pointer transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
        onClick={onSelect}
      >
        <div className='flex items-start justify-between mb-4'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              {group.name}
            </h3>
            {group.description && (
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                {group.description}
              </p>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <button
              onClick={e => {
                e.stopPropagation();
                setAllGroups(multiResumeStorage.getResumeGroups());
                setShowEditModal(true);
              }}
              className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
              title='Edit group'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                handleDeleteGroup();
              }}
              className='p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors'
              title='Delete group'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                />
              </svg>
            </button>
            <div className='text-right'>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {totalVariants}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                resume{totalVariants !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-gray-600 dark:text-gray-400'>
              Best Score:
            </span>
            {bestScore > 0 ? (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  bestScore >= 80
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : bestScore >= 60
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                {bestScore}%
              </span>
            ) : (
              <span className='text-gray-400 dark:text-gray-500'>
                No analyses
              </span>
            )}
          </div>

          <div className='flex items-center justify-between text-sm'>
            <span className='text-gray-600 dark:text-gray-400'>
              Last Updated:
            </span>
            <span className='text-gray-900 dark:text-white'>
              {new Date(group.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {isSelected && (
          <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-blue-600 dark:text-blue-400'>
              Click to view resume comparison ↓
            </p>
          </div>
        )}
      </div>

      {/* Edit Group Modal */}
      {showEditModal && (
        <CreateGroupModal
          onClose={() => setShowEditModal(false)}
          onCreate={handleEditGroup}
          existingGroupNames={allGroups.map(g => g.name)}
          editMode={true}
          initialName={group.name}
          initialDescription={group.description ?? ''}
        />
      )}
    </>
  );
};
