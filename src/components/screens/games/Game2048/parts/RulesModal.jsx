import styled from "styled-components";
import { CommonModal, Modal } from "../../../../shared/modals";
import { useGame } from "../useGame";
import { noop } from "lodash";
import finger from '../../../../../assets/images/2048/finger.webp';
import { GameController } from "./GameController";
import { GameBoard } from "./GameBoard";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { useEffect, useState } from "react";
import {ACTIONS, CLOSE_ANIMATION_DURATION, DESCRIPTION_EXIT_DURATION} from '../constants';
import { useProgress } from "../../../../../hooks/useProgress";
import { motion } from "framer-motion";
import { MovingBlock } from "../../../../shared/MovingBlock";

const WrapperInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    height: 100%;
`

const ModalStyled = styled(Modal)`
    padding-top: ${({$ratio}) => $ratio * 155}px;
`

const FingerMoving = styled(motion.img)`
    position: absolute;
    top: ${({$ratio}) => $ratio * 196}px;
    left: calc(50% - ${({$ratio}) => $ratio * 94}px);
    width: ${({$ratio}) => $ratio * 68}px;
    height: ${({$ratio}) => $ratio * 68}px;
    z-index: 2;
`;

export const RulesModal = () => {
    const ratio = useSizeRatio();
    const [isClosing, setIsClosing] = useState(false);
    const { handleCloseModal } = useProgress();
    const { startGame, getTiles, moveTiles } = useGame(noop, noop, true);

    useEffect(() => {
        startGame();
    }, []);

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => handleCloseModal?.(), CLOSE_ANIMATION_DURATION);
    }

    const handleMoveRight = () => {
        moveTiles(ACTIONS.MOVE_RIGHT);
        closeModal();
    }

    return (
        <ModalStyled $ratio={ratio} isDisabledAnimation>
            <GameController
                    active
                    onMoveUp={noop}
                    onMoveDown={noop}
                    onMoveLeft={noop}
                    onMoveRight={handleMoveRight}
                >
                    {(ref) => (
                        <WrapperInner ref={ref}>
                            <GameBoard tiles={getTiles()} isRules />
                            {!isClosing && (
                                <FingerMoving 
                                    $ratio={ratio} 
                                    src={finger} 
                                    alt='' 
                                    initial={{x: '-50%'}} 
                                    animate={{x: 10}} 
                                    transition={{repeatType: 'reverse', repeat: Infinity, duration: 0.7}}
                                />
                            )}
                        </WrapperInner>
                    )}
                </GameController>
                <MovingBlock top={356} onClose={handleMoveRight}>
                    <p>
                        Свайпай в любую сторону, чтобы объединить блоки с одинаковыми цифрами — тогда их значения удвоятся
                    </p>
                    <br />
                    <p>
                        Набери как можно больше очков на поле, чтобы заработать больше коинов!
                    </p>
                </MovingBlock>
        </ModalStyled>
    )
}

