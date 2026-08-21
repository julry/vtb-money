import styled from "styled-components";
import { Modal } from "../../../../shared/modals";
import { useGame } from "../useGame";
import finger from '../../../../../assets/images/2048/finger.webp';
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { useState } from "react";
import { DESCRIPTION_EXIT_DURATION } from '../constants';
import { useProgress } from "../../../../../hooks/useProgress";
import { motion } from "framer-motion";
import {Board} from './Board';
import { MovingBlock } from "../../../../shared/MovingBlock";

const ModalStyled = styled(Modal)`
    padding: ${({$ratio}) => $ratio * 155}px ${({ $ratio }) => $ratio * 25}px 0;
    justify-content: flex-start;
`

const Description = styled(motion.div)`
    position: absolute;
    top: ${({$ratio}) => $ratio * 390}px;
    right: ${({$ratio}) => $ratio * -89}px;
    width: ${({$ratio}) => $ratio * 394}px;
    color: var(--btn-color-main);
    font-size: ${({$ratio}) => $ratio * 16}px;
    background-color: var(--color-accent);
    z-index: 3;

    padding: ${({$ratio}) => $ratio * 20}px;
    padding-right: ${({$ratio}) => $ratio * 99}px;
    border-radius: var(--border-radius-md);
    box-shadow: inset 2px 2px 2px rgba(255, 255, 255, 0.4);

    text-align: left;
`;

const FingerMoving = styled(motion.img)`
    position: absolute;
    top: ${({$ratio}) => $ratio * 236}px;
    left: calc(50% - ${({$ratio}) => $ratio * 68}px);
    width: ${({$ratio}) => $ratio * 68}px;
    height: ${({$ratio}) => $ratio * 68}px;
    z-index: 2;
`;

export const RulesMatch3Modal = ({onFinish}) => {
    const ratio = useSizeRatio();
    const [isClosing, setIsClosing] = useState(false);
    const { handleCloseModal } = useProgress();
    const { selected, board, handleCellClick, handleTouchStart, handleTouchEnd, touchStartRef } = useGame({isRules: true});

    const handleClick = (r, c) => {
        handleCellClick(r, c);

        if (selected) {
            setTimeout(() => handleCloseModal?.(), 500);
        }
    };

    const handleFingerClick = () => {
        if (!selected) {
            handleCellClick(1, 1);
        } else {
            handleCellClick(1, 2);
            setTimeout(() => handleCloseModal?.(), 500);
        }
    }

    const handleFinish = (e) => {
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartRef.current.x;
        const dy = touch.clientY - touchStartRef.current.y;

        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;

        if (!(Math.abs(dx) > Math.abs(dy) && dx > 0)) {
            return;
        } 

        handleTouchEnd(e);
        console.log(onFinish);
        onFinish?.();
        closeModal();
    };

    const closeModal = () => {
        setIsClosing(true);

        setTimeout(() => handleCloseModal?.(), 500);
    }

    return (
        <ModalStyled $ratio={ratio} isDisabledAnimation>
            <Board 
                isRules 
                board={board} 
                selected={selected} 
                handleCellClick={handleClick} 
                handleTouchStart={handleTouchStart} 
                handleTouchEnd={handleFinish} 
            />
            {!isClosing && (
                <FingerMoving 
                    $ratio={ratio} 
                    src={finger} 
                    onMouseDown={handleFingerClick}
                    onTouchStart={(e) => handleTouchStart(e, 1, 1)}
                    onTouchEnd={handleFinish}
                    alt='' 
                    initial={{x: '-50%'}} 
                    animate={selected ? {x: 10} : {scale: 0.8}} 
                    transition={{repeatType: 'reverse', repeat: Infinity, duration: 0.7}}
                />
            )}
            <MovingBlock top={390} $ratio={ratio} onClose={closeModal}>
                <p>
                    Тапни по активу и свайпни его на соседнюю клетку, чтобы поменять их местами
                </p>
                <br />
                <p>
                    Собери 3 и больше одинаковых элементов в ряд!
                </p>
            </MovingBlock>
        </ModalStyled>
    )
}

