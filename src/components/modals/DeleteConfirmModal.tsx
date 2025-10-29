'use client';

import React, { useState, useEffect } from 'react';

import { multiResumeStorage } from '@/lib/resume/multiResumeStorage';

interface DeleteConfirmModalProps {
  groupId: string;
  variantId: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  groupId,
  variantId,
  onClose,
  onConfirm,
}) => {
  const [resumeName, setResumeName] = useState('');

  useEffect(() => {
    const variant = multiResumeStorage.getResumeVariant(groupId, variantId);
    if (variant) {
      setResumeName(variant.name);
    }
  }, [groupId, variantId]);

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Delete Resume
        </h3>
        
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>"{resumeName}"</strong>? 
            This action cannot be undone.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ This will permanently delete the resume and all its analysis data.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Resume
          </button>
        </div>
      </div>
    </div>
  );
};
