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

const Description = styled(motion.div)`
    position: absolute;
    top: ${({$ratio}) => $ratio * 356}px;
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
    top: ${({$ratio}) => $ratio * 196}px;
    left: calc(50% - ${({$ratio}) => $ratio * 94}px);
    width: ${({$ratio}) => $ratio * 68}px;
    height: ${({$ratio}) => $ratio * 68}px;
    z-index: 2;
`;

export const RulesModal = ({isV2}) => {
    const ratio = useSizeRatio();
    const [isClosing, setIsClosing] = useState(false);
    const { handleCloseModal } = useProgress();
    const { startGame, getTiles, moveTiles } = useGame(noop, noop, true);

    useEffect(() => {
        startGame();
    }, []);

    const handleMoveRight = () => {
        moveTiles(ACTIONS.MOVE_RIGHT);
        setIsClosing(true);
        setTimeout(() => handleCloseModal?.(), CLOSE_ANIMATION_DURATION);
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
                            <GameBoard tiles={getTiles()} isRules isV2={isV2}/>
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
                            <Description $ratio={ratio} animate={isClosing ? {x: 330} : {}} transition={{duration: DESCRIPTION_EXIT_DURATION / 1000}}>
                                <p>
                                    Свайпай в любую сторону, чтобы объединить блоки с одинаковыми цифрами — тогда их значения удвоятся
                                </p>
                                <br />
                                <p>
                                    Набери как можно больше очковна поле, чтобы заработать больше коинов!
                                </p>
                            </Description>
                        </WrapperInner>
                    )}
                </GameController>
        </ModalStyled>
    )
}

