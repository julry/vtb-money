import React from "react";
import { SCREENS } from "./screens"; // или откуда у тебя SCREENS

const loadIntroReg     = () => import("../components/screens/IntroReg");
const loadReg          = () => import("../components/screens/Registration");
const loadSex          = () => import("../components/screens/SexScreen");
const loadWaiting      = () => import("../components/screens/Waiting");
const loadProfile      = () => import("../components/screens/ProfileScreen");
const loadShop         = () => import("../components/screens/ShopScreen");
const loadMiniGames    = () => import("../components/screens/MiniGamesScreen");
const loadLobby        = () => import("../components/screens/Lobby");
const loadRules        = () => import("../components/screens/RulesScreen");

const loadGame2048     = () => import("../components/screens/games/Game2048");
const loadGameMatch3   = () => import("../components/screens/games/GameMatch3");
const loadGameRunner   = () => import("../components/screens/games/GameRunner");
const loadGameDoodle   = () => import("../components/screens/games/GameDoodle");
const loadGameCrossRoad = () => import("../components/screens/games/GameCrossRoad");

export const screens = {
  [SCREENS.INTRO]:     React.lazy(() => import("../components/screens/Intro")), // оставляем как было
  [SCREENS.INTROREG]:  React.lazy(loadIntroReg),
  [SCREENS.REG]:       React.lazy(loadReg),
  [SCREENS.SEX]:       React.lazy(loadSex),
  [SCREENS.WAITING]:   React.lazy(loadWaiting),
  [SCREENS.PROFILE]:   React.lazy(loadProfile),
  [SCREENS.STORE]:     React.lazy(loadShop),
  [SCREENS.MINIGAMES]: React.lazy(loadMiniGames),
  [SCREENS.LOBBY]:     React.lazy(loadLobby),
  [SCREENS.RULES]:     React.lazy(loadRules),

  [SCREENS.GAME2048]:  React.lazy(loadGame2048),
  [SCREENS.GAMEMATCH3]:React.lazy(loadGameMatch3),
  [SCREENS.GAMERUNNER]:React.lazy(loadGameRunner),
  [SCREENS.GAMEDOODLE]:React.lazy(loadGameDoodle),
  [SCREENS.GAMECROSS]: React.lazy(loadGameCrossRoad),
};

export const preload = {
  introReg:     loadIntroReg,
  reg:          loadReg,
  sex:          loadSex,
  waiting:      loadWaiting,
  profile:      loadProfile,
  shop:         loadShop,
  miniGames:    loadMiniGames,
  lobby:        loadLobby,
  rules:        loadRules,

  game2048:     loadGame2048,
  gameMatch3:   loadGameMatch3,
  gameRunner:   loadGameRunner,
  gameDoodle:   loadGameDoodle,
  gameCrossRoad:loadGameCrossRoad,
};
