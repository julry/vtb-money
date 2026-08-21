import { useEffect, useMemo, useState } from "react";
import { useProgress } from "../../hooks/useProgress";
import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { Title } from "../shared/Title";
import { BackHeader } from "../shared/BackHeader";
import { ShopCard } from "../shared/ShopCard";
import { mapIdToImage } from "../../utils/mapItemIdToImage";
import { Button } from "../shared/Button";
import {Text} from '../shared/Text';
import { Scrollbar } from "../shared/ScrollBar";
import { CURRENT_WEEK } from "../../contexts/ProgressProvider";
import {SCREENS} from '../../constants/screens';
import { faculties, universities } from "../../constants/universities";
import {ConfirmShopModal} from '../shared/modals/ConfirmShopModal';
import { EmptyShopModal } from "../shared/modals/EmptyShopModal";
import {SuccessShopModal} from '../shared/modals/SuccessShopModal';

const Wrapper = styled.div`
    padding-top: ${({$ratio}) => $ratio * 64}px;
    height: 100%;
`;

const InnerWrapper = styled.div`
    width: 100%;
    padding:  ${({$ratio}) => $ratio * 25}px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    row-gap: var(--spacing_x5);
    column-gap: var(--spacing_x3);
`;

const CardWrapper = styled.div`
    display: grid;
    gap: var(--spacing_x2);
    grid-template-rows: auto ${({$ratio}) => $ratio * 123}px ${({$ratio}) => $ratio * 42}px;
`;

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
`;

const CardTitle = styled(Text)`
    font-size: var(--font_sm);
    width: ${({$ratio}) => $ratio * 100}px;
    opacity: ${({$isDisabled}) => $isDisabled ? 0.5 : 1};
`;

const TitleStyled = styled(Title)`
    font-size: ${({ $ratio }) => 30 * $ratio}px;
`;

const WEEK_TO_DATE = {
    2: '14 сентября',
    3: '21 сентября',
    4: '28 сентября',
}

const ShopScreen = () => {
    const ratio = useSizeRatio();
    const { updateShopItems, shopItems, next, user, handleOpenModal } = useProgress();
   
    useEffect(() => {
       updateShopItems(user.facId).then(res => {
            if (res?.isClosed) {
                handleOpenModal({
                    Component: <EmptyShopModal />,
                })
            }
       });
    }, []);


    const handleClick = async (itemId) => {
        handleOpenModal({
            Component: <ConfirmShopModal itemId={itemId}/>,
        })
    }
    return (
        <Wrapper $ratio={ratio}> 
            <BackHeader isShownCoins onBack={() => next(SCREENS.LOBBY)}/>
            <Scrollbar offset={4}>
                <TitleStyled>Магазин</TitleStyled>
                <InnerWrapper $ratio={ratio}>
                    {shopItems.map((card) => {
                        //TODO: поменять на обычный amount
                        const isDisabled = card.week > CURRENT_WEEK || card.testAmount < 1;
                        return (
                        <CardWrapper $ratio={ratio} key={card.id}>
                            <TitleWrapper>
                                <CardTitle $ratio={ratio} $isDisabled={isDisabled}>
                                    {card.title}
                                </CardTitle>
                            </TitleWrapper>
                            <ShopCard 
                                shouldShowInfo={card.week <= CURRENT_WEEK && !isDisabled} 
                                disabledText={card.week > CURRENT_WEEK ? `будет\nдоступно\n${WEEK_TO_DATE[card.week]}` : null} 
                                isDisabled={isDisabled} 
                                cardInfo={{...card, src: mapIdToImage(card.id)}} 
                            />
                            <Button
                                onClick={() => handleClick(card.id)}
                                disabled={isDisabled || user.totalCoins < card.cost}
                            >купить</Button>
                        </CardWrapper>
                    )
                    })}
                </InnerWrapper>
            </Scrollbar>
        </Wrapper>
    )
};

export default ShopScreen;