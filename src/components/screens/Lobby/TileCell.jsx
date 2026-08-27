import { memo } from 'react';
import styled from 'styled-components';
import { CELL_HEIGHT, CELL_WIDTH, MAX_X } from './constants';

const CellRoot = styled.div`
  position: absolute;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  left: ${({ $x }) => $x * CELL_WIDTH}px;
  top: ${({ $y }) => $y * CELL_HEIGHT}px;
  z-index: ${({ $x, $zIndex }) => $zIndex ?? ((MAX_X + 1) - $x)};
  margin-left: ${({ $marginLeft }) => $marginLeft || 0}px;
  margin-top: ${({ $marginTop }) => $marginTop || 0}px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  content-visibility: auto;
  contain-intrinsic-size: ${({ $width }) => $width}px ${({ $height }) => $height}px;

    opacity: ${({ $opacity }) => $opacity};
    ${({ $isBlured }) => $isBlured ? 'filter: blur(3px)' : ''};
`;

const TileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
  transform: rotate(25deg);
`;

const ActiveTileSvg = styled.svg`
    position: absolute;
    top: ${({ $top }) => $top ?? 40}%;
    left: 54%;
    transform: translate(-50%, -50%) rotate(25deg);
    opacity: ${({ $isActive }) => $isActive ? 1 : 0};
    transition: opacity 0.2s;
    z-index: 2;
