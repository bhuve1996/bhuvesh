import React from 'react';

import { AIAssistant } from '../../resume/AIAssistant';
import { RichTextEditor } from '../../resume/RichTextEditor';

interface RichTextInputProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  context?: string;
  type?: 'experience' | 'project' | 'summary';
  showAI?: boolean;
  className?: string;
}

export const RichTextInput: React.FC<RichTextInputProps> = ({
  content,
  onChange,
  placeholder,
  maxLength,
  context,
  type,
  showAI = true,
  className = '',
}) => {
  return (
    <div className={className}>
      <RichTextEditor
        content={content}
        onChange={onChange}
        {...(placeholder && { placeholder })}
        {...(maxLength && { maxLength })}
      />
      {showAI && context && type && (
        <div className='mt-2'>
          <AIAssistant onSuggestion={onChange} context={context} type={type} />
        </div>
      )}
    </div>
  );
};

export default RichTextInput;
