import { useCallback, useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useGame } from './useGame';
import bg from '../../../../assets/images/doodle/bg.webp';
import { useProgress } from '../../../../hooks/useProgress';
import { StartDoodleModal } from './parts/StartModal';
import { RulesModal } from './parts/RulesModal';
import { BackHeaderGame } from '../../../shared/BackHeaderGame';
import { EndModal } from '../../../shared/modals/EndModal';
import {getPluralCoins} from '../../../../utils/getPluralCoins';

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

export default function GameDoodle() {
  const { handleOpenModal, gameState, finishCell} = useProgress();
  const {
    containerRef, handlePointerDown, handlePointerMove, handlePointerUp,
    worldRef, characterRef, togglePause, scoreElementRef,
    started, initGame, gameOver, score, paused, stateRef, forceGameOver
  } = useGame();

  useLayoutEffect(() => {
    // TODO: раскомментировать для модалок
    handleOpenModal({
      Component: <StartDoodleModal />,
      closeCallback: initGame,
      nextOpenedModalProps: {
        component: <RulesModal />,
      }
    });
  }, []);

  const handleClickRules = useCallback(() => {
    togglePause();
    handleOpenModal({
        Component: <RulesModal />,
        closeCallback: togglePause
    })
  }, [])

  const handleFinish = useCallback(() => {
    forceGameOver();
    if (gameState?.id) {
        finishCell(gameState?.id);
    } 
    handleOpenModal({
        Component: <EndModal title={"Ура! Ты достиг\nвершины"} subTitle={`и заработал ${getPluralCoins(stateRef?.current?.coinsCollected ?? 0)}`} />,
    })
  }, []);

  useEffect(() => {
    if (!gameOver) {
        return;
    }

    if (gameState?.id) {
        finishCell(gameState?.id);
    } 

     handleOpenModal({
        Component: <EndModal title={"О нет, ты улетел!"} subTitle={`Но ничего страшного, ты успел заработать ${getPluralCoins(stateRef?.current?.coinsCollected ?? 0)}`} />,
    })
  }, [gameOver]);

  useEffect(() => {
        const preventDefault = (e) => e.preventDefault();
        
        document.body.addEventListener('touchmove', preventDefault, { passive: false });
        
        return () => document.body.removeEventListener('touchmove', preventDefault);
    }, [])

  return (
    <GameWrapper>
        <BackHeaderGame timerData={{initialTime: 50, isStart: started && !paused && !gameOver, onFinish: handleFinish}} currentPoints={score} $scoreElementRef={scoreElementRef} onRulesClick={handleClickRules}/>
      <GameContainer
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <World ref={worldRef}>
          {/* Платформы и монетки управляются императивно внутри useGame */}
          <img
            ref={characterRef}
            src=""
            alt=""
            style={{
              position: 'absolute',
              width: '124px',
              height: '191px',
              willChange: 'transform',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        </World>
      </GameContainer>
    </GameWrapper>
  );
}