import styled from "styled-components";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { useProgress } from "../../../hooks/useProgress";
import { Block } from "../Block";

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

const ContentWrapper = styled(Block)`
    padding: ${({$ratio}) => $ratio * 25}px;
`;

export const CommonModal = ({onClose, children, isDisabledAnimation, secondBtnText, onSecondBtnClick, btnText = 'Далее', ...props }) => {
    const ratio = useSizeRatio();
    const { handleCloseModal } = useProgress();

    return (
        <ModalStyled isDisabledAnimation={isDisabledAnimation} {...props}>
            <ContentWrapper $ratio={ratio}>
                {children}
                <ButtonStyled onClick={handleCloseModal}>{btnText}</ButtonStyled>
                {secondBtnText?.length > 0 && (
                    <ButtonStyled type="secondary" onClick={onSecondBtnClick}>
                        {secondBtnText}
                    </ButtonStyled>
                )}
            </ContentWrapper>
        </ModalStyled>
    )
}