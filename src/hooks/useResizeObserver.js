import { useEffect, useRef, useCallback } from 'react';

export function useResizeObserver({
  ref,
  onResize,
  disabled = false,
  debounce = 0,
  box = 'content-box',
}) {
  const timerRef = useRef(null);
  const observerRef = useRef(null);
  
  // Стабильная версия onResize
  const stableOnResize = useCallback(onResize, [onResize]);

  useEffect(() => {
    const element = ref.current;
    
    // Если нет элемента или отключено - выходим
    if (!element || disabled) {
      return;
    }

    // Создаем наблюдатель
    observerRef.current = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;

      // Если есть дебаунс
      if (debounce > 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          stableOnResize(entry);
        }, debounce);
      } else {
        stableOnResize(entry);
      }
    });

    // Начинаем наблюдение
    observerRef.current.observe(element, { box });

    // Очистка
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [ref, stableOnResize, disabled, debounce, box]);
};
