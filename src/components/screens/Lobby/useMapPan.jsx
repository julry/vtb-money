import { useRef, useEffect, useState, useCallback } from 'react';
import { CELL_HEIGHT, CELL_WIDTH, PAN_PADDING, VISIBLE_UPDATE_MS } from './constants';
import { clampOffset } from './helpers';

const CENTER_DURATION = 450; // ms

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function useMapPan({
  centerCellId,
  cells,
  cellWidth = CELL_WIDTH,
  cellHeight = CELL_HEIGHT,
  mapW = 0,
  mapH = 0,
  viewportRef,
  mapLayerRef,
  padding = PAN_PADDING,
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const hasCenteredOnce = useRef(false);
  const rafId = useRef(0);
  const lastVisibleUpdate = useRef(0);

  // анимация центрирования
  const animRaf = useRef(0);
  const animStart = useRef(0);
  const animFrom = useRef({ x: 0, y: 0 });
  const animTo = useRef({ x: 0, y: 0 });

  const mapSizeRef = useRef({ mapW, mapH });
  mapSizeRef.current = { mapW, mapH };
  const paddingRef = useRef(padding);
  paddingRef.current = padding;

  const applyTransform = useCallback(
    (x, y, { clamp = true } = {}) => {
      let nextX = x;
      let nextY = y;

      if (clamp && viewportRef.current) {
        const { clientWidth: vw, clientHeight: vh } = viewportRef.current;
        const { mapW: w, mapH: h } = mapSizeRef.current;
        if (w > 0 && h > 0 && vw > 0 && vh > 0) {
          const clamped = clampOffset(x, y, w, h, vw, vh, paddingRef.current);
          nextX = clamped.x;
          nextY = clamped.y;
        }
      }

      const el = mapLayerRef.current;
      if (el) {
        el.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      }
      offsetRef.current = { x: nextX, y: nextY };
      return offsetRef.current;
    },
    [mapLayerRef, viewportRef]
  );

  // плавная анимация к точке
  const animateTo = useCallback(
    (targetX, targetY) => {
      if (animRaf.current) {
        cancelAnimationFrame(animRaf.current);
        animRaf.current = 0;
      }

      animFrom.current = { ...offsetRef.current };
      animTo.current = { x: targetX, y: targetY };
      animStart.current = performance.now();

      const step = (now) => {
        const elapsed = now - animStart.current;
        const t = Math.min(1, elapsed / CENTER_DURATION);
        const eased = easeOutCubic(t);

        const x = animFrom.current.x + (animTo.current.x - animFrom.current.x) * eased;
        const y = animFrom.current.y + (animTo.current.y - animFrom.current.y) * eased;

        applyTransform(x, y);

        if (t >= 1 || now - lastVisibleUpdate.current > VISIBLE_UPDATE_MS) {
          lastVisibleUpdate.current = now;
          setOffset({ ...offsetRef.current });
        }

        if (t < 1) {
          animRaf.current = requestAnimationFrame(step);
        } else {
          animRaf.current = 0;
          setOffset({ ...offsetRef.current });
        }
      };

      animRaf.current = requestAnimationFrame(step);
    },
    [applyTransform]
  );

  const centerOnCell = useCallback(
  (cellId, { instant = false } = {}) => {
    if (isDragging.current) return;

    const cell = cells.find((c) => c.id === cellId);
    if (!cell || !viewportRef.current) return;

    const { clientWidth: vw, clientHeight: vh } = viewportRef.current;
    const { mapW: w, mapH: h } = mapSizeRef.current;

    const cellW = cell.width ?? cellWidth;
    const cellH = cell.height ?? cellHeight;

    const cellCenterX = cell.x * cellWidth + cellW / 2 + (cell.marginLeft ?? 0);
    const cellCenterY = cell.y * cellHeight + cellH / 2 + (cell.marginTop ?? 0);

    let targetX = vw / 2 - cellCenterX;
    let targetY = vh / 2 - cellCenterY;

    if (w > 0 && h > 0 && vw > 0 && vh > 0) {
      const clamped = clampOffset(targetX, targetY, w, h, vw, vh, paddingRef.current);
      targetX = clamped.x;
      targetY = clamped.y;
    }

    // первое центрирование — мгновенно
    if (instant || !hasCenteredOnce.current) {
      hasCenteredOnce.current = true;
      applyTransform(targetX, targetY);
      setOffset({ x: targetX, y: targetY });
      return;
    }

    // дальше — только анимация
    animateTo(targetX, targetY);
  },
  [cells, cellWidth, cellHeight, viewportRef, applyTransform, animateTo]
);
const centerOnCellRef = useRef(centerOnCell);
centerOnCellRef.current = centerOnCell;

useEffect(() => {
  const t = setTimeout(() => {
    // на маунте instant = true, потом обычная анимация
    centerOnCellRef.current(centerCellId, { instant: !hasCenteredOnce.current });
  }, 0);
  return () => clearTimeout(t);
}, [centerCellId]);

  useEffect(() => {
    if (!mapW || !mapH || !viewportRef.current) return;
    const next = applyTransform(offsetRef.current.x, offsetRef.current.y);
    setOffset(next);
  }, [mapW, mapH, applyTransform, viewportRef]);

  const scheduleOffsetSync = useCallback(() => {
    const now = performance.now();
    if (now - lastVisibleUpdate.current < VISIBLE_UPDATE_MS) {
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          rafId.current = 0;
          lastVisibleUpdate.current = performance.now();
          setOffset({ ...offsetRef.current });
        });
      }
      return;
    }
    lastVisibleUpdate.current = now;
    setOffset({ ...offsetRef.current });
  }, []);

  const onPointerDown = useCallback((e) => {
    // останавливаем анимацию при начале драга
    if (animRaf.current) {
      cancelAnimationFrame(animRaf.current);
      animRaf.current = 0;
    }

    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      if (!isDragging.current) return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };

      applyTransform(offsetRef.current.x + dx, offsetRef.current.y + dy);
      scheduleOffsetSync();
    },
    [applyTransform, scheduleOffsetSync]
  );

  const onPointerUp = useCallback((e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    e.currentTarget.style.cursor = 'grab';
    setOffset({ ...offsetRef.current });
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (animRaf.current) cancelAnimationFrame(animRaf.current);
    };
  }, []);

  const setOffsetClamped = useCallback(
    (next) => {
      const value = typeof next === 'function' ? next(offsetRef.current) : next;
      const clamped = applyTransform(value.x, value.y);
      setOffset(clamped);
    },
    [applyTransform]
  );

  return {
    offset,
    setOffset: setOffsetClamped,
    centerOnCell,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      style: {
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
      },
    },
  };
}