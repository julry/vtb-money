import { useState } from "react";
import persStart from '../../assets/images/person/persStart.webp';
import female from '../../assets/images/person/persStartF.webp';
import arrow from '../../assets/images/arrowLeft.webp';
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { FlexWrapper } from "../shared/ContentWrapper";
import { LogoOutlined } from "../shared/LogoOutlined";
import { Title } from "../shared/Title";
import { Button } from "../shared/Button";
import { useProgress } from "../../hooks/useProgress";
import { SCREENS } from "../../constants/screens";
import { CURRENT_WEEK } from "../../contexts/ProgressProvider";
import { GENDERS } from "../../constants/genders";

const CARDS = [
    {
        id: 'female',
        alt: 'Женский',
        pic: female,
        width: 206,
        height: 391,
    },
    {
        id: 'men',
        alt: 'Мужской',
        pic: persStart,
        width: 216,
        height: 394,
    },
];

const Wrapper = styled.div`
    width: 100%;
    position: relative;
    height: ${({$ratio}) => $ratio * 422}px;
    max-width:  375px;
    display: flex;
    align-items: center;
`;

const CardStyled = styled(motion.div)`
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
`

const Card = styled.img`
    width: ${({$width}) => $width}px;
    height: ${({$height}) => $height}px;
    object-fit: contain;
`;

const Arrow = styled.img`
    width: 100%;
    height: 100%;
    transform: scale(${({$isMirror}) => $isMirror ? '-1, 1' : 1});
`;

const ButtonSlider = styled.button`
    position: absolute;
    background-color: transparent;
    outline: none;
    top: 50%;
    transform: translateY(-50%);
    width: ${({$ratio}) => $ratio * 80}px;
    height: ${({$ratio}) => $ratio * 80}px;
    z-index: 10;
`;

const ButtonSliderLeft = styled(ButtonSlider)`
    left: ${({$ratio}) => $ratio * 35}px;
`
const ButtonSliderRight = styled(ButtonSlider)`
    right: ${({$ratio}) => $ratio * 35}px;
`

const TitleStyled = styled(Title)`
    margin-top: ${({$ratio}) => $ratio * 32}px;
`;

const SexScreen = () => {
    const ratio = useSizeRatio();
    const { next, registrateUser } = useProgress();
    const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

    const nextSlide = () => {
        setCurrentIndex([(currentIndex + 1) % CARDS.length, 1]);
    };

    const prevSlide = () => {
        setCurrentIndex([(currentIndex - 1 + CARDS.length) % CARDS.length, -1]);
    }

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: 'spring', stiffness: 400, damping: 40 },
                opacity: { duration: 0.3 }
            }
        },
        exit: (direction) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            transition: {
                x: { duration: 0.3, ease: 'easeInOut' },
                opacity: { duration: 0.2 }
            }
        })
    };

    const handleClick = () => {
        registrateUser({gender: currentIndex === 0 ? GENDERS.Female : GENDERS.Male});

        if (CURRENT_WEEK < 1) {
            next(SCREENS.WAITING);

            return;
        }

        next(SCREENS.LOBBY);
    }

    return (
        <FlexWrapper>
            <LogoOutlined />
            <TitleStyled $ratio={ratio}>
                Выбери игрового{'\n'}персонажа
            </TitleStyled>
            <Wrapper  $ratio={ratio}>
                <ButtonSliderLeft  $ratio={ratio} onClick={nextSlide} >
                    <Arrow src={arrow} alt="" />
                </ButtonSliderLeft>
                <ButtonSliderRight  $ratio={ratio} onClick={prevSlide}>
                        <Arrow src={arrow} alt="" $isMirror/>
                </ButtonSliderRight>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <CardStyled
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                    >
                        <Card 
                            $width={CARDS[currentIndex].width * ratio}
                            $height={CARDS[currentIndex].height * ratio}
                            src={CARDS[currentIndex].pic}
                            alt={CARDS[currentIndex].alt}
                        />
                    </CardStyled>
                </AnimatePresence>
            </Wrapper>
            <Button width={275 * ratio} onClick={handleClick}>Выбрать</Button>
        </FlexWrapper>
    )
};

export default SexScreen;