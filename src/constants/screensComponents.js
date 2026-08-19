
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
const ShopScreen = React.lazy(() => import("../components/screens/ShopScreen"));
const IntroScreen = React.lazy(() => import("../components/screens/Intro"));
const IntroRegScreen = React.lazy(() => import("../components/screens/IntroReg"));
const MiniGamesScreen = React.lazy(() => import("../components/screens/MiniGamesScreen"));
const LobbyScreen = React.lazy(() => import("../components/screens/Lobby"));


export const screens = {
    [SCREENS.INTRO]: IntroScreen,
    [SCREENS.INTROREG]: IntroRegScreen,
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
    [SCREENS.STORE]: ShopScreen,
    [SCREENS.MINIGAMES]: MiniGamesScreen,
    [SCREENS.LOBBY]: LobbyScreen,
};
