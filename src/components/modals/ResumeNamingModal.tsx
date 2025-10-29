'use client';

import React, { useEffect, useState } from 'react';

import { useMultiResumeStore } from '@/store/multiResumeStore';

interface ResumeNamingModalProps {
  fileName: string;
  onSubmit: (resumeName: string, groupId?: string) => void;
  onClose: () => void;
}

export const ResumeNamingModal: React.FC<ResumeNamingModalProps> = ({
  fileName,
  onSubmit,
  onClose,
}) => {
  const [resumeName, setResumeName] = useState('');
  const [groupName, setGroupName] = useState('');
  const { groups, loadGroups } = useMultiResumeStore();
  const [useExistingGroup, setUseExistingGroup] = useState(groups.length > 0);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  useEffect(() => {
    // Auto-generate name from filename
    const baseName = fileName.replace(/\.[^/.]+$/, ''); // Remove extension
    setResumeName(baseName);

    // Auto-generate group name if no groups exist
    if (groups.length === 0) {
      setGroupName('My Resumes');
    }
  }, [fileName, groups.length]);

  // Load groups on mount
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Update useExistingGroup when groups change
  useEffect(() => {
    if (groups.length === 0) {
      setUseExistingGroup(false);
    }
  }, [groups]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Use filename as backup if no name provided
    const finalResumeName =
      resumeName.trim() || fileName.replace(/\.[^/.]+$/, '');

    if (useExistingGroup && selectedGroupId) {
      onSubmit(finalResumeName, selectedGroupId);
    } else if (!useExistingGroup && groupName.trim()) {
      // Create new group first
      const groupId = multiResumeStorage.createResumeGroup(groupName.trim());
      onSubmit(finalResumeName, groupId);
    } else {
      // Use default group or create one
      let groupId = groups[0]?.id;
      if (!groupId) {
        groupId = multiResumeStorage.createResumeGroup('My Resumes');
      }
      onSubmit(finalResumeName, groupId);
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    if (useExistingGroup) {
      return groups.length > 0 && selectedGroupId !== '';
    } else {
      return groupName.trim() !== '';
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
          Name Your Resume
        </h3>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Resume Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Resume Name *
            </label>
            <input
              type='text'
              value={resumeName}
              onChange={e => setResumeName(e.target.value)}
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='e.g., Software Engineer Resume'
              required
              autoFocus
            />
          </div>

          {/* Group Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Save to Group
            </label>

            <div className='space-y-3'>
              {/* Use Existing Group */}
              <div>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    checked={useExistingGroup}
                    onChange={() => setUseExistingGroup(true)}
                    disabled={groups.length === 0}
                    className='mr-2 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                  />
                  <span
                    className={`text-sm ${
                      groups.length === 0
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Use existing group{' '}
                    {groups.length === 0 && '(No groups available)'}
                  </span>
                </label>

                {useExistingGroup && groups.length > 0 && (
                  <select
                    value={selectedGroupId}
                    onChange={e => setSelectedGroupId(e.target.value)}
                    className='w-full mt-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    <option value=''>Select a group</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                )}

                {useExistingGroup && groups.length === 0 && (
                  <div className='mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400'>
                    No groups available. Please create a new group.
                  </div>
                )}
              </div>

              {/* Create New Group */}
              <div>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    checked={!useExistingGroup}
                    onChange={() => setUseExistingGroup(false)}
                    className='mr-2 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    Create new group
                  </span>
                </label>

                {!useExistingGroup && (
                  <input
                    type='text'
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    className='w-full mt-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='e.g., Software Engineer Resumes'
                  />
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={!isFormValid()}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Save Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
