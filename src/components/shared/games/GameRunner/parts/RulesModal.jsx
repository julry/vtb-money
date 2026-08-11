import styled from "styled-components";
import { motion } from "framer-motion";
import { Modal } from "../../../modals";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const ModalStyled = styled(Modal)`
    padding-top: ${({$ratio}) => $ratio * 155}px;
`

const Description = styled(motion.div)`
    position: absolute;
    top: ${({$ratio}) => $ratio * 75}px;
    right: ${({$ratio}) => $ratio * -89}px;
    width: ${({$ratio}) => $ratio * 394}px;
    color: var(--btn-color-main);
    font-size: ${({$ratio}) => $ratio * 16}px;
    background-color: var(--color-accent);
    z-index: 3;

    padding: ${({$ratio}) => $ratio * 20}px;
    padding-right: ${({$ratio}) => $ratio * 99}px;
    border-radius: var(--border-radius-md);
    box-shadow: inset 2px 2px 2px rgba(255, 255, 255, 0.4);

    text-align: left;
`;

export const RulesModal = () => {
    const ratio = useSizeRatio();

    return (
        <ModalStyled $ratio={ratio} isDisabledAnimation>
            <Description $ratio={ratio} exit={{x: 330}} transition={{duration: 0.25}}>
                <p>
                    Тапни по экрану, чтобы прыгнуть и перепрыгнуть препятствие
                </p>
                <br />
                <p>
                   Собирай коины и уворачивайся от препятствий!
                </p>
            </Description>
        </ModalStyled>
    )
}

