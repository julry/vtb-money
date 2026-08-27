import styled from "styled-components"
import { Text } from "../Text"
import { InfoModal } from "./InfoModal"

const TextStyled = styled(Text)`
    margin-top: calc(var(--spacing_x2) * 1.5);
`;

export const NewWeekModal = ({week}) => {
    return (
        <InfoModal title={`Неделя ${week}\nначалась!`}>
            <TextStyled>
                Наступила новая неделя, а с ней миллиард поводов начать исследовать новые возможности для твоего{'\n'}капитала!
            </TextStyled>
        </InfoModal>
    )
}