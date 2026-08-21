import styled from "styled-components";
import startImg from '../../../../../assets/images/runner/startImg.webp';
import { GameModal } from "../../../../shared/modals";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    height: ${({$ratio}) => $ratio * 244}px;

    & img {
        position: absolute;
        top: ${({$ratio}) => $ratio * 95}px;
        left: ${({$ratio}) => $ratio * -3}px;
        right: ${({$ratio}) => $ratio * -3}px;
        width: calc(100% + ${({$ratio}) => $ratio * 6}px);
        object-fit: contain;
    }
`;

export const StartRunnerModal = () => {
    const ratio = useSizeRatio();

    return (
        <GameModal title={"Беги, лови коины, уворачивайся от лишних трат и покажи лучший результат!"}>
            <ImageWrapper $ratio={ratio}>
                <img src={startImg} alt="" />
            </ImageWrapper>
        </GameModal>
    )
}