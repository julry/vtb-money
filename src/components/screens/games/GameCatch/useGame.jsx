import { useRef, useEffect, useState } from 'react';
import {
  HEIGHT,
  MOVE_SPEED,
  PLAYER_SIZE,
  WIDTH,
  PLAYER_HEIGHT,
  PLAYER_Y,
  BAD_ITEMS,
  GOOD_ITEMS,
} from './constants';
import { generateRandomNumber } from '../../../../utils/generateRandomNumber';
import { MIN_MOCKUP_WIDTH } from '../../../ScreenTemplate';

export const useGame = () => {
  /* ── Refs ── */
  const containerRef = useRef(null);
  const worldRef = useRef(null);
  const characterRef = useRef(null);

  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const touchSideRef = useRef(null);
  const accumulatorRef = useRef(0);
  const FIXED_DT = 1 / 60;

  const itemPoolRef = useRef([]);

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

  const stateRef = useRef({
    player: null,
    items: [],               // падающие предметы
    score: 0,
    lives: 3,
    gameOver: false,
    started: false,
    spawnTimer: 0,           // таймер спавна
    itemCounter: 0,
  });

  /* ── React-state: только для UI ── */
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(3);
  const [paused, setPaused] = useState(false);

  const forceGameOver = () => {
    const state = stateRef.current;
    if (!state.started || state.gameOver) return;
    state.gameOver = true;
    setGameOver(true);
  };

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && stateRef.current.started && !stateRef.current.gameOver) {
        stateRef.current.paused = true;
        setPaused(true);
      }
      if (!document.hidden && stateRef.current.started && !stateRef.current.gameOver) {
        stateRef.current.paused = false;
        setPaused(false);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  /* ── Object pool: предметы ── */
  const getItem = () => {
    const pool = itemPoolRef.current;
    const free = pool.find((p) => !p.inUse);
    if (free) {
      free.inUse = true;
      free.el.style.display = '';
      return free;
    }
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.zIndex = '8';
    el.style.willChange = 'transform';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    worldRef.current?.appendChild(el);

    const item = { el, inUse: true };
    pool.push(item);
    return item;
  };

  const releaseItem = (item) => {
    if (!item) return;
    item.inUse = false;
    item.el.style.display = 'none';
    item.el.style.backgroundImage = '';
  };

  /* ── Спавн падающего предмета ── */
  const spawnItem = (state) => {
    const isBad = Math.random() < 0.3; // 30% плохих предметов (можно менять)
    const source = isBad ? BAD_ITEMS : GOOD_ITEMS;
    const template = source[generateRandomNumber(0, source.length - 1)];
    const { width, height } = template;
    const x = generateRandomNumber(16, widthRef.current - width - 16);
    const y = -height - 20;
    const speed = generateRandomNumber(160, 300);
    const rotation = generateRandomNumber(-12, 12);

    const poolItem = getItem();

    poolItem.el.style.width = `${width}px`;
    poolItem.el.style.height = `${height}px`;
    poolItem.el.style.backgroundImage = `url(${template.img})`;
    poolItem.el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;

    state.items.push({
      id: `item_${state.itemCounter++}`,
      x,
      y,
      prevX: x,
      prevY: y,
      rotation,
      width,
      height,
      speed,
      isBad,
      item: poolItem,
    });
  };

  /* ── Инициализация ── */
  const initGame = () => {
    const state = stateRef.current;
    lastTimeRef.current = 0;

    // очистка пула
    itemPoolRef.current.forEach(releaseItem);

    const startY = heightRef.current - PLAYER_Y - PLAYER_HEIGHT * 0.8;

    state.player = {
      x: 29,
      y: startY,
      prevX: 29,
      prevY: startY,
      velocityX: 0,
      width: PLAYER_SIZE,
      height: PLAYER_HEIGHT,
    };

    state.items = [];
    state.score = 0;
    state.lives = 3;
    state.gameOver = false;
    state.started = true;
    state.spawnTimer = 0;
    state.itemCounter = 0;

    setGameOver(false);
    setStarted(true);
    setDisplayScore(0);
    setDisplayLives(3);
  };

  /* ── Игровая логика ── */
  const updateGame = (dt) => {
    const state = stateRef.current;
    if (state.gameOver || !state.started || state.paused || !state.player) return;

    const player = state.player;

    // сохраняем предыдущие позиции ПЕРЕД обновлением
    player.prevX = player.x;
    player.prevY = player.y;

    // ввод
    if (keysRef.current.left || touchSideRef.current === 'left') {
      player.velocityX = -MOVE_SPEED;
    } else if (keysRef.current.right || touchSideRef.current === 'right') {
      player.velocityX = MOVE_SPEED;
    } else {
      player.velocityX *= 0.85; // при fixed dt можно просто так
    }

    player.x += player.velocityX * dt * 60; // *60, если MOVE_SPEED был под 60 fps

    // границы
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > widthRef.current) {
      player.x = widthRef.current - player.width;
    }

    // спавн
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnItem(state);
      const baseInterval = 0.9;
      const difficulty = Math.min(state.score * 0.0015, 0.5);
      state.spawnTimer = baseInterval - difficulty + Math.random() * 0.3;
    }

    // предметы
    for (let i = state.items.length - 1; i >= 0; i--) {
      const it = state.items[i];

      it.prevX = it.x;
      it.prevY = it.y;

      it.y += it.speed * dt;

      if (it.y > heightRef.current + 50) {
        releaseItem(it.item);
        state.items.splice(i, 1);
        continue;
      }

      // коллизия с игроком
      // const playerBottom = player.y + player.height;
      // const playerTop = player.y + player.height * 0.2; // ловим верхней частью

      const collisionTop = player.y + player.height * 0.2;                          // верх корзины
      const collisionBottom = player.y + player.height * 0.25; // середина корзины

      const overlapX =
        player.x + player.width * 0.15 < it.x + it.width &&
        player.x + player.width * 0.85 > it.x;

      const overlapY =
        collisionTop < it.y + it.height &&
        collisionBottom > it.y;


      if (overlapX && overlapY) {
        if (it.isBad) {
          state.lives -= 1;
          setDisplayLives(state.lives);
          if (state.lives <= 0) {
            state.gameOver = true;
            setGameOver(true);
          }
        } else {
          state.score += 10;
          setDisplayScore(state.score);
        }

        releaseItem(it.item);
        state.items.splice(i, 1);
      }
    }
  };

  /* ── Отрисовка ── */
  const renderFrame = () => {
    const state = stateRef.current;

    // персонаж
    if (characterRef.current && state.player) {
      const { x } = state.player;
      const char = characterRef.current;

      char.style.transform = `translate3d(${Math.round(x)}px, 0, 0)`;
    }

    // предметы
    state.items.forEach((it) => {
      if (it.item?.el) {
        it.item.el.style.transform = `translate3d(${Math.round(it.x)}px, ${Math.round(it.y)}px, 0) rotate(${it.rotation}deg)`;
      }
    });
  };

  /* ── Game loop ── */
  const updateGameRef = useRef(updateGame);
  const renderFrameRef = useRef(renderFrame);

  useEffect(() => {
    updateGameRef.current = updateGame;
    renderFrameRef.current = renderFrame;
  });

  const gameLoop = (time) => {
    const state = stateRef.current;

    if (!lastTimeRef.current) lastTimeRef.current = time;
    let dt = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    if (dt > 0.05) dt = 0.05;

    if (state.started && !state.gameOver && !state.paused) {
      updateGameRef.current(dt);
    }
    renderFrameRef.current();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  /* ── Пауза ── */
  const togglePause = () => {
    const state = stateRef.current;
    if (!state.started || state.gameOver) return;
    state.paused = !state.paused;
    setPaused(state.paused);
  };

  /* ── Управление ── */
  const getTouchSide = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const scaleFactor = WIDTH / rect.width;
    const x = (clientX - rect.left) * scaleFactor;
    return x < WIDTH / 2 ? 'left' : 'right';
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    const side = getTouchSide(e.clientX);
    touchSideRef.current = side;
  };

  const handlePointerMove = (e) => {
    if (touchSideRef.current === null) return;
    e.preventDefault();
    touchSideRef.current = getTouchSide(e.clientX);
  };

  const handlePointerUp = (e) => {
    e.preventDefault();
    touchSideRef.current = null;
  };

  /* ── Клавиатура ── */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true;
    };
    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return {
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    worldRef,
    characterRef,
    started,
    paused,
    initGame,
    gameOver,
    score: displayScore,
    lives: displayLives,
    togglePause,
    forceGameOver,
  };
};