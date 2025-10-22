import React from 'react';

interface ChevronIconProps {
  direction: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({
  direction,
  className = 'w-6 h-6',
}) => {
  const getPath = () => {
    switch (direction) {
      case 'up':
        return 'M5 15l7-7 7 7';
      case 'down':
        return 'M19 9l-7 7-7-7';
      case 'left':
        return 'M15 19l-7-7 7-7';
      case 'right':
        return 'M9 5l7 7-7 7';
      default:
        return 'M19 9l-7 7-7-7';
    }
  };

  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d={getPath()}
      />
    </svg>
  );
};

export default ChevronIcon;
