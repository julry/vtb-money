import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio"
import { BackHeader } from "../shared/BackHeader";
import match3 from '../../assets/images/match/startImg.webp';
import numbers from '../../assets/images/2048/startImg.webp';
import runner from '../../assets/images/runner/bg.webp';
import collect from '../../assets/images/runner/collectEffect.webp';
import pers from '../../assets/images/person/persJump.webp';
import persF from '../../assets/images/person/persFJump.webp';
import cross from '../../assets/images/cross/startImg.webp';
import catchG from '../../assets/images/doodle/startImg.webp';
import { FlexRowWrapper} from "../shared/ContentWrapper";
import { useLayoutEffect } from "react";
import { useProgress } from "../../hooks/useProgress";
import { Title } from "../shared/Title";
import { Modal } from "../shared/modals";
import { Text } from "../shared/Text";
import { SCREENS } from "../../constants/screens";

const Wrapper = styled(Modal)`
    background: rgba(219, 237, 255, 0.4);
`;
const ContentWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${({$ratio}) => $ratio * 64}px  ${({$ratio}) => $ratio * 25}px ${({$ratio}) => $ratio * 25}px;
`;

const GameInfo = styled.div`
    position: relative;
    overflow: hidden;
    width: ${({$ratio}) => $ratio * 150}px;
    height: ${({$ratio}) => $ratio * 150}px;
    margin-top:  ${({$ratio}) => $ratio * 5}px;

    background: rgba(95, 131, 255, 0.8) 71.69%;
    background: linear-gradient(199.89deg, rgba(173, 207, 245, 0.8) 32.53%, rgba(95, 131, 255, 0.8) 71.69%, rgba(0, 76, 218, 0.8) 126.32%);
    border: 0.581478px solid rgba(0, 76, 218, 0.5);
    box-shadow: inset 1.55061px 1.55061px 1.55061px rgba(0, 40, 130, 0.3);
    border-radius:  ${({$ratio}) => $ratio * 16}px;
`;

const Image = styled.img`
    position: absolute;
    top: ${({$top}) => $top ?? '50%'};
    left: ${({$left}) => $left ?? '50%'};
    transform: translate(-50%, -50%);
    width: ${({$width}) => $width ? $width + 'px' : '100%'};
    height: ${({$height}) => $height ? $height + 'px' : '100%'};
    object-fit: contain;
    z-index: ${({$zIndex}) => $zIndex ?? 1};
`;

const FlexRowWrapperStyled = styled(FlexRowWrapper)`
    justify-content: space-between;
    margin-top: var(--spacing_x3);
    width: 100%;
    max-width: ${({$ratio}) => $ratio * 350}px;
`;

const MiniGamesScreen = () => {
    const { handleOpenModal, next, handleCloseModal, setGameState, isFemale } = useProgress();
    const ratio = useSizeRatio();

    const handleClick = (screen) => {
        setGameState({isInfinite: true});
        next(screen);
    }

    useLayoutEffect(() => {
        handleOpenModal({
            Component: (
                <Wrapper>
                    <BackHeader onBack={() => handleClick(SCREENS.LOBBY)}/>
                    <ContentWrapper $ratio={ratio}>
                        <Title>Мини-игры</Title>
                        <FlexRowWrapperStyled $ratio={ratio}>
                            <div onClick={() => handleClick(SCREENS.GAMEMATCH3)}>
                                <Text>Три в ряд</Text>
                                <GameInfo $ratio={ratio}>
                                    <Image src={match3} alt=""/>
                                </GameInfo>
                            </div>
                            <div onClick={() => handleClick(SCREENS.GAMERUNNER)}>
                                <Text>Раннер</Text>
                                <GameInfo $ratio={ratio}>
                                    <Image src={runner} alt="" $width={196 * ratio} $height={157 * ratio}/>
                                    <Image src={collect} alt="" $left={'53%'} $zIndex={2} $width={102 * ratio} $height={80 * ratio}/>
                                    <Image src={isFemale ? persF : pers} alt="" $top={'65%'}  $zIndex={3} $width={72 * ratio} $height={144 * ratio}/>
                                </GameInfo>
                            </div>
                        </FlexRowWrapperStyled>
                        <FlexRowWrapperStyled $ratio={ratio}>
                            <div onClick={() => handleClick(SCREENS.GAMECATCH)}>
                                <Text>Ловля предметов</Text>
                                <GameInfo $ratio={ratio}>
                                    <Image src={catchG} $width={144 * ratio} $height={115 * ratio} alt=""/>
                                </GameInfo>
                            </div>
                            <div onClick={() => handleClick(SCREENS.GAME2048)}>
                                <Text>2048</Text>
                                <GameInfo $ratio={ratio}>
                                    <Image src={numbers} $top={'60%'} $width={212 * ratio} $height={183 * ratio} alt=""/>
                                </GameInfo>
                            </div>
                        </FlexRowWrapperStyled>
                        <FlexRowWrapperStyled $ratio={ratio}>
                            <div onClick={() => handleClick(SCREENS.GAMECROSS)}>
                                <Text>Crossy Road</Text>
                                <GameInfo $ratio={ratio} >
                                    <Image src={cross} $width={131 * ratio} $height={124 * ratio} alt=""/>
                                </GameInfo>
                            </div>
                        </FlexRowWrapperStyled>
                    </ContentWrapper>
                </Wrapper>
            ),
            isBlurTransitionDisabled: true
        })

        return () => {
            handleCloseModal();
        }
    }, []);

    return (<></>)
};

export default MiniGamesScreen;