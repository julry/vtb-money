import styled from "styled-components";
import endImg from '../../../assets/images/endImg.webp';
import { GameModal } from "./GameModal";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import {getPluralCoins} from '../../../utils/getPluralCoins';

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;

    & img {
        width: ${({$ratio}) => $ratio * 248}px;
        height: ${({$ratio}) => $ratio * 194}px;
        object-fit: contain;
    }
`;

const SubTitle = styled.p`
    font-size: ${({$ratio}) => $ratio * 18}px;
    font-weight: 400;
    color: var(--color-accent);
    text-align: center;
    margin-top: var(--spacing_x2);
`;

export const EndModal = ({title, isGameMode, subTitle, coins}) => {
    const ratio = useSizeRatio();

    return (
        <GameModal isBoldTitle btnText={isGameMode ? 'Играть ещё' : 'Забрать'} title={title} secondBtnText={isGameMode ? "Вернуться на главный экран" : undefined}>
            <SubTitle $ratio={ratio}>{subTitle ?? `Заработано ${getPluralCoins(coins)}`}</SubTitle>
            <ImageWrapper $ratio={ratio}>
                <img src={endImg} alt="" />
            </ImageWrapper>
        </GameModal>
    )
}