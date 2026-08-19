import styled from "styled-components";
import { CommonModal } from "./CommonModal";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { SCREENS } from "../../../constants/screens";

const TitleStyled = styled.h4`
    font-size: ${({$ratio}) => $ratio * 28}px;
    font-weight: ${({$isBold}) => $isBold ? 500 : 400};
    text-align: center;
    color: var(--color-accent);
`;

export const GameModal = ({ title, btnText = 'Окей', isBoldTitle, children, secondBtnText }) => {
    const {ratio, next} = useSizeRatio();

    return (
        <CommonModal btnText={btnText} isDisabledAnimation secondBtnText={secondBtnText} onSecondBtnClick={() => next(SCREENS.LOBBY)}>
            <TitleStyled $ratio={ratio} $isBold={isBoldTitle}>
                {title}
            </TitleStyled>
            {children}
        </CommonModal>
    )
}