import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";

const Wrapper = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({$type}) => 'var(--btn-bg-' + $type + ')'};
    color: ${({$type}) => 'var(--btn-color-' + $type + ')'};
    font-size: ${({$ratio}) => $ratio * 17}px;

    padding: ${({$ratio}) => $ratio * 6}px;
    width: 100%;
    max-width: ${({$width, $ratio}) => $width ? $ratio * $width + 'px' : 'var(--content-width)'};
    min-height: ${({$ratio}) => $ratio * 42}px;
    border-radius: var(--border-radius-md);
    box-shadow: ${({$type}) => $type === 'secondary' ? '0.694444px 0.694444px 1.38889px rgba(1, 32, 103, 0.8),' : ''} inset 2px 2px 2px rgba(255, 255, 255, 0.4);

    text-align: center;
    cursor: pointer;
    transition: background 0.3s, color 0.3s;

    &:disabled {
        background: var(--btn-bg-disabled);
        color: var(--btn-color-disabled);
    }
`;

const IconWrapper = styled(Wrapper)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${({$ratio}) => $ratio * 48}px;
    height: ${({$ratio}) => $ratio * 48}px;
    padding: 0;
    border-radius: var(--border-radius-md);

    & svg:first-of-type {
        width: ${({$ratio, $svgWidth}) => $ratio * $svgWidth}px;
        height: ${({$ratio, $svgHeight}) => $ratio * $svgHeight}px;
    }
`;

export const Button = ({type = 'main', width, ...props}) => {
    const ratio = useSizeRatio();

    return <Wrapper {...props} $type={type} $width={width} $ratio={ratio}/>
}

export const IconButton = ({icon = {}, type = 'main', ...props}) => {
    const ratio = useSizeRatio();
    const {width = 36, height = 36} = icon;

    return <IconWrapper {...props} $svgWidth={width} $svgHeight={height} $type={type} $ratio={ratio} />
}

export const BackButton = styled(IconButton)`
    width: auto;
    padding: 0 var(--spacing_x2);
`;