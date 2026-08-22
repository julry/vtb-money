import React, {
    useRef,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from 'react';
import styled from 'styled-components';
import {CELL_HEIGHT, CELL_WIDTH, CULL_BUFFER, GAME_CELLS, PAN_PADDING} from './constants';
import characterSrc from '../../../assets/images/person/persStand.webp';
import characterFSrc from '../../../assets/images/person/persFStand.webp';
import { buildSpatialIndex, getCharacterStyle, getVisibleCells } from './helpers';
import { useMapPan } from './useMapPan';
import { SeparatorCell } from './SeparatorCell';
import { TileCell } from './TileCell';
import { CURRENT_WEEK } from '../../../contexts/ProgressProvider';
import { useCharacterPath } from './useCharacterPath';
import { useProgress } from '../../../hooks/useProgress';
import { CellModal } from '../../shared/modals/CellModal';

const Viewport = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  contain: layout style;
  transform: rotate(-25deg);
`;

const MapLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  contain: layout paint;
`;

const Person = styled.img`
  transform: rotate(25deg);
  object-fit: contain;
`;

export default function PathMap({
    cells = GAME_CELLS,
    cellIndex,
    children,
    isBlured,
}) {
    const { handleOpenModal, openCell, setGameState, isFemale, user } = useProgress();
    const viewportRef = useRef(null);
    const mapLayerRef = useRef(null);
    const [activeCell, setActiveCell] = useState(cells[cellIndex]);
    const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });

    const currentCell = cells[cellIndex];

    const onComplete = useCallback((index) => {
        const currCell = cells[index];
        setActiveCell(currCell);
        setGameState(currCell);

        openCell(currCell.id, {week: currCell.week});
        setTimeout(() => {
            handleOpenModal({
                Component: <CellModal cell={currCell}/>,
            })
        }, 300)
    }, []);


    const { animatedCell } = useCharacterPath(cells, cellIndex, onComplete);

    const spatialIndex = useMemo(() => buildSpatialIndex(cells), [cells]);

const EXTRA_CELLS = 1; // уже есть в constants

const { mapW, mapH, clampBounds } = useMemo(() => {
    const progressWeek = user?.progressWeek ?? CURRENT_WEEK;

    let maxX = 0;
    let minYAll = Infinity;
    let maxYAll = -Infinity;

    // пиксельные границы клеток текущей недели (с учётом marginTop / height)
    let weekTop = Infinity;      // самый верхний пиксель
    let weekBottom = -Infinity;  // самый нижний пиксель

    for (const c of cells) {
        const cellH = c.height ?? CELL_HEIGHT;
        const mTop = c.marginTop ?? 0;
        const pxTop = c.y * CELL_HEIGHT + mTop;
        const pxBottom = pxTop + cellH;

        if (c.x > maxX) maxX = c.x;
        // для полной высоты слоя тоже учитываем margin
        if (pxTop < minYAll) minYAll = pxTop;
        if (pxBottom > maxYAll) maxYAll = pxBottom;

        if (c.week === progressWeek) {
            if (pxTop < weekTop) weekTop = pxTop;
            if (pxBottom > weekBottom) weekBottom = pxBottom;
        }
    }

    // fallback, если на неделе нет клеток
    if (!Number.isFinite(weekTop)) {
        weekTop = minYAll;
        weekBottom = maxYAll;
    }

    const extraPx = EXTRA_CELLS * CELL_HEIGHT;

    // MapLayer покрывает все клетки (с запасом)
    const mapTop = Math.min(0, minYAll);
    const mapBottom = maxYAll + 0.2 * CELL_HEIGHT;
    const mapH = mapBottom - mapTop;
    const mapW = (maxX + 1.2) * CELL_WIDTH;

    // разрешённая полоса = неделя ± EXTRA клеток (в пикселях)
    const allowedTop = weekTop - extraPx;
    const allowedBottom = weekBottom + extraPx;

    // в координатах MapLayer (если mapTop < 0 — сдвигаем)
    return {
        mapW,
        mapH,
        clampBounds: {
            top: allowedTop - mapTop,
            bottom: allowedBottom - mapTop,
        },
    };
}, [cells, user?.progressWeek]);

    const { offset, bind } = useMapPan({
    centerCellId: currentCell.id,
    cells,
    cellWidth: CELL_WIDTH,
    cellHeight: CELL_HEIGHT,
    mapW,
    mapH,
    clampBounds,           // ← обязательно
    viewportRef,
    mapLayerRef,
    padding: PAN_PADDING,
});

    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;

        const update = () => {
            setViewportSize({ w: el.clientWidth, h: el.clientHeight });
        };
        update();

        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const visibleCells = useMemo(() => {
        if (!viewportSize.w || !viewportSize.h) return cells;
        return getVisibleCells(
            spatialIndex,
            offset,
            viewportSize.w,
            viewportSize.h,
            CELL_WIDTH,
            CELL_HEIGHT,
            CULL_BUFFER
        );
    }, [spatialIndex, offset, viewportSize, cells]);

    //TODO: активные клетки доделать в том числе подсветку первой клетки
    return (
        <Viewport ref={viewportRef}>
            <MapLayer
                ref={mapLayerRef}
                {...bind}
                style={{
                    ...bind.style,
                    width: mapW,
                    height: mapH,
                }}
            >
                {visibleCells.map((cell) => (
                    <React.Fragment key={cell.id}>
                        {
                            cell.separators?.map((separator, index) => (
                                <SeparatorCell
                                    key={`separator_${cell.id}_${index}`}
                                    {...separator}
                                    opacity={cell.week > CURRENT_WEEK ? 0.3 : 1}
                                    x={cell.x}
                                    y={cell.y}
                                    isBlured={isBlured}
                                />
                            ))
                        }
                        
                        <TileCell
                            id={cell.id}
                            x={cell.x}
                            y={cell.y}
                            zIndex={cell.zIndex}
                            marginLeft={cell.marginLeft}
                            marginTop={cell.marginTop}
                            tileSrc={cell.tileSrc}
                            width={cell.width}
                            height={cell.height}
                            isStart={cell.isStart}
                            type={cell.type}
                            isActive={cell.id === activeCell.id}
                            activeColor={cell.activeColor}
                            cellType={cell.cellType}
                            opacity={cell.week > CURRENT_WEEK ? 0.3 : 1}
                            isBlured={isBlured && cell.id !== activeCell.id}
                        />
                    </React.Fragment>
                ))}
                <Person
                    src={isFemale ? characterFSrc : characterSrc}          // путь к спрайту
                    alt=""
                    style={getCharacterStyle(animatedCell)}
                />
                {children}
            </MapLayer>
        </Viewport>
    );
}
