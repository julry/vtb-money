import { useRef, useEffect, useState } from 'react';
import {COIN_SIZE, FLOOR_Y, GAP_MAX, GAP_MIN, GRAVITY, HEIGHT, JUMP_FORCE, MOVE_SPEED, PLATFORM_COLORS, PLATFORM_HEIGHT, PLATFORM_WIDTH, PLAYER_SIZE, WIDTH, FLOOR_HEIGHT, PLAYER_HEIGHT, PLAYER_Y, PLAYER_EMPTY_PLACE} from './constants';
import { generateRandomNumber } from '../../../../utils/generateRandomNumber';
import { MIN_MOCKUP_WIDTH } from '../../../ScreenTemplate';
import picRight from '../../../../assets/images/person/persRunR.webp';
import picJump from '../../../../assets/images/person/persStand.webp';
import picStart from '../../../../assets/images/person/persStart.webp';
import coinImg from '../../../../assets/images/coinImg.webp';
import roadImg from '../../../../assets/images/runner/road.webp';
import breakingL from '../../../../assets/images/doodle/breakingL.webp';
import breakingR from '../../../../assets/images/doodle/breakingR.webp';

/* ── CSS-анимации разлома, встраиваем один раз ── */
const BREAK_CSS_ID = 'doodle-breaking-animations';


