'use client';

import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

import { Button } from '@/components/atoms/Button/Button';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  id?: string;
  'aria-label'?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start typing...',
  className = '',
  maxLength = 500,
  id,
  'aria-label': ariaLabel,
}) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
      }),
    ],
    content: content || '',
    immediatelyRender: false, // Fix SSR hydration issues
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();

      // Check length limit
      if (text.length <= maxLength) {
        onChange(html);
      } else {
        // Revert to previous content if over limit
        editor.commands.setContent(content);
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-sm max-w-none focus:outline-none text-sm sm:text-base ${className}`,
        ...(id && { id }),
        ...(ariaLabel && { 'aria-label': ariaLabel }),
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
  });

  // Update editor content when content prop changes
  React.useEffect(() => {
    if (editor && content !== undefined) {
      try {
        const currentContent = editor.getHTML();
        if (currentContent !== content) {
          editor.commands.setContent(content || '');
        }
      } catch (_error) {
        // Editor might not be ready yet, ignore the error silently
        // This is expected in test environments or during SSR
      }
    }
  }, [editor, content]);

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor?.chain().focus().toggleOrderedList().run();
  };

  const insertBulletPoint = () => {
    editor?.chain().focus().insertContent('• ').run();
  };

  const clearFormatting = () => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run();
  };

  if (!isClient || !editor) {
    return (
      <div className='border border-border rounded-lg p-4 min-h-[120px] bg-muted animate-pulse'>
        <div className='h-4 bg-muted-foreground/20 rounded w-1/4 mb-2'></div>
        <div className='h-4 bg-muted-foreground/20 rounded w-3/4'></div>
      </div>
    );
  }

  const currentLength = editor.getText().length;
  const isOverLimit = currentLength > maxLength;

  return (
    <div className='border border-border rounded-lg overflow-hidden bg-background'>
      {/* Toolbar */}
      <div className='flex items-center gap-1 p-1 sm:p-2 bg-muted border-b border-border'>
        <Button
          type='button'
          variant='outline'
          size='xs'
          onClick={toggleBold}
          className={`h-6 w-6 sm:h-8 sm:w-8 p-0 ${editor.isActive('bold') ? 'bg-accent' : ''}`}
          title='Bold'
        >
          <svg
            className='w-4 h-4 sm:w-6 sm:h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M5 4a1 1 0 011-1h5.5a3.5 3.5 0 013.5 3.5v.5a3 3 0 01-1.5 2.6A3.5 3.5 0 0115 13.5V14a3.5 3.5 0 01-3.5 3.5H6a1 1 0 01-1-1V4zm2 1v4h4.5a1.5 1.5 0 001.5-1.5V6.5A1.5 1.5 0 0011.5 5H7zm0 6v4h5.5a1.5 1.5 0 001.5-1.5v-.5a1.5 1.5 0 00-1.5-1.5H7z' />
          </svg>
        </Button>

        <Button
          type='button'
          variant='outline'
          size='xs'
          onClick={toggleItalic}
          className={`h-6 w-6 sm:h-8 sm:w-8 p-0 ${editor.isActive('italic') ? 'bg-accent' : ''}`}
          title='Italic'
        >
          <svg
            className='w-4 h-4 sm:w-6 sm:h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M8 3a1 1 0 000 2h1.5l-3 10H5a1 1 0 100 2h6a1 1 0 100-2h-1.5l3-10H14a1 1 0 100-2H8z' />
          </svg>
        </Button>

        <div className='w-px h-4 sm:h-6 bg-border mx-1'></div>

        <Button
          type='button'
          variant='outline'
          size='xs'
          onClick={toggleBulletList}
          className={`h-6 w-6 sm:h-8 sm:w-8 p-0 ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
          title='Bullet List'
        >
          <svg
            className='w-4 h-4 sm:w-6 sm:h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M3 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zM11 4a1 1 0 10-2 0v12a1 1 0 102 0V4z' />
          </svg>
        </Button>

        <Button
          type='button'
          variant='outline'
          size='xs'
          onClick={toggleOrderedList}
          className={`h-6 w-6 sm:h-8 sm:w-8 p-0 ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
          title='Numbered List'
        >
          <svg
            className='w-4 h-4 sm:w-6 sm:h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M2 3a1 1 0 011-1h2a1 1 0 110 2H4v1h1a1 1 0 110 2H3a1 1 0 01-1-1V3zm0 4a1 1 0 011-1h2a1 1 0 110 2H4v1h1a1 1 0 110 2H3a1 1 0 01-1-1V7zm0 4a1 1 0 011-1h2a1 1 0 110 2H4v1h1a1 1 0 110 2H3a1 1 0 01-1-1v-2zm0 4a1 1 0 011-1h2a1 1 0 110 2H4v1h1a1 1 0 110 2H3a1 1 0 01-1-1v-2z' />
          </svg>
        </Button>

        <div className='w-px h-4 sm:h-6 bg-border mx-1'></div>

        <Button
          type='button'
          variant='outline'
          size='xs'
          onClick={insertBulletPoint}
          className='h-6 w-6 sm:h-8 sm:w-8 p-0'
          title='Insert Bullet Point'
        >
          <svg
            className='w-4 h-4 sm:w-6 sm:h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
          </svg>
        </Button>

        <Button
          type='button'
          variant='outline'
          size='xs'
          onClick={clearFormatting}
          className='h-6 w-6 sm:h-8 sm:w-8 p-0'
          title='Clear Formatting'
        >
          <svg
            className='w-4 h-4 sm:w-6 sm:h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M4 3a1 1 0 000 2h12a1 1 0 100-2H4zm0 4a1 1 0 000 2h12a1 1 0 100-2H4zm0 4a1 1 0 000 2h12a1 1 0 100-2H4zm0 4a1 1 0 000 2h12a1 1 0 100-2H4z' />
          </svg>
        </Button>

        <div className='flex-1'></div>

        {/* Character count */}
        <div
          className={`text-xs px-1 py-0.5 sm:px-2 sm:py-1 rounded ${
            isOverLimit
              ? 'text-destructive bg-destructive/10'
              : currentLength > maxLength * 0.8
                ? 'text-warning-600 bg-warning-50 dark:text-warning-400 dark:bg-warning-950/20'
                : 'text-muted-foreground'
          }`}
        >
          {currentLength}/{maxLength}
        </div>
      </div>

      {/* Editor */}
      <div className='p-2 sm:p-4 min-h-[100px] sm:min-h-[120px]'>
        <EditorContent editor={editor} />
      </div>

      {/* Error message */}
      {isOverLimit && (
        <div className='px-2 sm:px-4 pb-2'>
          <p className='text-xs text-destructive'>
            Character limit exceeded. Please shorten your text.
          </p>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
