import { useState, useEffect, useRef } from 'react';

/**
 * Анимирует персонажа по всем клеткам от prevIndex до currentIndex
 * @param {Array} cells
 * @param {number} cellIndex
 * @param {number} stepDuration - длительность одного шага (мс)
 * @param {Function} onComplete - вызывается после окончания всей анимации
 */

export function useCharacterPath(cells, cellIndex, onComplete) {
  const [animatedIndex, setAnimatedIndex] = useState(cellIndex);
  const isAnimating = useRef(false);
  const timeoutRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // всегда актуальный колбэк
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (animatedIndex === cellIndex) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isAnimating.current = true;

    const from = animatedIndex;
    const to = cellIndex;
    const direction = to > from ? 1 : -1;
    const steps = Math.abs(to - from);

    const stepDuration = 300 - (steps - 1) * 30;

    let currentStep = 0;

    const step = () => {
      currentStep++;
      const nextIndex = from + currentStep * direction;
      setAnimatedIndex(nextIndex);

      if (currentStep < steps) {
        timeoutRef.current = setTimeout(step, stepDuration);
      } else {
        // анимация полностью закончилась
        isAnimating.current = false;
        onCompleteRef?.current?.(nextIndex); // ← сюда передаём итоговый индекс
      }
    };

    timeoutRef.current = setTimeout(step, 16);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [cellIndex]);

  const currentAnimatedCell = cells[animatedIndex] ?? cells[0];

  return {
    animatedCell: currentAnimatedCell,
    animatedIndex,
    isAnimating: isAnimating.current,
  };
}