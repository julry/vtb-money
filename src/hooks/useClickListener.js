import {useCallback, useEffect} from "react";
import {isTouchDevice} from "../utils/isTouchDevice.js";

export function useClickListener({active, targetRef, prevent, onStart, onMove, onEnd}) {
    const isTouch = isTouchDevice()

    const handleTouchStart = useCallback((e) => {
        if (prevent) {
            e.preventDefault()
        }

        const newEvent = {
            target: e.target,
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        }

        onStart?.(newEvent)
    }, [prevent, onStart])

    const handleTouchMove = useCallback((e) => {
        if (prevent) {
            e.preventDefault()
        }

        const newEvent = {
            target: e.target,
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        }

        onMove?.(newEvent)
    }, [prevent, onMove])

    const handleTouchEnd = useCallback((e) => {
        if (prevent) {
            e.preventDefault()
        }

        const newEvent = {
            target: e.target,
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
        }

        onEnd?.(newEvent)
    }, [prevent, onEnd])

    const handleMouseDown = useCallback((e) => {
        if (prevent) {
            e.preventDefault()
        }

        const newEvent = {
            target: e.target,
            x: e.clientX,
            y: e.clientY,
        }

        onStart?.(newEvent)
    }, [prevent, onStart])

    const handleMouseMove = useCallback((e) => {
        if (prevent) {
            e.preventDefault()
        }

        const newEvent = {
            target: e.target,
            x: e.clientX,
            y: e.clientY,
        }

        onMove?.(newEvent)
    }, [prevent, onMove])

    const handleMouseUp = useCallback((e) => {
        if (prevent) {
            e.preventDefault()
        }

        const newEvent = {
            target: e.target,
            x: e.clientX,
            y: e.clientY,
        }

        onEnd?.(newEvent)
    }, [prevent, onEnd])

    useEffect(() => {
        if (active && targetRef?.current) {
            if (isTouch) {
                targetRef.current?.addEventListener("touchstart", handleTouchStart);
                targetRef.current?.addEventListener("touchmove", handleTouchMove);
                targetRef.current?.addEventListener("touchend", handleTouchEnd);

                return () => {
                    targetRef.current?.removeEventListener("touchstart", handleTouchStart);
                    targetRef.current?.removeEventListener("touchmove", handleTouchMove);
                    targetRef.current?.removeEventListener("touchend", handleTouchEnd);
                };
            } else {
                targetRef.current?.addEventListener("mousedown", handleMouseDown);
                targetRef.current?.addEventListener("mousemove", handleMouseMove);
                targetRef.current?.addEventListener("mouseup", handleMouseUp);

                return () => {
                    targetRef.current?.removeEventListener?.("mousedown", handleMouseDown);
                    targetRef.current?.removeEventListener?.("mousemove", handleMouseMove);
                    targetRef.current?.removeEventListener?.("mouseup", handleMouseUp);
                };
            }
        }
    }, [active, targetRef, isTouch, handleTouchStart, handleTouchMove, handleTouchEnd]);
}