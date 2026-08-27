import {CELL_HEIGHT, CELL_WIDTH, CHARACTER_HEIGHT, CHARACTER_WIDTH, CULL_BUFFER, MAX_CELL_H, MAX_CELL_W, MAX_MARGIN_LEFT, MAX_MARGIN_TOP, PAN_PADDING} from './constants';

export function getVisibleCells(
    spatialIndex,
    offset,
    vw,
    vh,
    cellWidth,
    cellHeight,
    buffer = CULL_BUFFER
) {
    // 1. Базовый прямоугольник в локальных координатах MapLayer
    const left = -offset.x;
    const top = -offset.y;

    // 2. Учитываем поворот (-25°) — расширяем AABB
    //    (приближённо, но очень надёжно)
    const angle = 25 * Math.PI / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Размер повёрнутого вьюпорта в осях карты
    const rotW = vw * cos + vh * sin;
    const rotH = vw * sin + vh * cos;

    // Центр вьюпорта в локальных координатах
    const cx = left + vw / 2;
    const cy = top + vh / 2;

    // Расширенный прямоугольник
    const expandX = (rotW - vw) / 2 + MAX_MARGIN_LEFT + (MAX_CELL_W - CELL_WIDTH);
    const expandY = (rotH - vh) / 2 + MAX_MARGIN_TOP  + (MAX_CELL_H - CELL_HEIGHT);

    const minX = Math.floor((cx - rotW / 2 - expandX) / cellWidth) - buffer;
    const maxX = Math.ceil((cx + rotW / 2 + expandX) / cellWidth) + buffer;
    const minY = Math.floor((cy - rotH / 2 - expandY) / cellHeight) - buffer;
    const maxY = Math.ceil((cy + rotH / 2 + expandY) / cellHeight) + buffer;

    const result = [];
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const cell = spatialIndex.get(`${x},${y}`);
            if (cell) result.push(cell);
        }
    }
    return result;
}


export function clampOffset(
    x,
    y,
    mapW,
    mapH,
    vw,
    vh,
    padding = PAN_PADDING,
    clampBounds = null, // { left, right, top, bottom }
) {
    let minX, maxX, minY, maxY;

    if (
        clampBounds &&
        Number.isFinite(clampBounds.left) &&
        Number.isFinite(clampBounds.right) &&
        Number.isFinite(clampBounds.top) &&
        Number.isFinite(clampBounds.bottom)
    ) {
        // X: leftAllowed появляется на экране при offset.x + clampBounds.left
        maxX = padding.left - clampBounds.left;
        minX = vw - padding.right - clampBounds.right;

        // Y
        maxY = padding.top - clampBounds.top;
        minY = vh - padding.bottom - clampBounds.bottom;
    } else {
        // fallback — весь map
        minX = vw - mapW - padding.right;
        maxX = padding.left;
        minY = vh - mapH - padding.bottom;
        maxY = padding.top;
    }

    if (minX > maxX) {
        x = (minX + maxX) / 2;
    } else {
        x = Math.max(minX, Math.min(maxX, x));
    }

    if (minY > maxY) {
        y = (minY + maxY) / 2;
    } else {
        y = Math.max(minY, Math.min(maxY, y));
    }

    return { x, y };
}

export function buildSpatialIndex(cells) {
    const index = new Map();
    for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        index.set(`${c.x},${c.y}`, c);
    }
    return index;
}

export function getCharacterStyle(cell) {
  if (!cell) return { display: 'none' };


  // центр персонажа над центром тайла
  const left =
    (cell.x ?? 0) * CELL_WIDTH +
    (cell.marginLeft ?? 0) +
    (cell.width ?? CELL_WIDTH) / 2 -
    CHARACTER_WIDTH / 6;

  const top =
    (cell.y ?? 0) * CELL_HEIGHT +
    (cell.marginTop ?? 0) +
    (cell.height ?? CELL_HEIGHT) / 2 -
    CHARACTER_HEIGHT + 10;

  return {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: CHARACTER_WIDTH,
    height: CHARACTER_HEIGHT,
    transition: 'left 0.4s ease, top 0.4s ease',
    zIndex: 60,
    pointerEvents: 'none',
  };
}