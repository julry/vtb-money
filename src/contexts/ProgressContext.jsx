import { createContext, useEffect, useContext, useRef, useState } from 'react'
import { FTClient } from 'ft-client';
import WebApp from '@twa-dev/sdk';
import { uid } from 'uid';
import { SCREENS, NEXT_SCREENS } from "../constants/screens";
import { screens } from "../constants/screensComponents";
import { getUrlParam } from "../utils/getUrlParam";
import { useCallback } from 'react';

const INITIAL_DAY_ACTIVITY = {
    completedAt: null,
    isCompleted: false,
}

const INITIAL_ACTIVITY_DATA = {
    1: INITIAL_DAY_ACTIVITY,
    2: INITIAL_DAY_ACTIVITY,
    3: INITIAL_DAY_ACTIVITY,
    4: INITIAL_DAY_ACTIVITY,
    5: INITIAL_DAY_ACTIVITY,
    6: INITIAL_DAY_ACTIVITY,
    7: INITIAL_DAY_ACTIVITY,
    8: INITIAL_DAY_ACTIVITY,
    9: INITIAL_DAY_ACTIVITY,
    10: INITIAL_DAY_ACTIVITY,
    11: INITIAL_DAY_ACTIVITY,
    12: INITIAL_DAY_ACTIVITY,
};

const INITIAL_ENTER_DATA = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
}

const GAME_COINS_INFO = {
    coins: 0, // клеточные
    coinsInfinity: 0, // из меню
    hasPlayed: false // играл ли вообще 
}

const MAX_TURNS_PER_WEEK = 5;
const INITIAL_COINS = 1000;

const INITIAL_USER = {
    id: '',
    name: '',
    surname: '',
    email: '',
    university: '',
    faculty: '',
    isTargeted: false,
    seenStartInfo: false,

    coins: INITIAL_COINS,
    progressWeek: 1, //на какой ща неделе
    //Выбранные клетки по неделям
    cells: [],
    regDate: '',
    //Собранные Множители кэфа
    coinsKoefs: 1,
    //Прибавка в начале недели
    newWeekCoins: 0,
    //Количество ходов
    weekTurns: [MAX_TURNS_PER_WEEK, MAX_TURNS_PER_WEEK, MAX_TURNS_PER_WEEK, MAX_TURNS_PER_WEEK],
};

const getMoscowTime = (date) => {
    const dateNow = date ?? new Date();
    const localOffset = dateNow.getTimezoneOffset();
    const utcPlus3Offset = -180;
    const totalOffset = utcPlus3Offset - localOffset;
    
    return new Date(dateNow.getTime() + totalOffset * 60 * 1000);
}

const getCurrentWeek = () => {
    return 4;

    const today = getMoscowTime();

    if (today < getMoscowTime(new Date(2025, 10, 10))) return 0;
    if (today < getMoscowTime(new Date(2025, 10, 27))) return 1;
    if (today < getMoscowTime(new Date(2025, 10, 24))) return 2;
    if (today < getMoscowTime(new Date(2025, 11, 1))) return 3;
    if (today < getMoscowTime(new Date(2025, 11, 8))) return 4;

    return 5;
}

export const CURRENT_WEEK = getCurrentWeek();

const INITIAL_STATE = {
    screen: SCREENS.GAME2048,
    points: 0,
    weekPoints: 0,
    user: INITIAL_USER,
    passedWeeks: [],
}

const ProgressContext = createContext(INITIAL_STATE);

const API_LINK = import.meta.env.VITE_API_URL;
const API_NAME = import.meta.env.VITE_API_NAME;
const DEV_ID = import.meta.env.VITE_DEV_ID;

