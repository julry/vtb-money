import styled from "styled-components"
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { Block } from "../Block";
import { Modal } from "./Modal";
import { BlueText } from "../Texts";
import { achievements } from "../../../constants/achievements";
import { useEffect, useRef } from "react";

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ $ratio }) => 120 * $ratio}px;
    height: ${({ $ratio }) => 120 * $ratio}px;
    background: #ffffff;
    border-radius: ${({ $ratio }) => 35 * $ratio}px;
    margin-bottom: ${({ $ratio }) => 13 * $ratio}px;

    & svg {
        width: ${({ $ratio }) => 84 * $ratio}px;
        height: ${({ $ratio }) => 84 * $ratio}px;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Text = styled(BlueText)`
    font-size: ${({ $ratio }) => 26 * $ratio}px;
`;

export const NewAchieveModal = ({ onClose, isOpen, achieveId, children }) => {
    const ratio = useSizeRatio();
    const timerRef = useRef();

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            onClose?.();
        }, 3000);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = undefined;
            }
        }
    }, []);

    const achieve = achievements.find(({id}) => achieveId === id);

    return (
        <Modal isOpen={isOpen} onClick={onClose}>
            <Wrapper>
                <IconWrapper $ratio={ratio}>
                    {achieve?.icon()}
                </IconWrapper>
                <Text $ratio={ratio}>{achieve?.title}</Text>
                {children}
            </Wrapper>
        </Modal>
    )
}