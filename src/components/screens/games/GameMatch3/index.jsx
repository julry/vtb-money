import styled from 'styled-components';
import { useGame } from './useGame';
import { BackHeaderGame } from '../../../shared/BackHeaderGame';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
import { Board } from './parts/Board';
import { AnimatePresence, motion} from 'framer-motion';
import { useEffect, useLayoutEffect } from 'react';
import { StartMatch3Modal } from './parts/StartModal';
import { RulesMatch3Modal } from './parts/RulesModal';
import { useProgress } from '../../../../hooks/useProgress';
import { useTimer } from '../../../../hooks/useTimer';
import { EndModal } from '../../../shared/modals/EndModal';
import coinIcon from '../../../../assets/images/coinImg.webp';

const Wrapper = styled.div`
    height: 100%;
    padding: ${({ $ratio }) => $ratio * 155}px ${({ $ratio }) => $ratio * 25}px 0;
`;

const ShuffleNotice = styled(motion.div)`
    position: fixed;
    top: calc(${({ $ratio }) => $ratio * 105}px + 50%);
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: ${({ $ratio }) => $ratio * 305}px;
    padding: ${({ $ratio }) => $ratio * 25}px;
    backdrop-filter: blur(5px);
    background: rgba(198, 216, 254, 0.9);
    text-align: center;
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: 0.7px 0.7px 1.4px rgba(1, 32, 103, 0.8), inset 1.4px 1.4px 1.4px rgba(255, 255, 255, 0.6);
    border-radius:  ${({ $ratio }) => $ratio * 30}px;
    white-space: pre-line;
    color: var(--color-accent);

    transition: opacity 0.3s ease;
    z-index: 100;
`;

const TimerWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    gap: var(--spacing_x3);
    padding-top: ${({$ratio}) => $ratio * 40}px;
`;

const TimerBlock = styled.div`
    background: rgba(255, 255, 255, 0.25);
    border: 0.520833px solid rgba(0, 76, 218, 0.5);
    box-shadow: 0.694444px 0.694444px 1.38889px rgba(1, 32, 103, 0.6), inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.4);
    border-radius: ${({$ratio}) => $ratio * 20}px;
    width: calc((100% - var(--spacing_x3)) / 2);
    height: ${({$ratio}) => $ratio * 70}px;
    display: flex;
    gap: var(--spacing_x1);
    align-items: center;
    justify-content: center;
    color: var(--color-accent);
`;

const TimeAmount = styled.h4`
    font-weight: 500;
    font-size: ${({$ratio}) => $ratio * 34}px;
`;

const CoinIcon = styled.img`
    width: ${({$ratio}) => $ratio * 36}px;
    height: ${({$ratio}) => $ratio * 36}px;
    object-fit: contain;
`;

const GameMatch3 = () => {
    const ratio = useSizeRatio();
    const { openedModal, handleOpenModal } = useProgress();
    const { score, selected, board, handleCellClick, handleTouchStart, handleTouchEnd, showShuffle } = useGame({});

    //TODO: добавить выход в меню
    const { getSeconds } = useTimer({isStart: !openedModal?.isOpen, initialTime: 50, onFinish: () => handleOpenModal({
        Component: <EndModal title={"Время вышло!"} coins={"[уточняется]"}/>,
    })});

    useEffect(() => {
        const preventDefault = (e) => e.preventDefault();
        
        document.body.addEventListener('touchmove', preventDefault, { passive: false });
        
        return () => document.body.removeEventListener('touchmove', preventDefault);
    }, [])

    useLayoutEffect(() => {
        handleOpenModal(
            {
                Component: <StartMatch3Modal />,
                nextOpenedModalProps: {
                    component: <RulesMatch3Modal />,
                    isBlurTransitionDisabled: true,
                }
            });
    }, []);

    const handleOpenRules = () => {
        handleOpenModal(
            {
                Component: <RulesMatch3Modal />,
                isBlurTransitionDisabled: true,
            });
    }

    return (
        <Wrapper $ratio={ratio}>
            <BackHeaderGame onRulesClick={handleOpenRules}/>
            <Board board={board} selected={selected} handleCellClick={handleCellClick} handleTouchStart={handleTouchStart} handleTouchEnd={handleTouchEnd} />
            <TimerWrapper $ratio={ratio}>
                <TimerBlock $ratio={ratio}>
                    <TimeAmount $ratio={ratio}>0:{getSeconds()}</TimeAmount>
                </TimerBlock>
                <TimerBlock $ratio={ratio}>
                    <CoinIcon $ratio={ratio} src={coinIcon} alt="" />
                    <TimeAmount $ratio={ratio}>{score}</TimeAmount>
                </TimerBlock>
            </TimerWrapper>
            <AnimatePresence>
                {showShuffle && (
                    <ShuffleNotice $ratio={ratio} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Нет ходов!{'\n'}Перемешивание...
                    </ShuffleNotice>
                )}
            </AnimatePresence>
        </Wrapper>
    );
};

export default GameMatch3;
