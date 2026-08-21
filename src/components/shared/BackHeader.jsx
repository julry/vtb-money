import styled from "styled-components";
import { Button } from "./Button";
import coinIcon from '../../assets/images/coinImg.webp';
import ticket from '../../assets/images/ticket.webp';
import questionIcon from '../../assets/images/question.webp';
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { useProgress } from "../../hooks/useProgress";
import { useTimer } from "../../hooks/useTimer";
import { CommonModal } from "./modals";
import { CloseIcon } from "./CloseIcon";
import {RuleTextModal} from './modals/RuleTextModal';
import {rulesTexts} from '../../constants/rulesTexts';
import { Logo } from "./Logo";

const Header = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
    position: absolute;
    top: calc(var(--spacing_x6) / 1.6);
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
    max-height: ${({$ratio}) => $ratio * 42}px;
`;

const CoinIcon = styled.img`
    width: ${({$ratio}) => $ratio * 30}px;
    height: ${({$ratio}) => $ratio * 30}px;
    object-fit: contain;
    margin-right: 3px;
`;

const TicketIcon = styled.img`
    width: ${({$ratio}) => $ratio * 40}px;
    height: ${({$ratio}) => $ratio * 40}px;
    object-fit: contain;
    margin-left: ${({$ratio}) => $ratio * 5}px;
    margin-top: ${({$ratio}) => $ratio * 2}px;
    margin-right: ${({$ratio}) => $ratio * 5}px;
`;

const LogoWrapper = styled.div`
  padding-left:  ${({$ratio}) => $ratio * 13}px; 
`;

export const BackHeader = ({ className, onBack, isShownExit = true, isShownTickets, isShownCoins }) => {
    const { user, handleOpenModal } = useProgress();

    const coins = (user.totalCoins ?? 0).toLocaleString();
    const tickets = (user.bilets ?? 0).toLocaleString();
    const ratio = useSizeRatio();

    const getCoinsButtonLength = () => {
       return Math.max(115 + (10 * (coins.length - 5)), 100);
    }

    const getTicketsButtonLength = () => {
       return Math.max(105 + (10 * (coins.length - 5)), 105);
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
                {isShownExit ?  (
                    <ExitButton $ratio={ratio} onClick={onBack} width={65}>
                        <CloseIcon />
                    </ExitButton>
                ) : (
                    <LogoWrapper $ratio={ratio}>
                        <Logo isWhiteVersion/>
                    </LogoWrapper>
                )}
                
                {isShownCoins && (
                    <CoinsButton $ratio={ratio} width={getCoinsButtonLength()}>
                        <CoinIcon $ratio={ratio} src={coinIcon} alt="" />
                        <p>{coins}</p>
                    </CoinsButton>
                )}
                {isShownTickets && (
                    <CoinsButton $ratio={ratio} width={getTicketsButtonLength()}>
                        <TicketIcon $ratio={ratio} src={ticket} alt="" />
                        <p>{tickets}</p>
                    </CoinsButton>
                )}
            </Header>
        </>
)
}