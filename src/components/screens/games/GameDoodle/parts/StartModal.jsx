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
        top: ${({$ratio}) => $ratio * 72}px;
        left: ${({$ratio}) => $ratio * -25}px;
        width: ${({$ratio}) => $ratio * 350}px;
        height: ${({$ratio}) => $ratio * 301}px;
        object-fit: contain;
    }
`;

export const StartDoodleModal = () => {
    const ratio = useSizeRatio();

    return (
        <GameModal title={"Прыгай на платформы, избегай препятствий и поднимись на вершину"}>
            <ImageWrapper $ratio={ratio}>
                <img src={startImg} alt="" />
            </ImageWrapper>
        </GameModal>
    )
}