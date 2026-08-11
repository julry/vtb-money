import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";

const Wrapper = styled.div`
    position: relative;
    text-align: center;
    border-radius: var(--border-radius-lg);
    color: #000000;
    width: calc(var(--content-width) + var(--spacing_x1));
`;

const SvgWrapper = styled.div`
    position: absolute;
    inset: 0;
    z-index: 1;
`;

const Content = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: calc(2.5 * var(--spacing_x1));
    background: #FFFFFF;
    z-index: 2;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius-lg);

    padding: ${({$ratio}) => $ratio * 14}px ${({$ratio}) => $ratio * 17}px;
`;

export const Block = ({svgComponent, children, ...props}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper $ratio={ratio} {...props}>
            <Content $ratio={ratio}>
                {children}
            </Content>
            {svgComponent && <SvgWrapper>
                {svgComponent}
            </SvgWrapper>}
        </Wrapper>
    )
}