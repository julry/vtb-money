import { useCallback, useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useGame } from './useGame';
import bg from '../../../../assets/images/doodle/bg.webp';
import floor from '../../../../assets/images/runner/road.webp';
import { useProgress } from '../../../../hooks/useProgress';
import { StartCatchModal } from './parts/StartModal';
import { RulesModal } from './parts/RulesModal';
import { BackHeaderGame } from '../../../shared/BackHeaderGame';
import { EndModal } from '../../../shared/modals/EndModal';
import { getPluralCoins } from '../../../../utils/getPluralCoins';
import { BAD_ITEMS, FLOOR_HEIGHT, GOOD_ITEMS, PLAYER_HEIGHT, PLAYER_SIZE } from './constants';
import picStart from '../../../../assets/images/doodle/cart.webp';
import { FlexRowWrapper } from '../../../shared/ContentWrapper';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
import { WEEK_TO_TIMER, MAX_INFINITE } from '../constants';
import { CURRENT_WEEK } from '../../../../contexts/ProgressProvider';
import { SCREENS } from '../../../../constants/screens';
import { useImagePreloader } from '../../../../hooks/useImagePreloader';
import { CommonEndModal } from '../../../shared/modals/CommonEndModal';

const GameWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const GameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  background: url(${bg}) no-repeat;
  background-position: center;
  background-size: cover;
  contain: strict;
`;

const World = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
`;

const LivesWrapper = styled(FlexRowWrapper)`
    position: absolute;
    top: ${({ $ratio }) => $ratio * 23}px;
    left: 50%;
    gap: ${({ $ratio }) => $ratio * 5}px;
    transform: translateX(-50%);

    & svg {
      width: ${({ $ratio }) => $ratio * 30}px;
      height: ${({ $ratio }) => $ratio * 28}px;
      transition: fill 0.25s;
    }

    & img {
      object-fit: contain;
    }
`;

const Floor = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${FLOOR_HEIGHT}px;
    width: 100%;
    background-image: url(${floor});
