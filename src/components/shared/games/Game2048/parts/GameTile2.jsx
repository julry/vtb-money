import styled from "styled-components";
import cell2 from '../../../../../assets/images/2048/cell2.webp';
import cell4 from '../../../../../assets/images/2048/cell4.webp';
import cell8 from '../../../../../assets/images/2048/cell8.webp';
import cell16 from '../../../../../assets/images/2048/cell16.webp';
import cell32 from '../../../../../assets/images/2048/cell32.webp';
import cell64 from '../../../../../assets/images/2048/cell64.webp';
import cell128 from '../../../../../assets/images/2048/cell128.webp';
import cell256 from '../../../../../assets/images/2048/cell256.webp';
import cell512 from '../../../../../assets/images/2048/cell512.webp';
import cell1024 from '../../../../../assets/images/2048/cell1024.webp';
import cell2048 from '../../../../../assets/images/2048/cell2048.webp';
import { CONTAINER_SIZE, TILE_COUNT_PER_DIMENSION, MERGE_ANIMATION_DURATION, MOVE_ANIMATION_DURATION } from "../constants";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const VALUE_TO_BACKGROUND = {
    2: cell2,
    4: cell4,
    8: cell8,
    16: cell16,
    32: cell32,
    64: cell64,
    128: cell128,
    256: cell256,
    512: cell512,
    1024: cell1024,
    2048: cell2048,
    undefined: 'rgba(255, 255, 255, 0.3)',
}

const VALUE_TO_SIZE = {
    2: 40,
    4: 40,
    8: 40,
    16: 40,
    32: 40,
    64: 40,
    128: 35,
    256: 35,
    512: 35,
    1024: 28,
    2048: 28,
}

const Tile = styled.div`
    position: absolute;
    left: ${({$left, $sizeRatio}) => $left * $sizeRatio}px;
    top: ${({$top, $sizeRatio}) => $top * $sizeRatio}px;
    z-index: ${({value}) => value};

    display: flex;
    align-items: center;
    justify-content: center;

    --cell-size: ${({$sizeRatio}) => `calc(${(CONTAINER_SIZE - 8 - 8 * (TILE_COUNT_PER_DIMENSION - 1) ) / TILE_COUNT_PER_DIMENSION}px * ${$sizeRatio})`};
    
    width: var(--cell-size);
    height: var(--cell-size);
    
    border-radius: ${({$sizeRatio}) => `calc(10px * ${$sizeRatio})`};
    ${({$hasBorder}) => $hasBorder ? 'border: 0.5px solid rgba(0, 76, 218, 0.5); ' : ""};
    ${({$isRules}) => $isRules ? 'box-shadow: 0px 0px 5px rgba(0, 76, 218, 0.5);' : ""};

    background: rgba(255, 255, 255, 0.3);
    background-image: url(${({value}) => VALUE_TO_BACKGROUND[value]});
    background-size: ${103 / 74 * 100}% ${101 / 74 * 100}%;
    background-position: center;
    
    color: #FFFFFF;
    font-size: ${({$sizeRatio, value}) => VALUE_TO_SIZE[value] * $sizeRatio}px;
    font-weight: 500;
    
    transition-property: left, top, transform;
    transition-duration: ${MOVE_ANIMATION_DURATION}ms, ${MOVE_ANIMATION_DURATION}ms, ${MERGE_ANIMATION_DURATION}ms;
`;

export function GameTile2({ position, value, isRules }) {
    const sizeRatio = useSizeRatio();

    const positionToPixels = (position) => ((position) / TILE_COUNT_PER_DIMENSION) * (CONTAINER_SIZE - (10 * sizeRatio));

    return (
        <Tile
            $sizeRatio={sizeRatio}
            $left={positionToPixels(position[0])}
            $top={positionToPixels(position[1])}
            $hasBorder={!value}
            $isRules={isRules && value === 2}
            value={value}
        >
            {value}
        </Tile>
    );
}
