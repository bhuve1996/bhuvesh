import React from 'react';

import type { TabsProps } from '@/types/ui';

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  className = '',
  variant: _variant = 'default',
  ...props
}) => {
  const [activeTab, setActiveTab] = React.useState(
    defaultActiveTab || items[0]?.id || ''
  );

  return (
    <div className={`tabs ${className}`} {...props}>
      {/* Tab Navigation */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === item.id
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                cursor-pointer
              `}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='mt-6'>
        {items.find(item => item.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;
