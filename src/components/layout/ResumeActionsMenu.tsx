'use client';

import React, { useState } from 'react';

import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { RenameResumeModal } from '@/components/modals/RenameResumeModal';
import { Icons } from '@/components/ui/SVG/SVG';
import { multiResumeStorage } from '@/lib/resume/multiResumeStorage';
import { useResumeStore } from '@/store/resumeStore';

interface ResumeActionsMenuProps {
  groupId: string;
  variantId: string;
  onClose: () => void;
  onAction?: () => void;
}

export const ResumeActionsMenu: React.FC<ResumeActionsMenuProps> = ({
  groupId,
  variantId,
  onClose,
  onAction,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    // Load resume into builder
    const variant = multiResumeStorage.getResumeVariant(groupId, variantId);

    if (variant) {
      useResumeStore.getState().setResumeData(variant.data);
      window.location.href = '/resume/builder';
    }
    onClose();
  };

  const handleDuplicate = () => {
    try {
      multiResumeStorage.duplicateResumeVariant(groupId, variantId);
      onAction?.();
      onClose();
    } catch (error) {
      console.error('Failed to duplicate resume:', error);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleRename = () => {
    setShowRenameModal(true);
  };

  const handleDeleteConfirm = () => {
    try {
      multiResumeStorage.deleteResumeVariant(groupId, variantId);
      onAction?.();
      onClose();
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  const handleRenameConfirm = (newName: string) => {
    try {
      multiResumeStorage.updateResumeVariant(groupId, variantId, {
        name: newName,
      });
      onAction?.();
      onClose();
    } catch (error) {
      console.error('Failed to rename resume:', error);
    }
  };

  return (
    <>
      <div className='relative'>
        <button
          onClick={e => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className='p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors'
        >
          <Icons.MoreVertical className='w-4 h-4 text-gray-400' />
        </button>

        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className='fixed inset-0 z-10'
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <div className='absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20'>
              <div className='py-1'>
                <button
                  onClick={handleEdit}
                  className='w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                >
                  ✏️ Edit Resume
                </button>
                <button
                  onClick={handleDuplicate}
                  className='w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                >
                  📋 Duplicate
                </button>
                <button
                  onClick={handleRename}
                  className='w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                >
                  🏷️ Rename
                </button>
                <button
                  onClick={handleDelete}
                  className='w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <RenameResumeModal
          groupId={groupId}
          variantId={variantId}
          onClose={() => setShowRenameModal(false)}
          onRename={handleRenameConfirm}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          groupId={groupId}
          variantId={variantId}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};
