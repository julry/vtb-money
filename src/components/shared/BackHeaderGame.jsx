import styled from "styled-components";
import { Button } from "./Button";
import coinIcon from '../../assets/images/coinImg.webp';
import questionIcon from '../../assets/images/question.webp';
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { useProgress } from "../../hooks/useProgress";
import { useTimer } from "../../hooks/useTimer";
import { CommonModal, SkipModal } from "./modals";
import {CloseIcon} from './CloseIcon';
import { SCREENS } from "../../constants/screens";
import { useEffect } from "react";

const HeaderButton = styled(Button)`
    position: absolute;
    top: calc(var(--spacing_x7) + var(--spacing_x1) / 2);
    z-index: var(--header-z-index);
    opacity: ${({$isHidden}) => $isHidden ? 0 : 1};
    transform: opacity 0.25s;
`;

const ExitButton = styled(HeaderButton)`
    left: 0;
    justify-content: flex-end;
    flex-shrink: 0;
    max-height: 42px;
    height: 42px;
    margin-left: -1px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: ${({$ratio}) => $ratio * 49}px;
`;

const CoinIcon = styled.img`
    width: ${({$ratio}) => $ratio * 30}px;
    height: ${({$ratio}) => $ratio * 30}px;
    object-fit: contain;
    margin-right: 3px;
`;

const QuestionIcon = styled.img`
    width: ${({$ratio}) => $ratio * 25}px;
    height: ${({$ratio}) => $ratio * 36}px;
    object-fit: contain;
`;

const AdditionalBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.4);
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: 0.694444px 0.694444px 1.38889px rgba(1, 32, 103, 0.6), inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.4);
    border-radius: var(--border-radius-md);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: ${({$ratio, $isLarge}) => $ratio * ($isLarge ? 34 : 27)}px;
    height: ${({$ratio, $isLarge}) => $ratio * ($isLarge ? 51 : 41)}px;
    flex-shrink: 0;
    color: var(--color-accent);
`;

const TimerBlock = styled(AdditionalBlock)`
    ${({$isCenteredTimer}) => $isCenteredTimer ? 'border-radius: var(--border-radius-md); margin: auto;': ''};
    width: ${({$ratio,  $isLarge}) => $ratio * ($isLarge ? 98 : 79)}px;
`

const CurrentPointsBlock = styled(AdditionalBlock)`
    min-width: ${({$ratio,  $isLarge}) => $ratio * ($isLarge ? 98 : 79)}px;
    width: fit-content;
    padding:  ${({$ratio}) => $ratio * 10}px  ${({$ratio}) => $ratio * 5}px  ${({$ratio}) => $ratio * 13}px;
`

const RulesButton = styled(HeaderButton)`
    padding-left: var(--spacing_x4);
    right: 0;
    justify-content: flex-start;
    transform: translateX(25px);
`;

const InfoWrapper = styled.div`
    position: absolute;
    z-index: var(--header-z-index);
    top: calc(var(--spacing_x7) + var(--spacing_x1) / 2 + ${({$ratio}) => $ratio * 50}px);
    width: 100%;
    opacity: ${({$isHidden}) => $isHidden ? 0 : 1};
    transform: opacity 0.25s;

    & div + div {
        margin-top: ${({$ratio}) => $ratio * 10}px;
    }
`;

export const BackHeaderGame = ({ isCenteredTimer, isHidden, isLarge, onExit, timerData, currentPoints, shouldShowCoinIcon = true, onRulesClick, scoreElementRef }) => {
    const { handleOpenModal } = useProgress();
    const { getSeconds, getMinutes } = useTimer(timerData ?? {});

    const ratio = useSizeRatio();

    const onButtonClick = (callback) => (e) => {
        e?.stopPropagation();
        callback?.();
    }

    const handleExitClick = () => {
        handleOpenModal({
            Component: <SkipModal onClose={onExit} />
        })
    };

    return (
        <>
            <ExitButton 
                $ratio={ratio} 
                $isHidden={isHidden} 
                onPointerDown={e => e?.stopPropagation} 
                onClick={onButtonClick(handleExitClick)} 
                width={90}
            >
                <CloseIcon />
            </ExitButton>
            
            <RulesButton $ratio={ratio} $isHidden={isHidden} onPointerDown={e => e?.stopPropagation} type="transparent" width={85} onClick={onButtonClick(onRulesClick)}>
                <QuestionIcon $ratio={ratio} src={questionIcon} alt="" />
            </RulesButton>
            <InfoWrapper $ratio={ratio} $isHidden={isHidden}>
                {timerData !== undefined && (
                    <TimerBlock $ratio={ratio} $isCenteredTimer={isCenteredTimer} $isLarge={isLarge}>
                        <p>{getMinutes()}:{getSeconds()}</p>
                    </TimerBlock>
                )}
                {currentPoints !== undefined && (
                    <CurrentPointsBlock $ratio={ratio} $isLarge={isLarge}>
                       {shouldShowCoinIcon && <CoinIcon $ratio={ratio} src={coinIcon} alt="" />}
                        <p ref={scoreElementRef}>{currentPoints}</p>
                    </CurrentPointsBlock>
                )}
            </InfoWrapper>
        </>
)
}