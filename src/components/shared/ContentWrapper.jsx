import styled from "styled-components";

export const ContentWrapper = styled.div`
    position: relative;
    width: 100%;
    min-width: 100%;
    height: 100%;
`;

export const FlexWrapper = styled(ContentWrapper)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: ${({$justify = 'flex-start'}) => $justify};
`;

export const FlexRowWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: ${({$gap = 0}) => $gap}px;
`;
