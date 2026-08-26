import styled from "styled-components";
import endImg from '../../../assets/images/discount.webp';
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import {CommonModal} from './CommonModal';
import { Title } from "../Title";
import {useProgress} from '../../../hooks/useProgress';

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: ${({$ratio}) => $ratio * 25}px;
    margin-top: ${({$ratio}) => $ratio * 25}px;

    & img {
        width: ${({$ratio}) => $ratio * 165}px;
        height: ${({$ratio}) => $ratio * 165}px;
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

export const DiscountShopModal = ({cost, costRef}) => {
    const ratio = useSizeRatio();

   const handleUse = () => {
        costRef.current = cost;
   }

    return (
        <CommonModal onClose={handleUse} btnText={'Применить скидку'} isDisabledAnimation secondBtnText={'Не сейчас'}>
            <Title $ratio={ratio}>
                {'Применить скидку на этот товар?'}
            </Title>
            <SubTitle $ratio={ratio}>Со скидкой он обойдётся всего в {cost} коинов</SubTitle>
            <ImageWrapper $ratio={ratio}>
                <img src={endImg} alt="" />
            </ImageWrapper>
        </CommonModal>
    )
}