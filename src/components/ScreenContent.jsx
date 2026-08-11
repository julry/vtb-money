import { useMemo } from "react";
import styled, { keyframes } from 'styled-components';
import { useProgress } from "../contexts/ProgressContext";
import { FlexWrapper } from "./shared/ContentWrapper";

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    min-height: 100%;
    height: 100%;
    ${({$isBlured}) => $isBlured ? 'filter: blur(20px)' : ''};
    ${({$isBlurTransitionDisabled}) => $isBlurTransitionDisabled ? '' : 'transition: filter 0.3s;'};
`;

const Loading = styled(FlexWrapper)`
    gap: var(--spacing_x2);
    flex-direction: row;
    justify-content: center;
`;

const dotPulse = keyframes`
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
`;

const Dot = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--color-accent);
    animation: ${dotPulse} 1.5s infinite ease-in-out;

        &:nth-child(1) {
            animation-delay: 0s;
        }

        &:nth-child(2) {
            animation-delay: calc(1.5s * 0.13);
        }

        &:nth-child(3) {
            animation-delay: calc(1.5s * 0.26);
        }
`;

export function ScreenContent() {
    const { screen, isLoading, tgError, openedModal } = useProgress();
    const Screen = useMemo(() => screen, [screen]);

    if (tgError?.isError) return (
        <div>
            Ошибка инициализации. {'\n\n'}
            {tgError?.message}
        </div>
    )

    if (isLoading) return (
        <Loading>
            <Dot />
            <Dot />
            <Dot />
        </Loading>
    )

    return Screen && (
        <Wrapper $isBlured={openedModal?.isOpen} $isBlurTransitionDisabled={openedModal?.isBlurTransitionDisabled}>
            <Screen />
        </Wrapper>
    )
}