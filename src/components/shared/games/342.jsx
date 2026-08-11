import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// ================== CONSTANTS ==================
const TILE_SIZE = 40;
const VISIBLE_ROWS = 13;
const GAME_WIDTH_PX = 375;
const MAX_WIDTH_PX = 600;
const LANE_HEIGHT = TILE_SIZE;
const SWIPE_THRESHOLD = 20;
const TAP_MAX_DURATION = 300;
const TAP_MAX_MOVE = 10;
const MIN_ENTITY_GAP = 70;
const START_LANE = VISIBLE_ROWS - 2;

const CAMERA_FOLLOW_THRESHOLD = 0.5;
const CAMERA_SMOOTHING = 0.08;

const TOP_BUFFER_ROWS = 5;
const BOTTOM_BUFFER_ROWS = 5;

const COLORS = {
  grass: '#4caf50',
  grassDark: '#388e3c',
  road: '#424242',
  roadLine: '#616161',
  water: '#2196f3',
  waterDark: '#1976d2',
  rail: '#5d4037',
  railTie: '#3e2723',
  log: '#8d6e63',
  carRed: '#f44336',
  carBlue: '#2196f3',
  carYellow: '#ffeb3b',
  carGreen: '#4caf50',
  truck: '#ff9800',
  train: '#212121',
  player: '#e91e63',
  playerEye: '#fff',
  playerPupil: '#000',
  coin: '#ffd700',
};

const DANGER_TYPES = ['road', 'rail'];

// ================== STYLES ==================
const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    background: #1a1a2e;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Courier New', 'Lucida Console', monospace;
  }
`;

const GameContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: ${MAX_WIDTH_PX}px;
  height: ${VISIBLE_ROWS * TILE_SIZE}px;
  background: #0f0f1a;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 0 40px rgba(0,0,0,0.6);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  perspective: 2000px; /* далёкая перспектива = мягкое искажение */
  @media (min-width: ${MAX_WIDTH_PX + 1}px) {
    width: ${GAME_WIDTH_PX}px;
  }
`;

const GameWorld = styled.div`
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  height: ${VISIBLE_ROWS * TILE_SIZE + 50}px;
  transform: rotateX(12deg);
  transform-origin: center center;
  transform-style: preserve-3d;
`;

const ScoreBoard = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 14px;
  z-index: 100;
  text-shadow: 2px 2px 0 #000;
  pointer-events: none;
  font-weight: 500;
  white-space: nowrap;
`;

const LaneDiv = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: ${LANE_HEIGHT}px;
  overflow: hidden;
  will-change: transform;
`;

const RoadMarking = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    ${COLORS.roadLine} 0px,
    ${COLORS.roadLine} 20px,
    transparent 20px,
    transparent 40px
  );
  transform: translateY(-50%);
`;

const RailTie = styled.div`
  position: absolute;
  top: 0;
  width: 8px;
  height: 100%;
  background: ${COLORS.railTie};
`;

const RailLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: #9e9e9e;
`;

const EntityDiv = styled.div`
  position: absolute;
  top: 2px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
`;

const PlayerDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${TILE_SIZE - 4}px;
  height: ${TILE_SIZE - 4}px;
  background: ${COLORS.player};
  border-radius: 8px;
  z-index: 50;
  box-shadow: 0 3px 8px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  will-change: transform;
`;

const Eye = styled.div`
  width: 8px;
  height: 8px;
  background: ${COLORS.playerEye};
  border-radius: 50%;
  position: relative;
`;

const Pupil = styled.div`
  width: 4px;
  height: 4px;
  background: ${COLORS.playerPupil};
  border-radius: 50%;
  position: absolute;
  top: 2px;
  right: 1px;
`;

const CoinDiv = styled.div`
  position: absolute;
  top: 2px;
  left: 0;
  width: ${TILE_SIZE - 12}px;
  height: ${TILE_SIZE - 12}px;
  background: ${COLORS.coin};
  border-radius: 50%;
  z-index: 10;
  box-shadow: 0 0 8px rgba(255,215,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #b8860b;
  font-weight: 500;
  will-change: transform;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
  color: #fff;
  gap: 16px;
`;

const Btn = styled.button`
  background: #e91e63;
  color: #fff;
  border: none;
  padding: 12px 28px;
  font-family: inherit;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 0 #ad1457;
  transition: transform 0.05s;
  font-weight: 500;
  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #ad1457;
  }
`;

const TouchHint = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.5);
  font-size: 10px;
  z-index: 100;
  pointer-events: none;
  text-align: center;
  line-height: 1.5;
`;

