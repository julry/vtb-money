import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import pic from '../../assets/images/waiting.webp';
import WebApp from "@twa-dev/sdk";
import bridge from "@vkontakte/vk-bridge";
import { FlexWrapper } from "../shared/ContentWrapper";
import { LogoOutlined } from "../shared/LogoOutlined";
import {Block} from '../shared/Block';
import { Title } from "../shared/Title";
import { Text } from "../shared/Text";
import { Button } from "../shared/Button";
import { useProgress } from "../../hooks/useProgress";

const ContentWrapper = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: ${({$ratio}) => $ratio * 25}px;
`;

const TitleStyled = styled(Title)`
    margin-bottom: calc(var(--spacing_x1) * 1.5);
`;

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: ${({$ratio}) => $ratio * 261}px;
    height: ${({$ratio}) => $ratio * 261}px;

    & img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const WaitingGameScreen = () => {
    const { isVkPlatform } = useProgress();
    const ratio = useSizeRatio();

    const handleClick = () => {
        WebApp?.close?.();
        if (isVkPlatform) {
            bridge.send('VKWebAppClose', {
                status: 'success',
            })
            .catch((error) => {
                // Ошибка
                console.log('Error close app', error);
            });
        }
    };

    return (
        <FlexWrapper>
            <LogoOutlined />
           <ContentWrapper $ratio={ratio}>
                <TitleStyled>
                    Ход сделан,{'\n'}ты в игре!
                </TitleStyled>
                <Text>
                    Осталось совсем немного:{'\n'}игра откроется 7 сентября.{'\n'}Мы пришлём напоминание{'\n'}в боте в день старта
                </Text>
                <ImageWrapper  $ratio={ratio}>
                    <img src={pic} alt="" />
                </ImageWrapper>
                <Button onClick={handleClick}>Перейти в бота</Button>
           </ContentWrapper>
        </FlexWrapper>
    )
};

export default WaitingGameScreen;