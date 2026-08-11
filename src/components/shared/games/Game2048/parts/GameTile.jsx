import styled from "styled-components";
import { CONTAINER_SIZE, TILE_COUNT_PER_DIMENSION, MERGE_ANIMATION_DURATION, MOVE_ANIMATION_DURATION } from "../constants";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const VALUE_TO_BACKGROUND = {
    2: '#B4BFFB',
    4: '#96A7FC',
    8: '#6E8EF7',
    16: '#4874E7',
    32: '#DABDFB',
    64: '#C7A3F7',
    128: '#B985FF',
    256: '#9971F1',
    512: '#1286FB',
    1024: '#0D5AF3',
    2048: '#0046CB',
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
    1024: 26,
    2048: 26,
}

const VALUE_TO_SHADOW = {
    2: '#6E85EE',
    4: '#3869FA',
    8: '#1E57D4',
    16: '#0149B7',
    32: '#C096F5',
    64: '#A878EF',
    128: '#9952FB',
    256: '#7B48E8',
    512: '#0066E8',
    1024: '#0142c5',
    2048: '#012e89',
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
    
    background: rgba(255, 255, 255, 0.3);
`;

const Tile3d = styled(Tile)`
    box-shadow: 3px 3px 6px 0px rgba(255, 255, 255, 0.35) inset, -2px -3px 2px 0px ${({value}) => VALUE_TO_SHADOW[value]} inset${({$isRules}) => $isRules ? ', 0px 0px 10px rgba(0, 76, 218, 0.5);' : ""};
    background: ${({value}) => VALUE_TO_BACKGROUND[value]};

    color: #FFFFFF;
    font-size: ${({$sizeRatio, value}) => VALUE_TO_SIZE[value] * $sizeRatio}px;
    font-weight: 500;

    transition-property: left, top, transform;
    transition-duration: ${MOVE_ANIMATION_DURATION}ms, ${MOVE_ANIMATION_DURATION}ms, ${MERGE_ANIMATION_DURATION}ms;
`;

const HighlightTop = styled.svg`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 9px;
  height: 10px;
  pointer-events: none;
`;

const EdgeGlowLeft = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1px;
  height: calc(100% - 6px);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.45) 10%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.45) 30%,
    rgba(255, 255, 255, 0.55) 50%,
    rgba(255, 255, 255, 0.35) 70%,
    transparent 100%
  );
  filter: blur(0.5px);
  pointer-events: none;
`;
const EdgeGlowRight = styled.div`
  position: absolute;
  top: 6px;
  right: 2px;
  width: 1px;
  height: calc(100% - 16px);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.45) 10%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.45) 30%,
    rgba(255, 255, 255, 0.55) 50%,
    rgba(255, 255, 255, 0.35) 70%,
    transparent 100%
  );
  filter: blur(0.5px);
  pointer-events: none;
`;

const EdgeGlowTop = styled.div`
  position: absolute;
  top: 2px;
  left: 4px;
  height: 1px;
  width: calc(100% - 12px);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.45) 10%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.45) 30%,
    rgba(255, 255, 255, 0.55) 50%,
    rgba(255, 255, 255, 0.35) 70%,
    transparent 100%
  );
  filter: blur(0.5px);
  pointer-events: none;
`;

export function GameTile({ position, value, isRules }) {
    const sizeRatio = useSizeRatio();

    const positionToPixels = (position) => ((position) / TILE_COUNT_PER_DIMENSION) * (CONTAINER_SIZE - (10 * sizeRatio));

    const Component = value > 0 ? Tile3d : Tile;

    return (
        <Component
            $sizeRatio={sizeRatio}
            $left={positionToPixels(position[0])}
            $top={positionToPixels(position[1])}
            $hasBorder={!value}
            $isRules={isRules && value === 2}
            value={value}
        >
            {value}
            {value > 0 && (
                <>
                    <HighlightTop>
                        <svg viewBox="0 0 9 10" fill="none" >
                            <path d="M0.5 9.50006C0.833333 6.83339 2.8 1.30006 8 0.500061" stroke="url(#paint0_linear_2058_3)" stroke-linecap="round"/>
                            <defs>
                                <linearGradient id="paint0_linear_2058_3" x1="0.5" y1="10.0001" x2="8" y2="6.15127e-05" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white" stop-opacity="0"/>
                                <stop offset="0.543517" stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </HighlightTop>
                    <EdgeGlowLeft />
                    <EdgeGlowTop />
                    <EdgeGlowRight />
                </>
            )}
        </Component>
    );
}
