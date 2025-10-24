'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';
import { Tooltip } from '@/components/ui/Tooltip/Tooltip';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className='w-8 h-8 bg-muted rounded-full animate-pulse'></div>
        <div className='w-20 h-4 bg-muted rounded animate-pulse'></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={className}>
        <LoginButton size='sm' />
      </div>
    );
  }

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = session.user?.name ? getInitials(session.user.name) : 'U';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* User Avatar/Initials with Tooltip */}
      <Tooltip
        content={`${session.user?.name || 'User'} - ${session.user?.email}`}
        position='bottom'
        delay={200}
      >
        <div className='relative group cursor-pointer'>
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={32}
              height={32}
              className='rounded-full hover:ring-2 hover:ring-primary-500/50 transition-all duration-200'
            />
          ) : (
            <div className='w-8 h-8 bg-primary-500 text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium hover:bg-primary-600 transition-colors duration-200'>
              {userInitials}
            </div>
          )}
        </div>
      </Tooltip>

      {/* Logout Button with Tooltip */}
      <Tooltip
        content='Sign Out'
        position='bottom'
        delay={200}
      >
        <div>
          <LogoutButton size='sm' showText={false} />
        </div>
      </Tooltip>
    </div>
  );
};
