import styled from "styled-components";
import { Modal } from "../../../../shared/modals";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { MovingBlock } from '../../../../shared/MovingBlock';

const ModalStyled = styled(Modal)`
    padding-top: ${({$ratio}) => $ratio * 155}px;
`

export const RulesModal = ({onClick}) => {
    const ratio = useSizeRatio();

    return (
        <ModalStyled $ratio={ratio} isDisabledAnimation onClick={onClick}>
            <MovingBlock $ratio={ratio} top={75} onClose={onClick}>
                <p>
                    Тапни по экрану, чтобы прыгнуть и перепрыгнуть препятствие
                </p>
                <br />
                <p>
                   Собирай коины и уворачивайся от препятствий!
                </p>
            </MovingBlock>
        </ModalStyled>
    )
}

