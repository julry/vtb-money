import styled from "styled-components";
import { Button } from "./Button";
import coinIcon from '../../assets/images/coinImg.webp';
import ticket from '../../assets/images/ticket.webp';
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { useProgress } from "../../hooks/useProgress";
import { CloseIcon } from "./CloseIcon";
import { Logo } from "./Logo";
import { CoinsInfoModal } from "./modals/CoinsInfoModal";

const Header = styled.div`
    display: flex;
    width: 100%;
    justify-content: ${({$isOnlyRight}) => $isOnlyRight ? 'flex-end' : 'space-between'};
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

export const BackHeader = ({ className, isDisabledBtns, onBack, isShownExit = true, isHiddenLogo, isShownTickets, isShownCoins }) => {
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

    const handleOpenCoinsModal = () => {
        if (isDisabledBtns) {
            return;
        }

        handleOpenModal({
            Component: (
                <CoinsInfoModal />
            ),
            isBlurTransitionDisabled: true,
            blurSize: 5,
        })
    }

    const handleBack = () => {
        if (isDisabledBtns) {
            return;
        }

        onBack?.();
    }

    return (
        <>
            <Header className={className} $isOnlyRight={!isShownExit && isHiddenLogo}>
                {isShownExit ? (
                    <ExitButton $ratio={ratio} onClick={handleBack} width={65}>
                        <CloseIcon />
                    </ExitButton>
                ) : !isHiddenLogo && (
                    <LogoWrapper $ratio={ratio}>
                        <Logo isWhiteVersion/>
                    </LogoWrapper>
                )}
                
                {isShownCoins && (
                    <CoinsButton $ratio={ratio} width={getCoinsButtonLength()} onClick={handleOpenCoinsModal}>
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