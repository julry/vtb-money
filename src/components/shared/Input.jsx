import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";

const InputWrapper = styled.div`
    position: relative;
`;

const InputStyled = styled.input`
    border: 0.5px solid ${({$isCorrect}) => $isCorrect ? '#004CDA': '#B90000'};
    border-radius: ${({$ratio}) => $ratio * 10}px;
    padding: ${({$ratio}) => $ratio * 10}px;
    height: ${({$height}) => $height}px;
    font-size: var(--font_sm);
    font-weight: 400;
    outline: none;
    background: transparent;
    width: 100%;

    &::placeholder {
        color: ${({$isCorrect}) => $isCorrect ? 'rgba(0,76,218,0.5)': 'rgba(185,0,0,0.5)'};
    }
`;

const ErrorText = styled.p`
    position: absolute;
    top: ${({$ratio}) => $ratio * 42}px;
    left: 0;
    font-size: ${({$ratio}) => $ratio * 9}px;
    color: #B90000;
    opacity: ${({$isCorrect}) => $isCorrect ? 0 : 1};
    transition: opacity 0.25s;
`;

export const Input = ({isCorrect, errorText, className, ...props}) => {
    const ratio = useSizeRatio();

    return (
        <InputWrapper className={className}>
            <InputStyled {...props} $isCorrect={isCorrect} $height={ratio * 40} $ratio={ratio} />
            <ErrorText $isCorrect={isCorrect} $ratio={ratio}>{errorText}</ErrorText>
        </InputWrapper>
    )
}