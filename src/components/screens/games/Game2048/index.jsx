import { useEffect, useLayoutEffect, useMemo } from "react";
import styled from "styled-components";
import { useProgress } from "../../../../hooks/useProgress";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { useCallbackRef } from "../../../../hooks/useCallbackRef";
import { BackHeaderGame } from '../../../shared/BackHeaderGame';
import { CommonModal } from "../../../shared/modals/CommonModal";
import { GameController } from './parts/GameController';
import { useGame } from "./useGame";
import { GameBoard, RulesModal, Start2048Modal } from "./parts";
import { ACTIONS, CONTAINER_SIZE } from './constants';
import { EndModal } from "../../../shared/modals/EndModal";
import { MAX_INFINITE, WEEK_TO_TIMER } from "../constants";
import { CURRENT_WEEK } from "../../../../contexts/ProgressProvider";
import { SCREENS } from "../../../../constants/screens";

const Wrapper = styled.div`
    height: 100%;
`;

const WrapperInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    height: 100%;
    padding-top: ${({$ratio}) => $ratio * 155}px;
`;

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

function Game2048() {
    const { finishCell, gameState, user, next, updateUser, openedModal, handleOpenModal } = useProgress();
    const ratio = useSizeRatio();
    const isFirstTime = !user['2048'].hasPlayed;

    const isGameActive = useMemo(
        () => !openedModal?.isOpen,
        [openedModal],
    );

    const handleResultRef = useCallbackRef(handleResult);

    const {startGame, restartGame, getTiles, moveTiles, score} = useGame(handleResultRef, handleResultRef, false);

    function handleResult() {
        let coins = 0;
        const newInfiniteCoins = [...(user.infiniteCoins ?? [])];
        const newGameInfo = {...(user['2048'] ?? {}), hasPlayed: true};

        if (gameState?.incomes?.length > 0) {
            let coinsIndex = 0;

            if (score >= 512) {
                coinsIndex = 2;
            }

            if (score === 256) {
                coinsIndex = 1;
            }

            coins = gameState.incomes[coinsIndex];
            newGameInfo.coins = newGameInfo.coins + coins;
        } else {
            if (score >= 256 && user.infiniteCoins[CURRENT_WEEK - 1] < MAX_INFINITE) {
                coins = 10;
                newInfiniteCoins[CURRENT_WEEK - 1] += 10;
                newGameInfo.coinsInfinity = newGameInfo.coinsInfinity + coins;
            }
        }

        if (gameState?.id) {
            finishCell(gameState?.id, {coinsAdd: coins, score}, coins, {2048: newGameInfo});
        } else {
            updateUser({totalCoins: coins + user.totalCoins, infiniteCoins: newInfiniteCoins, 2048: newGameInfo})
        }

        const isGameMode = gameState?.isInfinite;
        handleOpenModal({Component: <EndModal onClose={isGameMode ? restartGame : next(SCREENS.LOBBY)} title={"Ура, капитал собран!"} isGameMode={isGameMode} coins={coins}/>});
    }

    useLayoutEffect(() => {
        handleOpenModal(
            { 
                Component: <Start2048Modal />, 
               ...(isFirstTime ? (
                {
                    nextOpenedModalProps: {
                        component: <RulesModal />, 
                        isBlurTransitionDisabled: true,
                    }
                }) : {}
               )
            }
        );
    }, []);

    useEffect(() => {
        startGame(isFirstTime);
    }, []);

    return (
        <Wrapper $ratio={ratio}>
            <BackHeaderGame 
                onRulesClick={() => handleOpenModal({Component: <RulesModal />, isBlurTransitionDisabled: true})}
                onBack={() => handleOpenModal({Component: <CommonModal />})}
                isCenteredTimer
                isLarge
                timerData={{
                    initialTime: WEEK_TO_TIMER[gameState?.week ?? CURRENT_WEEK],
                    isStart: isGameActive,
                    onFinish: handleResult,
                }}
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