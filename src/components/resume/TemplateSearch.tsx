'use client';

interface TemplateSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TemplateSearch: React.FC<TemplateSearchProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6'>
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Search */}
        <div className='flex-1'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search templates...'
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className='w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-500'
            />
            <svg
              className='absolute left-3 top-3.5 h-5 w-5 text-slate-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
