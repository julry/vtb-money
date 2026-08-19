import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useProgress } from "../hooks/useProgress";
import { FlexWrapper } from "./shared/ContentWrapper";
import { screens } from "../constants/screensComponents";
import { Loading } from "./Loading";
import {DelayedSuspenseWithPrevious} from './DelayedSuspenseWithPrevious'

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    min-height: 100%;
    height: 100%;
    ${({$isBlured, $blurSize = 20}) => $isBlured ? 'filter: blur(' + $blurSize +'px)' : ''};
    ${({$isBlurTransitionDisabled}) => $isBlurTransitionDisabled ? '' : 'transition: filter 0.3s;'};
`;


export function ScreenContent() {
    const { isLoading, tgError, openedModal, currentScreen } = useProgress();
    const Screen = screens[currentScreen];

    if (tgError?.isError) return (
        <div>
            Ошибка инициализации. {'\n\n'}
            {tgError?.message}
        </div>
    )

    if (isLoading) return <Loading />

    return(
        <>
        {Screen && (
            <Wrapper 
                $blurSize={openedModal?.blurSize} 
                $isBlured={openedModal?.isOpen} 
                $isBlurTransitionDisabled={openedModal?.isBlurTransitionDisabled}
            >
                <DelayedSuspenseWithPrevious
                    fallback={<Loading />} 
                    delay={900}
                    currentKey={currentScreen}
                >
                    <Screen />
                </DelayedSuspenseWithPrevious>
            </Wrapper>
        )}
        </>
    )
}