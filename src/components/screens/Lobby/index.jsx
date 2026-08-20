import styled from "styled-components";
import { useProgress } from "../../../hooks/useProgress";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { BackHeader } from "../../shared/BackHeader";
import { Button } from "../../shared/Button";
import { FlexWrapper } from "../../shared/ContentWrapper";
import { SCREENS } from "../../../constants/screens";
import profile from '../../../assets/images/profile.webp';
import rules from '../../../assets/images/rules.webp';
import turns from '../../../assets/images/turns.webp';
import shop from '../../../assets/images/shop.webp';
import games from '../../../assets/images/games.webp';
import PathMap from './Board';
import {useMemo, useEffect, useState} from 'react';
import NumberPicker from "./NumberPicker";
import { GAME_CELLS } from "./constants";

const ButtonStyled = styled(Button)`
    position: absolute;
    top: ${({$top}) => $top}px;
    left: -4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: ${({$ratio}) => $ratio * 58}px;
    height: ${({$ratio}) => $ratio * 51}px;
    background-color: rgba(219, 237, 255, 0.8);
    z-index: 5;

    & img {
        width: ${({$ratio}) => $ratio * 48}px;
        height: ${({$ratio}) => $ratio * 40}px;
    }
`;

const Lobby = () => {
    const ratio = useSizeRatio();
    const { next, user, handleOpenModal } = useProgress();
    //мб перенести в отдельный стейт
    const lastCell = useMemo(() => {
        if (user.lastOpenedCell) {
            return user.lastOpenedCell
        };

        if (user.cells.length > 0) {
            return user.cells[user.cells?.length - 1].name;
        }
       
       return 'start-1';
    }, [user.cells, user.lastOpenedCell]);

    const [cellIndex, setCellIndex] = useState(GAME_CELLS.findIndex(({id}) => id === lastCell));

    useEffect(() => {
        const preventDefault = (e) => e.preventDefault();
        
        document.body.addEventListener('touchmove', preventDefault, { passive: false });
        
        return () => document.body.removeEventListener('touchmove', preventDefault);
    }, []);

    useEffect(() => {
        if (user.lastOpenedCell) {
            // компонент который типа "походи сначала"

            // handleOpenModal({
            //     Component: 
            // })
        };
    }, []);

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
            <PathMap centerCellId={lastCell} cellIndex={cellIndex}/>
            <NumberPicker onChange={(number) => setCellIndex(prev => prev + number)}/>
        </FlexWrapper>
    )
};

export default Lobby;
