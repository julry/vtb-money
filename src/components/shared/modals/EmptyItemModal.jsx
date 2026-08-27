import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import picture from '../../../assets/images/emptyitem.webp';
import { lazy } from "react";

const InfoModal = lazy(() => import('./InfoModal').then((m) => ({ default: m.InfoModal })));

const ModalStyled = styled(InfoModal)`
    & > div {
        padding-bottom: 0;
    }
`;

const Image = styled.img`
    width: ${({$ratio}) => $ratio * 206}px;
    height: ${({$ratio}) => $ratio * 183}px;
    margin: ${({$ratio}) => $ratio * -10}px auto 0;
    object-fit: contain;
`;

export const EmptyItemModal = () => {
    const ratio = useSizeRatio();

    return (
        <ModalStyled title={"Упс, к сожалению,\nэтого товара нет\nв наличии"}>
            <Image src={picture} $ratio={ratio} alt="" />
        </ModalStyled>
    )
}