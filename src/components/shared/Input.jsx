import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";

const SIZE_TO_HEIGHT = {
    sm: 40,
    md: 42,
    xl: 54,
}
const Wrapper = styled.input`
    padding: var(--spacing_x2) var(--spacing_x4);
    height: ${({$height}) => $height}px;
    font-size: var(--font_sm);
    font-weight: 500;
    outline: none;
    border: 3px solid ${({$borderColor = 'blue'}) => 'var(--color-' + $borderColor + ')'};
    border-radius: var(--border-radius-xl);
    background: #ffffff;
    width: 100%;

    font-weight: 500;

    &::placeholder {
        color: rgba(0,0,0,0.3);
    }
`;

export const Input = ({isCorrect, size = "sm", ...props}) => {
    const ratio = useSizeRatio();

    const getBorderColor = () => {
        if (isCorrect === true) return 'green';
        if (isCorrect === false) return 'red';

        return 'blue'
    }
    return <Wrapper {...props} $height={ratio * SIZE_TO_HEIGHT[size]} $ratio={ratio} $borderColor={getBorderColor()}/>
}