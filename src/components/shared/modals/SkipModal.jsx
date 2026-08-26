import styled from "styled-components";
import { CommonModal } from "./CommonModal";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { SCREENS } from "../../../constants/screens";
import { useProgress } from "../../../hooks/useProgress";
import { Title } from "../Title";
import door from '../../../assets/images/door.webp';

const TitleStyled = styled(Title)`
    font-size: ${({$ratio}) => $ratio * 28}px;
`;

const SubTitle = styled.p`
    font-size: ${({$ratio}) => $ratio * 18}px;
    font-weight: 400;
    color: var(--color-accent);
    text-align: center;
    margin-top: var(--spacing_x2);
`;

const Image = styled.img`
    margin: ${({$ratio}) => $ratio * 19}px 0 ${({$ratio}) => $ratio * 12}px ${({$ratio}) => $ratio * 38}px;
    width: ${({$ratio}) => $ratio * 218}px;
    height: ${({$ratio}) => $ratio * 172}px;
    object-fit: contain;
`;

export const SkipModal = ({ onClose }) => {
    const ratio = useSizeRatio();
    const { next } = useProgress();

    const handleClose = () => {
        onClose?.();
        next(SCREENS.LOBBY)
    }

    return (
        <CommonModal 
            btnText={'Выйти'} 
            onClose={handleClose} 
            secondBtnText={'Продолжить игру'} 
            secondBtnColor="var(--color-accent)"
        >
            <TitleStyled $ratio={ratio}>
                Хочешь вернуться на главный экран?
            </TitleStyled>
            <SubTitle>
                Не переживай, заработанные коины сохранятся
            </SubTitle>
            <Image $ratio={ratio} src={door} />
        </CommonModal>
    )
}