export const useGame = () => {
  /* ── Refs ── */
  const containerRef = useRef(null);
  const worldRef = useRef(null);
  const characterRef = useRef(null);
  const scoreElementRef = useRef(null);

  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const touchSideRef = useRef(null);
  const currentCharSrcRef = useRef('');

  const platformPoolRef = useRef([]);
  const coinPoolRef = useRef([]);

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
    platforms: [],
    coins: [],
    cameraY: 0,
    score: 0,
    coinsCollected: 0,
    gameOver: false,
    started: false,
    waitingForStart: true,
    lastPlatformY: FLOOR_Y,
    platformCounter: 0,
  });

  /* ── React-state: только для UI ── */
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
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

  /* ── Object pool: платформы ── */
  const getPlatformItem = () => {
    const pool = platformPoolRef.current;
    const free = pool.find((p) => !p.inUse);
    if (free) {
      free.inUse = true;
      free.el.style.display = '';
      return free;
    }
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.zIndex = '5';
    el.style.willChange = 'transform';
    worldRef.current?.appendChild(el);

    const item = { el, inUse: true, type: null, leftWrap: null, rightWrap: null };
    pool.push(item);
    return item;
  };

  const releasePlatformItem = (item) => {
    if (!item) return;
    item.inUse = false;
    item.el.style.display = 'none';
    item.el.className = '';
    item.el.innerHTML = '';
    item.type = null;
    item.leftWrap = null;
    item.rightWrap = null;
  };

  /* ── Object pool: монетки ── */
  const getCoinItem = () => {
    const pool = coinPoolRef.current;
    const free = pool.find((c) => !c.inUse);
    if (free) {
      free.inUse = true;
      free.el.style.display = '';
      return free;
    }
    const el = document.createElement('div');
    el.style.cssText =
      `position:absolute;width:${COIN_SIZE}px;height:${COIN_SIZE}px;` +
      `background:url(${coinImg}) no-repeat;background-size:contain;` +
      `z-index:8;will-change:transform;`;
    worldRef.current?.appendChild(el);

    const item = { el, inUse: true };
    pool.push(item);
    return item;
  };

  const releaseCoinItem = (item) => {
    if (!item) return;
    item.inUse = false;
    item.el.style.display = 'none';
  };

  /* ── Спавн платформы ── */
  const spawnPlatform = (state) => {
    state.lastPlatformY -= generateRandomNumber(GAP_MIN, GAP_MAX);
    const edge = state.platforms.length > 1 ? 10 : widthRef.current / 2;
    const x = generateRandomNumber(edge, widthRef.current - PLATFORM_WIDTH - 10);

    const progress = state.cameraY < 0 ? 1 : 0;
    const type = Math.random() < progress * 0.25 ? 'breaking' : 'normal';

    const id = `p_${state.platformCounter++}`;
    const color = PLATFORM_COLORS[generateRandomNumber(0, PLATFORM_COLORS.length - 1)];

    const item = getPlatformItem();
    item.type = type;

    if (type === 'breaking') {
      item.el.style.cssText =
        `position:absolute;z-index:5;width:${PLATFORM_WIDTH}px;height:${PLATFORM_HEIGHT}px;` +
        `background:transparent;pointer-events:none;will-change:transform;`;

      const leftWrap = document.createElement('div');
      leftWrap.style.cssText =
        'position:absolute;top:0;left:0;width:50%;height:100%;transform-origin:top right;';
      const rightWrap = document.createElement('div');
      rightWrap.style.cssText =
        'position:absolute;top:0;right:0;width:50%;height:100%;transform-origin:top left;';

      const leftPart = document.createElement('div');
      leftPart.style.cssText =
        `position:absolute;top:0;left:0;height:calc(100% - 2px);width:100%;` +
        `background-color:${color};border-top-left-radius:10px;border-bottom-left-radius:10px;` +
        `clip-path:polygon(99% 72%,89% 100%,0% 100%,0% 0%,85% 0%,100% 26%,93% 40%);`;

      const rightPart = document.createElement('div');
      rightPart.style.cssText =
        `position:absolute;top:0;right:0;height:calc(100% - 2px);width:100%;` +
        `background-color:${color};border-top-right-radius:10px;border-bottom-right-radius:10px;` +
        `clip-path:polygon(0% 0%,100% 0%,100% 100%,0% 99%,12% 76%,2% 44%,11% 26%);`;

      const leftSvg = document.createElement('img');
      leftSvg.src = breakingL;
      leftSvg.style.cssText =
        'position:absolute;left:0;top:-1px;z-index:2;height:calc(100% + 2px);pointer-events:none;';

      const rightSvg = document.createElement('img');
      rightSvg.src = breakingR;
      rightSvg.style.cssText =
        'position:absolute;left:0;top:-1px;z-index:2;height:calc(100% + 2px);pointer-events:none;';

      leftWrap.append(leftPart, leftSvg);
      rightWrap.append(rightPart, rightSvg);
      item.el.append(leftWrap, rightWrap);

      item.leftWrap = leftWrap;
      item.rightWrap = rightWrap;
    } else {
      item.el.style.cssText =
        `position:absolute;z-index:5;width:${PLATFORM_WIDTH}px;height:${PLATFORM_HEIGHT}px;` +
        `background-color:${color};` +
        `border:0.694444px solid rgba(255,255,255,0.4);` +
        `box-shadow:0.694444px 0.694444px 1.38889px #012067,` +
        `inset 1.38889px 1.38889px 1.38889px rgba(173,207,245,0.9);` +
        `border-radius:10px;will-change:transform;`;
    }

    item.el.style.transform = `translate3d(${x}px, ${state.lastPlatformY}px, 0)`;

    state.platforms.push({
      id, x, y: state.lastPlatformY,
      width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT,
      type, color, item,
    });

    /* монетка */
    const screenTop = state.cameraY - 100;
    if (state.lastPlatformY < screenTop && Math.random() < 0.35) {
      const coinX = x + PLATFORM_WIDTH / 2 - COIN_SIZE / 2;
      const coinY = state.lastPlatformY - COIN_SIZE - 8;
      const coinItem = getCoinItem();
      coinItem.el.style.transform = `translate3d(${coinX}px, ${coinY}px, 0)`;

      state.coins.push({
        id: `c_${state.platformCounter}_${Math.random().toString(36).slice(2, 5)}`,
        x: coinX, y: coinY,
        width: COIN_SIZE, height: COIN_SIZE,
        item: coinItem,
      });
    }
  };

  /* ── Инициализация ── */
  const initGame = () => {
    const state = stateRef.current;
    lastTimeRef.current = 0;
    if (state.platforms.length > 0) return;

    platformPoolRef.current.forEach(releasePlatformItem);
    coinPoolRef.current.forEach(releaseCoinItem);

    const startY = heightRef.current - PLAYER_Y;

    state.player = {
      x: PLAYER_SIZE / 2,
      y: startY,
      velocityX: 0,
      velocityY: 0,
      width: PLAYER_SIZE,
      height: PLAYER_HEIGHT,
      onPlatform: true,
    };
    state.platforms = [];
    state.coins = [];
    state.cameraY = 0;
    state.score = 0;
    state.coinsCollected = 0;
    state.gameOver = false;
    state.started = true;
    state.waitingForStart = true;
    state.lastPlatformY = heightRef.current - FLOOR_HEIGHT + PLATFORM_HEIGHT / 2;
    state.platformCounter = 0;

    /* пол */
    const floorItem = getPlatformItem();
    floorItem.type = 'floor';
    floorItem.el.style.cssText =
        `position:absolute;z-index:5;width:100%;height:${FLOOR_HEIGHT}px;` +
        `background-image:url(${roadImg});` +
        `background-repeat: repeat-x;` +
        `will-change:transform;`;
    floorItem.el.style.transform = `translate3d(0px, ${state.lastPlatformY}px, 0)`;
    floorItem.el.style.transform = `translate3d(0px, ${state.lastPlatformY}px, 0)`;

    state.platforms.push({
      id: 'floor',
      x: 0,
      y: state.lastPlatformY,
      width: WIDTH,
      height: FLOOR_HEIGHT,
      type: 'floor',
      color: '#2d3561',
      item: floorItem,
    });

    while (state.lastPlatformY > -heightRef.current * 2) {
      spawnPlatform(state);
    }

    setGameOver(false);
    setStarted(true);
    setDisplayScore(0);
    currentCharSrcRef.current = '';
  };

  /* ── Игровая логика ── */
    const updateGame = (dt) => {
    const state = stateRef.current;
    if (state.gameOver || !state.started || state.paused || !state.player) return;

    const player = state.player;
    const scale = dt * 90; // 1.0 при 60fps, 2.0 при 30fps и т.д.

    if (state.waitingForStart) {
      player.velocityX = 0;
      player.velocityY = 0;
      return;
    }

    /* ввод */
    if (keysRef.current.left || touchSideRef.current === 'left') {
      player.velocityX = -MOVE_SPEED;
    } else if (keysRef.current.right || touchSideRef.current === 'right') {
      player.velocityX = MOVE_SPEED;
    } else {
      player.velocityX *= Math.pow(0.85, scale);
    }

    /* физика */
    const prevY = player.y;

    player.x += player.velocityX * scale;
    if (player.x + player.width < 0) player.x = WIDTH;
    else if (player.x > WIDTH) player.x = -player.width;

    player.velocityY += GRAVITY * scale;
    player.y += player.velocityY * scale;

    /* камера */
    const targetCameraY = player.y - heightRef.current * 0.35;
    if (targetCameraY < state.cameraY) {
      state.cameraY = targetCameraY;
    }

    /* счёт */
    const heightScore = Math.max(0, Math.floor((FLOOR_Y - player.y) / 10));
    if (heightScore > state.score) state.score = heightScore;

    /* коллизии: платформы */
    if (player.velocityY > 0) {
      for (const platform of state.platforms) {
        if (platform.broken || !platform.item?.inUse) continue;

        const wasAbove = prevY + player.height <= platform.y + 5;
        const nowOverlapping =
          player.x + player.width > platform.x &&
          player.x < platform.x + platform.width &&
          player.y + player.height >= platform.y &&
          player.y + player.height <= platform.y + platform.height + player.velocityY * scale + 2;

        if (wasAbove && nowOverlapping) {
          player.y = platform.y - player.height;
          player.velocityY = JUMP_FORCE;
          player.onPlatform = true;

          if (platform.type === 'breaking' && platform.item.leftWrap && platform.item.rightWrap) {
            platform.broken = true;
            platform.breakTime = performance.now();
            platform.item.leftWrap.classList.add('break-left');
            platform.item.rightWrap.classList.add('break-right');
          }
          break;
        }
      }
    }

    /* коллизии: монетки */
    for (let i = state.coins.length - 1; i >= 0; i--) {
      const coin = state.coins[i];
      if (
        player.x + player.width / 4 < coin.x + coin.width &&
        player.x + (3 * player.width) / 4 > coin.x &&
        player.y + player.height / 2 < coin.y + coin.height &&
        player.y + player.height > coin.y
      ) {
        state.coins.splice(i, 1);
        releaseCoinItem(coin.item);
        state.coinsCollected += 1;
      }
    }

    /* генерация */
    while (state.lastPlatformY > state.cameraY - heightRef.current * 1.2) {
      spawnPlatform(state);
    }

    /* очистка вне экрана */
    const now = performance.now();
    const bottomLimit = state.cameraY + heightRef.current + 200;

    for (let i = state.platforms.length - 1; i >= 0; i--) {
      const p = state.platforms[i];
      if (p.type === 'floor') continue;

      const gone = (p.broken && now - p.breakTime > 400) || p.y > bottomLimit;
      if (gone) {
        releasePlatformItem(p.item);
        state.platforms.splice(i, 1);
      }
    }

    for (let i = state.coins.length - 1; i >= 0; i--) {
      const c = state.coins[i];
      if (c.y > bottomLimit) {
        releaseCoinItem(c.item);
        state.coins.splice(i, 1);
      }
    }

    /* game over */
    if (player.y - state.cameraY > heightRef.current + 50) {
      state.gameOver = true;
      setGameOver(true);
    }
  };

  /* ── Отрисовка ── */
  const renderFrame = () => {
    const state = stateRef.current;

    if (worldRef.current) {
      worldRef.current.style.transform = `translateY(${Math.round(-state.cameraY)}px)`;
    }

    if (characterRef.current && state.player) {
      const { velocityX, x, y } = state.player;
      const char = characterRef.current;

      const nextSrc = state.waitingForStart
        ? 'start'
        : Math.abs(velocityX) > 0.5
        ? 'right'
        : 'jump';

      if (currentCharSrcRef.current !== nextSrc) {
        currentCharSrcRef.current = nextSrc;
        char.src =
          nextSrc === 'start' ? picStart : nextSrc === 'right' ? picRight : picJump;
      }

      const scaleX = velocityX < -0.5 ? -1 : 1;
      char.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y - PLAYER_HEIGHT / 10)}px, 0) scaleX(${scaleX})`;
    }

    if (scoreElementRef.current) {
      scoreElementRef.current.textContent = `${state.coinsCollected}`;  // ← заменить
    }

    if (state.coinsCollected !== displayScore) {  // ← заменить условие
      setDisplayScore(state.coinsCollected);
    }
  };

  /* ── Game loop: стабильные ref'ы, эффект без deps ── */
  const updateGameRef = useRef(updateGame);
  const renderFrameRef = useRef(renderFrame);

  useEffect(() => {
    updateGameRef.current = updateGame;
    renderFrameRef.current = renderFrame;
  }, []);

  useEffect(() => {
    if (document.getElementById(BREAK_CSS_ID)) return;
    if (typeof document !== 'undefined' && !document.getElementById(BREAK_CSS_ID)) {
        const style = document.createElement('style');
        style.id = BREAK_CSS_ID;
        style.textContent = `
            @keyframes breakLeft {
            0%   { transform: rotate(0deg) translateY(0) translateX(0); opacity: 1; }
            100% { transform: rotate(-25deg) translateY(25px) translateX(-20px); opacity: 0; }
            }
            @keyframes breakRight {
            0%   { transform: rotate(0deg) translateY(0) translateX(0); opacity: 1; }
            100% { transform: rotate(25deg) translateY(25px) translateX(20px); opacity: 0; }
            }
            .break-left  { animation: breakLeft  0.4s ease-in forwards; }
            .break-right { animation: breakRight 0.4s ease-in forwards; }
        `;
        document.head.appendChild(style);

        return () => {
      document.getElementById(BREAK_CSS_ID)?.remove();
    };
    }
  }, [])

  /* ── Пауза ── */
  const togglePause = () => {
    const state = stateRef.current;
    if (!state.started || state.gameOver) return;

    state.paused = !state.paused;
    setPaused(state.paused);
  };

    const gameLoop = (time) => {
        const state = stateRef.current;

        if (!lastTimeRef.current) lastTimeRef.current = time;
        let dt = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        // Защита от фризов / свёрнутой вкладки — не даём телепортировать
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

    const state = stateRef.current;
    if (state.waitingForStart && side) {
      state.waitingForStart = false;
      if (!state.player) state.player = { x: 0, y: 0, velocityX: 0, velocityY: 0, width: PLAYER_SIZE, height: PLAYER_HEIGHT };
      state.player.velocityY = JUMP_FORCE;
      state.player.onPlatform = false;
    }
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
    scoreElementRef,
    started,
    initGame,
    gameOver,
    score: displayScore,
    togglePause,
    stateRef,
    forceGameOver
  };
};