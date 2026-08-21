import { createContext, useEffect, useContext, useRef, useState } from 'react'
import { FTClient } from 'ft-client';
import WebApp from '@twa-dev/sdk';
import { uid } from 'uid';
import { SCREENS, NEXT_SCREENS } from "../constants/screens";
import { screens } from "../constants/screensComponents";
import { getUrlParam } from "../utils/getUrlParam";
import { useCallback } from 'react';
import { BASE_LOCK_TIMEOUT, INITIAL_STATE, INITIAL_USER, MAX_LOCK_TIMEOUT, MAX_RETRIES, MAX_TURNS_PER_WEEK, RETRY_DELAY } from './constants';
import { ProgressContext } from './ProgressContext';
import { GENDERS } from '../constants/genders';
import turns from '../assets/images/turns.webp';

const getMoscowTime = (date) => {
    const dateNow = date ?? new Date();
    const localOffset = dateNow.getTimezoneOffset();
    const utcPlus3Offset = -180;
    const totalOffset = utcPlus3Offset - localOffset;
    
    return new Date(dateNow.getTime() + totalOffset * 60 * 1000);
}

const getCurrentWeek = () => {
    return 1;

    const today = getMoscowTime();

    if (today < getMoscowTime(new Date(2026, 10, 7))) return 0;
    if (today < getMoscowTime(new Date(2026, 10, 14))) return 1;
    if (today < getMoscowTime(new Date(2026, 10, 21))) return 2;
    if (today < getMoscowTime(new Date(2026, 10, 28))) return 3;
    if (today < getMoscowTime(new Date(2026, 11, 5))) return 4;

    return 5;
}

export const CURRENT_WEEK = getCurrentWeek();

const API_LINK = import.meta.env.VITE_API_URL;
const API_NAME = import.meta.env.VITE_API_NAME;
const API_SHOP_NAME = import.meta.env.VITE_API_SHOP_NAME;
const DEV_ID = import.meta.env.VITE_DEV_ID;

