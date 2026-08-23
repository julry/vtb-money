import React, {
    useRef,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from 'react';
import styled from 'styled-components';
import {CELL_HEIGHT, CELL_WIDTH, CULL_BUFFER, EXTRA_CELLS, GAME_CELLS, PAN_PADDING} from './constants';
import characterSrc from '../../../assets/images/person/persStandLobby.webp';
import characterFSrc from '../../../assets/images/person/persFStandLobby.webp';
import characterInvest from '../../../assets/images/person/persInvest.webp';
import characterFInvest from '../../../assets/images/person/persFInvest.webp';
import characterGame from '../../../assets/images/person/persGame.webp';
import characterFGame from '../../../assets/images/person/persFGame.webp';
import characterQuiz from '../../../assets/images/person/persQuiz.webp';
import characterFQuiz from '../../../assets/images/person/persFQuiz.webp';
import characterLuck from '../../../assets/images/person/persLuck.webp';
import characterFLuck from '../../../assets/images/person/persFLuck.webp';
import characterBonus from '../../../assets/images/person/persBonus.webp';
import characterFBonus from '../../../assets/images/person/persFBonus.webp';
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
    const [personSrc, setPersonSrc] = useState(isFemale ? characterFSrc : characterSrc);

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
        }, 800)
    }, []);


    useEffect(() => {
        const currCell = cells?.find(cell => cell.id === user.lastOpenedCell);

        if (!currCell) {
            setPersonSrc(isFemale ? characterFSrc : characterSrc)
        }

        if (currCell?.type === 'minigame') {
            setPersonSrc(isFemale ? characterFGame : characterGame);
            return;
        }

        if (currCell?.type === 'investment') {
            setPersonSrc(isFemale ? characterFInvest : characterInvest);
            return;
        }

        if (currCell?.type === 'bonus') {
            setPersonSrc(isFemale ? characterFBonus : characterBonus);
            return;
        }

        if (currCell?.type === 'quiz') {
            setPersonSrc(isFemale ? characterFQuiz : characterQuiz);
            return;
        }
        if (currCell?.type === 'luck') {
            setPersonSrc(isFemale ? characterFLuck : characterLuck);
            return;
        }

    }, [user.lastOpenedCell]);

    const { animatedCell } = useCharacterPath(cells, cellIndex, onComplete);

    const spatialIndex = useMemo(() => buildSpatialIndex(cells), [cells]);


const { mapW, mapH, clampBounds } = useMemo(() => {
    const progressWeek = user?.progressWeek ?? CURRENT_WEEK;

    let minXAll = Infinity;
    let maxXAll = -Infinity;
    let minYAll = Infinity;
    let maxYAll = -Infinity;

    let weekLeft = Infinity;
    let weekRight = -Infinity;
    let weekTop = Infinity;
    let weekBottom = -Infinity;

    for (const c of cells) {
        const cellW = c.width ?? CELL_WIDTH;
        const cellH = c.height ?? CELL_HEIGHT;
        const mLeft = c.marginLeft ?? 0;
        const mTop = c.marginTop ?? 0;

        const pxLeft = c.x * CELL_WIDTH + mLeft;
        const pxRight = pxLeft + cellW;
        const pxTop = c.y * CELL_HEIGHT + mTop;
        const pxBottom = pxTop + cellH;

        // полные границы карты
        if (pxLeft < minXAll) minXAll = pxLeft;
        if (pxRight > maxXAll) maxXAll = pxRight;
        if (pxTop < minYAll) minYAll = pxTop;
        if (pxBottom > maxYAll) maxYAll = pxBottom;

        // границы текущей недели
        if (c.week === progressWeek) {
            if (pxLeft < weekLeft) weekLeft = pxLeft;
            if (pxRight > weekRight) weekRight = pxRight;
            if (pxTop < weekTop) weekTop = pxTop;
            if (pxBottom > weekBottom) weekBottom = pxBottom;
        }
    }

    // fallback
    if (!Number.isFinite(weekLeft)) {
        weekLeft = minXAll;
        weekRight = maxXAll;
        weekTop = minYAll;
        weekBottom = maxYAll;
    }

    const extraX = EXTRA_CELLS * CELL_WIDTH;
    const extraY = EXTRA_CELLS * CELL_HEIGHT;

    // MapLayer должен покрывать всё
    const mapLeft = Math.min(0, minXAll);
    const mapTop = Math.min(0, minYAll);
    const mapRight = maxXAll + 0.2 * CELL_WIDTH;
    const mapBottom = maxYAll + 0.2 * CELL_HEIGHT;

    const mapW = mapRight - mapLeft;
    const mapH = mapBottom - mapTop;

    return {
        mapW,
        mapH,
        clampBounds: {
            left:   (weekLeft - extraX) - mapLeft,
            right:  (weekRight + extraX) - mapLeft,
            top:    (weekTop - extraY) - mapTop,
            bottom: (weekBottom + extraY) - mapTop,
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
                    src={personSrc}          // путь к спрайту
                    alt=""
                    style={getCharacterStyle(animatedCell)}
                />
                {children}
            </MapLayer>
        </Viewport>
    );
}
