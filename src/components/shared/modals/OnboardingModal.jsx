import { useState } from "react";
import styled from "styled-components";
import money from '../../../assets/images/money.webp';
import edu from '../../../assets/images/edu.webp';
import cart from '../../../assets/images/cart.webp';
import luck from '../../../assets/images/luck.webp';
import play from '../../../assets/images/play.webp';
import arrow from '../../../assets/images/arrowRight.webp';
import field from '../../../assets/images/onboardingField.webp';
import profile from '../../../assets/images/profile.webp';
import rules from '../../../assets/images/rules.webp';
import shop from '../../../assets/images/shop.webp';
import games from '../../../assets/images/games.webp';
import { Modal } from "./Modal";
import { useProgress } from "../../../hooks/useProgress";
import { Block } from "../Block";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { Text } from "../Text";
import { Title } from "../Title";
import { Button } from "../Button";
import { FlexRowWrapper } from "../ContentWrapper";
import NumberPicker from '../../screens/Lobby/NumberPicker';
import { BackHeader } from "../BackHeader";
import {SCREENS} from '../../../constants/screens';

const BlockStyled = styled(Block)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 ${({$paddingH, $ratio}) => ($paddingH ?? 26) * $ratio}px;
    padding-top: ${({$paddingTop, $ratio}) => ($paddingTop ?? 20) * $ratio}px;
    padding-bottom: ${({$paddingBot, $ratio}) => ($paddingBot ?? 25) * $ratio}px;

    & b {
        font-weight: 500;
    }

    ${({$style}) => $style};
`;

const TitleStyled = styled(Title)`
    margin-bottom: calc(2.5 * var(--spacing_x1));
`;

const ArrowImg = styled.img`
    width: ${({$ratio}) => $ratio * 62}px;
    height: ${({$ratio}) => $ratio * 40}px;
    object-fit: contain;
`;

const ButtonStyled = styled(Button)`
    height: ${({$ratio}) => $ratio * 54}px;
    min-height: ${({$ratio}) => $ratio * 54}px;
`;

const MenuButtonStyled = styled(Button)`
    position: absolute;
    top: ${({$top}) => $top}px;
    left: -4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: ${({$ratio}) => $ratio * 58}px;
    height: ${({$ratio}) => $ratio * 51}px;
    background-color: rgba(219, 237, 255, 0.8);
    z-index: calc(var(--header-z-index) + 1);
    box-shadow: 0px 0px 6px 2.5px #FFFFFF, inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.4);

    & img {
        width: ${({$ratio}) => $ratio * 48}px;
        height: ${({$ratio}) => $ratio * 40}px;
    }
`;


const InfoWrapper = styled.div`
    margin-top: ${({$ratio}) => $ratio * 15}px;
`;

const FlexRowWrapperStyled = styled(FlexRowWrapper)`
    gap: var(--spacing_x3);

    & + & {
        margin-top: calc(2.5 * var(--spacing_x1));
    }

    & img {
        width: ${({$ratio}) => $ratio * 34}px;
        height: ${({$ratio}) => $ratio * 29}px;
    }

    & p {
        font-size: ${({$ratio}) => $ratio * 14}px;
        line-height: 110%;
        color: var(--color-accent);
    }
`;

const FieldImg = styled.img`
   position: absolute;
   top: ${({$ratio}) => $ratio * -10}px;
   left: 50%;
   transform: translateX(-50%);
   width: 110%;
   max-height: calc(100% - ${({$ratio}) => $ratio * 330}px);
   object-fit: contain;
   height: auto;
`;

const PickerStyled = styled(NumberPicker)`
    box-shadow: 0px 0px 10px #FFFFFF;
