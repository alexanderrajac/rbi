import { useState, useEffect, useRef } from 'react';

/**
 * High-performance smooth numeric counter hook for trading & financial terminals.
 * Uses requestAnimationFrame with easeOutExpo curve for realistic market number roll.
 */
export const useAnimatedCounter = (targetValue, duration = 1200, enabled = true) => {
  const [displayValue, setDisplayValue] = useState(0);
  const targetNum = typeof targetValue === 'number' ? targetValue : parseFloat(targetValue) || 0;
  const prevTargetRef = useRef(targetNum);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayValue(targetNum);
      return;
    }

    const startValue = displayValue;
    const diff = targetNum - startValue;
    if (diff === 0) return;

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Exponential ease-out for realistic financial terminal ticks
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + diff * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetNum);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetNum, duration, enabled]);

  return displayValue;
};
