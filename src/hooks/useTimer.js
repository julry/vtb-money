import { useCallback, useEffect, useRef, useState } from "react";

export const useTimer = ({ timerId, isStart, initialTime, reverse, onFinish, onStop, interval = 1 }) => {
    const [time, setTime] = useState(initialTime);
    const $interval = useRef(null);
    const $time = useRef(initialTime);
    const $restart = useRef(false);
    const started = useRef(false);
    
    // Флаг: таймер тикал в момент сворачивания окна
    const wasRunning = useRef(false);

    // Ref'ы для колбэков, чтобы избежать stale closures
    const onFinishRef = useRef(onFinish);
    const onStopRef = useRef(onStop);

    useEffect(() => {
        resetTimer();
    }, [timerId])

    useEffect(() => { onFinishRef.current = onFinish; }, [onFinish]);
    useEffect(() => { onStopRef.current = onStop; }, [onStop]);

    // Вынесли запуск в функцию, чтобы не дублировать код
    const startTimer = useCallback(() => {
        if ($interval.current) {
            clearInterval($interval.current);
            $interval.current = null;
        }

        if (!started.current) {
            setTime($time.current);
            started.current = true;

            if (reverse) {
                $time.current += interval;
            } else {
                if ($time.current <= 0) {
                    onFinishRef.current?.();
                    started.current = false;
                    return;
                }
                $time.current -= interval;
            }
        }

        $interval.current = setInterval(() => {
            setTime($time.current);

            if (reverse) {
                $time.current += interval;
            } else {
                if ($time.current <= 0) {
                    onFinishRef.current?.();
                    clearInterval($interval.current);
                    $interval.current = null;
                    started.current = false;
                    return;
                }
                $time.current -= interval;
            }
        }, interval * 1000);
    }, [interval, reverse]);

    const stopTimer = useCallback(() => {
        onStopRef.current?.($time.current);
        clearInterval($interval.current);
        $interval.current = null;
        if ($time.current === 0) {
            $restart.current = true;
        }
    }, []);

    // Основной эффект управления таймером
    useEffect(() => {
        if (!initialTime) {
            return;
        }

        if (isStart) {
            if ($restart.current) {
                $time.current = initialTime;
                $restart.current = false;
                started.current = false;
            }
            startTimer();
        } else {
            stopTimer();
        }

        return () => {
            if ($interval.current) {
                clearInterval($interval.current);
                $interval.current = null;
            }
        };
    }, [initialTime, isStart, timerId, startTimer, stopTimer]);

    // === ПАУЗА ПРИ СВОРАЧИВАНИИ ОКНА ===
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Окно свернуто/неактивно — ставим на паузу
                if ($interval.current) {
                    wasRunning.current = true;
                    clearInterval($interval.current);
                    $interval.current = null;
                }
            } else {
                // Окно снова активно — возобновляем, если таймер должен работать
                if (wasRunning.current) {
                    wasRunning.current = false;
                    if (isStart) {
                        startTimer();
                    }
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isStart, startTimer]);

    const getMinutes = useCallback(() => {
        const minutes = Math.floor(time / 60);
        return minutes;
    }, [time]);

    const getSeconds = useCallback(() => {
        const seconds = Math.floor(time % 60);
        return seconds > 9 ? seconds : `0${seconds}`;
    }, [time]);

    const resetTimer = useCallback(() => {
        if ($interval.current) {
            clearInterval($interval.current);
            $interval.current = null;
        }

        $time.current = initialTime;
        started.current = false;
        $restart.current = false;
        wasRunning.current = false;
        setTime(initialTime);
    }, [initialTime]);

    return {
        getSeconds,
        getMinutes,
        time,
        resetTimer
    };
};