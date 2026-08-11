import { useState } from "react"
import { CommonModal } from "../shared/modals";
import { useProgress } from "../../contexts/ProgressContext";
import { Button, IconButton } from "../shared/Button";
import styled from "styled-components";
import { Lobby1 } from "./week1";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { Block } from "../shared/Block";
import { RedStroke1Line } from "../shared/RedStrokes";
import { MarkeredText } from "../shared/Texts";
import { AwardsScreen } from "./AwardsScreen";
import { ProfileScreen } from "./ProfileScreen";
import { AchievesScreen } from "./AchievesScreen";

const ButtonHighlight = styled.div`
    position: absolute;
    height: ${({$ratio}) => $ratio * 60}px;
    width: ${({$ratio}) => $ratio * 60}px;
    border-radius: ${({$ratio}) => $ratio * 15}px;
    box-shadow: 0 0 10px 1400px rgba(100, 88, 144, 0.5);
    z-index: 30;
`;

const AwardsButtonHighlight = styled(ButtonHighlight)`
    top: ${({$ratio}) => $ratio * 86}px;
    right: ${({$ratio}) => $ratio * 18}px;
`;

const ProfileButtonHihlight = styled(ButtonHighlight)`
    top: ${({$ratio}) => $ratio * 25}px;
    left: ${({$ratio}) => $ratio * 18}px;
`;

const AchieveButtonHihlight = styled(ButtonHighlight)`
    top: ${({$ratio}) => $ratio * 25}px;
    right: ${({$ratio}) => $ratio * 18}px;
`;

const BlockStyled = styled(Block)`
    width:  ${({$ratio}) => $ratio * 334}px;

    & > div {
        font-size: var(--font_sm);
        padding: ${({$ratio}) => $ratio * 14}px ${({$ratio}) => $ratio * 14}px;
    }
`;

const Darken = styled.div`
    position: absolute;
    inset: 0;
    z-index: 30;
    background: rgba(100, 88, 144, 0.5);
`;

const ModalStyled = styled.div`
    position: absolute;
    flex-direction: column;
    z-index: 32;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({$ratio}) => $ratio * 18}px;
`;

