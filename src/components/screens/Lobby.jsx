import styled from "styled-components";
import { useProgress } from "../../hooks/useProgress";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { BackHeader } from "../shared/BackHeader";
import { Button } from "../shared/Button";
import { FlexWrapper } from "../shared/ContentWrapper";
import { SCREENS } from "../../constants/screens";
import profile from '../../assets/images/profile.webp';
import rules from '../../assets/images/rules.webp';
import turns from '../../assets/images/turns.webp';
import shop from '../../assets/images/shop.webp';
import games from '../../assets/images/games.webp';

const ButtonStyled = styled(Button)`
    position: absolute;
    top: ${({$top}) => $top}px;
    left: -4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: ${({$ratio}) => $ratio * 58}px;
    height: ${({$ratio}) => $ratio * 51}px;
    background-color: rgba(219, 237, 255, 0.8);

    & img {
        width: ${({$ratio}) => $ratio * 48}px;
        height: ${({$ratio}) => $ratio * 40}px;
    }
`;

const Lobby = () => {
    const ratio = useSizeRatio();
    const { next, user } = useProgress();
    // проверить целевой ли для доступа в магаз
    return (
        <FlexWrapper>
            <BackHeader isShownExit={false} isShownCoins/>
            <ButtonStyled $ratio={ratio} $top={57 * ratio} type="transparent" onClick={() => next(SCREENS.PROFILE)}>
                <img src={profile} alt="Профиль"/>
            </ButtonStyled>
            <ButtonStyled $ratio={ratio} $top={118 * ratio} type="transparent" onClick={() => next(SCREENS.MINIGAMES)}>
                <img src={games} alt="Мини-игры"/>
            </ButtonStyled>
            <ButtonStyled $ratio={ratio} $top={179 * ratio} type="transparent" onClick={() => next(SCREENS.STORE)}>
                <img src={shop} alt="Магазин"/>
            </ButtonStyled>
            <ButtonStyled $ratio={ratio}  $top={240 * ratio} type="transparent" onClick={() => next(SCREENS.RULES)}>
                <img src={rules} alt="Правила"/>
            </ButtonStyled>
        </FlexWrapper>
    )
};

export default Lobby;
