import styled from 'styled-components';

const WrapperStyled = styled.div`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    will-change: transform;
`;

export const ItemsBoard = ({ ref, children }) => (
    <WrapperStyled ref={ref}>
        {children}
    </WrapperStyled>
);