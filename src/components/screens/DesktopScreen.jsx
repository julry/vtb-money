import styled from "styled-components";
import bg from '../../assets/images/desk_bg.png';
import { FlexWrapper } from "../shared/ContentWrapper";
import { Block } from "../shared/Block";
import { Title } from "../shared/Title";

const Wrapper = styled(FlexWrapper)`
    background: url(${bg}) 0 100% no-repeat;
    background-size: cover;

    & div + div {
        margin-top: var(--spacing_x4);
    }

    & div {
        & p {
            line-height: 0.7;
            font-weight: 500;
        }
    }
`;

const BlockStyled = styled(Block)`
    padding: var(--spacing_x2);
`;

export const DesktopScreen = () => (
    <Wrapper>
        <BlockStyled>
            <Title>
                Ты почти на месте, осталось только взять смартфон. 
            </Title>
        </BlockStyled>
        <Block>
            Открой бота с мобильного устройства, заходи на нашу кухню и мешай свой идеальный баланс работы и отдыха!
        </Block>
    </Wrapper>
)