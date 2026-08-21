import styled from "styled-components";
import { CommonModal } from "./CommonModal";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { SCREENS } from "../../../constants/screens";
import { useProgress } from "../../../hooks/useProgress";

const TitleStyled = styled.h4`
    font-size: ${({$ratio}) => $ratio * 22}px;
    font-weight: ${({$isBold}) => $isBold ? 500 : 400};
    text-align: center;
    color: var(--color-accent);
`;

export const GameModal = ({ title, onClose, btnText = 'Окей', isBoldTitle, children, secondBtnText }) => {
    const ratio = useSizeRatio();
    const { next } = useProgress();

    return (
        <CommonModal btnText={btnText} onClose={onClose} isDisabledAnimation secondBtnText={secondBtnText} onSecondBtnClick={() => next(SCREENS.LOBBY)}>
            <TitleStyled $ratio={ratio} $isBold={isBoldTitle}>
                {title}
            </TitleStyled>
            {children}
        </CommonModal>
    )
}