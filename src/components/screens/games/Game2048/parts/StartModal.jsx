import styled from "styled-components";
import startImg from '../../../../../assets/images/2048/startImg.webp';
import { GameModal } from "../../../../shared/modals";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    height: ${({$ratio}) => $ratio * 246}px;

    & img {
        height: ${({$ratio}) => $ratio * 280}px;
        width: ${({$ratio}) => $ratio * 337}px;
        object-fit: contain;
    }
`;

export const Start2048Modal = () => {
    const ratio = useSizeRatio();

    return (
        <GameModal title={"Объединяй\nодинаковые цифры\nи увеличивай свой капитал!"}>
            <ImageWrapper $ratio={ratio}>
                <img src={startImg} alt="" />
            </ImageWrapper>
        </GameModal>
    )
}