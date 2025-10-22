import React, { ReactNode } from 'react';

import { Button } from '../Button';

interface ItemCardProps {
  children: ReactNode;
  onRemove: () => void;
  removeLabel: string;
  removeIcon?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  children,
  onRemove,
  removeLabel,
  removeIcon = '🗑️',
}) => {
  return (
    <div className='border-2 border-border rounded-xl p-6 bg-muted/20 hover:bg-muted/30 transition-colors'>
      {children}
      <div className='flex justify-end mt-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={onRemove}
          className='text-red-500 hover:bg-red-50 border-red-200 hover:border-red-300'
        >
          {removeIcon} {removeLabel}
        </Button>
      </div>
    </div>
  );
};

export default ItemCard;