// ================== HELPERS ==================
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function overlaps(x1, w1, x2, w2, minGap) {
  return x1 < x2 + w2 + minGap && x1 + w1 + minGap > x2;
}

function generateLane(index, prevType) {
  if (index >= START_LANE) {
    return { type: 'grass', speed: 0, entities: [], coins: [], index };
  }

  // Чередование: опасная -> безопасная -> опасная -> безопасная
  let type;
  if (prevType === 'grass') {
    type = randChoice(DANGER_TYPES);
  } else {
    type = 'grass';
  }

  const direction = Math.random() > 0.5 ? 1 : -1;
  const laneSpeed = direction * rand(8, 14) / 10;
  const entities = [];
  const coins = [];

  if (type === 'road') {
    const carCount = rand(2, 3);
    const colors = [COLORS.carRed, COLORS.carBlue, COLORS.carYellow, COLORS.carGreen];
    for (let i = 0; i < carCount; i++) {
      let attempts = 0;
      let newEntity;
      do {
        newEntity = {
          x: rand(0, GAME_WIDTH_PX - 60),
          w: rand(50, 70),
          h: TILE_SIZE - 8,
          color: randChoice(colors),
          speed: laneSpeed,
        };
        attempts++;
      } while (
        attempts < 20 &&
        entities.some(e => overlaps(e.x, e.w, newEntity.x, newEntity.w, MIN_ENTITY_GAP))
      );
      if (attempts < 20) entities.push(newEntity);
    }
  } else if (type === 'rail') {
    entities.push({
      x: -250,
      w: 220,
      h: TILE_SIZE - 6,
      color: COLORS.train,
      speed: laneSpeed,
    });
  } else if (type === 'grass' && Math.random() > 0.6) {
    const treeCount = rand(1, 3);
    for (let i = 0; i < treeCount; i++) {
      let attempts = 0;
      let newTree;
      do {
        newTree = {
          x: rand(0, GAME_WIDTH_PX - TILE_SIZE),
          w: TILE_SIZE,
          h: TILE_SIZE,
          color: COLORS.grassDark,
          speed: 0,
          isTree: true,
        };
        attempts++;
      } while (
        attempts < 20 &&
        entities.some(e => overlaps(e.x, e.w, newTree.x, newTree.w, 10))
      );
      if (attempts < 20) entities.push(newTree);
    }
  }

  if (type !== 'road' && type !== 'rail' && Math.random() > 0.7) {
    let attempts = 0;
    let coinX;
    do {
      coinX = rand(0, GAME_WIDTH_PX - TILE_SIZE);
      attempts++;
    } while (
      attempts < 20 &&
      entities.some(e => coinX >= e.x - TILE_SIZE && coinX <= e.x + e.w)
    );
    if (attempts < 20) coins.push({ x: coinX + 6 });
  }

  return { type, speed: laneSpeed, entities, coins, index };
}

function generateInitialLanes() {
  const lanes = [];
  let prev = 'grass';
  for (let i = 0; i < VISIBLE_ROWS + 4; i++) {
    const lane = generateLane(i, prev);
    lanes.push(lane);
    prev = lane.type;
  }
  return lanes;
}