`;

const PARTS = [
    {
        title: 'Твоя цель',
        text: 'Стать грамотным стратегом в мире финансов и максимально увеличить свой доход',
    },
    {
        text: <>Это <b>игровое поле</b>. На нем расположены клетки — за каждой скрывается доход или затраты:</>,
        style: (ratio) => `position: absolute; padding-left:${ratio * 26}px;  bottom: -1px; left: 50%; transform: translateX(-50%); border-bottom-left-radius: 0;border-bottom-right-radius: 0;`,
        isShowField: true,
    },
    {
        title: 'Счетчик ходов',
        text: 'Чтобы перемещаться по игровому полю, используй кнопки внизу\n\nВ течение недели ты можешь сделать до 5 ходов. Нажимай на цифру снизу, она равняется количеству клеток, на которое ты шагнёшь вперёд',
        style: (ratio) => `position: absolute; top: ${ratio * 120}px; left: 50%; transform: translateX(-50%);`,
        isShowNumbers: true,
    },
    {
        title: 'Счетчик коинов',
        text: 'Следи за своим уровнем дохода — делай выбор клеток грамотно, чтобы цифра только росла!\n\nВ игре существует свой уровень инфляции, поэтому с каждой неделей стоимость клеток и доход будут увеличиваться',
        style: (ratio) => `position: absolute; top: ${ratio * 120}px; left: 50%; transform: translateX(-50%);`,
        isShowCoins: true,
    },
    {
        title: 'Меню',
        text: 'Здесь ты можешь сыграть в мини‑игры и заработать дополнительные коины, потратить их в магазине на крутые товары, вспомнить правила игры и узнать больше про участие в розыгрыше',
        textUntarget: 'Здесь ты можешь сыграть в мини‑игры и заработать дополнительные коины, вспомнить правила игры и узнать больше про участие в розыгрыше',
        style: (ratio) => `position: absolute; top: ${ratio * 321}px; left: 50%; transform: translateX(-50%);`,
        isShowMenu: true,
    },
    {
        title: 'Старт',
        text: 'Ну что, погнали получать высокий доход со старта!',
    },
]
export const OnBoardingModal = () => {
    const [part, setPart] = useState(0);

    const ratio = useSizeRatio();
    const {updateUser, user, handleCloseModal, setIsMapHidden} = useProgress();

    const handleNextPart = () => {
        if (part === 0) {
            setIsMapHidden(true);
        } 

        if (part === 1) {
            setIsMapHidden(false);
        } 

        setPart(prev => prev + 1);
    }

    const handleStart = () => {
        updateUser({seenStartInfo: true});
        handleCloseModal();
    }

    const currentPart = PARTS[part];
    return (
        <Modal>
            {currentPart.isShowField && (
                <FieldImg $ratio={ratio} src={field} alt="" />
            )}
            {currentPart.isShowNumbers && (
                <PickerStyled disabledPick/>
            )}
            {currentPart.isShowCoins && (
                <BackHeader isShownExit={false} isHiddenLogo isShownCoins isHighlightedCoins />
            )}
            {currentPart.isShowMenu && (
                <>
                    <MenuButtonStyled $ratio={ratio} $top={77 * ratio} type="transparent" >
                        <img src={profile} alt="Профиль"/>
                    </MenuButtonStyled>
                    <MenuButtonStyled $ratio={ratio} $top={138 * ratio} type="transparent" >
                        <img src={games} alt="Мини-игры"/>
                    </MenuButtonStyled>
                    {user.isTargeted && (
                        <MenuButtonStyled $ratio={ratio} $top={199 * ratio} type="transparent">
                            <img src={shop} alt="Магазин"/>
                        </MenuButtonStyled>
                    )}
                    <MenuButtonStyled $ratio={ratio}  $top={(user.isTargeted ? 260 : 199) * ratio} type="transparent">
                        <img src={rules} alt="Правила"/>
                    </MenuButtonStyled>
                </>
            )}
            <BlockStyled 
                $ratio={ratio} 
                $paddingBot={part === 1 ? 14 : 25}
                $paddingTop={part === 1 ? 17 : 20}
                $paddingH={part === 1 ? 16 : 26}
                $style={currentPart?.style?.(ratio) ?? {}}
            >
                    {
                        currentPart.title && (
                            <TitleStyled>{currentPart.title}</TitleStyled>
                        )
                    }
                    <Text>{!user.isTargeted && currentPart.textUntarget ? currentPart.textUntarget : currentPart.text}</Text>
                    {part === 1 && (
                        <InfoWrapper $ratio={ratio}>
                            <FlexRowWrapperStyled $ratio={ratio}>
                                <img src={cart} alt=""/>
                                <p><b>инвестиции</b> требуют вложений и приносят еженедельный доход</p>
                            </FlexRowWrapperStyled>
                            <FlexRowWrapperStyled $ratio={ratio}>
                                <img src={money} alt=""/>
                                <p><b>бонусы</b> приносят разовые{'\n'}выплаты </p>
                            </FlexRowWrapperStyled>
                            <FlexRowWrapperStyled $ratio={ratio}>
                                <img src={luck} alt=""/>
                                <p><b>удача</b> может принести как удачу, так и значительные затраты</p>
                            </FlexRowWrapperStyled>
                            <FlexRowWrapperStyled $ratio={ratio}>
                                <img src={play} alt=""/>
                                <p><b>мини-игры</b> дают заработок за прохождение мини-игр</p>
                            </FlexRowWrapperStyled>
                            <FlexRowWrapperStyled $ratio={ratio}>
                                <img src={edu} alt=""/>
                                <p><b>вопросы на засыпку</b> проверяют твою смекалку и вознаграждают её</p>
                            </FlexRowWrapperStyled>
                        </InfoWrapper>
                    )}
                    {part === PARTS.length - 1 ? (
                        <Button mt={part === 1 ? 15 * ratio : 20 * ratio} onClick={handleStart}>
                            Начать
                        </Button>
                    ) : (
                        <ButtonStyled $ratio={ratio} width={100 * ratio} mt={part === 1 ? 15 * ratio : 20 * ratio} onClick={handleNextPart}>
                            <ArrowImg $ratio={ratio}  src={arrow} alt=""/>
                        </ButtonStyled>
                    )}
                    
            </BlockStyled>
        </Modal>
    )
};