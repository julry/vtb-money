import {SCREENS} from '../constants/screens';
import {GENDERS} from '../constants/genders';

export const GAME_COINS_INFO = {
    coins: 0, // клеточные за все врем
    coinsInfinity: 0, // из меню за врем
    hasPlayed: false // играл ли вообще 
}

export const MAX_TURNS_PER_WEEK = 5;
export const INITIAL_COINS = 1000;

export const INITIAL_USER = {
    id: '',
    name: '',
    surname: '',
    email: '',
    university: '',
    faculty: '',
    isTargeted: false,
    seenStartInfo: false,
    gender: GENDERS.Female,

    totalCoins: INITIAL_COINS,
    //На какой ща неделе
    progressWeek: 1, 
    //Выбранные клетки по неделям
    cells: [],
    regDate: '',
    //Собранные Множители кэфа
    coinsKoefs: 1,
    //Прибавка в начале недели
    newWeekCoins: 0,
    //Количество ходов
    turns: MAX_TURNS_PER_WEEK,
    //Последняя открытая клетка
    lastOpenedCell: '',
    //Открывал ли профиль
    hasWatchedProfile: false,
    //Покупки
    shop: [],
    //Tickets
    bilets: 0,
    runner: GAME_COINS_INFO,
    2048: GAME_COINS_INFO,
    crossyroad: GAME_COINS_INFO,
    'match-3': GAME_COINS_INFO,
};

export const INITIAL_STATE = {
    currentScreen: SCREENS.RULES,
    points: 0,
    weekPoints: 0,
    user: INITIAL_USER,
    passedWeeks: [],
}
