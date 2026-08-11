import isNil from "lodash/isNil";
import styled from "styled-components";
import {GameTile} from "./GameTile";
import {CONTAINER_SIZE, TILE_COUNT_PER_DIMENSION} from '../constants';
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const Board = styled.div`
    position: relative;
    width: ${({$sizeRatio}) => `calc(${CONTAINER_SIZE}px * ${$sizeRatio})`};
    height: ${({$sizeRatio}) => `calc(${CONTAINER_SIZE}px * ${$sizeRatio})`};
    background: rgb(201 216 254);
    border-radius: var(--border-radius-lg);
    border: 0.5px solid var(--color-blue-light);
    padding: var(--spacing_x2);
`

const Tiles = styled.div`
    position: absolute;
    z-index: 2;
    left: var(--spacing_x2);
    top: var(--spacing_x2);
    right: var(--spacing_x2);
    bottom: var(--spacing_x2);
`

export function GameBoard({ className, tiles, isRules }) {
    const sizeRatio = useSizeRatio();

    const renderTiles = () => {
        return tiles.filter((tile) => !isNil(tile?.id)).map((tile) => (
            <GameTile isRules={isRules} key={tile.id} {...tile} />
        ));
    };

    return (
        <Board className={className} $sizeRatio={sizeRatio}>
            
            <Tiles $sizeRatio={sizeRatio}>
                {Array.from({length: TILE_COUNT_PER_DIMENSION * TILE_COUNT_PER_DIMENSION}).map((_, index) => (
                    <GameTile key={index} position={[Math.floor(index % TILE_COUNT_PER_DIMENSION), Math.floor(index / TILE_COUNT_PER_DIMENSION)]}/>
                ))}
                {renderTiles()}
            </Tiles>
        </Board>
    );
}