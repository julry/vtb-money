import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio"
import { FlexRowWrapper } from "../ContentWrapper";
import {useMemo, lazy} from 'react';
import { useProgress } from "../../../hooks/useProgress";
import { ShopCard } from "../ShopCard";
import { Text } from "../Text";
import { mapIdToImage } from "../../../utils/mapItemIdToImage";

const InfoModal = lazy(() => import('./InfoModal').then((m) => ({ default: m.InfoModal })));

const InfoWrapper = styled.div`
    margin-top: ${({$ratio}) => $ratio * 29}px;
`;

const InfoModalStyled = styled(InfoModal)`
    & > div {
        padding-bottom: 0;
    }
`;

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