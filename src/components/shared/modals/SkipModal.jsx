import styled from "styled-components";
import { Modal } from "./Modal";
import { Block } from "../Block";
import { Button } from "../Button";
import { useSizeRatio } from "../../../hooks/useSizeRatio";

const ModalStyled = styled(Modal)`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: var(--font_sm);
`;

const ButtonWrapper= styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing_x4);
    width: 100%;
    padding-bottom: var(--spacing_x6);
    margin-top: calc(var(--spacing_x5) - var(--spacing_x1)/2);
`;

export const SkipModal = ({ isOpen, onClose, onExit }) => {
    const ratio = useSizeRatio();

    return (
    <ModalStyled isOpen={isOpen}>
    </ModalStyled>
);

}