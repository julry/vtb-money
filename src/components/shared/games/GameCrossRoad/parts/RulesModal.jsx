import styled from "styled-components";
import { motion } from "framer-motion";
import { Modal } from "../../../modals";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { useProgress } from "../../../../../contexts/ProgressContext";

const Description = styled(motion.div)`
    position: absolute;
    top: ${({$ratio}) => $ratio * 75}px;
    left: ${({$ratio}) => $ratio * 60}px;
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

export const RulesModal = ({onClose}) => {
    const ratio = useSizeRatio();

    return (
        <Modal $ratio={ratio} isDisabledAnimation onClick={onClose}>
            <Description $ratio={ratio} exit={{x: 330}} transition={{duration: 0.25}}>
                <p>
                    Тапни вперёд, чтобы сделать шаг. Свайпай влево или вправо, чтобы уклоняться
                </p>
                <br />
                <p>
                    Следи за движущимся потоком трат — смотри не столкнись с ними!
                </p>
            </Description>
        </Modal>
    )
}

