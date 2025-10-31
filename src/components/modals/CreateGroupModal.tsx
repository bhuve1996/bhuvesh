'use client';

import React, { useState } from 'react';

interface CreateGroupModalProps {
  onClose: () => void;
  onCreate: (name: string, description?: string) => void;
  existingGroupNames?: string[];
  editMode?: boolean;
  initialName?: string;
  initialDescription?: string;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  onCreate,
  existingGroupNames = [],
  editMode = false,
  initialName = '',
  initialDescription = '',
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error
    setError('');

    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    // Check for duplicate names (case-insensitive), excluding the current name if editing
    if (
      existingGroupNames.some(
        groupName =>
          groupName.toLowerCase() === name.trim().toLowerCase() &&
          (!editMode || groupName.toLowerCase() !== initialName.toLowerCase())
      )
    ) {
      setError('A group with this name already exists');
      return;
    }

    onCreate(name.trim(), description.trim() || undefined);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
          {editMode ? 'Edit Resume Group' : 'Create Resume Group'}
        </h3>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Error Message */}
          {error && (
            <div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
              <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
            </div>
          )}

          {/* Group Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Group Name *
            </label>
            <input
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='e.g., Software Engineer Resumes'
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='e.g., Resumes for software engineering positions'
              rows={3}
            />
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
              disabled={!name.trim()}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {editMode ? 'Update Group' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
