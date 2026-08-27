import { useState } from "react";
import persStart from '../../assets/images/person/persStand.webp';
import female from '../../assets/images/person/persFStand.webp';
import persShine from '../../assets/images/person/persStandShine.webp';
import femaleShine from '../../assets/images/person/persFStandShine.webp';
import styled from "styled-components";
import { motion } from "framer-motion";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { FlexRowWrapper, FlexWrapper } from "../shared/ContentWrapper";
import { LogoOutlined } from "../shared/LogoOutlined";
import { Title } from "../shared/Title";
import { Button } from "../shared/Button";
import { useProgress } from "../../hooks/useProgress";
import { SCREENS } from "../../constants/screens";
import { CURRENT_WEEK } from "../../contexts/ProgressProvider";
import { GENDERS } from "../../constants/genders";
import {MIN_MOCKUP_WIDTH} from '../ScreenTemplate';

const FlexWrapperStyled = styled(FlexWrapper)`
    min-height: 100%;
    padding-bottom: var(--spacing_x4);
`;

const CARDS = [
    {
        id: 'female',
        alt: 'Женский',
        pic: female,
        chosenPic: femaleShine,
        width: 231,
        height: 410,
        x: '-45%',
        xInitial:'-45%',
    },
    {
        id: 'men',
        alt: 'Мужской',
        pic: persStart,
        chosenPic: persShine,
        width: 231,
        height: 410,
        x: '-55%',
        xInitial:'-55%',
    },
];

const Wrapper = styled(FlexRowWrapper)`
    width: 100%;
    position: relative;
    height: ${({$ratio}) => $ratio * 419}px;
    margin-top: ${({$ratio}) => $ratio * 10}px;
    margin-left: ${({$ratio}) => $ratio * -10}px;
    justify-content: center;
    max-width: 375px;
    flex: 1;
    max-height: 60vh;
    
    @media screen and (min-height: 700px) and (max-width: ${MIN_MOCKUP_WIDTH}px) {
         margin-top: ${({$ratio}) => $ratio * 40}px;
         transform: scale(1.1);
    }
`;

const CardStyled = styled.div`
    position: relative;
    width: 50%;
    height: 100%;
    overflow: visible;
    display: flex;
    justify-content: center;
`

const Card = styled(motion.img)`
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${({$width}) => $width}px;
    height: ${({$height}) => $height}px;
    object-fit: contain;
    pointer-events: none;
`;

const TitleStyled = styled(Title)`
    margin-top: ${({$ratio}) => $ratio * 32}px;

    @media screen and (min-height: 700px) and (max-width: ${MIN_MOCKUP_WIDTH}px) {
        margin-top: ${({$ratio}) => $ratio * 82}px;
    }
`;

const ErrorText = styled.p`
    position: absolute;
    bottom:  0;
    font-size: ${({$ratio}) => $ratio * 9}px;
    color: #B90000;
    opacity: ${({$isCorrect}) => $isCorrect ? 0 : 1};
    transition: opacity 0.25s;
`;

const SexScreen = () => {
    const ratio = useSizeRatio();
    const { next, registrateUser } = useProgress();
    const [isSending, setIsSending] = useState(false);
    const [isNetworkError, setIsNetworkError] = useState(false);
    const [currentIndex, setCurrentIndex] = useState();
    

    const handleClick = async () => {
        if (currentIndex === undefined || isSending) {
            return;
        }
        setIsSending(true);
        setIsNetworkError(false);

        const res = await registrateUser({gender: currentIndex === 0 ? GENDERS.Female : GENDERS.Male});

        setIsSending(false);

        if (res.isError) {
            setIsNetworkError(true);

            return;
        }

        if (CURRENT_WEEK < 1) {
            next(SCREENS.WAITING);

            return;
        }

        next(SCREENS.LOBBY);
    }

    const getAnimation = (card, index) => {
        console.log('heelllo', currentIndex);
        if (!(typeof currentIndex === 'number')) {
            return {scale: 1}
        }

        if (currentIndex === index) {
            return {scale: 1.04}
        }

        if (currentIndex !== index) {
           return {scale: 0.85}
        }
    }

    const handleChoosePers = (index) => {
        if (isSending) {
            return;
        }

        setCurrentIndex(index)
    }

    return (
        <FlexWrapperStyled>
            <LogoOutlined />
            <TitleStyled $ratio={ratio}>
                Выбери игрового{'\n'}персонажа
            </TitleStyled>
            <Wrapper $ratio={ratio}>
                {CARDS.map((card, index) => (
                    (<CardStyled key={card.id} onClick={() => handleChoosePers(index)}>
                        <Card 
                            initial={{x: card.xInitial, y: card.y ?? '-50%'}}
                            $width={card.width * ratio}
                            $height={card.height * ratio}
                            src={currentIndex === index ? card.chosenPic : card.pic}
                            alt={card.alt}
                            animate={getAnimation(card, index)}
                            transition={{duration: 0.25, ease: 'linear'}}
                        />
                    </CardStyled>)
                ))}
                {isNetworkError && (
                    <ErrorText $ratio={ratio}>Что-то пошло не так, попробуй снова</ErrorText>
                )}
            </Wrapper>
            <Button width={275 * ratio} onClick={handleClick}>Выбрать</Button>
        </FlexWrapperStyled>
    )
};

export default SexScreen;