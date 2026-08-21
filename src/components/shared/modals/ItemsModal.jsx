import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio"
import { Button } from "../Button";
import { InfoModal } from "./InfoModal"
import { FlexRowWrapper } from "../ContentWrapper";
import { useMemo } from "react";
import { useProgress } from "../../../hooks/useProgress";
import { ShopCard } from "../ShopCard";
import { Text } from "../Text";
import { mapIdToImage } from "../../../utils/mapItemIdToImage";

const InfoWrapper = styled.div`
    margin-top: ${({$ratio}) => $ratio * 29}px;
`;

const InfoModalStyled = styled(InfoModal)`
    & > div {
        padding-bottom: 0;
    }
`;

const TEST_ITEMS = [
        { "id": 1, "title": "Шопер", "cost": 800, "week": 1 },
        { "id": 2, "title": "Шоколадный слиток золота", "cost": 950, "week": 1},
        { "id": 2, "title": "Шоколадный слиток золота", "cost": 950, "week": 1},
        { "id": 4, "title": "Антистресс с кнопочками", "cost": 1250, "amount": 1, "week": 1, "testAmount": 4 },
        { "id": 5, "title": "Обложка на студенческий", "cost": 1400, "amount": 1, "week": 1, "testAmount": 2 },
        { "id": 6, "title": "Бутылка для воды", "cost": 1550, "amount": 1, "week": 1, "testAmount": 3 },
];

function countDuplicatesById(arr) {
  // Сначала считаем количество
  const countMap = arr.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {});
  
  // Затем создаем уникальные объекты с amount
  const seenIds = new Set();
  return arr.reduce((acc, item) => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      acc.push({
        ...item,
        amount: countMap[item.id]
      });
    }
    return acc;
  }, []);
}

const RowWrapper = styled(FlexRowWrapper)`
    align-items: flex-start;

    & + & {
        margin-top: var(--spacing_x5);
    }

    &:last-child {
        padding-bottom: var(--spacing_x5);
    }
`;

const TextStyled = styled(Text)`
    text-align: left;
    font-size: var(--font_sm);
`;

export const ItemsModal = () => {
    const ratio = useSizeRatio();
    const {user} = useProgress();
    // const items = useMemo(() => countDuplicatesById(TEST_ITEMS), []);

    const items = useMemo(() => countDuplicatesById(user.shop), [user.shop]);
    return (
        <InfoModalStyled title={'Твои подарки'}>
            <InfoWrapper $ratio={ratio}>
                {items.map((item) => (
                    <RowWrapper key={item.id} $gap={14 * ratio}>
                        <ShopCard isCoins={false} cardInfo={{...item, src: mapIdToImage(item.id)}}/>
                        <TextStyled>{item.title}</TextStyled>
                    </RowWrapper>
                ))}
            </InfoWrapper>
        </InfoModalStyled>
    )
}