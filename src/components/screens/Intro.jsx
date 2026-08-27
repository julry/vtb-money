import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { useImagePreloader } from "../../hooks/useImagePreloader";
import { FlexWrapper } from "../shared/ContentWrapper";
import { LogoOutlined } from "../shared/LogoOutlined";
import {Block} from '../shared/Block';
import { Title } from "../shared/Title";
import { Text } from "../shared/Text";
import { Button } from "../shared/Button";
import { useProgress } from "../../hooks/useProgress";
import { useEffect } from "react";
import bg from '../../assets/images/introBg.webp';
import persons from '../../assets/images/startImg.webp';
import { CURRENT_WEEK } from "../../contexts/ProgressProvider";
import { preload } from "../../constants/screensComponents";
import {MIN_MOCKUP_WIDTH} from '../ScreenTemplate';
import {introImages, introImagesWaiting} from '../../constants/preloads';

const Wrapper = styled(FlexWrapper)`
    background: linear-gradient(197.56deg, rgba(173, 207, 245, 0.75) 0%, rgba(95, 131, 255, 0.75) 50%, rgba(149, 141, 238, 0.75) 85.2%), #FFFFFF;
`;

const ContentWrapper = styled(FlexWrapper)`
    padding: ${({$ratio}) => $ratio * 25}px;
    height: 100%;
    flex: 1;

    @media screen and (min-height: 700px) and (max-width: ${MIN_MOCKUP_WIDTH}px) {
       padding-top:  ${({$ratio}) => $ratio * 35}px;
    }
`;

const TitleStyled = styled(Title)`
    margin-bottom: calc(var(--spacing_x1) * 1.5);
    @media screen and (min-height: 700px) and (max-width: ${MIN_MOCKUP_WIDTH}px) {
        margin-bottom: ${({$ratio}) => $ratio * 30}px;
        font-size: ${({$ratio}) => $ratio * 38}px;
    }
`;

const ImageBackground = styled.img`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: auto;
    object-fit: contain;
`;

const Image = styled.img`
    position: absolute;
    bottom: ${({$ratio}) => $ratio * -4}px;
    width: ${({$ratio}) => $ratio * 302}px;
    height: ${({$ratio}) => $ratio * 453}px;
    object-fit: contain;
    z-index: 2;

    @media screen and (min-height: 700px) and (max-width: ${MIN_MOCKUP_WIDTH}px) {
        width: ${({$ratio}) => $ratio * 302 * 1.2}px;
        height: ${({$ratio}) => $ratio * 453 * 1.2}px;
        max-width: 60vh;
        max-height: 60vh;
    }
`;

const TextStyled = styled(Text)`
    width: ${({$ratio}) => $ratio * 290}px;
    font-size: ${({$ratio}) => $ratio * 15}px;

    @media screen and (min-height: 700px) and (max-width: ${MIN_MOCKUP_WIDTH}px){
        width: 100%;
        font-size: ${({$ratio}) => $ratio * 22}px;
    }
`;

const ButtonStyled = styled(Button)`
    position: absolute;
    bottom: ${({$ratio}) => $ratio * 81}px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    background: rgba(0, 48, 222, 1);
    max-width: ${({$ratio}) => $ratio * 328}px;
    backdrop-filter: blur(5px);
`;

const IntroScreen = () => {
    const ratio = useSizeRatio();
    const { next } = useProgress();

    const handleClick = () => {
        next();
    };

    useImagePreloader(CURRENT_WEEK > 0 ? introImages : introImagesWaiting);

    //TODO: load картинок из introReg или waiting
    useEffect(() => {
        preload.introReg();        
    }, []);

    return (
        <Wrapper>
            <LogoOutlined />
           <ContentWrapper $ratio={ratio}>
                <TitleStyled $ratio={ratio}>
                    Привет!{'\n'}Это «Ход вперёд»{'\n'}от ВТБ
                </TitleStyled>
                <TextStyled $ratio={ratio}>
                    Игра про логику, стратегическое мышление, риск и деньги. С каждым правильным шагом твой доход становится всё выше. Готов?
                </TextStyled>
                <Image $ratio={ratio} src={persons} alt="" />
                <ImageBackground src={bg} alt="" />
           </ContentWrapper>
            <ButtonStyled $ratio={ratio} onClick={handleClick}>Стартуем</ButtonStyled>
        </Wrapper>
    )
};

export default IntroScreen;