'use client';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'carousel';
  onViewModeChange: (mode: 'grid' | 'carousel') => void;
  isCarouselCollapsed: boolean;
  onCarouselToggle: () => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  isCarouselCollapsed,
  onCarouselToggle,
}) => {
  return (
    <div className='flex justify-center mb-6 mt-8'>
      <div className='bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex items-center gap-1 shadow-sm border border-slate-200 dark:border-slate-700'>
        <div className='flex'>
          <button
            onClick={() => onViewModeChange('carousel')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'carousel'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            📱 Carousel
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            🔲 Grid
          </button>
        </div>

        {/* Always show collapse toggle for better UX */}
        <div className='h-4 w-px bg-slate-300 mx-1'></div>
        <button
          onClick={onCarouselToggle}
          className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
            isCarouselCollapsed
              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              : 'bg-white text-slate-900 shadow-sm hover:bg-slate-50'
          }`}
          title={
            isCarouselCollapsed
              ? 'Show carousel (Enter)'
              : 'Hide carousel (Esc)'
          }
        >
          <svg
            className={`w-3 h-3 transition-transform ${
              isCarouselCollapsed ? 'rotate-180' : ''
            }`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 15l7-7 7 7'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