// ================== COMPONENT ==================
export default function CrossyRoadGame() {
  const startY = START_LANE * TILE_SIZE + 2;
  const startX = Math.floor(GAME_WIDTH_PX / 2 / TILE_SIZE) * TILE_SIZE + 2;

  const [lanes, setLanes] = useState(generateInitialLanes);
  const [playerX, setPlayerX] = useState(startX);
  const [playerY, setPlayerY] = useState(startY);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [coins, setCoins] = useState(0);
  const [cameraOffset, setCameraOffset] = useState(0);

  const lanesRef = useRef(lanes);
  const lanesMapRef = useRef(new Map());
  const playerXRef = useRef(playerX);
  const playerYRef = useRef(playerY);
  const scoreRef = useRef(score);
  const gameOverRef = useRef(gameOver);
  const gameStartedRef = useRef(gameStarted);
  const coinsRef = useRef(coins);
  const rafRef = useRef();
  const lastTimeRef = useRef(0);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const cameraTargetRef = useRef(0);
  const initialPlayerYRef = useRef(startY);

  const syncLanes = useCallback((laneArray) => {
    lanesRef.current = laneArray;
    const map = new Map();
    for (const lane of laneArray) {
      map.set(lane.index, lane);
    }
    lanesMapRef.current = map;
  }, []);

  useEffect(() => { syncLanes(lanes); }, [lanes, syncLanes]);
  useEffect(() => { playerXRef.current = playerX; }, [playerX]);
  useEffect(() => { playerYRef.current = playerY; }, [playerY]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { gameStartedRef.current = gameStarted; }, [gameStarted]);
  useEffect(() => { coinsRef.current = coins; }, [coins]);

  useEffect(() => {
    const handler = (e) => e.preventDefault();
    document.addEventListener('touchmove', handler, { passive: false });
    return () => document.removeEventListener('touchmove', handler);
  }, []);

  const resetGame = useCallback(() => {
    if (gameOverRef.current) {
      const newLanes = generateInitialLanes();
      setLanes(newLanes);
      syncLanes(newLanes);
    }
    setPlayerX(startX);
    setPlayerY(startY);
    setScore(0);
    setCoins(0);
    setGameOver(false);
    setGameStarted(true);
    setCameraOffset(0);
    cameraTargetRef.current = 0;
    initialPlayerYRef.current = startY;
    gameOverRef.current = false;
    gameStartedRef.current = true;
  }, [startX, startY, syncLanes]);

  const die = useCallback(() => {
    if (gameOverRef.current) return;
    setGameOver(true);
    gameOverRef.current = true;
    setHighScore(s => Math.max(s, scoreRef.current));
  }, []);

  const movePlayer = useCallback((dx, dy) => {
    if (gameOverRef.current || !gameStartedRef.current) return;

    const newX = Math.max(2, Math.min(GAME_WIDTH_PX - TILE_SIZE + 2, playerXRef.current + dx * TILE_SIZE));
    const newY = playerYRef.current + dy * TILE_SIZE;

    if (newY > (START_LANE + 1) * TILE_SIZE) {
      return;
    }

    const laneIndex = Math.floor(newY / TILE_SIZE);
    const lane = lanesMapRef.current.get(laneIndex);
    if (lane) {
      for (const e of lane.entities) {
        if (e.isTree && newX + 4 >= e.x && newX + TILE_SIZE - 8 <= e.x + e.w) {
          return;
        }
      }
    }

    setPlayerX(newX);
    setPlayerY(newY);

    if (dy < 0) {
      const forwardLanes = START_LANE - laneIndex;
      if (forwardLanes > scoreRef.current) {
        setScore(forwardLanes);
      }

      setLanes(prevLanes => {
        let minIndex = Infinity;
        let maxIndex = -Infinity;
        for (const l of prevLanes) {
          if (l.index < minIndex) minIndex = l.index;
          if (l.index > maxIndex) maxIndex = l.index;
        }

        let result = prevLanes;

        const neededMin = laneIndex - TOP_BUFFER_ROWS;
        if (neededMin < minIndex) {
          const newBatch = [];
          let prevType = lanesMapRef.current.get(minIndex)?.type || 'grass';
          for (let i = minIndex - 1; i >= neededMin; i--) {
            const lane = generateLane(i, prevType);
            newBatch.push(lane);
            prevType = lane.type;
          }
          result = [...newBatch, ...result];
        }

        const maxKeepIndex = laneIndex + VISIBLE_ROWS + BOTTOM_BUFFER_ROWS;
        result = result.filter(l => l.index <= maxKeepIndex);

        syncLanes(result);
        return result;
      });
    }
  }, [syncLanes]);

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
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
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
      if (dx > 0) movePlayer(1, 0);
      else movePlayer(-1, 0);
    }
  }, [movePlayer]);

  useEffect(() => {
    const loop = (time) => {
      const dt = Math.min((time - lastTimeRef.current) / 16.67, 3);
      lastTimeRef.current = time;

      if (gameStartedRef.current && !gameOverRef.current) {
        setLanes(prev => {
          const updated = prev.map(lane => {
            const newEntities = lane.entities.map(e => {
              let nx = e.x + e.speed * dt;
              if (e.speed > 0 && nx > GAME_WIDTH_PX) nx = -e.w;
              if (e.speed < 0 && nx + e.w < 0) nx = GAME_WIDTH_PX;
              return { ...e, x: nx };
            });
            return { ...lane, entities: newEntities };
          });
          lanesRef.current = updated;
          const map = new Map();
          for (const l of updated) map.set(l.index, l);
          lanesMapRef.current = map;
          return updated;
        });

        const screenHeight = VISIBLE_ROWS * TILE_SIZE;
        const playerProgress = initialPlayerYRef.current - playerYRef.current;
        const threshold = screenHeight * CAMERA_FOLLOW_THRESHOLD;
        const targetOffset = Math.max(0, playerProgress - threshold);
        cameraTargetRef.current += (targetOffset - cameraTargetRef.current) * CAMERA_SMOOTHING;
        setCameraOffset(cameraTargetRef.current);

        const pRect = {
          x: playerXRef.current + 4,
          y: playerYRef.current + 4,
          w: TILE_SIZE - 12,
          h: TILE_SIZE - 12,
        };

        const laneIdx = Math.floor(playerYRef.current / TILE_SIZE);
        const lane = lanesMapRef.current.get(laneIdx);
        const laneY = laneIdx * TILE_SIZE;

        if (lane) {
          const isSafeLane = laneIdx >= START_LANE;

          if (!isSafeLane) {
            if (lane.type === 'road' || lane.type === 'rail') {
              for (const e of lane.entities) {
                if (
                  pRect.x < e.x + e.w - 4 &&
                  pRect.x + pRect.w > e.x + 4 &&
                  pRect.y < laneY + LANE_HEIGHT - 2 &&
                  pRect.y + pRect.h > laneY + 2
                ) {
                  die();
                }
              }
            }
          }

          const newCoins = [];
          for (const c of lane.coins) {
            const cx = c.x + 6;
            const cy = laneY + 6;
            const cw = TILE_SIZE - 12;
            if (
              pRect.x < cx + cw &&
              pRect.x + pRect.w > cx &&
              pRect.y < cy + cw &&
              pRect.y + pRect.h > cy
            ) {
              setCoins(prev => prev + 1);
            } else {
              newCoins.push(c);
            }
          }
          if (newCoins.length !== lane.coins.length) {
            setLanes(prevLanes => {
              const updated = prevLanes.map(l =>
                l.index === laneIdx ? { ...l, coins: newCoins } : l
              );
              lanesRef.current = updated;
              const map = new Map();
              for (const ln of updated) map.set(ln.index, ln);
              lanesMapRef.current = map;
              return updated;
            });
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [die]);

  const visibleLanes = useMemo(() => {
    return lanes.filter(lane => {
      const y = lane.index * TILE_SIZE + cameraOffset;
      return y >= -LANE_HEIGHT && y <= VISIBLE_ROWS * TILE_SIZE;
    });
  }, [lanes, cameraOffset]);

  return (
    <>
      <GlobalStyle />
      <GameContainer
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <GameWorld>
          {visibleLanes.map(lane => {
            const y = lane.index * TILE_SIZE + cameraOffset;

            let bg = COLORS.grass;
            if (lane.type === 'road') bg = COLORS.road;
            if (lane.type === 'rail') bg = COLORS.rail;

            return (
              <LaneDiv
                key={lane.index}
                style={{ transform: `translate3d(0, ${y}px, 0)`, background: bg }}
              >
                {lane.type === 'road' && <RoadMarking />}
                {lane.type === 'rail' && (
                  <>
                    <RailLine style={{ top: 6 }} />
                    <RailLine style={{ top: LANE_HEIGHT - 9 }} />
                    {Array.from({ length: Math.ceil(GAME_WIDTH_PX / 40) + 2 }).map((_, i) => (
                      <RailTie key={i} style={{ left: i * 40 }} />
                    ))}
                  </>
                )}
                {lane.type === 'grass' && lane.index < START_LANE && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: lane.index % 2 === 0 ? 'rgba(0,0,0,0.03)' : 'transparent'
                  }} />
                )}

                {lane.entities.map((e, idx) => (
                  <EntityDiv
                    key={idx}
                    style={{
                      transform: `translate3d(${e.x}px, 0, 0)`,
                      width: e.w,
                      height: e.h,
                      background: e.color,
                      borderRadius: e.isTree ? '2px' : '6px',
                      boxShadow: e.isTree ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    {e.isTree && (
                      <div style={{
                        width: e.w - 8,
                        height: e.h - 8,
                        background: '#2e7d32',
                        borderRadius: 4,
                      }} />
                    )}
                    {lane.type === 'road' && (
                      <div style={{
                        position: 'absolute',
                        top: 4,
                        width: e.w - 12,
                        height: 4,
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: 2,
                      }} />
                    )}
                  </EntityDiv>
                ))}

                {lane.coins.map((c, idx) => (
                  <CoinDiv key={idx} style={{ transform: `translate3d(${c.x}px, 0, 0)` }}>
                    $
                  </CoinDiv>
                ))}
              </LaneDiv>
            );
          })}

          <PlayerDiv style={{ transform: `translate3d(${playerX}px, ${playerY + cameraOffset}px, 0)` }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <Eye><Pupil /></Eye>
              <Eye><Pupil /></Eye>
            </div>
          </PlayerDiv>
        </GameWorld>
      </GameContainer>
    </>
  );
}