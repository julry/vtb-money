import { createContext, useEffect, useContext, useRef, useState } from 'react'
import { FTClient } from 'ft-client';
import WebApp from '@twa-dev/sdk';
import { uid } from 'uid';
import { SCREENS, NEXT_SCREENS } from "../constants/screens";
import { screens } from "../constants/screensComponents";
import { getUrlParam } from "../utils/getUrlParam";
import { useCallback } from 'react';
import { INITIAL_STATE, INITIAL_USER } from './constants';
import { ProgressContext } from './ProgressContext';

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

const API_LINK = import.meta.env.VITE_API_URL;
const API_NAME = import.meta.env.VITE_API_NAME;
const DEV_ID = import.meta.env.VITE_DEV_ID;

export function ProgressProvider(props) {
    const { children } = props
    const [isLoading, setIsLoading] = useState();
    const [currentScreen, setCurrentScreen] = useState(getUrlParam('screen') ?? SCREENS.RULES);
    const [openedModal, setOpenedModal] = useState();
    const [user, setUser] = useState(INITIAL_STATE.user);
    const [tgError, setTgError] = useState({isError: false, message: ''});

    const client = useRef();
    const recordId = useRef();
    const isDesktop = useRef(false);
    const tgInfo = useRef();

    const setUserBdData = (record = {}) => {
        recordId.current = record?.id;
        const { data = INITIAL_USER } = record ?? {};

        setUserInfo(data);
    }

    const initProject = async () => {
        setIsLoading(true);
        try {
            const info = await loadRecord();

            // if (isDesktop.current) {
            //     setCurrentScreen(SCREENS.DESKTOP);

            //     return;
            // }

            if (!info) {
                setTgError({isError: true, message: ''});
            }

            tgInfo.current = info?.systemData ?? {};

            setUserBdData(info ?? {});

            const {data = {}} = info ?? {};

            // if (CURRENT_WEEK > 4 || data.gameProgress?.['12']?.isCompleted) {
            //     if (data.email) {
            //         setCurrentScreen(SCREENS.FINISH);

            //         return;
            //     }
                
            //     setCurrentScreen(SCREENS.PLUG);
            // };

            // if (!data.email) {
            //     setCurrentScreen(INITIAL_STATE.currentScreen);
            //     return;
            // } else if (!data.seenStartInfo) {
            //     setCurrentScreen(CURRENT_WEEK > 0 ? SCREENS.INTRO_RULES : SCREENS.WAITING);

            //     return;
            // } else {
            //     setCurrentScreen(SCREENS[`LOBBY${Math.max(data.currentWeek, 1)}`]);
            // }
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

        // if (window?.location?.hostname === 'localhost' || !!getUrlParam('login')) {
        //     const login = getUrlParam('login') ?? DEV_ID;
        //     return client.current.findRecord('id', login);
        // } 

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
    

        // await updateUser(
        //     {            }
        // );

    }


    const updateUser = async (changed) => {
        setUserInfo(prev => ({...prev, changed}));

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
            currentWeek: 1,
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

    const handleOpenModal = useCallback(({Component, closeCallback, nextOpenedModalProps, blurSize = 20, isBlurTransitionDisabled = false}) => {
        setOpenedModal({isOpen: true, component: Component, closeCallback, nextOpenedModalProps, blurSize, isBlurTransitionDisabled});
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
        currentScreen,
        next,
        setUserInfo,
        user,
        endGame,
        updateUser,
        registrateUser,
        isLoading,
        patchData,
        handleOpenModal,
        handleCloseModal,
        tgError,
        checkEmailRegistrated,
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