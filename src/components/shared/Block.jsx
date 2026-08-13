import styled from 'styled-components';

export const Block = styled.div`
    position: relative;
    width: 100%;
    max-width: ${({$ratio}) => $ratio * 325}px;
    background: rgba(198, 216, 254, 0.7);
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: 0.7px 0.7px 1.4px rgba(1, 32, 103, 0.8), inset 1.4px 1.4px 1.4px rgba(255, 255, 255, 0.6);
    border-radius:  ${({$ratio}) => $ratio * 30}px;
    white-space: pre-line;
`;