import { memo } from 'react';
import styled from 'styled-components';
import { CELL_HEIGHT, CELL_WIDTH, MAX_X } from './constants';

const Wrapper = styled.div`
  position: absolute;
  width: 55px;
  height: 70px;
  left: ${({ $x }) => $x * CELL_WIDTH}px;
  top: ${({ $y }) => $y * CELL_HEIGHT}px;
  z-index: 50;
  margin-left: ${({ $marginLeft }) => $marginLeft || 0}px;
  margin-top: ${({ $marginTop }) => $marginTop || 0}px;

  transform: rotate(25deg);
 
  pointer-events: none;
  content-visibility: auto;
`;

export const LockIcon = memo(function LockIcon({
    x,
    y,
    marginLeft = 0,
    marginTop = 0,
    zIndex,
}) {
    return (
        <Wrapper
            data-cell-id="lock_icon"
            $x={x}
            $y={y}
            $zIndex={zIndex}
            $marginLeft={marginLeft}
            $marginTop={marginTop}
        >
            <svg width="55" height="70" viewBox="0 0 55 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7">
            <path d="M27.293 37.2931C26.2831 37.2806 25.2939 37.5949 24.4585 38.1936C23.623 38.7923 22.9814 39.6467 22.6201 40.6418C22.2588 41.6369 22.195 42.7249 22.4375 43.7594C22.6799 44.7939 23.2168 45.7252 23.976 46.4279V51.2928C23.976 52.221 24.3255 53.1113 24.9475 53.7676C25.5696 54.424 26.4133 54.7927 27.293 54.7927C28.1727 54.7927 29.0163 54.424 29.6384 53.7676C30.2604 53.1113 30.6099 52.221 30.6099 51.2928V46.4279C31.3691 45.7252 31.906 44.7939 32.1485 43.7594C32.3909 42.7249 32.3271 41.6369 31.9658 40.6418C31.6045 39.6467 30.9629 38.7923 30.1275 38.1936C29.292 37.5949 28.3028 37.2806 27.293 37.2931Z" fill="white"/>
            <rect x="2.29297" y="27.2927" width="50" height="40" rx="6.87806" stroke="white" stroke-width="4.58537"/>
            <path d="M14.793 16.0427C14.793 8.44881 20.9491 2.29272 28.543 2.29272V2.29272C36.1369 2.29272 42.293 8.44881 42.293 16.0427V27.2927H14.793V16.0427Z" stroke="white" stroke-width="4.58537"/>
            </g>
            </svg>
        </Wrapper>
    );
});
