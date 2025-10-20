import { useState, useCallback } from 'react';

interface UsePullRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
}

export function usePullRefresh({ onRefresh, threshold = 80, disabled = false }: UsePullRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    // Only trigger if scrolled to top
    if (window.scrollY > 0) return;
    
    const touch = e.touches[0];
    return touch;
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent, startY: number) => {
    if (disabled || isRefreshing) return;
    
    const touch = e.touches[0];
    const distance = Math.max(0, touch.clientY - startY);
    
    if (distance > 0) {
      e.preventDefault(); // Prevent scrolling
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  }, [disabled, isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing) return;
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
  }, [disabled, isRefreshing, pullDistance, threshold, onRefresh]);

  const pullToRefreshProps = {
    onTouchStart: (e: React.TouchEvent) => {
      const startTouch = handleTouchStart(e);
      if (startTouch) {
        const startY = startTouch.clientY;
        
        const handleMove = (moveEvent: TouchEvent) => {
          handleTouchMove(moveEvent as any, startY);
        };
        
        const handleEnd = () => {
          document.removeEventListener('touchmove', handleMove);
          document.removeEventListener('touchend', handleEnd);
          handleTouchEnd();
        };
        
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
      }
    },
  };

  return {
    isRefreshing,
    pullDistance,
    pullToRefreshProps,
  };
}