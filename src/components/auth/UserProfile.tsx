'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';

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

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {session.user?.image && (
        <Image
          src={session.user.image}
          alt={session.user.name || 'User'}
          width={32}
          height={32}
          className='rounded-full'
        />
      )}
      <div className='flex flex-col'>
        <span className='text-sm font-medium text-foreground'>
          {session.user?.name || 'User'}
        </span>
        <span className='text-xs text-muted-foreground'>
          {session.user?.email}
        </span>
      </div>
      <LogoutButton size='sm' />
    </div>
  );
};
