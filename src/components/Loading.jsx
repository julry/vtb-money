import styled from 'styled-components';
import {keyframes} from 'styled-components';
import {FlexWrapper} from './shared/ContentWrapper';

const Wrapper = styled(FlexWrapper)`
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

export const Loading = () => (
    <Wrapper>
        <Dot />
        <Dot />
        <Dot />
    </Wrapper>
)