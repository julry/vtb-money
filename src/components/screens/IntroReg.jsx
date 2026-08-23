import styled from "styled-components";
import {useEffect} from 'react';
import pic from '../../assets/images/introreg.webp';
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { useProgress } from "../../hooks/useProgress";
import { FlexWrapper } from "../shared/ContentWrapper";
import { LogoOutlined } from "../shared/LogoOutlined";
import {Block} from '../shared/Block';
import { Title } from "../shared/Title";
import { Text } from "../shared/Text";
import { Button } from "../shared/Button";
import {preload} from '../../constants/screensComponents';

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
    width: ${({$ratio}) => $ratio * 316}px;
    height: ${({$ratio}) => $ratio * 258}px;
    margin-left:  ${({$ratio}) => $ratio * -18}px;

    & img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const IntroRegScreen = () => {
    const ratio = useSizeRatio();
    const { next } = useProgress();

    const handleClick = () => {
        next();
    };

    useEffect(() => {
        preload.reg();
                    // if (cancelled) return;
                    // await preload.sex();
                    // if (cancelled) return;
    
                    // if (CURRENT_WEEK > 0) {
                    //     await preload.lobby();
                    // }
    }, []);

    return (
        <FlexWrapper>
            <LogoOutlined />
           <ContentWrapper $ratio={ratio}>
                <TitleStyled>
                   Настрой хороший!
                </TitleStyled>
                <Text>
                    Заполни несколько деталей о себе — они понадобятся для участия в розыгрыше
                </Text>
                <ImageWrapper $ratio={ratio}>
                    <img src={pic} alt="" />
                </ImageWrapper>
                <Button mt={15 * ratio} onClick={handleClick}>К регистрации</Button>
           </ContentWrapper>
        </FlexWrapper>
    )
};

export default IntroRegScreen;