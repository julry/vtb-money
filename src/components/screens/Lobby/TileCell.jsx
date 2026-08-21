import { memo } from 'react';
import styled from 'styled-components';
import { CELL_HEIGHT, CELL_WIDTH, MAX_X } from './constants';

const CellRoot = styled.div`
  position: absolute;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  left: ${({ $x }) => $x * CELL_WIDTH}px;
  top: ${({ $y }) => $y * CELL_HEIGHT}px;
  z-index: ${({ $x }) => ((MAX_X + 1) - $x)};
  margin-left: ${({ $marginLeft }) => $marginLeft || 0}px;
  margin-top: ${({ $marginTop }) => $marginTop || 0}px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  content-visibility: auto;
  contain-intrinsic-size: ${({ $width }) => $width}px ${({ $height }) => $height}px;

    opacity: ${({ $opacity }) => $opacity};
    ${({ $isBlured }) => $isBlured ? 'filter: blur(5px)' : ''};
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
    top: 40%;
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
    width = CELL_WIDTH,
    height = CELL_HEIGHT,
    isStart = false,
    isActive,
    cellType,
    activeColor = 'var(--color-accent)',
    opacity,
    isBlured,
}) {
    //TODO: переделать тени
    const getSvg = () => {
        switch (cellType) {
            case 'rect':
                return (
                    <ActiveTileSvg $isActive={isActive} width={102 * 0.95} height={66 * 0.95} viewBox="0 0 102 66" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            case 'octGame':
                return (
                    <ActiveTileSvg $isActive={isActive} width={97 * 0.95} height={70 * 0.95} viewBox="0 0 97 70" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            case 'octQuiz':
                return (
                    <ActiveTileSvg style={{ top: '43.5%' }} $isActive={isActive} width={98} height={71} viewBox="0 0 98 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_ii_3037_44)">
                            <path d="M69.2891 6.68689L84.821 10.7137C91.7442 12.5086 96.8717 18.3457 97.7593 25.4425C98.108 28.2309 97.7783 31.0622 96.7983 33.6958L92.5657 45.0692C91.0793 49.0634 88.4765 52.5463 85.067 55.1034C83.2262 56.484 81.1823 57.5706 79.0082 58.3243L46.9109 69.4513C45.4994 69.9406 44.0453 70.2971 42.5676 70.5161C35.4323 71.5737 28.1996 69.3665 22.8705 64.5053L4.60185 47.8405C3.40233 46.7463 2.40067 45.4533 1.64101 44.0183C-0.465617 40.0392 -0.546584 35.2935 1.42306 31.2448L7.28907 19.1869L8.58709 16.2825C13.9384 4.30889 27.0002 -2.21978 39.7891 0.68689L69.2891 6.68689Z" fill="#479FFF" />
                        </g>
                        <defs>
                            <filter id="filter0_ii_3037_44" x="0" y="0" width="99.2506" height="72.1318" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="3.39029" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.7 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3037_44" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2.03418" dy="1.01709" />
                                <feGaussianBlur stdDeviation="0.678059" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.352941 0 0 0 0 0.737255 0 0 0 0.4 0" />
                                <feBlend mode="normal" in2="effect1_innerShadow_3037_44" result="effect2_innerShadow_3037_44" />
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
            />
            {getSvg()}
        </CellRoot>
    );
});
