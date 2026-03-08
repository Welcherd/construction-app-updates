import { forwardRef, useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const PullToRefresh = forwardRef(function PullToRefresh(
  { children, onRefresh, className, threshold = 80 },
  forwardedRef
) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const ref = forwardedRef || containerRef;

  const handleTouchStart = useCallback((e) => {
    if (ref.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, [ref]);

  const handleTouchMove = useCallback((e) => {
    if (!pulling || refreshing) return;
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    setPullDistance(Math.min(distance * 0.5, threshold * 1.5));
  }, [pulling, refreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling) return;
    setPulling(false);

    if (pullDistance >= threshold && onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    setPullDistance(0);
  }, [pulling, pullDistance, threshold, onRefresh]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [ref, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={ref}
      data-scroll-container
      className={cn("relative overflow-y-auto", className)}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 transition-all duration-200"
        style={{
          top: pullDistance > 0 ? pullDistance - 40 : -40,
          opacity: pullDistance / threshold,
        }}
      >
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10",
          refreshing && "animate-spin"
        )}>
          <Loader2 className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
          transition: pulling ? "none" : "transform 0.2s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
});