`;

export const TileCell = memo(function TileCell({
    id,
    x,
    y,
    marginLeft = 0,
    marginTop = 0,
    tileSrc,
    zIndex,
    width = CELL_WIDTH,
    height = CELL_HEIGHT,
    isStart = false,
    isActive,
    cellType,
    activeColor = 'var(--color-accent)',
    opacity,
    isBlured,
    type,
}) {
    const getSvg = () => {
        switch (cellType) {
            case 'rect':
                if (type === 'investment') {
                    return (
                        <ActiveTileSvg $isActive={isActive} width={114} height={67} viewBox="0 0 114 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_ii_1225_317)">
                                <path d="M57.4907 1.9134L12.2528 17.726C11.3187 18.0525 10.4357 18.5102 9.63043 19.0854C4.53634 22.7234 3.76746 29.9959 7.98816 34.6188L30.1921 58.9385C34.3949 63.5418 40.3545 66.1444 46.5877 66.0984C49.3022 66.0784 51.9896 65.5558 54.5138 64.557L100.896 46.2037C106.758 44.175 108.566 36.7675 104.297 32.2664L80.89 7.58531C76.3781 2.82783 69.9916 0.311782 63.4472 0.713481C61.416 0.838155 59.4117 1.24192 57.4907 1.9134Z" fill="#A171FF" />
                            </g>
                            <g filter="url(#filter1_ii_1225_317)">
                                <path d="M57.4907 1.9134L12.2528 17.726C11.3187 18.0525 10.4357 18.5102 9.63043 19.0854C4.53634 22.7234 3.76746 29.9959 7.98816 34.6188L30.1921 58.9385C34.3949 63.5418 40.3545 66.1444 46.5877 66.0984C49.3022 66.0784 51.9896 65.5558 54.5138 64.557L100.896 46.2037C106.758 44.175 108.566 36.7675 104.297 32.2664L80.89 7.58531C76.3781 2.82783 69.9916 0.311782 63.4472 0.713481C61.416 0.838155 59.4117 1.24192 57.4907 1.9134Z" fill="#A171FF" />
                            </g>
                            <defs>
                                <filter id="filter0_ii_1225_317" x="5.25781" y="0.671751" width="102.739" height="66.7834" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="3.39029" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.360784 0 0 0 0 0.137255 0 0 0 0 0.796078 0 0 0 0.7 0" />
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1225_317" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dx="2.03418" dy="1.01709" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.360784 0 0 0 0 0.137255 0 0 0 0 0.796078 0 0 0 0.4 0" />
                                    <feBlend mode="normal" in2="effect1_innerShadow_1225_317" result="effect2_innerShadow_1225_317" />
                                </filter>
                                <filter id="filter1_ii_1225_317" x="5.25781" y="0.671751" width="102.739" height="66.7834" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="3.39029" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.360784 0 0 0 0 0.137255 0 0 0 0 0.796078 0 0 0 0.7 0" />
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1225_317" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dx="2.03418" dy="1.01709" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.360784 0 0 0 0 0.137255 0 0 0 0 0.796078 0 0 0 0.4 0" />
                                    <feBlend mode="normal" in2="effect1_innerShadow_1225_317" result="effect2_innerShadow_1225_317" />
                                </filter>
                            </defs>
                        </ActiveTileSvg>
                    )
                }
                if (type === 'quiz' || type === 'minigame') {
                    return (
                        <ActiveTileSvg $isActive={isActive} width={115} height={69} viewBox="0 0 115 69" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_ii_1225_293)">
                                <path d="M57.5111 2.87157L12.5514 19.4584C11.623 19.8009 10.748 20.2737 9.95271 20.8626C4.92183 24.5876 4.2779 31.8721 8.57734 36.4219L31.1955 60.3569C35.4767 64.8874 41.4801 67.3872 47.7116 67.2343C50.4254 67.1677 53.1034 66.599 55.6101 65.557L101.67 46.4102C107.497 44.2812 109.177 36.8438 104.832 32.4166L81.0044 8.14096C76.4115 3.46164 69.9827 1.05559 63.4462 1.56957C61.4174 1.72909 59.4203 2.16721 57.5111 2.87157Z" fill="#479FFF" />
                            </g>
                            <g filter="url(#filter1_ii_1225_293)">
                                <path d="M57.5111 2.87157L12.5514 19.4584C11.623 19.8009 10.748 20.2737 9.95271 20.8626C4.92183 24.5876 4.2779 31.8721 8.57734 36.4219L31.1955 60.3569C35.4767 64.8874 41.4801 67.3872 47.7116 67.2343C50.4254 67.1677 53.1034 66.599 55.6101 65.557L101.67 46.4102C107.497 44.2812 109.177 36.8438 104.832 32.4166L81.0044 8.14096C76.4115 3.46164 69.9827 1.05559 63.4462 1.56957C61.4174 1.72909 59.4203 2.16721 57.5111 2.87157Z" fill="#479FFF" />
                            </g>
                            <defs>
                                <filter id="filter0_ii_1225_293" x="5.72656" y="1.50128" width="102.907" height="67.0958" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="3.39029" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.7 0" />
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1225_293" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dx="2.03418" dy="1.01709" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.4 0" />
                                    <feBlend mode="normal" in2="effect1_innerShadow_1225_293" result="effect2_innerShadow_1225_293" />
                                </filter>
                                <filter id="filter1_ii_1225_293" x="5.72656" y="1.50128" width="102.907" height="67.0958" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="3.39029" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.7 0" />
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1225_293" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dx="2.03418" dy="1.01709" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.4 0" />
                                    <feBlend mode="normal" in2="effect1_innerShadow_1225_293" result="effect2_innerShadow_1225_293" />
                                </filter>
                            </defs>
                        </ActiveTileSvg>
                    )
                }

                if (type === 'bonus') {
                    return <ActiveTileSvg $isActive={isActive} width={115} height={68} viewBox="0 0 115 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_ii_1225_260)">
                            <path d="M57.5076 2.63003L12.4764 19.0221C11.5466 19.3606 10.6696 19.8296 9.87172 20.415C4.82476 24.1182 4.1493 31.3999 8.429 35.9682L30.9433 60.0009C35.2049 64.5498 41.1974 67.0757 47.4295 66.9497C50.1436 66.8949 52.824 66.3378 55.3352 65.3067L101.478 46.3595C107.313 44.2556 109.026 36.8256 104.7 32.3796L80.9778 8.00107C76.4052 3.3019 69.9869 0.86805 63.4482 1.35373C61.4188 1.50447 59.4198 1.93394 57.5076 2.63003Z" fill="#5E67E8" />
                        </g>
                        <g filter="url(#filter1_ii_1225_260)">
                            <path d="M57.5076 2.63003L12.4764 19.0221C11.5466 19.3606 10.6696 19.8296 9.87172 20.415C4.82476 24.1182 4.1493 31.3999 8.429 35.9682L30.9433 60.0009C35.2049 64.5498 41.1974 67.0757 47.4295 66.9497C50.1436 66.8949 52.824 66.3378 55.3352 65.3067L101.478 46.3595C107.313 44.2556 109.026 36.8256 104.7 32.3796L80.9778 8.00107C76.4052 3.3019 69.9869 0.86805 63.4482 1.35373C61.4188 1.50447 59.4198 1.93394 57.5076 2.63003Z" fill="#5E67E8" />
                        </g>
                        <defs>
                            <filter id="filter0_ii_1225_260" x="5.60938" y="1.29271" width="102.868" height="67.0176" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="3.39029" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.133333 0 0 0 0 0.168627 0 0 0 0 0.686275 0 0 0 0.7 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1225_260" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2.03418" dy="1.01709" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.133333 0 0 0 0 0.168627 0 0 0 0 0.686275 0 0 0 0.4 0" />
                                <feBlend mode="normal" in2="effect1_innerShadow_1225_260" result="effect2_innerShadow_1225_260" />
                            </filter>
                            <filter id="filter1_ii_1225_260" x="5.60938" y="1.29271" width="102.868" height="67.0176" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="3.39029" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.133333 0 0 0 0 0.168627 0 0 0 0 0.686275 0 0 0 0.7 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1225_260" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2.03418" dy="1.01709" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.133106 0 0 0 0 0.169086 0 0 0 0 0.684796 0 0 0 0.4 0" />
                                <feBlend mode="normal" in2="effect1_innerShadow_1225_260" result="effect2_innerShadow_1225_260" />
                            </filter>
                        </defs>
                    </ActiveTileSvg>

                }
                return (
                    <ActiveTileSvg $isActive={isActive} width={102} height={66} viewBox="0 0 102 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_ii_3006_28)">
                            <path d="M51.8982 1.33732L6.86707 17.7294C5.93719 18.0679 5.06018 18.5369 4.26235 19.1223C-0.784619 22.8255 -1.46007 30.1072 2.81963 34.6755L25.3339 58.7081C29.5955 63.2571 35.588 65.783 41.8201 65.657C44.5342 65.6022 47.2146 65.0451 49.7258 64.014L95.8682 45.0667C101.704 42.9629 103.416 35.5329 99.0902 31.0869L75.3684 6.70836C70.7958 2.0092 64.3775 -0.424658 57.8388 0.0610243C55.8094 0.211764 53.8104 0.64123 51.8982 1.33732Z" fill={activeColor} />
                        </g>
                        <defs>
                            <filter id="filter0_ii_3006_28" x="0" y="0" width="102.868" height="67.0176" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="3.39029" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.257227 0 0 0 0 0.514461 0 0 0 0.7 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3006_28" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2.03418" dy="1.01709" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.152673 0 0 0 0 0.496188 0 0 0 0.4 0" />
                                <feBlend mode="normal" in2="effect1_innerShadow_3006_28" result="effect2_innerShadow_3006_28" />
                            </filter>
                        </defs>
                    </ActiveTileSvg>
                )
            case 'oct1':
                if (type === 'minigame') {
                    return (
                        <ActiveTileSvg $isActive={isActive} $top={45} width={97} height={70} viewBox="0 0 97 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_ii_1031_12042)">
                                <path d="M28.426 5.78196L4.36202 24.4999C-1.38295 29.9715 -1.46305 39.1109 4.18513 44.6824L22.0006 62.2561C27.6122 67.7915 35.4083 70.5222 43.2474 69.6981C45.3395 69.4782 47.3976 69.0084 49.3779 68.2988L85.9055 55.2092C91.4069 53.2378 95.3497 48.3631 96.1275 42.5712C96.2678 41.5264 96.3021 40.4701 96.2298 39.4184L95.1997 24.4256C94.9785 21.2063 93.86 18.1133 91.9708 15.4972C89.637 12.2655 86.2573 9.94038 82.4047 8.91629L52.3275 0.921109C50.0271 0.309621 47.6569 -1.8726e-05 45.2767 -1.49321e-05C39.1731 -5.24264e-06 33.2437 2.03455 28.426 5.78196Z" fill="#479FFF" />
                            </g>
                            <defs>
                                <filter id="filter0_ii_1031_12042" x="0" y="0" width="97.6217" height="71.1988" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="3.39029" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.7 0" />
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1031_12042" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dx="2.03418" dy="1.01709" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.4 0" />
                                    <feBlend mode="normal" in2="effect1_innerShadow_1031_12042" result="effect2_innerShadow_1031_12042" />
                                </filter>
                            </defs>
                        </ActiveTileSvg>
                    )
                }

                if (type === 'quiz') {
                    return (
                        <ActiveTileSvg $isActive={isActive} $top={44} width={98} height={71} viewBox="0 0 98 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_ii_3050_168)">
                                <path d="M69.2891 6.68689L84.821 10.7137C91.7442 12.5086 96.8717 18.3457 97.7593 25.4425C98.108 28.2309 97.7783 31.0622 96.7983 33.6958L92.5657 45.0692C91.0793 49.0634 88.4765 52.5463 85.067 55.1034C83.2262 56.484 81.1823 57.5706 79.0082 58.3243L46.9109 69.4513C45.4994 69.9406 44.0453 70.2971 42.5676 70.5161C35.4323 71.5737 28.1996 69.3665 22.8705 64.5053L4.60185 47.8405C3.40233 46.7463 2.40067 45.4533 1.64101 44.0183C-0.465617 40.0392 -0.546584 35.2935 1.42306 31.2448L7.28907 19.1869L8.58709 16.2825C13.9384 4.30889 27.0002 -2.21978 39.7891 0.68689L69.2891 6.68689Z" fill="#479FFF" />
                            </g>
                            <defs>
                                <filter id="filter0_ii_3050_168" x="0" y="0" width="99.2506" height="72.1319" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="3.39029" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.7 0" />
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3050_168" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dx="2.03418" dy="1.01709" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.4 0" />
                                    <feBlend mode="normal" in2="effect1_innerShadow_3050_168" result="effect2_innerShadow_3050_168" />
                                </filter>
                            </defs>
                        </ActiveTileSvg>

                    )
                }

                if (type === 'investment') {
                    return (
                        <ActiveTileSvg $isActive={isActive} $top={43} width={98} height={71} viewBox="0 0 98 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_ii_1031_12162)">
                                <path d="M69.2891 6.68695L84.821 10.7137C91.7442 12.5087 96.8717 18.3458 97.7593 25.4426C98.108 28.2309 97.7783 31.0622 96.7983 33.6958L92.5657 45.0693C91.0793 49.0635 88.4765 52.5464 85.067 55.1035C83.2262 56.4841 81.1823 57.5706 79.0082 58.3243L46.9109 69.4514C45.4994 69.9407 44.0453 70.2972 42.5676 70.5162C35.4323 71.5737 28.1996 69.3666 22.8705 64.5053L4.60185 47.8406C3.40233 46.7464 2.40067 45.4533 1.64101 44.0184C-0.465617 40.0392 -0.546584 35.2936 1.42306 31.2449L7.28907 19.187L8.58709 16.2826C13.9384 4.30895 27.0002 -2.21972 39.7891 0.686951L69.2891 6.68695Z" fill="#A171FF" />
                            </g>
                            <defs>
                                <filter id="filter0_ii_1031_12162" x="0" y="0" width="99.2506" height="72.1319" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="3.39029" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.360784 0 0 0 0 0.137255 0 0 0 0 0.796078 0 0 0 0.7 0" />
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1031_12162" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dx="2.03418" dy="1.01709" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.360784 0 0 0 0 0.137255 0 0 0 0 0.796078 0 0 0 0.4 0" />
                                    <feBlend mode="normal" in2="effect1_innerShadow_1031_12162" result="effect2_innerShadow_1031_12162" />
                                </filter>
                            </defs>
                        </ActiveTileSvg>

                    )
                }
                return (
                    <ActiveTileSvg $isActive={isActive} width={98} height={71} viewBox="0 0 98 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_ii_1031_12162)">
                            <path d="M69.2891 6.68695L84.821 10.7137C91.7442 12.5087 96.8717 18.3458 97.7593 25.4426C98.108 28.2309 97.7783 31.0622 96.7983 33.6958L92.5657 45.0693C91.0793 49.0635 88.4765 52.5464 85.067 55.1035C83.2262 56.4841 81.1823 57.5706 79.0082 58.3243L46.9109 69.4514C45.4994 69.9407 44.0453 70.2972 42.5676 70.5162C35.4323 71.5737 28.1996 69.3666 22.8705 64.5053L4.60185 47.8406C3.40233 46.7464 2.40067 45.4533 1.64101 44.0184C-0.465617 40.0392 -0.546584 35.2936 1.42306 31.2449L7.28907 19.187L8.58709 16.2826C13.9384 4.30895 27.0002 -2.21972 39.7891 0.686951L69.2891 6.68695Z" fill={activeColor} />
                        </g>
                        <defs>
                            <filter id="filter0_ii_1031_12162" x="0" y="0" width="99.2506" height="72.1319" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="3.39029" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.360784 0 0 0 0 0.137255 0 0 0 0 0.796078 0 0 0 0.7 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1031_12162" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2.03418" dy="1.01709" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.360784 0 0 0 0 0.137255 0 0 0 0 0.796078 0 0 0 0.4 0" />
                                <feBlend mode="normal" in2="effect1_innerShadow_1031_12162" result="effect2_innerShadow_1031_12162" />
                            </filter>
                        </defs>
                    </ActiveTileSvg>
                )
            case 'oct2':
                if (type === 'investment') {
                    return (
                        <ActiveTileSvg $isActive={isActive} $top={45} width={97} height={72} viewBox="0 0 97 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_ii_1031_12158)">
                                <path d="M67.3149 5.01676L91.5015 23.246C98.552 29.7547 98.6649 40.8572 91.7483 47.508L73.5955 64.9632C68.4943 69.8683 61.3979 72.1148 54.4033 71.0387C53.1374 70.844 51.8902 70.5425 50.6752 70.1375L11.3852 57.0408C4.58672 54.7746 0.0010526 48.4124 0.00104876 41.2461L0.723766 25.3405C0.860533 22.3305 1.78643 19.4094 3.40854 16.8703C5.71974 13.2525 9.30154 10.6309 13.4488 9.52173L45.8883 0.845713C48.6097 0.117868 51.4349 -0.143033 54.2435 0.0741148C58.983 0.440542 63.5187 2.15561 67.3149 5.01676Z" fill="#A171FF" />
                            </g>
                            <defs>
                                <filter id="filter0_ii_1031_12158" x="0" y="0" width="98.2194" height="72.6591" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="3.39029" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.360784 0 0 0 0 0.137255 0 0 0 0 0.796078 0 0 0 0.7 0" />
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1031_12158" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dx="2.03418" dy="1.01709" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.360784 0 0 0 0 0.137255 0 0 0 0 0.796078 0 0 0 0.4 0" />
                                    <feBlend mode="normal" in2="effect1_innerShadow_1031_12158" result="effect2_innerShadow_1031_12158" />
                                </filter>
                            </defs>
                        </ActiveTileSvg>
                    )
                }
                if (type === 'minigame') {
                    return (
                        <ActiveTileSvg $isActive={isActive} $top={44} width={97} height={70} viewBox="0 0 97 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_ii_1031_12169)">
                                <path d="M67.8396 5.78196L91.9036 24.4999C97.6486 29.9715 97.7287 39.1109 92.0805 44.6824L74.265 62.2561C68.6534 67.7915 60.8573 70.5222 53.0182 69.6981C50.9262 69.4782 48.868 69.0084 46.8878 68.2988L10.3601 55.2092C4.85874 53.2378 0.915932 48.3631 0.138126 42.5712C-0.00218454 41.5264 -0.0364702 40.4701 0.0357853 39.4184L1.06591 24.4256C1.2871 21.2063 2.40567 18.1133 4.29483 15.4972C6.6286 12.2655 10.0084 9.94038 13.8609 8.91629L43.9382 0.921109C46.2385 0.309621 48.6087 -1.8726e-05 50.9889 -1.49321e-05C57.0925 -5.24264e-06 63.0219 2.03455 67.8396 5.78196Z" fill="#479FFF" />
                            </g>
                            <defs>
                                <filter id="filter0_ii_1031_12169" x="0" y="0" width="97.6217" height="71.1987" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="3.39029" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.7 0" />
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1031_12169" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dx="2.03418" dy="1.01709" />
                                    <feGaussianBlur stdDeviation="0.678059" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.4 0" />
                                    <feBlend mode="normal" in2="effect1_innerShadow_1031_12169" result="effect2_innerShadow_1031_12169" />
                                </filter>
                            </defs>
                        </ActiveTileSvg>
                    )
                }
                return (
                    <ActiveTileSvg $isActive={isActive} width={97} height={70} viewBox="0 0 97 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_ii_1031_12169)">
                            <path d="M67.8396 5.78196L91.9036 24.4999C97.6486 29.9715 97.7287 39.1109 92.0805 44.6824L74.265 62.2561C68.6534 67.7915 60.8573 70.5222 53.0182 69.6981C50.9262 69.4782 48.868 69.0084 46.8878 68.2988L10.3601 55.2092C4.85874 53.2378 0.915932 48.3631 0.138126 42.5712C-0.00218454 41.5264 -0.0364702 40.4701 0.0357853 39.4184L1.06591 24.4256C1.2871 21.2063 2.40567 18.1133 4.29483 15.4972C6.6286 12.2655 10.0084 9.94038 13.8609 8.91629L43.9382 0.921109C46.2385 0.309621 48.6087 -1.8726e-05 50.9889 -1.49321e-05C57.0925 -5.24264e-06 63.0219 2.03455 67.8396 5.78196Z" fill={activeColor} />
                        </g>
                        <defs>
                            <filter id="filter0_ii_1031_12169" x="0" y="0" width="97.6217" height="71.1987" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="3.39029" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.7 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1031_12169" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2.03418" dy="1.01709" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.4 0" />
                                <feBlend mode="normal" in2="effect1_innerShadow_1031_12169" result="effect2_innerShadow_1031_12169" />
                            </filter>
                        </defs>
                    </ActiveTileSvg>
                )
            case 'start':
                return (
                    <ActiveTileSvg $isActive={isActive} width={139 * 1.05} height={82 * 1.05} viewBox="0 0 139 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_ii_3006_30)">
                            <path d="M69.7779 3.22117L13.919 22.0564C11.7112 22.8009 9.73245 24.1018 8.17376 25.8337C3.63375 30.878 3.52296 38.5021 7.91447 43.6762L30.4524 70.2307C35.7752 76.5021 43.4535 80.2944 51.6688 80.7093C55.6402 80.9099 59.6117 80.3136 63.3491 78.9555L121.871 57.6901C122.841 57.3376 123.766 56.8715 124.627 56.3015C131.54 51.7226 132.503 41.949 126.616 36.1094L100.694 10.397C94.3586 4.1123 85.5676 0.951674 76.6805 1.76329C74.3306 1.9779 72.0139 2.4672 69.7779 3.22117Z" fill="#004CDA" fill-opacity="0.6" />
                        </g>
                        <g filter="url(#filter1_ii_3006_30)">
                            <path d="M69.7779 3.22117L13.919 22.0564C11.7112 22.8009 9.73245 24.1018 8.17376 25.8337C3.63375 30.878 3.52296 38.5021 7.91447 43.6762L30.4524 70.2307C35.7752 76.5021 43.4535 80.2944 51.6688 80.7093C55.6402 80.9099 59.6117 80.3136 63.3491 78.9555L121.871 57.6901C122.841 57.3376 123.766 56.8715 124.627 56.3015C131.54 51.7226 132.503 41.949 126.616 36.1094L100.694 10.397C94.3586 4.1123 85.5676 0.951674 76.6805 1.76329C74.3306 1.9779 72.0139 2.4672 69.7779 3.22117Z" fill="#004CDA" fill-opacity="0.6" />
                        </g>
                        <defs>
                            <filter id="filter0_ii_3006_30" x="4.69346" y="1.63806" width="127.182" height="80.498" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="3.47222" />
                                <feGaussianBlur stdDeviation="0.694444" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.257227 0 0 0 0 0.514461 0 0 0 0.7 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3006_30" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2.08333" dy="1.04167" />
                                <feGaussianBlur stdDeviation="0.694444" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.152673 0 0 0 0 0.496188 0 0 0 0.4 0" />
                                <feBlend mode="normal" in2="effect1_innerShadow_3006_30" result="effect2_innerShadow_3006_30" />
                            </filter>
                            <filter id="filter1_ii_3006_30" x="4.69346" y="1.63806" width="127.182" height="80.498" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="3.47222" />
                                <feGaussianBlur stdDeviation="0.694444" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.257227 0 0 0 0 0.514461 0 0 0 0.7 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3006_30" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2.08333" dy="1.04167" />
                                <feGaussianBlur stdDeviation="0.694444" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.152673 0 0 0 0 0.496188 0 0 0 0.4 0" />
                                <feBlend mode="normal" in2="effect1_innerShadow_3006_30" result="effect2_innerShadow_3006_30" />
                            </filter>
                        </defs>
                    </ActiveTileSvg>
                )
        }
    }
    return (
        <CellRoot
            $x={x}
            $y={y}
            $zIndex={zIndex}
            $width={width}
            $height={height}
            $marginLeft={marginLeft}
            $marginTop={marginTop}
            $isStart={isStart}
            data-cell-id={id}
            $opacity={opacity}
            $isBlured={isBlured}
        >
            <TileImg
                src={tileSrc}
                alt=""
                draggable={false}
                loading="lazy"
                decoding="async"
                fetchPriority="high"
            />
            {getSvg()}
        </CellRoot>
    );
});
