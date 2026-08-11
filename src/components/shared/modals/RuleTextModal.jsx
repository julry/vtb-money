import styled from "styled-components"
import { Text } from "../Text"
import { InfoModal } from "./InfoModal"

const TextStyled = styled(Text)`
    margin-top: var(--spacing_x5);
    font-size: calc(var(--font_md) + 2px);
`

export const RuleTextModal = ({title, text}) => {
    return (
        <InfoModal title={title}>
            <TextStyled>
                {text}
            </TextStyled>
        </InfoModal>
    )
}