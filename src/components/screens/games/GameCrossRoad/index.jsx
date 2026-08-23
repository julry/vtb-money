import styled from 'styled-components';
import {PERS_IMAGES, PERSON_HEIGHT, PERSON_WIDTH, TILE_SIZE, PERS_IMAGES_F, TRASH_IMAGES, TREE_IMAGES} from './constants';
import { useGame } from './useGame';
import { useLayoutEffect, memo, useRef, useState, useCallback, useMemo } from 'react';
import { BackHeaderGame } from '../../../shared/BackHeaderGame';
import { useProgress } from '../../../../hooks/useProgress';
import { StartCrossModal } from './parts/StartModal';
import { RulesModal } from './parts/RulesModal';
import { Lane } from './parts/Lane';
import { WEEK_TO_TIMER, MAX_INFINITE } from '../constants';
import { CURRENT_WEEK } from '../../../../contexts/ProgressProvider';
import { EndModal } from '../../../shared/modals/EndModal';
import { getPluralCoins } from '../../../../utils/getPluralCoins';
import { SCREENS } from '../../../../constants/screens';
import { useImagePreloader } from '../../../../hooks/useImagePreloader';

const GameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  overflow: hidden;
`;

const RotatedWorld = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform-origin: center center;
  transform: translate(-50%, -50%) rotate(10deg) scale(${props => props.$scale});
  will-change: transform;
`;

const PlayerDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${PERSON_WIDTH}px;
  height: ${PERSON_HEIGHT}px;
  border-radius: 8px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  will-change: transform;

  & img {
    position: absolute;
    top: calc(-1 * (125px - ${PERSON_HEIGHT}px));
    left: calc(-1.2 * ${PERSON_WIDTH / 2}px);
    transform: rotate(-10deg);
    width: 52px;
    height: 105px;
    object-fit: contain;
  }
`;


export default function GameCrossRoad() {
    const [isRules, setIsRules] = useState(false);
    const { handleOpenModal, gameState, user, next, updateUser, finishCell, isFemale } = useProgress();

    const finishGame = useCallback(({isFromGame, score, shouldShowModal = true}) => {
        let coins = 0;
        const hasPlayedBefore = user.crossyroad?.hasPlayed;
        const newInfiniteCoins = [...(user.infiniteCoins ?? [])];
        const newGameInfo = { ...(user.crossyroad ?? {}), hasPlayed: true };

        if (gameState?.incomes?.length > 0) {
            let coinsIndex = 0;

            if (score >= 31) {
                coinsIndex = 1;
            }

            if (score > 50) {
                coinsIndex = 2;
            }

            coins = gameState.incomes[coinsIndex];
            newGameInfo.coins = newGameInfo.coins + coins;
        } else {
            if (score >= 30 && user.infiniteCoins[CURRENT_WEEK - 1] < MAX_INFINITE) {
                coins = 10;
                newInfiniteCoins[CURRENT_WEEK - 1] += 10;
                newGameInfo.coinsInfinity = newGameInfo.coinsInfinity + coins;
            }
        }

        //TODO: нужно ?? sex message

        if (gameState?.id) {
            finishCell(gameState?.id, { coinsAdd: coins, score }, coins, {crossyroad: newGameInfo});
        } else if (!hasPlayedBefore || coins > 0) {
            updateUser({ totalCoins: coins + user.totalCoins, infiniteCoins: newInfiniteCoins, crossyroad: newGameInfo })
        }
        if (shouldShowModal) {
            const title = isFromGame ? 'Траты не обошли тебя стороной' : `Ты преодолел путь`;
            const subTitle = `${isFromGame ? 'Но это не страшно:\nты ' : 'и '}заработал ${getPluralCoins(coins)}`;

            const isGameMode = gameState?.isInfinite;
            handleOpenModal({
                Component: (
                    <EndModal 
                        onClose={isGameMode ? resetGame : next(SCREENS.LOBBY)} 
                        isGameMode={isGameMode} 
                        title={title} 
                        subTitle={subTitle} 
                    />
                )
            })
        }
    }, []);

    const {
        onTouchStart,
        onTouchEnd,
        resetGame,
        visibleLanes,
        coverScale,
        userImg,
        worldRef,
        playerRef,
        registerLane,
        registerEntity,
        die,
        score,
        gameStarted,
        startGame,
        pauseGame,
        playerYRef,
        heightRef
    } = useGame({onDie: finishGame});

    useLayoutEffect(() => {
        resetGame();
        handleOpenModal({
            Component: <StartCrossModal />,
            isBlurTransitionDisabled: true,
            closeCallback: () => setIsRules(true),
        })
    }, []);

    const handleCloseRules = useCallback(() => {
        setIsRules(false);
        startGame();
    }, []);

    const handleToggleRules = useCallback(() => {
        if (isRules) {
            setIsRules(false);
            startGame();
            return;
        }
        setIsRules(true);
        pauseGame();
    }, [isRules]);

    const images = useMemo(() => isFemale ? PERS_IMAGES_F : PERS_IMAGES, []);

    useImagePreloader([...Object.values(images), ...TREE_IMAGES, ...TRASH_IMAGES]);

    const currentLaneIndex = Math.floor(
        (heightRef.current - playerYRef.current) / TILE_SIZE
    ) - 1;

    return (
        <>
            <BackHeaderGame
                onRulesClick={handleToggleRules}
                isHidden={isRules}
                onExit={gameState?.isInfinite ? () => finishGame({score, shouldShowModal: false}) : undefined}
                timerData={{ isStart: gameStarted, initialTime: WEEK_TO_TIMER[gameState?.week ?? CURRENT_WEEK], onFinish: die }}
                currentPoints={score > 99 ? score : score > 9 ? `0${score}` : `00${score}`}
                shouldShowCoinIcon={false}
            />
            <GameContainer onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <RotatedWorld ref={worldRef} $scale={coverScale}>
                    {visibleLanes.map((lane, index) => (
                        <Lane
                            key={lane.index}
                            lane={lane}
                            registerLane={registerLane}
                            registerEntity={registerEntity}
                            isBlured={isRules &&
                                (
                                    index > currentLaneIndex + 2
                                    || index < currentLaneIndex
                                )}
                        />
                    ))}

                    <PlayerDiv ref={playerRef} style={{zIndex: 15 - (currentLaneIndex % 10 === 9 ? -1 : currentLaneIndex % 10)}}>
                        <img src={images[userImg]} alt="" />
                    </PlayerDiv>
                </RotatedWorld>
            </GameContainer>
            {isRules && (
                <RulesModal onClose={handleCloseRules} />
            )}
        </>
    );
}