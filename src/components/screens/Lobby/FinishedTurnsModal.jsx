import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio"
import { Button } from "../../shared/Button";
import { MovingBlock } from "../../shared/MovingBlock";
import { Modal } from "../../shared/modals";

const ModalStyled = styled(Modal)`
    z-index: calc(var(--header-z-index) - 1);
`;

const TitleStyled = styled.h3`
    font-size: ${({$ratio}) => $ratio * 28}px;
    color: white;
    margin-bottom: ${({$ratio}) => $ratio * 10}px;
`;

export const FinishedTurnsModal = () => {
    const ratio = useSizeRatio();

    return (
        <ModalStyled>
            <MovingBlock isInitial={false} top={189} right={-81} width={358}>
                <TitleStyled $ratio={ratio}>5 ходов сделаны! </TitleStyled>
                <p>Приходи на следующей неделе делать новые. Пока можешь поиграть в бесконечные мини‑игры по кнопке джойстика</p>
            </MovingBlock>
        </ModalStyled>
    )
}