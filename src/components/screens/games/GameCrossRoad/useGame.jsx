import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {BOTTOM_BUFFER_ROWS, CAMERA_SMOOTHING, LANE_HEIGHT, PERSON_HEIGHT, PERSON_WIDTH, SWIPE_THRESHOLD, TAP_MAX_DURATION, TAP_MAX_MOVE, TILE_SIZE, TOP_BUFFER_ROWS} from './constants';
import { generateInitialLanes, generateLane } from './helpers';
import {HEIGHT, WIDTH} from '../GameCatch/constants';
import { MIN_MOCKUP_WIDTH } from '../../../ScreenTemplate';


export const useGame = ({ onDie }) => {
    const heightRef = useRef(
        typeof window !== 'undefined' && window.innerWidth > MIN_MOCKUP_WIDTH
            ? HEIGHT
            : window?.innerHeight ?? HEIGHT
    );
    const widthRef = useRef(
        typeof window !== 'undefined' && window.innerWidth > MIN_MOCKUP_WIDTH
            ? WIDTH
            : window?.innerWidth ?? WIDTH
    );

    // === DOM-рефы для imperative updates ===
    const worldRef = useRef(null);
    const playerRef = useRef(null);
    const laneRefs = useRef(new Map());
    const entityRefs = useRef(new Map());

    // === State: только то, что редко меняется ===
    const [lanesVersion, setLanesVersion] = useState(0);
    const [playerX, setPlayerX] = useState(-10);
    const [playerY, setPlayerY] = useState(-10);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [userImg, setUserImg] = useState('right');
    const [coverScale, setCoverScale] = useState(1.2);

    // === Игровые refs ===
    const lanesRef = useRef([]);
    const lanesMapRef = useRef(new Map());
    const playerXRef = useRef(playerX);
    const playerYRef = useRef(playerY);
    const scoreRef = useRef(score);
    const gameOverRef = useRef(gameOver);
    const gameStartedRef = useRef(gameStarted);
    const rafRef = useRef();
    const lastTimeRef = useRef(0);
    const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
    const cameraTargetRef = useRef(-2 * TILE_SIZE);
    const initialPlayerYRef = useRef(0);
    const startLaneRef = useRef(0);
    const coverScaleRef = useRef(1.2);

    const syncLanes = useCallback((laneArray) => {
        lanesRef.current = laneArray;
        const map = new Map();
        for (const lane of laneArray) {
            map.set(lane.index, lane);
        }
        lanesMapRef.current = map;
    }, []);

    // === Регистрация DOM-элементов ===
    const registerLane = useCallback((index, el) => {
        if (el) {
            laneRefs.current.set(index, el);
            const y = Math.floor((heightRef.current - (index + 1) * TILE_SIZE) + cameraTargetRef.current);
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            el.style.display = (y >= -LANE_HEIGHT && y <= heightRef.current) ? 'block' : 'none';
        } else {
            laneRefs.current.delete(index);
        }
    }, []);

    const registerEntity = useCallback((laneIndex, entityIndex, el) => {
        const key = `${laneIndex}-${entityIndex}`;
        if (el) {
            entityRefs.current.set(key, el);
            const lane = lanesMapRef.current.get(laneIndex);
            if (lane && lane.entities[entityIndex]) {
                const e = lane.entities[entityIndex];
                el.style.transform = `translate3d(${e.x}px, 0, 0) rotate(-10deg)`;
            }
        } else {
            entityRefs.current.delete(key);
        }
    }, []);

    useEffect(() => {
        const w = widthRef.current;
        const h = heightRef.current;
        const rad = 10 * Math.PI / 180;
        const sin = Math.sin(rad);
        const cos = Math.cos(rad);
        const scale = Math.max(
            cos + (h / w) * sin,
            (w / h) * sin + cos
        );
        coverScaleRef.current = scale;
        setCoverScale(scale);
    }, []);

    useEffect(() => { playerXRef.current = playerX; }, [playerX]);
    useEffect(() => { playerYRef.current = playerY; }, [playerY]);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
    useEffect(() => { gameStartedRef.current = gameStarted; }, [gameStarted]);

    useEffect(() => {
        const handler = (e) => e.preventDefault();
        document.addEventListener('touchmove', handler, { passive: false });
        return () => document.removeEventListener('touchmove', handler);
    }, []);

    const startGame = useCallback(() => {
        setGameStarted(true);
        gameStartedRef.current = true;
    }, [])

    const pauseGame = useCallback(() => {
        setGameStarted(false);
        gameStartedRef.current = false;
    }, []);

    const resetGame = useCallback((shouldStart) => {
        const SAFE_PAD = getSafePad();
        const newLanes = generateInitialLanes(widthRef.current, heightRef.current, SAFE_PAD);
        syncLanes(newLanes);
        const startY = heightRef.current - TILE_SIZE;
        const startX = Math.floor(widthRef.current / 2 / TILE_SIZE) * TILE_SIZE + 2;
        setPlayerX(startX);
        setPlayerY(startY);
        setScore(0);
        setGameOver(false);

        if (shouldStart) {
            startGame();
        }

        playerRef.current.style.transform = `translate3d(${startX}px, ${startY + cameraTargetRef.current}px, 0)`;

        cameraTargetRef.current = -2 * TILE_SIZE;
        startLaneRef.current = newLanes.length;
        initialPlayerYRef.current = startY;
        playerYRef.current = startY;
        gameOverRef.current = false;
        setLanesVersion(v => v + 1);
    }, [syncLanes]);

    const getSafePad = useCallback(() => {
        const ANGLE = 10 * Math.PI / 180;
        const sin = Math.sin(ANGLE);
        return Math.max(20, Math.ceil(heightRef.current * sin * coverScaleRef.current / 2));
    }, []);

    const die = useCallback((isFromGame) => {
        setGameOver(true);
        onDie?.({ isFromGame, score: scoreRef.current });

        gameOverRef.current = true;
    }, []);

    const movePlayer = useCallback((dx, dy) => {
        if (gameOverRef.current || !gameStartedRef.current) return;

        if (dx === -1 && userImg !== 'left') setUserImg('left');
        if (dx === 1 && userImg !== 'right') setUserImg('right');
        if (dx === 0 && userImg !== 'up') setUserImg('up');


        const SAFE_PAD = getSafePad();
        const newX = Math.max(
            SAFE_PAD,
            Math.min(widthRef.current - PERSON_WIDTH - SAFE_PAD, playerXRef.current + dx * 2 * PERSON_WIDTH)
        );

        const newY = playerYRef.current + dy * TILE_SIZE;

        const laneIndex = Math.floor((heightRef.current - newY) / TILE_SIZE) - 1;
        const lane = lanesMapRef.current.get(laneIndex);
        if (lane) {
            for (const e of lane.entities) {
                if (e.isTree && newX < e.x + e.w && newX + PERSON_WIDTH > e.x) {
                    return;
                }
            }
        }

        playerXRef.current = newX;
        playerYRef.current = newY;

        setPlayerX(newX);
        setPlayerY(newY);

        if (dy < 0) {
            if (laneIndex > scoreRef.current) {
                setScore(laneIndex);
            }

            let currentLanes = lanesRef.current;
            let maxIndex = -Infinity;
            for (const l of currentLanes) {
                if (l.index > maxIndex) maxIndex = l.index;
            }

            const neededMax = laneIndex + TOP_BUFFER_ROWS;
            if (neededMax > maxIndex) {
                const newBatch = [];
                let prevType = lanesMapRef.current.get(maxIndex)?.type || 'grass';
                for (let i = maxIndex + 1; i <= neededMax; i++) {
                    const lane = generateLane(i, prevType, widthRef.current, SAFE_PAD);
                    newBatch.push(lane);
                    prevType = lane.type;
                }
                currentLanes = [...currentLanes, ...newBatch];
            }

            const visibleRowsCount = Math.ceil(heightRef.current / TILE_SIZE);
            const minKeepIndex = laneIndex - visibleRowsCount - BOTTOM_BUFFER_ROWS;
            currentLanes = currentLanes.filter(l => l.index >= minKeepIndex);

            syncLanes(currentLanes);
            setLanesVersion(v => v + 1);
        }
    }, [syncLanes, userImg]);

    useEffect(() => {
        const onKey = (e) => {
            if (!gameStartedRef.current) return;
            switch (e.key) {
                case 'ArrowUp': case 'w': case 'W': movePlayer(0, -1); break;
                case 'ArrowLeft': case 'a': case 'A': movePlayer(-1, 0); break;
                case 'ArrowRight': case 'd': case 'D': movePlayer(1, 0); break;
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [movePlayer]);

    const onTouchStart = useCallback((e) => {
        if (!gameStartedRef.current || gameOverRef.current) return;
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    }, []);

    const onTouchEnd = useCallback((e) => {
        if (!gameStartedRef.current || gameOverRef.current) return;
        const touch = e.changedTouches[0];
        const start = touchStartRef.current;
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        const duration = Date.now() - start.time;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (duration < TAP_MAX_DURATION && absDx < TAP_MAX_MOVE && absDy < TAP_MAX_MOVE) {
            movePlayer(0, -1);
            return;
        }
        if (absDx > absDy && absDx > SWIPE_THRESHOLD) {
            movePlayer(dx > 0 ? 1 : -1, 0);
        }

        if (absDy > absDx && absDy > SWIPE_THRESHOLD && dy < 0) {
            movePlayer(0, -1);
        }
    }, [movePlayer]);

    // === ИГРОВОЙ ЦИКЛ ===
    useEffect(() => {
        const loop = (time) => {
            const dt = Math.min((time - lastTimeRef.current) / 16.67, 3);
            lastTimeRef.current = time;

            if (gameStartedRef.current && !gameOverRef.current) {
                // 1. Двигаем entities (машины) напрямую в DOM
                for (const lane of lanesRef.current) {
                    if (lane.type !== 'road') continue;
                    for (let i = 0; i < lane.entities.length; i++) {
                        const e = lane.entities[i];
                        e.x += e.speed * dt;
                        if (e.speed > 0 && e.x > widthRef.current) e.x = -e.w;
                        if (e.speed < 0 && e.x + e.w < 0) e.x = widthRef.current;

                        const el = entityRefs.current.get(`${lane.index}-${i}`);
                        if (el) {
                            el.style.transform = `translate3d(${e.x}px, 0, 0) rotate(-10deg)`;
                        }
                    }
                }

                // 2. Считаем камеру
                const screenHeight = heightRef.current;
                const playerProgress = initialPlayerYRef.current - playerYRef.current;
                const threshold = screenHeight * 0.3; // ← 30% поля

                // Базовый сдвиг -TILE_SIZE, затем следуем 1:1 за игроком после threshold
                const targetOffset = -2 * TILE_SIZE + Math.max(0, playerProgress - threshold);

                cameraTargetRef.current += (targetOffset - cameraTargetRef.current) * CAMERA_SMOOTHING;

                // 3. Обновляем lanes (Y + видимость) — камера двигает ТОЛЬКО lanes, НЕ мир
                for (const lane of lanesRef.current) {
                    const y = Math.floor((heightRef.current - (lane.index + 1) * TILE_SIZE) + cameraTargetRef.current);
                    const el = laneRefs.current.get(lane.index);
                    if (el) {
                        const visible = y >= -LANE_HEIGHT && y <= heightRef.current;
                        if (el.style.display !== (visible ? 'block' : 'none')) {
                            el.style.display = visible ? 'block' : 'none';
                        }
                        if (visible) {
                            el.style.transform = `translate3d(0, ${y}px, 0)`;
                        }
                    }
                }

                // 4. Обновляем игрока
                if (playerRef.current) {
                    playerRef.current.style.transform = `translate3d(${playerXRef.current}px, ${playerYRef.current + cameraTargetRef.current}px, 0)`;
                }

                // 5. Коллизии
                const pRect = {
                    x: playerXRef.current,
                    y: playerYRef.current,
                    w: PERSON_WIDTH,
                    h: PERSON_HEIGHT,
                };
                const laneIdx = Math.floor((heightRef.current - playerYRef.current) / TILE_SIZE) - 1;
                const lane = lanesMapRef.current.get(laneIdx);
                const laneY = heightRef.current - (laneIdx + 1) * TILE_SIZE;

                if (lane && lane.type === 'road') {
                    for (const e of lane.entities) {
                        if (
                            pRect.x < e.x + e.w - 4 &&
                            pRect.x + pRect.w > e.x + 4 &&
                            pRect.y < laneY + LANE_HEIGHT - 2 &&
                            pRect.y + pRect.h > laneY + 4
                        ) {
                            die(true);
                        }
                    }
                }
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [die, coverScale]);

    const visibleLanes = useMemo(() => lanesRef.current, [lanesVersion]);

    return {
        onTouchStart,
        onTouchEnd,
        resetGame,
        visibleLanes,
        playerX,
        playerY,
        height: heightRef.current,
        coverScale,
        userImg,
        worldRef,
        playerRef,
        registerLane,
        registerEntity,
        die,
        gameStarted,
        score,
        startGame,
        pauseGame,
        playerYRef,
        heightRef
    };
};