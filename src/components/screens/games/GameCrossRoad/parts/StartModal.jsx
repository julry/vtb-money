import styled from "styled-components";
import startImg from '../../../../../assets/images/cross/startImg.webp';
import { GameModal } from "../../../../shared/modals";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    height: ${({$ratio}) => $ratio * 276}px;

    & img {
        margin-top: ${({$ratio}) => $ratio * 8}px;
        width: ${({$ratio}) => $ratio * 265}px;
        height: ${({$ratio}) => $ratio * 252}px;
        object-fit: contain;
    }
`;

export const StartCrossModal = () => {
    const ratio = useSizeRatio();

    return (
        <GameModal title={"Пересекай поток трат\nи рисков и доберись\nдо финала"}>
            <ImageWrapper $ratio={ratio}>
                <img src={startImg} alt="" />
            </ImageWrapper>
        </GameModal>
    )
}