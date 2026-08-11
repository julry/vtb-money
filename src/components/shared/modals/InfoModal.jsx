import styled from "styled-components";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { useProgress } from "../../../contexts/ProgressContext";

const ModalStyled = styled(Modal)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ButtonStyled = styled(Button)`
    position: relative;
    z-index: 2;
    margin-top: auto;

    & + & {
        margin-top: var(--spacing_x2);
    }
`;

const ContentWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: ${({$ratio}) => $ratio * 325}px;
    padding: ${({$ratio}) => $ratio * 25}px;
    background: rgba(198, 216, 254, 0.7);
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: 0.7px 0.7px 1.4px rgba(1, 32, 103, 0.8), inset 1.4px 1.4px 1.4px rgba(255, 255, 255, 0.6);
    border-radius:  ${({$ratio}) => $ratio * 30}px;
    white-space: pre-line;
`;

const CloseButton = styled.div`
    
`;

export const InfoModal = ({children, isDisabledAnimation,  btnText = 'Далее', ...props }) => {
    const ratio = useSizeRatio();
    const { handleCloseModal } = useProgress();

    return (
        <ModalStyled isDisabledAnimation={isDisabledAnimation} {...props}>
            <ContentWrapper $ratio={ratio}>
                {children}
            </ContentWrapper>
        </ModalStyled>
    )
}