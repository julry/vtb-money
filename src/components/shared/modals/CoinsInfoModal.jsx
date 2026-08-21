import styled from 'styled-components';
import {useSizeRatio} from '../../../hooks/useSizeRatio';
import {Button} from '../Button';
import {MovingBlock} from '../MovingBlock';
import { useProgress } from '../../../hooks/useProgress';
import { BackHeader } from '../BackHeader';
import { Modal } from './Modal';

const TitleStyled = styled.h3`
    font-size: ${({$ratio}) => $ratio * 28}px;
    color: white;
    margin-bottom: ${({$ratio}) => $ratio * 10}px;
`;

export const CoinsInfoModal = () => {
    const { handleCloseModal } = useProgress();
    const ratio = useSizeRatio();

    return (
        <Modal onClick={handleCloseModal}>
            <BackHeader isShownExit={false} isHiddenLogo isShownCoins/>
            <MovingBlock top={124} right={-79} onClose={handleCloseModal}>
                <TitleStyled $ratio={ratio}>Коины</TitleStyled>
                <p>Это валюта, которую ты получаешь взаимодействуя с клетками</p>
                <br />
                <p>Следи за своим уровнем дохода и делай выбор клеток грамотно, чтобы цифра только росла!</p>
            </MovingBlock>
        </Modal>
    )
}