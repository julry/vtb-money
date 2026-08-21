import styled from 'styled-components';
import {useSizeRatio} from '../../../hooks/useSizeRatio';
import {Button} from '../Button';
import {MovingBlock} from '../MovingBlock';
import { useProgress } from '../../../hooks/useProgress';
import { Modal } from './Modal';
import turns from '../../../assets/images/turns.webp';
import NumberPicker from '../../screens/Lobby/NumberPicker';

const TitleStyled = styled.h3`
    font-size: ${({$ratio}) => $ratio * 28}px;
    color: white;
    margin-bottom: ${({$ratio}) => $ratio * 10}px;
`;

const TurnsButton = styled(Button)`
    position: absolute;
    font-size: ${({$ratio}) => $ratio * 17}px;
    top: ${({$ratio}) => $ratio * 68}px;
    right: -1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    justify-content: flex-start;
    max-height: ${({$ratio}) => $ratio * 42}px;
    z-index: var(--header-z-index);

    & img {
        width:${({$ratio}) => $ratio * 37}px;
        height:${({$ratio}) => $ratio * 37}px;
    }
`;

const PickerStyled = styled(NumberPicker)`
    box-shadow: 0px 0px 10px #FFFFFF;
`;

export const TurnsInfoModal = () => {
    const { handleCloseModal, user } = useProgress();
    const ratio = useSizeRatio();

    return (
        <Modal onClick={handleCloseModal}>
            <TurnsButton $ratio={ratio} width={user.turns > 9 ? 80 : 65}>
               <img src={turns} alt="Ходов"/>
                <p>{user.turns}</p>
            </TurnsButton>
            <MovingBlock top={189} right={-79} onClose={handleCloseModal}>
                <TitleStyled $ratio={ratio}>Ходы</TitleStyled>
                <p>Чтобы перемещаться по игровому полю, используй кнопки внизу. В течение недели ты можешь сделать до 5 ходов</p>
                <br />
                <p>Нажимай на цифру снизу, она равняется количеству клеток, на которое ты шагнёшь вперёд</p>
            </MovingBlock>
            <PickerStyled disabledPick/>
        </Modal>
    )
}