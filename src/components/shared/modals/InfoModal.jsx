import styled from "styled-components";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { useProgress } from "../../../contexts/ProgressContext";
import { CloseIcon } from "../CloseIcon";
import {Scrollbar} from '../ScrollBar';

const ModalStyled = styled(Modal)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;


const ContentWrapper = styled.div`
    position: relative;
    width: 100%;
    max-height: calc(100% - ${({$ratio}) => $ratio * 128}px);
    max-width: ${({$ratio}) => $ratio * 325}px;
    padding: ${({$ratio}) => $ratio * 20}px ${({$ratio}) => $ratio * 17}px ${({$ratio}) => $ratio * 30}px;
    background: rgba(198, 216, 254, 0.7);
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: 0.7px 0.7px 1.4px rgba(1, 32, 103, 0.8), inset 1.4px 1.4px 1.4px rgba(255, 255, 255, 0.6);
    border-radius:  ${({$ratio}) => $ratio * 30}px;
    white-space: pre-line;
`;

const CloseButton = styled(Button)`
    position: absolute;
    top: -14px;
    right: 0;
    width: ${({$ratio}) => $ratio * 42}px;
    height: ${({$ratio}) => $ratio * 42}px;
    z-index: 2;
`;

const Title = styled.h4`
    font-weight: 500;
    font-size: ${({$ratio}) => $ratio * 28}px;
    line-height: 100%;
    text-align: center;
    color: #004CDA;
`;

export const InfoModal = ({children, isDisabledAnimation,  title, ...props }) => {
    const ratio = useSizeRatio();
    const { handleCloseModal } = useProgress();

    return (
        <ModalStyled isDisabledAnimation={isDisabledAnimation} {...props}>
            <ContentWrapper $ratio={ratio}>
                <Scrollbar offset={-8} top={101 * ratio} bottom={76 * ratio}>
                    <Title $ratio={ratio}>{title}</Title>
                    {children}
                </Scrollbar>
                
                <CloseButton $ratio={ratio} onClick={handleCloseModal}>
                    <CloseIcon />
                </CloseButton>
            </ContentWrapper>
        </ModalStyled>
    )
}