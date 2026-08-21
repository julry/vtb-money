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
import {UnfinishedModal} from './UnfinishedModal';
import { CellModal } from "../../shared/modals/CellModal";

const ButtonStyled = styled(Button)`
    position: absolute;
    top: ${({$top}) => $top}px;
    left: -4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: ${({$ratio}) => $ratio * 58}px;
    height: ${({$ratio}) => $ratio * 51}px;
    background-color: rgba(219, 237, 255, 0.8);
    z-index: calc(var(--header-z-index) + 1);

    & img {
        width: ${({$ratio}) => $ratio * 48}px;
        height: ${({$ratio}) => $ratio * 40}px;
    }
`;

const TurnsButton = styled(Button)`
    position: absolute;
    font-size: ${({$ratio}) => $ratio * 17}px;
    top: ${({$ratio}) => $ratio * 68}px;
    right: -1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    justify-content: flex-start;
    max-height: ${({$ratio}) => $ratio * 42}px;
    z-index: var(--header-z-index);

    & img {
        width:${({$ratio}) => $ratio * 37}px;
        height:${({$ratio}) => $ratio * 37}px;
    }
`;

const Lobby = () => {
    const ratio = useSizeRatio();
    const { next, user, handleOpenModal, updateUser, setGameState } = useProgress();
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
    const [isUnfinishedModal, setIsUnfinishedModal] = useState(!!user.lastOpenedCell);

    useEffect(() => {
        const preventDefault = (e) => e.preventDefault();
        
        document.body.addEventListener('touchmove', preventDefault, { passive: false });
        
        return () => document.body.removeEventListener('touchmove', preventDefault);
    }, []);

    const handleClose = () => {
        const lastCell = GAME_CELLS.find(({id}) => id === user.lastOpenedCell);
        setGameState(lastCell);
        
        handleOpenModal({
            Component: <CellModal cell={lastCell} />
        });

        setIsUnfinishedModal(false);
    };

    const handleMakeTurn = (number) => {
        if (user.turns < 1) {
            return;
        }

        updateUser({turns: user.turns - 1});
        setCellIndex(prev => prev + number)
    }

    return (
        <FlexWrapper>
            <BackHeader isShownExit={false} isShownCoins/>
            <TurnsButton $ratio={ratio} width={user.turns > 9 ? 80 : 65}>
                <img src={turns} alt="Ходов"/>
                <p>{user.turns}</p>
            </TurnsButton>
            <ButtonStyled $ratio={ratio} $top={57 * ratio} type="transparent" onClick={() => next(SCREENS.PROFILE)}>
                <img src={profile} alt="Профиль"/>
            </ButtonStyled>
            <ButtonStyled $ratio={ratio} $top={118 * ratio} type="transparent" onClick={() => next(SCREENS.MINIGAMES)}>
                <img src={games} alt="Мини-игры"/>
            </ButtonStyled>
            {user.isTargeted && (
                <ButtonStyled $ratio={ratio} $top={179 * ratio} type="transparent" onClick={() => next(SCREENS.STORE)}>
                    <img src={shop} alt="Магазин"/>
                </ButtonStyled>
            )}
            <ButtonStyled $ratio={ratio}  $top={(user.isTargeted ? 240 : 179) * ratio} type="transparent" onClick={() => next(SCREENS.RULES)}>
                <img src={rules} alt="Правила"/>
            </ButtonStyled>
            <PathMap isBlured={isUnfinishedModal} centerCellId={lastCell} cellIndex={cellIndex}/>
            <NumberPicker isBlured={isUnfinishedModal} onChange={handleMakeTurn}/>
            {isUnfinishedModal && (
                <UnfinishedModal lastOpenedCell={user.lastOpenedCell} onClose={handleClose}/>
            )}
        </FlexWrapper>
    )
};

export default Lobby;
