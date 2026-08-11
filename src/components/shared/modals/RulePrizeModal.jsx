import styled from "styled-components"
import { Text } from "../Text"
import { InfoModal } from "./InfoModal"

const TextStyled = styled(Text)`
    margin-top: var(--spacing_x5);
    font-size: calc(var(--font_md) + 2px);
`;

const UlStyled = styled.ul`
    margin-top: calc(var(--spacing_x5) / 2);
    color: var(--color-accent);
    margin-left: calc(var(--spacing_x5) + 3px);
    font-size: calc(var(--font_md) + 2px);
`;

export const RulePrizeModal = ({isTargeted}) => {
    return (
        <InfoModal title={"Розыгрыш"}>
            {isTargeted ? (
                <>
                    <TextStyled>
                        Главный приз — [название]{'\n'}Чтобы выиграть, копи билетики
                    </TextStyled>
                    <TextStyled>
                        <b>Как получить билетики?</b>
                    </TextStyled>
                </>
            ) : (
                <TextStyled>
                    Как принять участие?
                </TextStyled>
            )}
            <UlStyled>
                <li>приглашай в игру друзей по реферальной ссылке в профиле</li>
                <li>подписывайся на ТГ-канал в профиле</li>
                <li>{isTargeted ? 'покупай их в магазине за коины' : 'увеличивай свой доход каждую неделю'}</li>
            </UlStyled>
        </InfoModal>
    )
}