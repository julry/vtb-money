import styled from "styled-components";

export const PurpleText = styled.p`
    width: max-content;
    background: var(--color-purple);
    padding: calc(var(--spacing_x1) / 4 * 3) var(--spacing_x3) calc(var(--spacing_x1) / 4 * 7);
    border-radius: var(--border-radius-xl);
    color: #ffffff;
    font-weight: 500;
    text-align: center;
`;

export const BlueText = styled(PurpleText)`
    background: var(--color-blue);
`;

const Markered = styled.span`
    position: relative;
    font-weight: 500;
`;

const SvgStyled = styled.span`
    position: absolute;
    z-index: -1;
    width: ${({$width}) => $width}px;
    height: ${({$height}) => $height}px;
    left: ${({$left}) => $left ?? 0}px;
    top: ${({$top}) => $top ?? 0}px;

    & svg {
        width: 100%;
        height: 100%;
    }
`;

export const MarkeredText = ({svgElement, svgProps, text, ...props}) => (
    <Markered {...props}>
        {text}
        <SvgStyled $width={svgProps.width} $height={svgProps.height} $left={svgProps.left} $top={svgProps.top}>
            {svgElement}
        </SvgStyled>
    </Markered>
)