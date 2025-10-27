'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggablePanelOptions {
  initialPosition?: Position;
  boundary?: 'viewport' | 'none';
  persistPosition?: boolean;
  storageKey?: string;
}

interface UseDraggablePanelReturn {
  position: Position;
  isDragging: boolean;
  dragHandleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    style: React.CSSProperties;
  };
  panelStyle: React.CSSProperties;
  resetPosition: () => void;
}

const DEFAULT_POSITION: Position = { x: 0, y: 0 };

export const useDraggablePanel = ({
  initialPosition = DEFAULT_POSITION,
  boundary = 'viewport',
  persistPosition = true,
  storageKey = 'floating-panel-position',
}: UseDraggablePanelOptions = {}): UseDraggablePanelReturn => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const panelRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);

  // Load saved position from localStorage
  useEffect(() => {
    if (persistPosition && typeof window !== 'undefined') {
      try {
        const savedPosition = localStorage.getItem(storageKey);
        if (savedPosition) {
          const parsed = JSON.parse(savedPosition) as Position;
          setPosition(parsed);
        } else {
          // Set default position if no saved position exists
          const defaultPosition = {
            x: Math.max(0, window.innerWidth - 400),
            y: 100,
          };
          setPosition(defaultPosition);
        }
      } catch (_error) {
        // Failed to load panel position from localStorage
        // Set default position on error
        const defaultPosition = {
          x: Math.max(0, window.innerWidth - 400),
          y: 100,
        };
        setPosition(defaultPosition);
      }
    }
  }, [persistPosition, storageKey]);

  // Save position to localStorage
  const savePosition = useCallback(
    (newPosition: Position) => {
      if (persistPosition && typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(newPosition));
        } catch (_error) {
          // Failed to save panel position to localStorage
        }
      }
    },
    [persistPosition, storageKey]
  );

  // Constrain position within viewport
  const constrainPosition = useCallback(
    (pos: Position): Position => {
      if (boundary !== 'viewport' || !panelRef.current) {
        return pos;
      }

      const panelRect = panelRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const constrainedX = Math.max(
        0,
        Math.min(pos.x, viewportWidth - panelRect.width)
      );
      const constrainedY = Math.max(
        0,
        Math.min(pos.y, viewportHeight - panelRect.height)
      );

      return { x: constrainedX, y: constrainedY };
    },
    [boundary]
  );

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    isMouseDownRef.current = true;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const touch = e.touches[0];
    if (!touch) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });

    // Add global event listeners
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !isMouseDownRef.current) return;

      e.preventDefault();
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };

      const constrainedPosition = constrainPosition(newPosition);
      setPosition(constrainedPosition);
    },
    [isDragging, dragOffset, constrainPosition]
  );

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;

      const newPosition = {
        x: touch.clientX - dragOffset.x,
        y: touch.clientY - dragOffset.y,
      };

      const constrainedPosition = constrainPosition(newPosition);
      setPosition(constrainedPosition);
    },
    [isDragging, dragOffset, constrainPosition]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      isMouseDownRef.current = false;
      savePosition(position);
    }

    // Remove global event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging, position, savePosition, handleMouseMove]);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(position);
    }

    // Remove global event listeners
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [isDragging, position, savePosition, handleTouchMove]);

  // Reset position to default
  const resetPosition = useCallback(() => {
    const defaultPosition = {
      x: Math.max(0, window.innerWidth - 400),
      y: 100,
    };
    setPosition(defaultPosition);
    savePosition(defaultPosition);
  }, [savePosition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Drag handle props
  const dragHandleProps = {
    onMouseDown: handleMouseDown,
    onTouchStart: handleTouchStart,
    style: {
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none' as const,
    },
  };

  // Panel style with improved smoothness
  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 50,
    transform: isDragging ? 'scale(1.02)' : 'scale(1)',
    transition: isDragging
      ? 'none'
      : 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: isDragging ? 'transform, left, top' : 'auto',
  };

  return {
    position,
    isDragging,
    dragHandleProps,
    panelStyle,
    resetPosition,
  };
};
