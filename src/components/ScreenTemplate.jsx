import { useEffect, useRef, useState } from 'react';
import {AnimatePresence} from 'framer-motion';
import styled from 'styled-components';
import { SizeRatioContextProvider } from '../contexts/SizeRatioContext';
// import WebApp from '@twa-dev/sdk';

import { useProgress } from '../hooks/useProgress';
import { SCREENS } from '../constants/screens';
import { Button } from './shared/Button';

export const TARGET_WIDTH = 375;
export const TARGET_HEIGHT = 677;

export const MIN_MOCKUP_WIDTH = 450;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;

    @media (min-width: ${MIN_MOCKUP_WIDTH}px) {
        padding: 20px;
    }
`;

const WrapperInner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const Content = styled.div`
    --content-width: 88vw;
    --border-radius-xl: ${({$sizeRatio}) => $sizeRatio * 100}px;
    --border-radius-lg: ${({$sizeRatio}) => $sizeRatio * 20}px;
    --border-radius-md: ${({$sizeRatio}) => $sizeRatio * 15}px;
    --border-radius-sm: ${({$sizeRatio}) => $sizeRatio * 5}px;
    --spacing_x1: ${({$sizeRatio}) => $sizeRatio * 4}px;
    --spacing_x2: ${({$sizeRatio}) => $sizeRatio * 8}px;
    --spacing_x3: ${({$sizeRatio}) => $sizeRatio * 12}px;
    --spacing_x4: ${({$sizeRatio}) => $sizeRatio * 16}px;
    --spacing_x5: ${({$sizeRatio}) => $sizeRatio * 20}px;
    --spacing_x6: ${({$sizeRatio}) => $sizeRatio * 24}px;
    --spacing_x7: ${({$sizeRatio}) => $sizeRatio * 28}px;
    --spacing_x8: ${({$sizeRatio}) => $sizeRatio * 32}px;
    --spacing_x10: ${({$sizeRatio}) => $sizeRatio * 40}px;
    --font_xl:  ${({$sizeRatio}) => $sizeRatio * 26}px;
    --font_lg:  ${({$sizeRatio}) => $sizeRatio * 24}px;
    --font_md:  ${({$sizeRatio}) => $sizeRatio * 16}px;
    --font_sm:  ${({$sizeRatio}) => $sizeRatio * 14}px;
    --font_xs:  ${({$sizeRatio}) => $sizeRatio * 12}px;
    --font_xxs:  ${({$sizeRatio}) => $sizeRatio * 10}px;
    
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    min-height: 100%;
    ${({$shouldUseTransform}) => $shouldUseTransform ? 'transform: translate(0, 0);' : ''};
    white-space: pre-line;
    font-size: var(--font_md);
    background: #5F83FF;
    background: linear-gradient(197.56deg, #ADCFF5 0%, #5F83FF 50%, #958DEE 85.2%), #FFFFFF;

    @media (min-width: ${MIN_MOCKUP_WIDTH}px) {
        overflow: hidden;
        max-width: ${({$sizeRatio}) => `calc(${TARGET_WIDTH}px * ${$sizeRatio})`};
        max-height: ${({$sizeRatio}) => `calc(${TARGET_HEIGHT}px * ${$sizeRatio})`};
        min-height: ${({$sizeRatio}) => `calc(${TARGET_HEIGHT}px * ${$sizeRatio})`};
        border: 2px solid #000000;
        border-radius: 10px;
        box-sizing: content-box;
        --content-width: ${({$sizeRatio}) => $sizeRatio * 330}px;
    }
`;

const CookieInfo = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: ${({$sizeRatio}) => $sizeRatio * 325}px;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    z-index: 100000;

    background: rgba(255, 255, 255, 0.25);
    border: 0.520833px solid rgba(0, 76, 218, 0.5);
    box-shadow: 0.694444px 0.694444px 1.38889px rgba(1, 32, 103, 0.8), inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.4);
    border-radius: 17px 17px 0px 0px;
    backdrop-filter: blur(5px);
    gap: ${({$sizeRatio}) => $sizeRatio * 10}px;
    font-size: ${({$sizeRatio}) => $sizeRatio * 13}px;
    color: var(--color-accent);
    padding: ${({$sizeRatio}) => $sizeRatio * 15}px ${({$sizeRatio}) => $sizeRatio * 20}px ${({$sizeRatio}) => $sizeRatio * 18}px;

    & button {
        height: ${({$sizeRatio}) => $sizeRatio * 31}px;
        min-height: ${({$sizeRatio}) => $sizeRatio * 31}px;
    }
`;

export function ScreenTemplate(props) {
    const {currentScreen, openedModal} = useProgress();
    const [isShowCookies, setIsShowCookies] = useState(false);
    const { children } = props;
    const wrapperRef = useRef();
    const wrapperInnerRef = useRef();
    const shouldUseTransform = currentScreen !== SCREENS.DESKTOP;

    useEffect(() => { 
        let cookieAgree;

        // if (WebApp.DeviceStorage) {
        //     cookieAgree = WebApp.DeviceStorage.getItem('vtb_cookie2026') === 'true';
        // } else {
            cookieAgree = localStorage.getItem('vtb_money_cookie2026') === 'true';
        // }

        if (cookieAgree) return;

        setIsShowCookies(true);
    }, []);

    const handleCloseCookie = () => {
        setIsShowCookies(false);
        // if (WebApp.DeviceStorage) {
        //     WebApp.DeviceStorage.setItem('vtb_cookie2026', 'true');
        // } else {
            localStorage.setItem('vtb_cookie2026', 'true');
        // }
    }

    return (
        <SizeRatioContextProvider target={wrapperInnerRef} targetWidth={TARGET_WIDTH} targetHeight={TARGET_HEIGHT}>
            {(sizeRatio) => (
                <Wrapper ref={wrapperRef}>
                    <WrapperInner ref={wrapperInnerRef}>
                        <Content $sizeRatio={sizeRatio} id="content" $shouldUseTransform={shouldUseTransform}>
                            {children}
                            <AnimatePresence>
                            {openedModal?.isOpen && openedModal?.component}
                            </AnimatePresence>
                            {isShowCookies && 
                                <CookieInfo $sizeRatio={sizeRatio}>
                                    <p>Мы используем <a href="https://fut.ru/cookie" target="_blank" rel="noreferrer">куки</a>.{'\n'}Играя, ты соглашаешься с этим</p>
                                    <Button type="transparent" width={63 * sizeRatio} onClick={handleCloseCookie}>Окей</Button>
                                </CookieInfo>
                            }
                        </Content>
                    </WrapperInner>
                </Wrapper>
            )}
        </SizeRatioContextProvider>
    );
};
