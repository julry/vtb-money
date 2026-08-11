import { useEffect, useLayoutEffect, useMemo } from "react";
import styled from "styled-components";
import { useProgress } from "../../../../contexts/ProgressContext";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { useCallbackRef } from "../../../../hooks/useCallbackRef";
import { BackHeaderGame } from '../../BackHeaderGame';
import { CommonModal } from "../../modals/CommonModal";
import { GameController } from './parts/GameController';
import { useGame } from "./useGame";
import { GameBoard, RulesModal, Start2048Modal } from "./parts";
import { ACTIONS, CONTAINER_SIZE } from './constants';
import { EndModal } from "../../modals/EndModal";

const Wrapper = styled.div`
    height: 100%;
    padding-top: ${({$ratio}) => $ratio * 155}px;
`;

const WrapperInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    height: 100%;
`

const PointsWrapper = styled.div`
    display: flex;
    gap: var(--spacing_x3);
    margin-top: ${({ $ratio }) => $ratio * 40}px;
    width: 100%;
    max-width: ${({ $ratio }) => $ratio * CONTAINER_SIZE}px;
`;

const Aim = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(50% - var(--spacing_x3) / 2);
    flex-shrink: 0;
    color: var(--btn-color-main);
    font-size: ${({$ratio}) => $ratio * 30}px;
    background-color: ${({$isSecondary}) => $isSecondary ? 'rgba(255, 255, 255, 0.2)' : 'var(--color-accent)'};

    padding: ${({$ratio}) => $ratio * 16}px 0 ${({$ratio}) => $ratio * 20}px;
    height: ${({$ratio}) => $ratio * 88}px;
    gap: ${({$ratio}) => $ratio * 6}px;
    border-radius: var(--border-radius-md);
    box-shadow: inset 2px 2px 2px rgba(255, 255, 255, 0.4);

    text-align: center;
`;

const Subtitle = styled.p`
    font-size: var(--font_md);
`;

const TRIES_AMOUNT = 3;

function Game2048({isFirst, isGameMode, lobbyScreen, day}) {
    const { endGame, user, updateUser, openedModal, handleOpenModal } = useProgress();
    const ratio = useSizeRatio();
    const isFirstTime = !user?.hasSeen2048Rules;

    const isGameActive = useMemo(
        () => !openedModal?.isOpen,
        [openedModal],
    );

    const handleResultRef = useCallbackRef(handleResult);

    const {startGame, getTiles, moveTiles, score} = useGame(handleResultRef, handleResultRef, false);

    function handleResult() {
        handleOpenModal({Component: <EndModal title={"Ура, капитал собран!"} isGameMode={isGameMode} coins={"[уточняется]"}/>});
    }

    useLayoutEffect(() => {
        handleOpenModal(
            { 
                Component: <Start2048Modal />, 
                nextOpenedModalProps: {
                    component: <RulesModal />, 
                    isBlurTransitionDisabled: true,
                }
            });
    }, []);

    useEffect(() => {
        // TODO заменить тру на первый трай 
        startGame(true);
    }, []);

    return (
        <Wrapper $ratio={ratio}>
            <BackHeaderGame 
                onRulesClick={() => handleOpenModal({Component: <RulesModal />, isBlurTransitionDisabled: true})}
                onBack={() => handleOpenModal({Component: <CommonModal />})}
            />
                <GameController
                    active={isGameActive}
                    onMoveUp={() => moveTiles(ACTIONS.MOVE_UP)}
                    onMoveDown={() => moveTiles(ACTIONS.MOVE_DOWN)}
                    onMoveLeft={() => moveTiles(ACTIONS.MOVE_LEFT)}
                    onMoveRight={() => moveTiles(ACTIONS.MOVE_RIGHT)}
                >
                    {(ref) => (
                        <WrapperInner ref={ref} $ratio={ratio}>
                            <GameBoard tiles={getTiles()}/>
                            <PointsWrapper  $ratio={ratio}>
                                <Aim $ratio={ratio}>
                                    <Subtitle>
                                        Цель
                                    </Subtitle>
                                    <p>
                                        2048
                                    </p>
                                </Aim>

                                <Aim $ratio={ratio} $isSecondary>
                                    <Subtitle>
                                        Счётчик
                                    </Subtitle>
                                    <p>
                                        {score}
                                    </p>
                                </Aim>
                            </PointsWrapper>
                        </WrapperInner>
                    )}
                </GameController>
        </Wrapper>
    )
}

export default Game2048;