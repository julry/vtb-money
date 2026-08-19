import styled from 'styled-components';
import {LANE_HEIGHT, START_LANE, COLORS, PERS_IMAGES, TRASH_IMAGES, PERSON_HEIGHT, PERSON_WIDTH, TILE_SIZE} from './constants';
import { useGame } from './useGame';
import { useLayoutEffect, memo, useRef, useState, useCallback, useMemo } from 'react';
import { BackHeaderGame } from '../../../shared/BackHeaderGame';
import { useProgress } from '../../../../hooks/useProgress';
import { StartCrossModal } from './parts/StartModal';
import { RulesModal } from './parts/RulesModal';
import { Lane } from './parts/Lane';

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
  /* box-shadow: inset 0 0 3px 1px red; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  will-change: transform;

  & img {
    position: absolute;
    top: calc(-1 * (105px - ${PERSON_HEIGHT}px));
    left: calc(-1.2 * ${PERSON_WIDTH / 2}px);
    transform: rotate(-10deg);
    width: 52px;
    height: 105px;
    object-fit: contain;
  }
`;


export default function GameCrossRoad() {
    const [isRules, setIsRules] = useState(false);
    const { handleOpenModal } = useProgress();
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
    } = useGame();

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

  return (
    <>
      <BackHeaderGame onRulesClick={handleToggleRules} isHidden={isRules} timerData={{isStart: gameStarted, initialTime: 50, onFinish: die}} currentPoints={score}/>
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
                    index > Math.floor((heightRef.current - playerYRef.current) / TILE_SIZE) + 1
                    || index < Math.floor((heightRef.current - playerYRef.current) / TILE_SIZE) - 1
                )}
            />
          ))}

          <PlayerDiv ref={playerRef}>
              <img src={PERS_IMAGES[userImg]} alt="" />
          </PlayerDiv>
        </RotatedWorld>
      </GameContainer>
      {isRules && (
        <RulesModal onClose={handleCloseRules} />
      )}
    </>
  );
}