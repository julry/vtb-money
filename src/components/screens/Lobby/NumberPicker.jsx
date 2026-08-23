import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSizeRatio } from '../../../hooks/useSizeRatio';
import { Block } from '../../shared/Block';
import { Title } from '../../shared/Title';

const numbers = [1, 2, 3, 4, 5];
const RADIUS = 160;
const ANGLE_STEP = 26;
const ITEM_WIDTH = 70;
const ITEM_HEIGHT = 76;

const PickerContainer = styled(Block)`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    padding-top: var(--spacing_x3);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    user-select: none;
    z-index: 10;
    overflow: hidden;
    ${({$isBlured}) => $isBlured ? 'filter: blur(3px)' : ''};
`;

const PickerTitle = styled(Title)`
    position: relative;
    z-index: 13;
  font-size: var(--font_md);
  margin-bottom: var(--spacing_x2);
`;

const PickerWrapper = styled.div`
  position: relative;
  height: 140px;
  overflow: hidden;
  perspective: 800px;
`;

const Indicator = styled.div`
  position: absolute;
  top: var(--spacing_x3);
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 20px;
  z-index: 20;
`;

const Stage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Item = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${({ $ratio }) => $ratio * ITEM_WIDTH}px;
  height:${({ $ratio }) => $ratio * ITEM_HEIGHT}px;
  margin-left: ${({ $ratio }) => $ratio * -ITEM_WIDTH / 2}px;
  margin-top: ${({ $ratio }) => $ratio * -ITEM_HEIGHT / 2}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $ratio }) => $ratio * 30}px;
  font-weight: 500;
  border-radius:  ${({ $ratio }) => $ratio * 18}px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform, opacity;
    color: #ffffff;
  /* Трапеция с закруглениями */
  

  ${({ $active }) =>
        $active
            ? `
        background: #004CDA;
        box-shadow: inset 1.48714px 1.48714px 1.48714px rgba(255, 255, 255, 0.4);
        z-index: 10;
      `
            : `
        background: rgba(0, 127, 255, 0.7);
        box-shadow: inset 1.48714px 1.48714px 1.48714px rgba(255, 255, 255, 0.4);
      `}
`;

const Blur = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    width: calc(50% - 20px);
    left: 0;
    z-index: 9;
    background: linear-gradient(90deg,rgba(172, 192, 253, 1) 0%, rgba(172, 192, 253, 0) 100%);
`;

const BlurRight = styled(Blur)`
    transform: scale(-1, 1);
    right: 0;
    left: auto;
`

const NumberPicker = ({ value = 3, onChange, isBlured, disabledPick, ...props }) => {
    const ratio = useSizeRatio();
    const [currentIndex, setCurrentIndex] = useState(
        Math.max(0, numbers.indexOf(value))
    );

    const startX = useRef(0);
    const isDragging = useRef(false);

    const updateIndex = (newIndex) => {
        if (newIndex < 0 || newIndex >= numbers.length) return;
        setCurrentIndex(newIndex);
    };


    const pickNumber = (index) => {
        if (disabledPick) {
            return;
        }

        if (index === currentIndex) {
            onChange?.(numbers[index]);
            return;
        }
        updateIndex(index);
    }

    // Свайп
    const handleTouchStart = (e) => {
        if (disabledPick) {
            return;
        }
        startX.current = e.touches[0].clientX;
        isDragging.current = true;
    };

    const handleTouchEnd = (e) => {
        if (!isDragging.current) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX.current - endX;

        if (Math.abs(diff) > 40) {
            if (diff > 0) updateIndex(currentIndex + 1);
            else updateIndex(currentIndex - 1);
        }
        isDragging.current = false;
    };

    // Колёсико
    const handleWheel = (e) => {
        if (disabledPick) {
            return;
        }
        e.preventDefault();
        if (e.deltaY > 0) updateIndex(currentIndex + 1);
        else if (e.deltaY < 0) updateIndex(currentIndex - 1);
    };

    // Клавиатура
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') updateIndex(currentIndex - 1);
            if (e.key === 'ArrowRight') updateIndex(currentIndex + 1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);

    // Расчёт позиции на дуге
    const getItemStyle = (index) => {
        const offset = index - currentIndex; // -2 ... +2
        const angle = offset * ANGLE_STEP * (Math.PI / 180); // в радианы

        const x = Math.sin(angle) * RADIUS;
        const y = (1 - Math.cos(angle)) * RADIUS * 0.55; // дуга вниз

        const scale = 1 - Math.abs(offset) * 0.12;
        const opacity = 1 - Math.abs(offset) * 0.22;
        const rotate = offset * 8; // лёгкий поворот

        return {
            transform: `
        translateX(${x}px)
        translateY(${y - 10}px)
        scale(${Math.max(scale, 0.7)})
        rotate(${rotate}deg)
      `,
            opacity: Math.max(opacity, 0.4),
            zIndex: 10 - Math.abs(offset),
        };
    };

    return (
        <PickerContainer $ratio={ratio} $isBlured={isBlured} {...props}>
            <Blur />
            <BlurRight />
            <PickerTitle>
                На сколько шагов
                <br />
                вперед переместимся?
            </PickerTitle>

            <PickerWrapper
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <Indicator>
                    <svg width="100%" height="100%" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_i_1025_11143)">
                        <path d="M8.84378 17.1875C9.64566 18.5764 11.6503 18.5764 12.4522 17.1875L19.9698 4.16667C20.7717 2.77778 19.7693 1.04167 18.1656 1.04167H3.13043C1.52667 1.04167 0.524327 2.77778 1.3262 4.16667L8.84378 17.1875Z" fill="#004CDA"/>
                        </g>
                        <path d="M8.39258 17.4482C9.39495 19.1841 11.9009 19.1841 12.9033 17.4482L20.4209 4.42676C21.4229 2.69082 20.1704 0.520818 18.166 0.520508H3.13086C1.12629 0.520508 -0.12702 2.6907 0.875 4.42676L8.39258 17.4482Z" stroke="white" stroke-width="1.04167"/>
                        <defs>
                        <filter id="filter0_i_1025_11143" x="0" y="0" width="22.3385" height="19.9653" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dx="1.04167" dy="0.694444"/>
                        <feGaussianBlur stdDeviation="0.694444"/>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1025_11143"/>
                        </filter>
                        </defs>
                    </svg>
                </Indicator>
                <Stage>
                    {numbers.map((num, index) => (
                        <Item
                            key={num}
                            $ratio={ratio}
                            $active={index === currentIndex}
                            style={getItemStyle(index)}
                            onClick={() => pickNumber(index)}
                        >
                            {num}
                        </Item>
                    ))}
                </Stage>
            </PickerWrapper>
        </PickerContainer>
    );
};

export default NumberPicker;