export function ProgressProvider(props) {
    const { children } = props
    const [isLoading, setIsLoading] = useState();
    const [currentScreen, setCurrentScreen] = useState(getUrlParam('screen') ?? INITIAL_STATE.screen);
    const [openedModal, setOpenedModal] = useState();
    const [totalPoints, setTotalPoints] = useState(INITIAL_STATE.totalPoints);
    const [user, setUser] = useState(INITIAL_STATE.user);
    const [newAchieve, setNewAchieve] = useState();
    const [tgError, setTgError] = useState({isError: false, message: ''});
    const screen = screens[currentScreen];

    const client = useRef();
    const recordId = useRef();
    const isDesktop = useRef(false);
    const tgInfo = useRef();

    const setUserBdData = (record = {}) => {
        recordId.current = record?.id;
        const { data = INITIAL_USER, scriptData = {}} = record ?? {};
        const points = data.achievesPoints + data.regPoints;
        const pointsName = data.isTargeted ? 'totalPointsTarget' : 'totalPointsNotTarget';

        setUserInfo(data);
        setTotalPoints(scriptData?.[pointsName] ?? points);
    }

    const initProject = async () => {
        setIsLoading(true);
        try {
            const info = await loadRecord();

            if (isDesktop.current) {
                setCurrentScreen(SCREENS.DESKTOP);

                return;
            }

            if (!info) {
                setTgError({isError: true, message: ''});
            }

            tgInfo.current = info?.systemData ?? {};

            setUserBdData(info ?? {});

            const {data = {}} = info ?? {};

            const checkDay = getMoscowTime().getDay();

            if (CURRENT_WEEK > 0 && data.isTargeted && !data?.[`week${CURRENT_WEEK}EnterPoints`]?.[checkDay]) {
                await updateUser({
                    [`week${CURRENT_WEEK}Points`]: (data[`week${CURRENT_WEEK}Points`] ?? 0) + 10,
                    [`week${CURRENT_WEEK}EnterPoints`]: {
                        ...(data[`week${CURRENT_WEEK}EnterPoints`] ?? INITIAL_ENTER_DATA), 
                        [checkDay]: 10,
                    }
                });
            }

            const screenParam = getUrlParam('screen');

            if (screenParam) {
                if (screenParam.includes('LEVEL') || screenParam.includes('LOBBY')) {
                    let week = 1;
                    let level = 0;
                    if (screenParam.includes('LEVEL')) {
                        [week, level] = screenParam.split('LEVEL')[1];
                    }
                    if (screenParam.includes('LOBBY')) {
                        week = +screenParam.split('LOBBY')[1] - 1;
                        if (week > 0) {
                            level = 4;
                        }
                    }
                    const gameProgress = {...data.gameProgress};

                    for (let i=1; i < ((+week - 1) * 3 + +level); i++) {
                        gameProgress[i] = {isCompleted: true};
                    }
                   setUserInfo({gameProgress})
                }
                setCurrentScreen(screenParam);

                return;
            }

            if (CURRENT_WEEK > 4 || data.gameProgress?.['12']?.isCompleted) {
                if (data.email) {
                    setCurrentScreen(SCREENS.FINISH);

                    return;
                }
                
                setCurrentScreen(SCREENS.PLUG);
            };

            if (!data.email) {
                setCurrentScreen(INITIAL_STATE.screen);
                return;
            } else if (!data.seenStartInfo) {
                setCurrentScreen(CURRENT_WEEK > 0 ? SCREENS.INTRO_RULES : SCREENS.WAITING);

                return;
            } else {
                setCurrentScreen(SCREENS[`LOBBY${Math.max(data.currentWeek, 1)}`]);
            }
        } catch (e) {
            setTgError({isError: true, message: e.message});
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        client.current = new FTClient(
            API_LINK,
            API_NAME
        );

        initProject().catch((e) => console.log(e));

        // if (WebApp) {
        //     WebApp.ready();
        //     WebApp.expand();
        //     WebApp.lockOrientation();
        // }
    }, []);

    const loadRecord = () => {
        // const webApp = window?.Telegram?.WebApp;
        // let webAppInitData = webApp?.initData;
        // let initData = WebApp.initData;

        //TODO: remove
        return { data: INITIAL_USER };

        if (window?.location?.hostname === 'localhost' || !!getUrlParam('login')) {
            const login = getUrlParam('login') ?? DEV_ID;
            return client.current.findRecord('id', login);
        } 

        console.log('webAppInitData', webAppInitData);

        if (
            WebApp?.platform?.toLowerCase()?.includes('web') || WebApp?.platform?.toLowerCase()?.includes('desktop')
            || webApp?.platform?.toLowerCase()?.includes('web') || webApp?.platform?.toLowerCase()?.includes('desktop')
        ) {
                isDesktop.current = true;

                return {};
        }
    
        if (webAppInitData) {
            return client.current.getTgRecord(webAppInitData);
        } else if (initData) {
            return client.current.getTgRecord(initData);
        } else if (!window?.Telegram) {
            console.error('Telegram не определен')

            throw new Error('Telegram не определен')
        } else if (!window?.Telegram?.WebApp) {
            console.error('Webapp не определен')

            throw new Error('Webapp не определен')
        } else {
            console.error('В WebApp нет данных пользователя')

            throw new Error ('В WebApp нет данных пользователя');
        }
    }

    const next = (customScreen) => {
        const nextScreen = customScreen ?? NEXT_SCREENS[currentScreen];

        if (!nextScreen) {
            return
        }

        setCurrentScreen(nextScreen);
    }

    const setUserInfo = (user) => {
        setUser(prev => ({ ...prev, ...user }));
    }

    const formatDate = (date) => new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date).replace(',', '');

    const endGame = async ({ week, level, achieve, isEndWeek}) => {
        const hasAchieve = achieve !== undefined;

        const achieveCost = hasAchieve ? 5 : 0;
        const totalGamePoints = user?.isTargeted ? 10 : 0;

        if (user.gameProgress?.[level]?.isCompleted) return;

        const endTimeMsc = getMoscowTime();

        if (hasAchieve) {
            setNewAchieve(achieve);
        }

        await updateUser(
            {
                [`week${week}Points`]: (user[`week${week}Points`] ?? 0) + totalGamePoints,
                gameProgress: { ...(user.gameProgress ?? INITIAL_ACTIVITY_DATA), [level]: {
                    isCompleted: true,
                    completedAt: formatDate(endTimeMsc),
                }},
                achievesPoints: (user.achievesPoints ?? 0) + achieveCost,
                achieves: hasAchieve ? [...user.achieves, achieve] : user.achieves,
                passedWeeks: isEndWeek ? [...(user.passedWeeks ?? []), week] : user.passedWeeks,
                currentWeek: isEndWeek ? Math.min(user.currentWeek + 1, 4) : user.currentWeek,
            }
        );

       await updateTotalPoints();
    }

    const updateTotalPoints = async () => {
        const data = await loadRecord();
        const pointsName = data.isTargeted ? 'totalPointsTarget' : 'totalPointsNotTarget';

        if (data?.scriptData?.[pointsName]) {
            setTotalPoints(data?.scriptData?.[pointsName]);
        } else {
            setTotalPoints(user.achievesPoints + user.regPoints);
        }
    };

    const updateUser = async (changed) => {
        setUserInfo(changed);

        // return patchData(changed);
    }

    const patchData = async (changed) => {
        if (!recordId.current) return;
        
        try {
            const result = await client.current?.patchRecord(recordId.current, changed);

            return result;
        } catch (e) {
            console.log(e);

            return { isError: true };
        }
    }

    const registrateAchieve = (id, isUpdating) => {
        setNewAchieve(id);
        if (isUpdating) updateUser({achieves: [...user.achieves, id], achievesPoints: (user.achievesPoints ?? 0) + 5})
    };

    const registrateUser = async (args) => {
        const regDate = formatDate(getMoscowTime());
        let id = uid(8);

        if (window?.location?.hostname === 'localhost' || !!getUrlParam('login')) {
            id = getUrlParam('login') ?? DEV_ID;
        }

        const checkDay = getMoscowTime().getDay();

        const hasGivenEnterPoints = args.isTargeted && CURRENT_WEEK > 0;

        const data = {
            ...user,
            achieves: [],
            regPoints: 10,
            passedWeeks: [],
            id,
            regDate,
            gameProgress: INITIAL_ACTIVITY_DATA,
            currentWeek: 1,
            week1EnterPoints: INITIAL_ENTER_DATA,
            week2EnterPoints: INITIAL_ENTER_DATA,
            week3EnterPoints: INITIAL_ENTER_DATA,
            week4EnterPoints: INITIAL_ENTER_DATA,
            ...(hasGivenEnterPoints ? {
                [`week${CURRENT_WEEK}EnterPoints`]: {
                ...INITIAL_ENTER_DATA, 
                [checkDay]: 10,
            },
            [`week${CURRENT_WEEK}Points`]: 10,
            } : {}),
            ...args,
        }

        setUser(data);

        try {
            const record = await client?.current?.patchRecord(recordId.current, data);

            return record; 
        } catch (e) {
            return {isError: true}
        }
    };

    const checkEmailRegistrated = async (email) =>{
        const record = await client?.current?.findRecord('email', email);

        return !!record?.id;
    };

    const handleOpenModal = useCallback(({Component, closeCallback, nextOpenedModalProps, isBlurTransitionDisabled = false}) => {
        setOpenedModal({isOpen: true, component: Component, closeCallback, nextOpenedModalProps, isBlurTransitionDisabled});
    }, []);

    const handleCloseModal = () => {
        openedModal?.closeCallback?.();

        if (openedModal?.nextOpenedModalProps) {
            setOpenedModal({isOpen: true, ...openedModal?.nextOpenedModalProps});

            return
        }
        setOpenedModal(prev => ({isOpen: false, isBlurTransitionDisabled: prev.isBlurTransitionDisabled}));
    }

    const state = {
        screen,
        currentScreen,
        next,
        setUserInfo,
        user,
        endGame,
        updateUser,
        registrateUser,
        totalPoints,
        isLoading,
        patchData,
        handleOpenModal,
        handleCloseModal,
        tgError,
        checkEmailRegistrated,
        registrateAchieve,
        setNewAchieve,
        newAchieve,
        updateTotalPoints,
        tgInfo,
        setOpenedModal,
        openedModal,
    }

    return (
        <ProgressContext.Provider value={state}>
            {children}
        </ProgressContext.Provider>
    )
}

export function useProgress() {
    return useContext(ProgressContext)
}