export function ProgressProvider(props) {
    const { children } = props
    const [isLoading, setIsLoading] = useState();
    const [currentScreen, setCurrentScreen] = useState();
    const [openedModal, setOpenedModal] = useState();
    const [user, setUser] = useState(INITIAL_STATE.user);
    const [isFemale, setIsFemale] = useState(true);
    const [gameState, setGameState] = useState({});
    const [isMapHidden, setIsMapHidden] = useState(false);
    const [shopItems, setShopItems] = useState([]);
    const [tgError, setTgError] = useState({isError: false, message: ''});
    const [isFinishedTurnsModal, setFinishedTurnsModal] = useState(!user.lastOpenedCell && user.turns < 1);

    const client = useRef();
    const clientShop = useRef();
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

            setIsFemale(data.gender === GENDERS.Female);

            if (data.facId) {
                updateShopItems(data.facId);
            }

            // check enter on new week
            if (data?.email && !data.weekEnter[`week${CURRENT_WEEK}`]) {
                const newCoins = data.totalCoins + data.newWeekCoins;
                const coinsKoefed = newCoins * data.coinsKoefs;
                //TODO: пересмотреть концепцию выдачи ходов
                const newTurns = data.turns + MAX_TURNS_PER_WEEK;
                const newWeekEnter = {...data.weekEnter, [`week${CURRENT_WEEK}`]: true}
                const updatedData = {
                    totalCoins: coinsKoefed,
                    turns: newTurns,
                    weekEnter: newWeekEnter,
                };

                updateUser(updatedData);
            }

            const urlScreen = getUrlParam('screen');

            if (urlScreen) {
                setCurrentScreen(urlScreen);

                return;
            }

            // if (CURRENT_WEEK > 4 || data.gameProgress?.['12']?.isCompleted) {
            //     if (data.email) {
            //         setCurrentScreen(SCREENS.FINISH);

            //         return;
            //     }
                
            //     setCurrentScreen(SCREENS.PLUG);
            // };

            
            if (!data.email) {
                setCurrentScreen(INITIAL_STATE.currentScreen);
                return;
            } else {
                setCurrentScreen(SCREENS.LOBBY);
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

        clientShop.current = new FTClient(
            API_LINK,
            API_SHOP_NAME
        );

        initProject().catch((e) => console.log(e));

        // if (WebApp) {
        //     WebApp.ready();
        //     WebApp.expand();
        //     WebApp.lockOrientation();
        // }
    }, []);

    const loadRecord = () => {
        const webApp = window?.Telegram?.WebApp;
        let webAppInitData = webApp?.initData;
        let initData = WebApp.initData;

        // return { data: INITIAL_USER };

        if (window?.location?.hostname === 'localhost' || !!getUrlParam('login')) {
            const login = getUrlParam('login') ?? DEV_ID;
            return client.current.findRecord('gameId', login);
        } 

        return { data: INITIAL_USER };

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

    const setUserInfo = (userInfo) => {
        setUser(prev => ({ ...prev, ...userInfo }));
    }

    const formatDate = (date) => new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date).replace(',', '');

    const updateUser = async (changed) => {
        setUserInfo(changed);

        return patchData(changed);
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
        let gameId = uid(8).toLocaleUpperCase();

        if (window?.location?.hostname === 'localhost' || !!getUrlParam('login')) {
            gameId = getUrlParam('login') ?? DEV_ID;
        }

        const data = {
            ...user,
            gameId,
            regDate,
            progressWeek: 1,
            weekEnter: {
                ...user.weekEnter,
                [`week${CURRENT_WEEK}`]: true,
            },
            ...args,
        }
        
        setIsFemale(data.gender === GENDERS.Female);

        setUser(data);

        try {
            if (!recordId.current) {
                const record = await client?.current?.createRecord(data);
                recordId.current = record.id;

                return record;
            } else {
                const record = await client?.current?.patchRecord(recordId.current, data);

                return record; 
            }
            
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

    const updateShopItems = async (facId, info) => {
        try {
            if (!clientShop?.current) {
                return {};
            }
            const result = await clientShop?.current?.findRecord('id', facId ?? user.facId);

            // await new Promise(resolve => setTimeout(resolve, 1000));

            // await clientShop.current.updateRecord(result.id, info);

            const { items } = result?.data ?? [];

            if (!result || !items.length) {
                setShopItems([]);
                return { items: [], isClosed: result && !items.length, recordId: result?.id }
            }
            
            return checkShopItems(items, result?.id);
        } catch (e) {
            console.log(e);
            return ({ 
                items: [], isClosed: true, isError: true,
            })
        }
    };

    const checkShopItems = (items, recordId) => {
        if (!items.length || items.filter(({ week, testAmount }) => week === CURRENT_WEEK && testAmount > 0).length < 1) {
            setShopItems(items);

            return { items: items, isClosed: true, recordId }
        }

        setShopItems(items);
        return { items: items, isClosed: false, recordId };
    }

    const buyItem = async (itemId, facId) => {
        const { id: userId } = user;

        // Максимальный таймаут 15 секунд

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            console.log(`Попытка ${attempt} из ${MAX_RETRIES}`);

        const { isClosed, items, recordId, isError } = await updateShopItems(facId);
        

        if (isClosed || isError) {
            console.log(`попали на isClosed ${isClosed} || isError ${isError}`,);
            return { isClosed: true, isError };
        }

        const itemIndex = items.findIndex(({ id }) => id === itemId);
        if (itemIndex === -1) {
            console.log(`попали на itemIndex || isError`);

            return { isError: true, message: 'Товар не найден' };
        }

        const item = items[itemIndex];
        
        if (item.testAmount < 1) {
            return { isEmpty: true };
        }

        // ===== ПРОВЕРКА БЛОКИРОВКИ С УЧЁТОМ ПОЛЬЗОВАТЕЛЯ =====
        if (item.lockedBy && item.lockedBy !== userId) {
            const lockAge = Date.now() - (item.lockedAt || 0);
            const currentTimeout = item.lockTimeout || BASE_LOCK_TIMEOUT;
            
            // Если блокировка истекла — снимаем
            if (lockAge > currentTimeout) {
                const unlockedItems = items.map((it) => {
                    if (it.id === itemId) {
                        const { lockedBy, lockedAt, lockTimeout, ...rest } = it;
                        return rest;
                    }
                    return it;
                });
                await clientShop.current.patchRecord(recordId, { items: unlockedItems });
                // Продолжаем выполнение (блокировка снята)
            } else {
                // Блокировка активна, ждём
                if (attempt < MAX_RETRIES) {
                    console.log(`Товар занят, ждём ${RETRY_DELAY}мс...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                    continue;
                } else {
                    return { 
                        isError: true, 
                        message: 'Товар временно недоступен, попробуйте позже' 
                    };
                }
            }
        }

        // ===== ЕСЛИ БЛОКИРОВКА ПРИНАДЛЕЖИТ ЭТОМУ ПОЛЬЗОВАТЕЛЮ =====
        if (item.lockedBy === userId) {
            const lockAge = Date.now() - (item.lockedAt || 0);
            const currentTimeout = item.lockTimeout || BASE_LOCK_TIMEOUT;
            
            // Проверяем, не истекла ли наша собственная блокировка
            if (lockAge > currentTimeout) {
                // Если истекла, но это мы — пробуем продлить
                if (currentTimeout < MAX_LOCK_TIMEOUT) {
                    console.log(`Продлеваем блокировку для пользователя ${userId}`);
                    
                    // Увеличиваем таймаут до 15 секунд
                    const extendedItems = items.map((it, idx) => {
                        if (idx === itemIndex) {
                            return {
                                ...it,
                                lockedAt: Date.now(),  // Сбрасываем время
                                lockTimeout: Math.min(currentTimeout + 5000, MAX_LOCK_TIMEOUT)
                            };
                        }
                        return it;
                    });
                    
                    await clientShop.current.patchRecord(recordId, {
                        items: extendedItems,
                    });
                    
                    // Продолжаем выполнение с обновлённой блокировкой
                    console.log(`Блокировка продлена до ${Math.min(currentTimeout + 5000, MAX_LOCK_TIMEOUT)}мс`);
                } else {
                    // Достигнут максимум — снимаем блокировку
                    const unlockedItems = items.map((it) => {
                        if (it.id === itemId) {
                            const { lockedBy, lockedAt, lockTimeout, ...rest } = it;
                            return rest;
                        }
                        return it;
                    });
                    await clientShop.current.patchRecord(recordId, { items: unlockedItems });
                    return { isError: true, message: 'Время блокировки истекло' };
                }
            }
        }

        // ===== ШАГ 3: СТАВИМ БЛОКИРОВКУ (если её нет) =====
        if (!item.lockedBy) {
            const newItemsWithLock = items.map((it, idx) => {
                if (idx === itemIndex) {
                    return {
                        ...it,
                        lockedBy: userId,
                        lockedAt: Date.now(),
                        lockTimeout: BASE_LOCK_TIMEOUT  // Сохраняем таймаут
                    };
                }
                return it;
            });

            try {
                await clientShop.current.patchRecord(recordId, {
                    items: newItemsWithLock,
                });
            } catch (e) {
                console.log('Error setting lock', e);
                return { isError: true, error: e };
            }
        }

        // ===== ШАГ 4: ПРОВЕРЯЕМ, ЧТО БЛОКИРОВКА НАША =====
        const { items: freshItems } = await updateShopItems(facId);
        const freshItem = freshItems.find(({ id }) => id === itemId);
        
        if (!freshItem || freshItem.lockedBy !== userId) {
            if (attempt < MAX_RETRIES) {
                console.log(`Блокировку перехватили, ждём ${RETRY_DELAY}мс...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                continue;
            } else {
                return { 
                    isError: true, 
                    message: 'Не удалось забронировать товар, попробуйте позже' 
                };
            }
        }

        // ===== ШАГ 5: ЕЩЁ РАЗ ПРОВЕРЯЕМ НАЛИЧИЕ =====
        if (freshItem.testAmount < 1) {
            const unlockedItems = freshItems.map((it) => {
                if (it.id === itemId) {
                    const { lockedBy, lockedAt, lockTimeout, ...rest } = it;
                    return rest;
                }
                return it;
            });
            await clientShop.current.patchRecord(recordId, { items: unlockedItems });
            return { isEmpty: true };
        }

        // ===== ШАГ 6: УМЕНЬШАЕМ AMOUNT И СНИМАЕМ БЛОКИРОВКУ =====
        const finalItems = freshItems.map((it) => {
            if (it.id === itemId) {
                const { lockedBy, lockedAt, lockTimeout, ...rest } = it;
                return {
                    ...rest,
                    testAmount: rest.testAmount - 1
                };
            }
            return it;
        });

        try {
            const updatedResult = await clientShop.current.patchRecord(recordId, {
                items: finalItems,
            });

            const { items: updatedItems } = updatedResult?.data ?? [];

            if (!updatedItems || updatedItems.length !== freshItems.length) {
                return { isError: true };
            }

            const purchasedItem = updatedItems.find(({ id }) => id === itemId);

            const newShop = [...user.shop, purchasedItem];
            const newCoins = user.totalCoins - purchasedItem.cost;


            await updateUser({shop: newShop, totalCoins: newCoins});
            //TODO: поменять на обычный amount по всему магаизну
            return { 
                success: true, 
                remainingAmount: purchasedItem?.testAmount ?? 0 
            };

        } catch (e) {
            console.log('Error patch Shop', e);
            return { isError: true, error: e };
        }
    }

    return { isError: true, message: 'Превышено количество попыток' };
    };

    const openCell = async (cellId, cellData = {}) => {
        updateUser({lastOpenedCell: cellId, cells: [...(user.cells ?? []), {name: cellId, start: true, ...cellData}]});
    }

    const finishCell = async (cellId, cellData = {}, changedCoins = 0, additionalData) => {
        const cells = [...(user.cells ?? [])];
        let coins = Math.max(0, user.totalCoins + changedCoins);

        const index = cells.findIndex(cell => cell.name === cellId);

        if (index !== -1) {
            cells[index] = { ...cells[index], ...cellData, finish: true };
        }

        if (user.turns < 1) {
            setFinishedTurnsModal(true);
        }
        updateUser({cells, lastOpenedCell: null, totalCoins: coins, ...additionalData});
    }

    const state = {
        currentScreen,
        next,
        setUserInfo,
        user,
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
        updateShopItems,
        shopItems,
        openCell,
        finishCell,
        buyItem,
        setGameState,
        gameState,
        isFemale,
        setIsMapHidden,
        isMapHidden,
        isFinishedTurnsModal
    }
 
    return (
        <ProgressContext.Provider value={state}>
            {children}
        </ProgressContext.Provider>
    )
}