'use client';

import { Button } from '@/components/ui/Button/Button';
import { signOut } from 'next-auth/react';

interface LogoutButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  size = 'md',
}) => {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <Button
      onClick={handleLogout}
      variant='outline'
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      <svg
        className='w-5 h-5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
        />
      </svg>
      Sign Out
    </Button>
  );
};
