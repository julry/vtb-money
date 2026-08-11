import styled from "styled-components";
import startImg from '../../../../../assets/images/match/startImg.webp';
import { GameModal } from "../../../modals";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;

    & img {
        height: ${({$ratio}) => $ratio * 250}px;
        width: ${({$ratio}) => $ratio * 314}px;
        object-fit: contain;
    }
`;

export const StartMatch3Modal = () => {
    const ratio = useSizeRatio();

    return (
        <GameModal title={"Собирай в ряд\n3 и больше одинаковых активов — чем длиннее комбо, тем выше доход!"}>
            <ImageWrapper $ratio={ratio}>
                <img src={startImg} alt="" />
            </ImageWrapper>
        </GameModal>
    )
}