`;
export default function GameCatch() {
    const { handleOpenModal, gameState, finishCell, updateUser, user, next } = useProgress();
    const ratio = useSizeRatio();
    const isFirstTime = !user.catchitems?.hasPlayed;

    const {
        containerRef, handlePointerDown, handlePointerMove, handlePointerUp,
        worldRef, characterRef, togglePause, lives, gameId,
        started, initGame, gameOver, score, paused, forceGameOver
    } = useGame();

    useLayoutEffect(() => {
        handleOpenModal({
            Component: <StartCatchModal />,
            closeCallback: !isFirstTime ? initGame : undefined,
            ...(isFirstTime ? (
                {
                    nextOpenedModalProps: {
                        component: <RulesModal />,
                        closeCallback: initGame,
                    }
                })
                : {}
            )

        });
    }, []);

    useImagePreloader([picStart, ...GOOD_ITEMS.map(({img}) => img), ...BAD_ITEMS.map(({img}) => img)]);

    const handleClickRules = useCallback(() => {
        togglePause();
        handleOpenModal({
            Component: <RulesModal />,
            closeCallback: togglePause
        })
    }, [])

    const finishGame = (shouldShowModal = true) => {
        let coins = 0;
        const hasPlayedBefore = user.catchitems?.hasPlayed;
        const newInfiniteCoins = [...(user.infiniteCoins ?? [])];
        const newGameInfo = { ...(user.catchitems ?? {}), hasPlayed: true };

        if (gameState?.incomes?.length > 0) {
            let coinsIndex = 0;

            if (score >= 300) {
                coinsIndex = 1;
            }

            if (score >= 600) {
                coinsIndex = 2;
            }

            coins = gameState.incomes[coinsIndex];
            newGameInfo.coins = newGameInfo.coins + coins;
        } else {
            if (score >= 300 && user.infiniteCoins[CURRENT_WEEK - 1] < MAX_INFINITE) {
                coins = 10;
                newInfiniteCoins[CURRENT_WEEK - 1] += 10;
                newGameInfo.coinsInfinity = newGameInfo.coinsInfinity + coins;
            }
        }

        if (gameState?.id) {
            finishCell(gameState?.id, { coinsAdd: coins, score }, coins, {catchitems: newGameInfo});
        } else if (!hasPlayedBefore || coins > 0){
            const gameMetriks = {...(user.metrikaInfinity?.catchitems ?? {})};
            const finalsScores = (gameMetriks.finalsScores ?? 0) + 1; 
            const maxScore = Math.max(gameMetriks.maxScore ?? 0, score);
            const weekScore = (gameMetriks[`week${CURRENT_WEEK}Score`] ?? 0) + coins;

            const metrikaInfinity = {...gameMetriks, finalsScores, maxScore, [`week${CURRENT_WEEK}Score`]: weekScore };

            updateUser({ 
                totalCoins: coins + user.totalCoins,
                infiniteCoins: newInfiniteCoins, 
                catchitems: newGameInfo,
                metrikaInfinity: {...user.metrikaInfinity, catchitems: {...metrikaInfinity}}
             })
        } else {
            const gameMetriks = {...(user.metrikaInfinity?.catchitems ?? {})};
            const finalsEmptyPoints = (gameMetriks.finalsEmptyPoints ?? 0) + 1; 
            const maxScore = Math.max(gameMetriks.maxScore ?? 0, score);
            const metrikaInfinity = {...gameMetriks, finalsEmptyPoints, maxScore };

            updateUser({metrikaInfinity: {...user.metrikaInfinity, catchitems: {...metrikaInfinity}}});
        }

        const isGameMode = gameState?.isInfinite;

        if (shouldShowModal) {
            if (lives > 0) {
                handleOpenModal({
                    Component: <EndModal isGameMode={isGameMode} onClose={isGameMode ? initGame : () => next(SCREENS.LOBBY)} title={"Ура! Ты собрал\nвсе предметы"} subTitle={`и заработал ${getPluralCoins(coins)}`} />,
                })
            } else {
                handleOpenModal({
                    Component: <EndModal isGameMode={isGameMode} title={"О нет, жизни закончились!"} onClose={isGameMode ? initGame : () => next(SCREENS.LOBBY)} subTitle={`Ты успел заработать ${getPluralCoins(coins)}`} />,
                })
            }
        } else {
            handleOpenModal({
                Component: <CommonEndModal coins={coins} />
            })
        }
        
    }

    useEffect(() => {
        if (!gameOver) {
            return;
        }

        finishGame();
    }, [gameOver]);

    useEffect(() => {
        const preventDefault = (e) => e.preventDefault();

        document.body.addEventListener('touchmove', preventDefault, { passive: false });

        return () => document.body.removeEventListener('touchmove', preventDefault);
    }, [])

    return (
        <GameWrapper>
            <BackHeaderGame
                onExit={() => finishGame(false)}
                shouldShowCoinIcon={false}
                timerData={{
                    timerId: gameId,
                    initialTime: WEEK_TO_TIMER[gameState?.week ?? CURRENT_WEEK],
                    isStart: started && !paused && !gameOver, onFinish: forceGameOver
                }}
                currentPoints={score > 99 ? score : score > 9 ? `0${score}` : `00${score}`}
                onRulesClick={handleClickRules}
            />
            <GameContainer
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <LivesWrapper $ratio={ratio}>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <svg viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="path-1-inside-1_1284_15555" fill="white">
                                <path d="M16.8816 2.51172C20.1873 -0.837214 25.5467 -0.837262 28.8523 2.51172C32.158 5.86074 32.158 11.2906 28.8523 14.6397L27.6365 15.8701L27.6384 15.8721L15.6677 28L8.46461 20.7022V20.7031L2.47926 14.6397C-0.826419 11.2906 -0.826419 5.86074 2.47926 2.51172C5.78493 -0.837217 11.1443 -0.837265 14.45 2.51172L15.6658 3.74317L16.8816 2.51172Z" />
                            </mask>
                            <path d="M16.8816 2.51172C20.1873 -0.837214 25.5467 -0.837262 28.8523 2.51172C32.158 5.86074 32.158 11.2906 28.8523 14.6397L27.6365 15.8701L27.6384 15.8721L15.6677 28L8.46461 20.7022V20.7031L2.47926 14.6397C-0.826419 11.2906 -0.826419 5.86074 2.47926 2.51172C5.78493 -0.837217 11.1443 -0.837265 14.45 2.51172L15.6658 3.74317L16.8816 2.51172Z" fill={lives > index ? "#004CDA" : 'none'} />
                            <path d="M16.8816 2.51172L18.3048 3.91688L18.305 3.91671L16.8816 2.51172ZM28.8523 2.51172L30.2757 1.10675L30.2757 1.10675L28.8523 2.51172ZM28.8523 14.6397L30.275 16.0454L30.2757 16.0446L28.8523 14.6397ZM27.6365 15.8701L26.2138 14.4644L24.8165 15.8786L26.2223 17.2843L27.6365 15.8701ZM27.6384 15.8721L29.0618 17.277L30.4577 15.8629L29.0526 14.4579L27.6384 15.8721ZM15.6677 28L14.2443 29.4049L15.6677 30.8471L17.0911 29.405L15.6677 28ZM8.46461 20.7022L9.88803 19.2972L6.46461 15.8288V20.7022H8.46461ZM8.46461 20.7031L7.04125 22.1081L10.4646 25.5762V20.7031H8.46461ZM2.47926 14.6397L1.05586 16.0446L1.0559 16.0447L2.47926 14.6397ZM2.47926 2.51172L1.05588 1.10673L1.05586 1.10675L2.47926 2.51172ZM14.45 2.51172L13.0266 3.9167L13.0267 3.91688L14.45 2.51172ZM15.6658 3.74317L14.2426 5.14832L15.6658 6.58983L17.089 5.14832L15.6658 3.74317ZM16.8816 2.51172L18.305 3.91671C20.8276 1.36111 24.9064 1.3611 27.4289 3.9167L28.8523 2.51172L30.2757 1.10675C26.1869 -3.03562 19.547 -3.03553 15.4582 1.10673L16.8816 2.51172ZM28.8523 2.51172L27.4289 3.91669C29.9658 6.48683 29.9658 10.6645 27.4289 13.2347L28.8523 14.6397L30.2757 16.0446C34.3502 11.9167 34.3502 5.23466 30.2757 1.10675L28.8523 2.51172ZM28.8523 14.6397L27.4296 13.2339L26.2138 14.4644L27.6365 15.8701L29.0591 17.2758L30.275 16.0454L28.8523 14.6397ZM27.6365 15.8701L26.2223 17.2843L26.2242 17.2863L27.6384 15.8721L29.0526 14.4579L29.0507 14.4559L27.6365 15.8701ZM27.6384 15.8721L26.215 14.4671L14.2443 26.595L15.6677 28L17.0911 29.405L29.0618 17.277L27.6384 15.8721ZM15.6677 28L17.0912 26.5951L9.88803 19.2972L8.46461 20.7022L7.04119 22.1071L14.2443 29.4049L15.6677 28ZM8.46461 20.7022H6.46461V20.7031H8.46461H10.4646V20.7022H8.46461ZM8.46461 20.7031L9.88796 19.2981L3.90261 13.2346L2.47926 14.6397L1.0559 16.0447L7.04125 22.1081L8.46461 20.7031ZM2.47926 14.6397L3.90265 13.2347C1.36578 10.6645 1.36578 6.48683 3.90265 3.91669L2.47926 2.51172L1.05586 1.10675C-3.01862 5.23466 -3.01862 11.9167 1.05586 16.0446L2.47926 14.6397ZM2.47926 2.51172L3.90263 3.91671C6.42523 1.3611 10.504 1.36109 13.0266 3.9167L14.45 2.51172L15.8734 1.10675C11.7846 -3.03562 5.14464 -3.03554 1.05588 1.10673L2.47926 2.51172ZM14.45 2.51172L13.0267 3.91688L14.2426 5.14832L15.6658 3.74317L17.089 2.33801L15.8732 1.10657L14.45 2.51172ZM15.6658 3.74317L17.089 5.14832L18.3048 3.91688L16.8816 2.51172L15.4584 1.10657L14.2426 2.33801L15.6658 3.74317Z" fill="#004CDA" mask="url(#path-1-inside-1_1284_15555)" />
                        </svg>
                    ))}
                </LivesWrapper>
                <World ref={worldRef}>
                    <img
                        ref={characterRef}
                        src={picStart}
                        alt=""
                        style={{
                            position: 'absolute',
                            bottom: '42px',
                            left: 0,
                            width: `${PLAYER_SIZE}px`,
                            height: `${PLAYER_HEIGHT}px`,
                            willChange: 'transform',
                            pointerEvents: 'none',
                            zIndex: 10,
                        }}
                    />
                    <Floor />
                </World>
            </GameContainer>
        </GameWrapper>
    );
}