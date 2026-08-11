
import React from "react";
import { SCREENS } from "./screens";

const Game2048 = React.lazy(() => import("../components/shared/games/Game2048"));
const GameMatch3 = React.lazy(() => import("../components/shared/games/GameMatch3"));
const GameRunner = React.lazy(() => import("../components/shared/games/GameRunner"));
const GameDoodle = React.lazy(() => import("../components/shared/games/GameDoodle"));
const GameCrossRoad = React.lazy(() => import("../components/shared/games/GameCrossRoad/index"));

export const screens = {
    [SCREENS.GAME2048]: Game2048,
    [SCREENS.GAMEMATCH3]: GameMatch3,
    [SCREENS.GAMERUNNER]: GameRunner,
    [SCREENS.GAMEDOODLE]: GameDoodle,
    [SCREENS.GAMECROSS]: GameCrossRoad,
};
