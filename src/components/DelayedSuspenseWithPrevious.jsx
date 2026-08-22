import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';

function ReadyNotifier({ onReady, readyKey }) {
  useEffect(() => {
    onReady(readyKey);
  }, [readyKey]); // onReady стабильный
  return null;
}

export const DelayedSuspenseWithPrevious = ({
  children,
  fallback,
  delay = 500,
  currentKey,
}) => {
  // То, что реально видит пользователь
  const [visibleChildren, setVisibleChildren] = useState(children);
  const [visibleKey, setVisibleKey] = useState(currentKey);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const pendingKeyRef = useRef(null);
  const timerRef = useRef(null);
  const latestChildrenRef = useRef(children);
  latestChildrenRef.current = children;

  // Стабильный колбэк — никаких устаревших замыканий
  const handleReady = useCallback((readyKey) => {
    // Принимаем ТОЛЬКО актуальный переход
    if (readyKey !== pendingKeyRef.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Коммитим только этот экран
    setVisibleChildren(latestChildrenRef.current);
    setVisibleKey(readyKey);
    pendingKeyRef.current = null;
    setIsTransitioning(false);
    setShowFallback(false);
  }, []);

  useEffect(() => {
    // Уже показываем этот экран и нет активного перехода
    if (currentKey === visibleKey && pendingKeyRef.current === null) {
      return;
    }

    // Отменяем предыдущий таймер
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Вернулись на тот экран, который сейчас на экране → просто отменяем переход
    if (currentKey === visibleKey) {
      pendingKeyRef.current = null;
      setIsTransitioning(false);
      setShowFallback(false);
      return;
    }

    // Начинаем новый переход
    pendingKeyRef.current = currentKey;
    setIsTransitioning(true);
    setShowFallback(false);

    timerRef.current = setTimeout(() => {
      if (pendingKeyRef.current === currentKey) {
        setShowFallback(true);
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentKey, delay, visibleKey]);

  return (
    <>
      {/* Стабильный экран — никогда не мигает промежуточными */}
      {!showFallback && visibleChildren}

      {/* Целевой экран грузится в фоне.
          Пока delay не прошёл — полностью скрыт (display: none),
          после delay — показываем fallback или уже готовый экран */}
      {isTransitioning && (
        <div style={{ display: showFallback ? 'contents' : 'none' }}>
          <Suspense fallback={showFallback ? fallback : null}>
            {children}
            <ReadyNotifier onReady={handleReady} readyKey={currentKey} />
          </Suspense>
        </div>
      )}
    </>
  );
};