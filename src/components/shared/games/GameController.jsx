import {useCallback, useEffect, useRef, useState} from "react";
import {useClickListener} from "../../../hooks/useClickListener";

export function GameController({ active, children, onMoveUp, onMoveDown, onMoveLeft, onMoveRight }) {
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const targetRef = useRef()

    const handleKeyDown = useCallback(
        (e) => {
            switch (e.code) {
                case "ArrowUp":
                    onMoveUp();
                    break;
                case "ArrowDown":
                    onMoveDown();
                    break;
                case "ArrowLeft":
                    onMoveLeft();
                    break;
                case "ArrowRight":
                    onMoveRight();
                    break;
                default:
                    break;
            }
        },
        [onMoveDown, onMoveUp, onMoveRight, onMoveLeft],
    );

    const handleStart = useCallback((e) => {
        setStartX(e.x);
        setStartY(e.y);
    }, []);

    const handleEnd = useCallback(
        (e) => {
            const endX = e.x;
            const endY = e.y;
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    onMoveRight();
                } else {
                    onMoveLeft();
                }
            } else {
                if (deltaY > 0) {
                    onMoveDown();
                } else {
                    onMoveUp();
                }
            }

            setStartX(0);
            setStartY(0);
        },
        [startX, startY, onMoveDown, onMoveUp, onMoveRight, onMoveLeft],
    );

    useClickListener({
        active,
        prevent: true,
        targetRef,
        onStart: handleStart,
        onEnd: handleEnd,
    })

    useEffect(() => {
        if (active) {
            document.addEventListener("keydown", handleKeyDown);

            return () => {
                document.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [active, handleKeyDown]);

    return children(targetRef);
}