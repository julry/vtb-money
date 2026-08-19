import React from "react";
import styled, { css, keyframes } from "styled-components";
import collectEffectImg from '../../../../assets/images/runner/collectEffect.webp';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
import { Character } from "./parts/Character";
import {CHARACTER_SCREEN_X, CHUNK_WIDTH, INITIAL_Y} from './constants';
import { Subject } from "./parts/Subject";
import { ItemsBoard } from "./parts/ItemsBoard";
import { Board } from "./parts/Board";
import { useGame } from "./useGame";
import { BackHeaderGame } from "../../../shared/BackHeaderGame";
import { AnimatePresence } from "framer-motion";
import { RulesModal } from "./parts/RulesModal";
import {useLayoutEffect, useEffect} from 'react';
import { StartRunnerModal } from "./parts/StartModal";
import { useProgress } from "../../../../hooks/useProgress";

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    touch-action: none;
    overflow: hidden;
`;

const collectFlash = keyframes`
    0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
    40%  { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
`;

const CharacterStyled = styled(Character)`
    position: absolute;
    bottom: ${({$ratio}) => INITIAL_Y * $ratio}px;
    left: ${({$ratio}) => CHARACTER_SCREEN_X * $ratio}px;
    z-index: 3;
    will-change: transform;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: ${({$ratio}) => 222 * $ratio}px;
        height: ${({$ratio}) => 174 * $ratio}px;
        border-radius: 50%;
        background: url(${collectEffectImg}) center/contain no-repeat;
        pointer-events: none;
        opacity: 0;
        ${({ $isCollecting }) => $isCollecting ? css`animation: ${collectFlash} 350ms ease-out forwards;` : ''}
    }
`;

function GameRunner({ className }) {
    const sizeRatio = useSizeRatio();
    const { handleOpenModal, openedModal } = useProgress();
    
    const {
        wrapperRef,
        handleTapStart,
        bgRef,
        roadRef,
        itemsBoardRef,
        chunks,
        collectedIds,
        characterRef,
        isUp,
        isPaused,
        gamePoint,
        isCollected,
        isGameStartedRef,
        isRules,
        handleOpenRules
    } = useGame(true);

    useLayoutEffect(() => {
        handleOpenModal(
            {
                Component: <StartRunnerModal />,
                isBlurTransitionDisabled: true,
            });
    }, []);

    useEffect(() => {
        const preventDefault = (e) => e.preventDefault();
        
        document.body.addEventListener('touchmove', preventDefault, { passive: false });
        
        return () => document.body.removeEventListener('touchmove', preventDefault);
    }, [])

    return (
        <Wrapper
            ref={wrapperRef}
            className={className}
            onClick={handleTapStart}
        >
            <BackHeaderGame 
                onRulesClick={handleOpenRules}
                currentPoints={gamePoint}
                isHidden={isRules}
                isLarge
                timerData={{
                    initialTime: 50,
                    isStart: isGameStartedRef.current
                }}
            />
            <AnimatePresence>
                {isRules && !openedModal?.isOpen && (
                    <RulesModal />
                )}

            </AnimatePresence>
            <Board ref={bgRef} roadRef={roadRef} />

            <ItemsBoard ref={itemsBoardRef}>
                {chunks.map(chunk => (
                    <React.Fragment key={chunk.index}>
                        {chunk.figures.map(fig => (
                            <Subject
                                key={fig.id}
                                subject={{
                                    id: fig.id,
                                    width: fig.width,
                                    isTrashLike: fig.isTrashLike,
                                    height: fig.height,
                                    position: [chunk.index * CHUNK_WIDTH + fig.x, fig.y]
                                }}
                                isCollected={collectedIds.has(fig.id)}
                            />
                        ))}
                        {chunk.trashes.map(trash => (
                            <Subject
                                key={trash.id}
                                subject={{
                                    id: trash.id,
                                    width: trash.width,
                                    height: trash.height,
                                    isTrash: true,
                                    imageId: trash.imageId,
                                    position: [chunk.index * CHUNK_WIDTH + trash.x, trash.y]
                                }}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </ItemsBoard>

            <CharacterStyled
                ref={characterRef}
                isPause={!isGameStartedRef.current || isPaused}
                ratio={sizeRatio}
                $ratio={sizeRatio}
                isJump={isUp}
                $isCollecting={isCollected}
            />
        </Wrapper>
    );
}

export default GameRunner;
