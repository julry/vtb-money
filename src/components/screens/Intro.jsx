import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { FlexWrapper } from "../shared/ContentWrapper";
import { LogoOutlined } from "../shared/LogoOutlined";
import {Block} from '../shared/Block';
import { Title } from "../shared/Title";
import { Text } from "../shared/Text";
import { Button } from "../shared/Button";
import { useProgress } from "../../hooks/useProgress";
import { useEffect } from "react";
import { CURRENT_WEEK } from "../../contexts/ProgressProvider";
import { preload } from "../../constants/screensComponents";

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
    height: ${({$ratio}) => $ratio * 234}px;

    & img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const IntroScreen = () => {
    const ratio = useSizeRatio();
    const { next } = useProgress();

    const handleClick = () => {
        next();
    };

    //TODO: load картинок из introReg или waiting
    useEffect(() => {
        preload.introReg();
    }, []);

    return (
        <FlexWrapper>
            <LogoOutlined />
           <ContentWrapper $ratio={ratio}>
                <TitleStyled>
                    Привет!{'\n'}Это «Ход капиталом» от ВТБ
                </TitleStyled>
                <Text>
                    Игра про логику, стратегическое мышление, риск и деньги.{'\n'}С каждым правильным шагом твой доход становится всё выше. Готов?
                </Text>
                <ImageWrapper  $ratio={ratio}></ImageWrapper>
                <Button  onClick={handleClick}>Стартуем</Button>
           </ContentWrapper>
        </FlexWrapper>
    )
};

export default IntroScreen;