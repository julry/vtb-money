import styled from "styled-components";
import endImg from '../../../assets/images/lobby/invest_depos.webp';
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import {CommonModal} from './CommonModal';
import { Title } from "../Title";
import { useState } from "react";
import {useProgress} from '../../../hooks/useProgress';
import { EmptyItemModal } from "./EmptyItemModal";
import {SuccessShopModal} from './SuccessShopModal';

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: ${({$ratio}) => $ratio * 25}px;
    margin-top: ${({$ratio}) => $ratio * 25}px;

    & img {
        width: ${({$ratio}) => $ratio * 165}px;
        height: ${({$ratio}) => $ratio * 165}px;
        object-fit: contain;
        transform: rotate(45deg);
    }
`;

export const ConfirmShopModal = ({itemId, itemCost, costRef}) => {
    const [isLoading, setIsLoading] = useState(false);
    const ratio = useSizeRatio();
    const { handleOpenModal, buyItem, user } = useProgress();

   const handleBuy = async () => {
        if (!itemId || isLoading) return;
        setIsLoading(true);
        const res = await buyItem(itemId, user.facId, !!costRef?.current);

        if (costRef) {
            costRef.current = undefined;
        }

        setIsLoading(false);

        if (res.success) {
            handleOpenModal({
                Component: <SuccessShopModal />
            })
        } else {
            handleOpenModal({
                Component: <EmptyItemModal />
            })
        }
   }

   const isNotEnoughMoney = user.totalCoins < (costRef?.current ?? itemCost);
   const isButtonDisabled = isLoading || isNotEnoughMoney;

    return (
        <CommonModal customClose={true} buttonsDisabled={isButtonDisabled} onClose={handleBuy} btnText={'Купить'} isDisabledAnimation secondBtnText={'Назад'}>
            <Title $ratio={ratio}>
                {'Ты точно хочешь купить это?'}
            </Title>
            <ImageWrapper $ratio={ratio}>
                <img src={endImg} alt="" />
            </ImageWrapper>
        </CommonModal>
    )
}