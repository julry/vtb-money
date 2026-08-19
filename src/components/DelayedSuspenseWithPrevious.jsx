import React, { Suspense, useState, useEffect, useRef } from 'react';

export const DelayedSuspenseWithPrevious = ({ children, fallback, delay = 800, currentKey }) => {
    const [showFallback, setShowFallback] = useState(false);
    const [prevChildren, setPrevChildren] = useState(null);
    const [shouldShowPrevious, setShouldShowPrevious] = useState(false);
    const timerRef = useRef(null);
    const prevKeyRef = useRef(currentKey);

    useEffect(() => {
        // Если сменился экран
        if (currentKey !== prevKeyRef.current) {
            // Сохраняем предыдущий children
            setPrevChildren(children);
            setShouldShowPrevious(true);
            prevKeyRef.current = currentKey;
            
            // Сбрасываем состояние
            setShowFallback(false);
            
            // Очищаем старый таймер
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            
            // Запускаем новый таймер
            timerRef.current = setTimeout(() => {
                setShowFallback(true);
                setShouldShowPrevious(false); // Скрываем предыдущий экран
            }, delay);
        } else {
            // Тот же экран - показываем его
            setShouldShowPrevious(false);
            setPrevChildren(null);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [children, currentKey, delay]);

    // Если показываем предыдущий экран (загрузка идет, но еще не прошло delay)
    if (shouldShowPrevious && prevChildren) {
        return prevChildren;
    }

    // Если прошло delay - показываем fallback

    if (!showFallback) {
       return children;
    }

    return (
        <Suspense fallback={showFallback ? fallback : null}>
            {children}
        </Suspense>
    );
};