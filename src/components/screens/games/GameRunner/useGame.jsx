import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useResizeObserver } from '../../../../hooks/useResizeObserver';
import { useProgress } from '../../../../hooks/useProgress';
import { generateRandomNumber } from '../../../../utils/generateRandomNumber';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
import {
    ACCELERATION_DISTANCE, BASE_SPEED, CHARACTER_SCREEN_X, CHUNK_WIDTH,
    DEFAULT_CHARACTER_WIDTH, GAP_CHARACTER_MULTIPLIER, INITIAL_Y,
    JUMP_CLEARANCE, MAX_SPEED, subjectK, VISIBLE_AHEAD, VISIBLE_BEHIND, MAX_JUMP,
    JUMP_DISTANCE
} from './constants';
import { generateChunk } from './helpers';
import { EndModal } from '../../../shared/modals/EndModal';
import { getPluralCoins } from '../../../../utils/getPluralCoins';


export const useGame = (isFirstTry) => {
    const sizeRatio = useSizeRatio();
    const [isRules, setIsRules] = useState(isFirstTry);
    const [gamePoint, setGamePoints] = useState(0);
    const { openedModal, handleOpenModal } = useProgress();

    // State только для монтирования чанков и UI
    const [chunks, setChunks] = useState([]);
    const [isCollected, setIsCollected] = useState(false); // идёт анимация сбора
    const [collectedIds, setCollectedIds] = useState(new Set());   // окончательно убрано
    const [isUp, setIsUp] = useState(false);

    // DOM-refs — двигаем напрямую из rAF
    const wrapperRef = useRef(null);
    const characterRef = useRef(null);
    const itemsBoardRef = useRef(null);
    const bgRef = useRef(null);
    const roadRef = useRef(null);

    // Game data
    const chunksRef = useRef([]);
    const collectedRef = useRef(new Set());
    const hitTrashIdsRef = useRef(new Set());
    const collectTimeoutRef = useRef(null);

    // Mutable game state (rAF не зависит от замыканий)
    const isGameStartedRef = useRef(false);
    const isJumpingRef = useRef(false);
    const isUpRef = useRef(false);
    const sizeRatioRef = useRef(sizeRatio);
    const characterSizeRef = useRef([0, 0]);
    const wrapperRectRef = useRef(null);
    const openedModalRef = useRef(openedModal);
    const charXRef = useRef(0);
    const charYRef = useRef(0);
    const gamePointRef = useRef(0);
    const jumpStartXRef = useRef(0);

    useEffect(() => { sizeRatioRef.current = sizeRatio; }, [sizeRatio]);
    useEffect(() => { openedModalRef.current = openedModal; }, [openedModal]);

    useEffect(() => {
        return () => {
            if (collectTimeoutRef.current) clearTimeout(collectTimeoutRef.current);
        };
    }, []);

    // Resize
    const updateWrapperRect = useCallback(() => {
        const rect = wrapperRef.current?.getBoundingClientRect?.();
        const character = characterRef.current?.getBoundingClientRect?.();
        if (!rect || !character) return;
        wrapperRectRef.current = rect;
        characterSizeRef.current = [character.width, character.height];
    }, []);

    useLayoutEffect(() => { updateWrapperRect(); }, [sizeRatio, updateWrapperRect]);
    useResizeObserver({ onResize: updateWrapperRect, ref: wrapperRef });

    // Tap / Jump
    const handleTapStart = useCallback(() => {
        if (!isGameStartedRef.current) {
            if (isRules) {
                setIsRules(false);
            }

            isGameStartedRef.current = true;
            return;
        }
       if (!isJumpingRef.current) {
            isJumpingRef.current = true;
            jumpStartXRef.current = charXRef.current;
            isUpRef.current = true;
            setIsUp(true);
        }
    }, []);

    // Game Loop
    useEffect(() => {
        let rafId;
        let lastTime = performance.now();

        const loop = (now) => {
            const delta = Math.min((now - lastTime) / 16.667, 2);
            lastTime = now;

            if (!isGameStartedRef.current || openedModalRef.current?.isOpen || document.hidden) {
                rafId = requestAnimationFrame(loop);
                return;
            }

            const ratio = sizeRatioRef.current;
            const charSize = characterSizeRef.current;
            if (!charSize[0]) {
                rafId = requestAnimationFrame(loop);
                return;
            }

            // --- Physics ---
                const prevX = charXRef.current;
                const prevY = charYRef.current;

                const speedProgress = Math.min(prevX, ACCELERATION_DISTANCE) / ACCELERATION_DISTANCE;
                const currentSpeed = (BASE_SPEED + speedProgress * (MAX_SPEED - BASE_SPEED)) * delta;

                let nextY = prevY;
                let nextX = prevX + currentSpeed;

                if (isJumpingRef.current) {
                    const jumpProgress = Math.min((nextX - jumpStartXRef.current) / JUMP_DISTANCE, 1);

                    // Синусоидальная дуга: плавный подъём и спуск
                    nextY = -Math.sin(jumpProgress * Math.PI) * MAX_JUMP * subjectK;

                    // Обновляем флаг для анимации (первые 50% — подъём)
                    const goingUp = jumpProgress < 0.5;
                    if (isUpRef.current !== goingUp) {
                        isUpRef.current = goingUp;
                        setIsUp(goingUp);
                    }

                    if (jumpProgress >= 1) {
                        isJumpingRef.current = false;
                        nextY = 0;
                    }
                }

                charXRef.current = nextX;
                charYRef.current = nextY;

            const worldOffsetPx = -nextX * ratio + CHARACTER_SCREEN_X * ratio;
            const bgOffsetPx = -nextX * 0.5;
            const roadOffsetPx = -nextX * 0.8;
            const charYPx = nextY * ratio;

            if (itemsBoardRef.current) {
                itemsBoardRef.current.style.transform = `translate3d(${worldOffsetPx}px, 0, 0)`;
            }
            if (bgRef.current) {
                bgRef.current.style.backgroundPositionX = `${bgOffsetPx}px`;
            }
            if (roadRef.current) {
                roadRef.current.style.backgroundPositionX = `${roadOffsetPx}px`;
            }
            if (characterRef.current) {
                characterRef.current.style.transform = `translate3d(0, ${charYPx}px, 0)`;
            }

            // --- Chunk generation (редко) ---
            const currentChunk = Math.floor(nextX / CHUNK_WIDTH);
            let chunksChanged = false;

            for (let i = currentChunk - VISIBLE_BEHIND; i <= currentChunk + VISIBLE_AHEAD; i++) {
                if (i < 0) continue;
                if (!chunksRef.current.some(c => c.index === i)) {
                    const multiplier = generateRandomNumber(GAP_CHARACTER_MULTIPLIER, 1.5 * GAP_CHARACTER_MULTIPLIER);
                    const minGap = Math.max(
                        DEFAULT_CHARACTER_WIDTH,
                        (characterSizeRef.current[0] || DEFAULT_CHARACTER_WIDTH) * multiplier
                    );
                    const newChunk = generateChunk(i, minGap);
                    chunksRef.current.push(newChunk);
                    chunksChanged = true;
                }
            }

            const filtered = chunksRef.current
                .sort((a, b) => a.index - b.index)
                .filter(c => c.index >= currentChunk - VISIBLE_BEHIND - 2);

            if (filtered.length !== chunksRef.current.length) {
                chunksRef.current = filtered;
                chunksChanged = true;
            } else {
                chunksRef.current = filtered;
            }

            if (chunksChanged) {
                setChunks(filtered);
            }

            // --- Collisions ---
            const charW = charSize[0];
            const charH = charSize[1];

            const charBox = {
                x1: nextX * ratio,
                x2: (nextX + charW) * ratio,
                y1: -nextY + INITIAL_Y * subjectK * ratio,
                y2: -nextY + charH + INITIAL_Y * subjectK * ratio,
            };

            for (let ci = currentChunk - 1; ci <= currentChunk + 1; ci++) {
                const chunk = chunksRef.current.find(c => c.index === ci);
                if (!chunk) continue;

                for (const fig of chunk.figures) {
                    if (collectedRef.current.has(fig.id)) continue;

                    const fx = (chunk.index * CHUNK_WIDTH + fig.x) * ratio;
                    const fy = fig.y * ratio * subjectK;

                    const fBox = {
                        x1: fx + fig.width * 0.6 * ratio,
                        x2: fx + fig.width * ratio,
                        y1: fy + fig.height * 0.6 * ratio * subjectK,
                        y2: fy + fig.height * ratio,
                    };

                    if (charBox.x2 >= fBox.x1 && charBox.x1 <= fBox.x2 &&
                        charBox.y2 >= fBox.y1 && charBox.y1 <= fBox.y2) {
                           if (!collectedRef.current.has(fig.id)) {
                                collectedRef.current.add(fig.id);
                                setCollectedIds(prev => new Set([...prev, fig.id]));

                                // Эффект на персонаже
                                if (collectTimeoutRef.current) clearTimeout(collectTimeoutRef.current);
                                setIsCollected(true);
                                collectTimeoutRef.current = setTimeout(() => {
                                    setIsCollected(false);
                                    collectTimeoutRef.current = null;
                                }, 350);

                                const newPoints = gamePointRef.current + 1;
                                gamePointRef.current = newPoints;
                                setGamePoints(newPoints);
                            }
                    }
                }

                const isAboveTrash = isJumpingRef.current && nextY <= (-JUMP_CLEARANCE * ratio);

                if (!isAboveTrash) {
                    for (const trash of chunk.trashes) {
                        if (hitTrashIdsRef.current.has(trash.id)) continue;

                        const tx = (chunk.index * CHUNK_WIDTH + trash.x) * ratio;
                        const tBox = {
                            x1: tx + trash.width * 0.5 * ratio,
                            x2: tx + trash.width * 0.53 * ratio,
                            y2: (trash.y + trash.height * 0.45) * ratio,
                        };

                        if (charBox.x2 >= tBox.x1 && charBox.x1 <= tBox.x2 && charBox.y1 <= tBox.y2) {
                            hitTrashIdsRef.current.add(trash.id);
                            //TODO: поменять subTitle когда добавится пол Ты заработал${sex === f ? 'a' : ''} ${getPluralCoins(gamePointRef.current ?? 0)}
                            //TODO: добавить выход в меню
                            handleOpenModal({
                                Component: (
                                    <EndModal 
                                        title="Забег окончен!"
                                        subTitle={`Ты заработал ${getPluralCoins(gamePointRef.current ?? 0)}`} 
                                        coins={gamePointRef.current ?? 0}
                                    />
                                )
                            });
                        }
                    }
                }
            }

            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, []);

    const handleOpenRules = () => {
        isGameStartedRef.current = false;
        setIsRules(true);
    }

    return {
        wrapperRef,
        handleTapStart,
        bgRef,
        roadRef,
        itemsBoardRef,
        chunks,
        collectedIds,
        isCollected,
        characterRef,
        isUp,
        isPaused: openedModal?.isOpen || isRules,
        gamePoint,
        isGameStartedRef,
        handleOpenRules,
        isRules
    };
};