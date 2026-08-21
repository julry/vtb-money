import {memo} from 'react';
import styled from 'styled-components';
import separator from '../../../assets/images/lobby/separator.webp';
import {CELL_HEIGHT, CELL_WIDTH, MAX_X} from './constants';

const SeparatorImg = styled.img`
    position: absolute;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
    width: 16px;
    height: 26px;
    left: ${({ $x }) => $x * CELL_WIDTH}px;
    top: ${({ $y }) => $y * CELL_HEIGHT}px;
    margin-left: ${({ $marginLeft }) => $marginLeft || 0}px;
    margin-top: ${({ $marginTop }) => $marginTop || 0}px;
    object-fit: contain;
    z-index: ${({ $x }) => ((MAX_X + 1) - $x)};
    content-visibility: auto;
    transform: rotate(25deg);
    opacity: ${({$opacity}) => $opacity};
    ${({ $isBlured }) => $isBlured ? 'filter: blur(5px)' : ''};

`;

export const SeparatorCell = memo(function SeparatorCell({ x, y, marginLeft, marginTop, isBlured }) {
    return (
        <SeparatorImg
            src={separator}
            alt=""
            $x={x}
            $y={y}
            $marginLeft={marginLeft}
            $marginTop={marginTop}
            loading="lazy"
            decoding="async"
            draggable={false}
            $isBlured={isBlured}
        />
    );
});