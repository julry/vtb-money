import styled from "styled-components"
import { Text } from "../Text"
import {lazy} from 'react';

const TextStyled = styled(Text)`
    margin-top: calc(var(--spacing_x2) * 1.5);
`;

const InfoModal = lazy(() => import('./InfoModal').then((m) => ({ default: m.InfoModal })));

export const NewWeekModal = ({week}) => {
    return (
        <InfoModal title={`Неделя ${week}\nначалась!`}>
            <TextStyled>
                Наступила новая неделя, а с ней миллиард поводов начать исследовать новые возможности для твоего{'\n'}капитала!
            </TextStyled>
        </InfoModal>
    )
}