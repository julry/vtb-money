import styled from "styled-components";
import startImg from '../../../../../assets/images/doodle/startImg.webp';
import { GameModal } from "../../../../shared/modals";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    height: ${({$ratio}) => $ratio * 276}px;

    & img {
        position: absolute;
        top: ${({$ratio}) => $ratio * 87}px;
        left: ${({$ratio}) => $ratio * 5}px;
        width: ${({$ratio}) => $ratio * 315}px;
        height: ${({$ratio}) => $ratio * 251}px;
        object-fit: contain;
    }
`;

export const StartCatchModal = () => {
    const ratio = useSizeRatio();

    return (
        <GameModal title={"Проверь свою реакцию и собери все предметы"}>
            <ImageWrapper $ratio={ratio}>
                <img src={startImg} alt="" />
            </ImageWrapper>
        </GameModal>
    )
}