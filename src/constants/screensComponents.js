
import React from "react";
import { SCREENS } from "./screens";

const Game2048 = React.lazy(() => import("../components/screens/games/Game2048"));
const GameMatch3 = React.lazy(() => import("../components/screens/games/GameMatch3"));
const GameRunner = React.lazy(() => import("../components/screens/games/GameRunner"));
const GameDoodle = React.lazy(() => import("../components/screens/games/GameDoodle"));
const GameCrossRoad = React.lazy(() => import("../components/screens/games/GameCrossRoad"));
const RulesScreen = React.lazy(() => import("../components/screens/RulesScreen"));
const RegScreen = React.lazy(() => import("../components/screens/Registration"));
const SexScreen = React.lazy(() => import("../components/screens/SexScreen"));
const WaitingGameScreen = React.lazy(() => import("../components/screens/Waiting"));
const ProfileScreen = React.lazy(() => import("../components/screens/ProfileScreen"));


export const screens = {
    [SCREENS.GAME2048]: Game2048,
    [SCREENS.GAMEMATCH3]: GameMatch3,
    [SCREENS.GAMERUNNER]: GameRunner,
    [SCREENS.GAMEDOODLE]: GameDoodle,
    [SCREENS.GAMECROSS]: GameCrossRoad,
    [SCREENS.RULES]: RulesScreen,
    [SCREENS.REG]: RegScreen,
    [SCREENS.SEX]: SexScreen,
    [SCREENS.WAITING]: WaitingGameScreen,
    [SCREENS.PROFILE]: ProfileScreen,
};
