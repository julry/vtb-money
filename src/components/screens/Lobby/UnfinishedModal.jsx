import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio"
import { Button } from "../../shared/Button";
import { MovingBlock } from "../../shared/MovingBlock";
import { Modal } from "../../shared/modals";

const ModalStyled = styled(Modal)`
    z-index: var(--header-z-index);
`;

const TitleStyled = styled.h3`
    font-size: ${({$ratio}) => $ratio * 28}px;
    color: white;
    margin-bottom: ${({$ratio}) => $ratio * 10}px;
`;

const ButtonStyled = styled(Button)`
    color: white;
`

export const UnfinishedModal = ({onClose}) => {
    const ratio = useSizeRatio();

    return (
        <ModalStyled>
            <MovingBlock top={366} right={-80}>
                <TitleStyled $ratio={ratio}>Поле неактивно</TitleStyled>
                <p>Чтобы продвигаться по полю дальше, тебе нужно согласиться или отказаться от условий клетки</p>
                <ButtonStyled type="transparent" mt={"var(--spacing_x5)"} onClick={onClose}>Сделать выбор</ButtonStyled>
            </MovingBlock>
        </ModalStyled>
    )
}