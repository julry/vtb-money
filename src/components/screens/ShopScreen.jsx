import { useEffect, useRef } from "react";
import { useProgress } from "../../hooks/useProgress";
import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { Title } from "../shared/Title";
import { BackHeader } from "../shared/BackHeader";
import { ShopCard } from "../shared/ShopCard";
import { mapIdToImage } from "../../utils/mapItemIdToImage";
import { Button } from "../shared/Button";
import { Text } from '../shared/Text';
import { Scrollbar } from "../shared/ScrollBar";
import { CURRENT_WEEK } from "../../contexts/ProgressProvider";
import { SCREENS } from '../../constants/screens';
import {ConfirmShopModal} from '../shared/modals/ConfirmShopModal';
import { EmptyShopModal } from "../shared/modals/EmptyShopModal";
import {DiscountShopModal} from '../shared/modals/DiscountShopModal';
import {DISCOUNT_KOEF} from '../../contexts/constants';

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
    const costRef = useRef();
   
    useEffect(() => {
       updateShopItems(user.facId).then(res => {
            if (res?.isClosed) {
                handleOpenModal({
                    Component: <EmptyShopModal />,
                })
            }
       });
    }, []);


    const handleClick = async (item) => {
        if (user.hasSale) {
            handleOpenModal({
                Component: <DiscountShopModal cost={Math.round(item.cost * DISCOUNT_KOEF)} costRef={costRef}/>,
                nextOpenedModalProps: {
                    component: <ConfirmShopModal itemId={item.id} costRef={costRef} itemCost={item.cost}/>,
                }
            });

            return;
        }

        handleOpenModal({
            Component: <ConfirmShopModal itemId={item.id}/>,
        })
    }

    return (
        <Wrapper $ratio={ratio}> 
            <BackHeader isShownCoins onBack={() => next(SCREENS.LOBBY)}/>
            <Scrollbar offset={4}>
                <TitleStyled>Магазин</TitleStyled>
                <InnerWrapper $ratio={ratio}>
                    {shopItems.map((card) => {
                        const isNotEnoughMoney = user.totalCoins < (user.hasSale ? Math.round(card.cost * DISCOUNT_KOEF) : card.cost);
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
                                onClick={() => handleClick(card)}
                                disabled={isDisabled || isNotEnoughMoney}
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