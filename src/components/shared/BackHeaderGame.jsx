import styled from "styled-components";
import { Button } from "./Button";
import coinIcon from '../../assets/images/coinImg.webp';
import questionIcon from '../../assets/images/question.webp';
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { useProgress } from "../../contexts/ProgressContext";
import { useTimer } from "../../hooks/useTimer";
import { CommonModal } from "./modals";

const Header = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
    position: absolute;
    top: calc(var(--spacing_x7) + var(--spacing_x1) / 2);
    left: 0;
    z-index: var(--header-z-index);
    opacity: ${({$isHidden}) => $isHidden ? 0 : 1};
    transform: opacity 0.25s;
`;

//TODO: чекнуть стили 
const ExitButton = styled(Button)`
    margin-left: -35px;
    justify-content: flex-end;
    flex-shrink: 0;
    max-height: 42px;
    width: ${({$ratio}) => $ratio * 90}px;
`;

const CoinsButton = styled(Button)`
    transform: translateX(17px);
    font-size: ${({$ratio}) => $ratio * 17}px;
    justify-content: flex-start;
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
    font-size: ${({$ratio}) => $ratio * 34}px;
    height: ${({$ratio}) => $ratio * 54}px;
    flex-shrink: 0;
    color: var(--color-accent);
`;

const TimerBlock = styled(AdditionalBlock)`
    width: ${({$ratio}) => $ratio * 110}px;
`

const CurrentPointsBlock = styled(AdditionalBlock)`
    min-width: ${({$ratio}) => $ratio * 85}px;
    width: fit-content;
    padding:  ${({$ratio}) => $ratio * 10}px  ${({$ratio}) => $ratio * 16}px  ${({$ratio}) => $ratio * 13}px ${({$ratio}) => $ratio * 10}px;
`

// const RulesButton = styled(Button)`
//     position: absolute;
//     top: calc(var(--spacing_x7) + var(--spacing_x1) / 2 + ${({$ratio}) => $ratio * 57}px);
//     right: -21px;
//     padding-left: var(--spacing_x4);
//     justify-content: flex-start;
//     z-index: var(--header-z-index);
// `;

const RulesButton = styled(Button)`
    padding-left: var(--spacing_x4);
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

export const BackHeaderGame = ({ className, isHidden, onBack, timerData, currentPoints, onRulesClick, scoreElementRef }) => {
    const { user, handleOpenModal } = useProgress();
    const { getSeconds } = useTimer(timerData ?? {});

    const coins = user.coins.toLocaleString();
    const ratio = useSizeRatio();

    const getCoinsButtonLength = () => {
       return Math.max(115 + (10 * (coins.length - 5)), 100);
    }

    const onButtonClick = (callback) => (e) => {
        e?.stopPropagation();
        callback?.();
    }

    return (
        <>
            <Header className={className} $isHidden={isHidden}>
                <ExitButton $ratio={ratio} onPointerDown={e => e?.stopPropagation} onClick={onButtonClick(onBack)} width={90}>
                    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.99912 7.1427L6.2036 7.93817L20.3462 22.0798L21.1417 21.2844L21.9372 20.4889L7.79464 6.34723L6.99912 7.1427Z" fill="white"/>
                        <path d="M7.00107 21.1427L6.20555 20.3472L20.3477 6.206L21.1432 7.00147L21.9388 7.79694L7.79659 21.9382L7.00107 21.1427Z" fill="white"/>
                    </svg>
                </ExitButton>
                
                <RulesButton $ratio={ratio} onPointerDown={e => e?.stopPropagation} type="transparent" width={85} onClick={onButtonClick(onRulesClick)}>
                    <QuestionIcon $ratio={ratio} src={questionIcon} alt="" />
                </RulesButton>
                {/* <CoinsButton $ratio={ratio} onPointerDown={e => e?.stopPropagation} onClick={onButtonClick(() => handleOpenModal({Component: <CommonModal />}))} width={getCoinsButtonLength()}>
                    <CoinIcon $ratio={ratio} src={coinIcon} alt="" />
                    <p>{coins.toLocaleString()}</p>
                </CoinsButton> */}
            </Header>
            <InfoWrapper $ratio={ratio} $isHidden={isHidden}>
                {timerData !== undefined && (
                    <TimerBlock $ratio={ratio}>
                        <p>0:{getSeconds()}</p>
                    </TimerBlock>
                )}
                {currentPoints !== undefined && (
                    <CurrentPointsBlock $ratio={ratio}>
                        <CoinIcon $ratio={ratio} src={coinIcon} alt="" />
                        <p ref={scoreElementRef}>{currentPoints}</p>
                    </CurrentPointsBlock>
                )}
            </InfoWrapper>
            
            {/* <RulesButton $ratio={ratio} onPointerDown={e => e?.stopPropagation} type="transparent" width={85} onClick={onButtonClick(onRulesClick)}>
                <QuestionIcon $ratio={ratio} src={questionIcon} alt="" />
            </RulesButton> */}
        </>
)
}