export const IntroRules = () => {
    const ratio = useSizeRatio();
    const [part, setPart] = useState(0);
    const [isAwards, setIsAwards] = useState(false);
    const [isProfile, setIsProfile] = useState(false);
    const [isAchieves, setIsAchieves] = useState(false);
    const { user, next, updateUser } = useProgress();

    const getText = () => {
        if (part === 0) return (
            <>
                <RedStroke1Line>Это таблица розыгрышей</RedStroke1Line>
                <p>Здесь ты всегда сможешь узнать свои шансы на победу в розыгрыше</p>
            </>
        )
        if (part === 1) return (
            <>
                <RedStroke1Line>Это твой личный кабинет</RedStroke1Line>
                <p>Тут хранится информация, которую ты указал о себе, и{"\u00A0"}
                    <MarkeredText 
                        text="ссылка для приглашения друзей"
                        svgProps={{width: ratio * 222, height: ratio * 16, left: -3 * ratio, top: 4 * ratio}}
                        svgElement={<svg width="100%" height="100%" viewBox="0 0 222 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M191.429 1.22957C180.533 1.14278 169.043 1.01257 157.553 0.969173C151.411 0.925777 145.27 0.925793 139.129 0.795603C134.374 0.70881 129.619 0.535218 124.667 0.491821C111.988 0.274839 40.5979 0.144644 27.7208 0.18804C20.5889 0.18804 13.6552 0.101263 6.52333 0.0144696C4.74036 0.0144696 2.36302 -0.115736 1.76869 0.405023C0.976257 0.925782 -0.704239 1.63329 0.778152 2.0975C2.26056 2.56171 1.76869 5.33328 1.76869 6.40994C1.76869 7.48661 1.76869 7.18327 1.76869 7.71184C1.76869 8.24041 0.778152 11.4118 0.501602 11.9404C0.225037 12.469 -0.608612 13.3806 0.778152 13.7278C1.57059 13.9448 2.56107 14.1183 2.95729 14.3787C3.3535 14.6825 4.34416 14.7693 5.53281 14.7259C8.50444 14.6825 11.476 14.9863 14.4477 14.9429C16.0325 14.9429 17.6174 14.9429 19.0042 15.1599C19.9947 15.3334 21.1833 15.29 22.1738 15.29C32.6736 15.29 101.884 15.3335 112.582 15.3335C119.318 15.3335 125.855 15.4202 132.393 15.4636C143.685 15.5504 155.175 15.4636 166.666 15.5504C174.59 15.5938 182.712 15.6806 190.637 15.8108C193.014 15.8542 195.391 15.7674 197.769 15.7674C202.721 15.7674 207.476 16.0712 212.429 15.9844C213.815 15.941 215.202 15.9844 216.589 15.8976C218.966 15.8108 220.353 15.3768 220.155 14.8561C219.164 12.8598 219.362 10.8636 220.155 8.86735C220.749 7.52206 220.155 6.17677 221.344 4.83148C222.136 4.05034 222.136 3.26919 221.74 2.48805C221.542 2.05409 220.749 1.92391 219.362 1.88052C217.976 1.83712 216.589 1.66353 215.202 1.66353C207.674 1.70693 200.146 1.05598 191.429 1.22957Z" fill="#04E061" fill-opacity="0.3"/>
                                </svg>
                        }
                    />{'\n'}<MarkeredText 
                        text="в игру"
                        svgProps={{width: ratio * 47, height: ratio * 16, left: -3 * ratio, top: 4 * ratio}}
                        svgElement={
                            <svg width="100%" height="100%" viewBox="0 0 47 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40.5278 1.22957C38.221 1.14278 35.7884 1.01257 33.3557 0.969173C32.0555 0.925777 30.7553 0.925793 29.4551 0.795603C28.4485 0.70881 27.4419 0.535218 26.3934 0.491821C23.7091 0.274839 8.59505 0.144644 5.86882 0.18804C4.35892 0.18804 2.89097 0.101263 1.38106 0.0144696C1.00359 0.0144696 0.500275 -0.115736 0.374451 0.405023C0.206684 0.925782 -0.149101 1.63329 0.164742 2.0975C0.478584 2.56171 0.374451 5.33328 0.374451 6.40994C0.374451 7.48661 0.374451 7.18327 0.374451 7.71184C0.374451 8.24041 0.164742 11.4118 0.10619 11.9404C0.0476379 12.469 -0.128853 13.3806 0.164742 13.7278C0.332508 13.9448 0.542206 14.1183 0.626091 14.3787C0.709972 14.6825 0.919704 14.7693 1.17136 14.7259C1.80048 14.6825 2.42961 14.9863 3.05874 14.9429C3.39428 14.9429 3.72981 14.9429 4.0234 15.1599C4.23311 15.3334 4.48475 15.29 4.69446 15.29C6.91738 15.29 21.57 15.3335 23.8349 15.3335C25.2609 15.3335 26.645 15.4202 28.0291 15.4636C30.4198 15.5504 32.8524 15.4636 35.285 15.5504C36.9627 15.5938 38.6823 15.6806 40.36 15.8108C40.8633 15.8542 41.3666 15.7674 41.8699 15.7674C42.9185 15.7674 43.9251 16.0712 44.9736 15.9844C45.2672 15.941 45.5608 15.9844 45.8544 15.8976C46.3577 15.8108 46.6513 15.3768 46.6093 14.8561C46.3996 12.8598 46.4416 10.8636 46.6093 8.86735C46.7352 7.52206 46.6094 6.17677 46.861 4.83148C47.0288 4.05034 47.0288 3.26919 46.9449 2.48805C46.903 2.05409 46.7352 1.92391 46.4416 1.88052C46.148 1.83712 45.8544 1.66353 45.5608 1.66353C43.967 1.70693 42.3732 1.05598 40.5278 1.22957Z" fill="#04E061" fill-opacity="0.3"/>
                            </svg>
                        }
                    /></p>
            </>
        )

        if (part === 2) return (
            <>
                <RedStroke1Line>Это твои достижения</RedStroke1Line>
                <p>Ты будешь собирать их во время прохождения уровней. Мы сохраним их здесь</p>
            </>
        )

        if (part === 3) {
            return (
               <>
                    <RedStroke1Line>Теперь все готово</RedStroke1Line>
                    <p>Начинаем наше путешествие!</p>
                </>
            )
        }
    };

    const handleClick = () => {
        if (part === 0) {
            setIsAwards(true);
        }
        if (part === 1) {
            setIsProfile(true);
        }
        if (part === 2) {
            updateUser({ 
                seenStartInfo: true, 
                achieves: [...user.achieves, 0],
                achievesPoints: (user.achievesPoints ?? 0) + 5,
            });
            setIsAchieves(true);
        }
        if (part === 3) {
            next();
            return;
        }
        setPart(prev => prev + 1);
    };

    return (
        <>
            <Lobby1 isDisabled/>
            {part === 0 && (
                 <AwardsButtonHighlight $ratio={ratio}/>
            )}

            {part === 1 && (
                 <ProfileButtonHihlight $ratio={ratio}/>
            )}

            {part === 2 && (
                <AchieveButtonHihlight $ratio={ratio}/>
            )}

            {part === 3 && (
                <Darken />
            )}
            <ModalStyled  $ratio={ratio}>
                <BlockStyled $ratio={ratio}>
                    {getText()}
                </BlockStyled>
                <Button onClick={handleClick}>{part < 3 ? 'Открыть' : 'В путь'}</Button>
            </ModalStyled>
            {isAwards && <AwardsScreen onClose={() => setIsAwards(false)} />}
            {isProfile && <ProfileScreen onClose={() => setIsProfile(false)} />}
            {isAchieves && <AchievesScreen onClose={() => setIsAchieves(false)} isFirst />}
        </>
    );
};
