import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import picture from '../../../assets/images/emptyshop.webp';
import { InfoModal } from "./InfoModal";
import { Text } from "../Text";

const ModalStyled = styled(InfoModal)`
    & > div {
        padding-bottom: var(--spacing_x5);
    }
`;

const TextStyled = styled(Text)`
    margin-top: calc(2.5 * var(--spacing_x1));
`;

const Image = styled.img`
    width: ${({$ratio}) => $ratio * 155}px;
    height: ${({$ratio}) => $ratio * 151}px;
    margin:  ${({$ratio}) => $ratio * 10}px auto 0;
    object-fit: contain;
`;

export const EmptyShopModal = () => {
    const ratio = useSizeRatio();

    return (
        <ModalStyled title="Магазин закрыт на переучёт">
            <TextStyled>
                Возвращайся на следующей{'\n'}неделе
            </TextStyled>
            <Image src={picture} $ratio={ratio} alt="" />
        </ModalStyled>
    )
}