import styled from "styled-components";
import { Button } from "./Button";
import coinIcon from '../../assets/images/coinImg.webp';
import questionIcon from '../../assets/images/question.webp';
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { useProgress } from "../../contexts/ProgressContext";
import { useTimer } from "../../hooks/useTimer";
import { CommonModal } from "./modals";
import { CloseIcon } from "./CloseIcon";
import {RuleTextModal} from './modals/RuleTextModal';
import {rulesTexts} from '../../constants/rulesTexts';

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
    margin-left: -1px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
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

export const BackHeader = ({ className, onBack, isShownExit = true, isShownCoins }) => {
    const { user, handleOpenModal } = useProgress();

    const coins = user.coins.toLocaleString();
    const ratio = useSizeRatio();

    const getCoinsButtonLength = () => {
       return Math.max(115 + (10 * (coins.length - 5)), 100);
    }

    //TODO: сделать компонент для монет чтобы выделялась сама кнопка
    const handleOpenCoinsModal = () => {
        handleOpenModal({
            Component: (
                <RuleTextModal
                    title="Коины"
                    text={rulesTexts.coins}
                />
            )
        })
    }

    return (
        <>
            <Header className={className}>
                {isShownExit && (
                    <ExitButton $ratio={ratio} onClick={onBack} width={65}>
                        <CloseIcon />
                    </ExitButton>
                )}
                
                {isShownCoins && (
                    <CoinsButton $ratio={ratio} onClick={handleOpenCoinsModal} width={getCoinsButtonLength()}>
                        <CoinIcon $ratio={ratio} src={coinIcon} alt="" />
                        <p>{coins.toLocaleString()}</p>
                    </CoinsButton>
                )}
            </Header>
        </>
)
}