import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import bgImage from '../../assets/images/introBg.svg?url';
import { FlexWrapper } from "./ContentWrapper";
import { Logo } from "./Logo";
import { Button } from "./Button";
import {Block} from './Block';

const Wrapper = styled(FlexWrapper)`
    justify-content: center;
    background: url(${() => '"' + bgImage + '"'}) no-repeat center center;
    background-size: cover;
`;


const LogoStyled = styled(Logo)`
    align-self: flex-start;
    justify-self: flex-start;
    width: ${({$ratio}) => $ratio * 142}px;
    height: ${({$ratio}) => $ratio * 53}px;
    flex-shrink: 0;
`;

const BlockStyled = styled(Block)`
    width: ${({$width}) => $width}px;
    height: ${({$height}) => $height}px;
    margin: auto;
    padding: var(--spacing_x4) var(--spacing_x3) calc(var(--spacing_x6) + var(--spacing_x1) / 2);

    & > div {
        background: transparent;
        padding: 0;
    }
`;

const ContentWrapper = styled(FlexWrapper)`
    height: auto;
    flex: 1;
`;

export const BrightScreen = ({buttonText, blockSize, svgComponent, onClick, hasLogo = true, isDisabledButton, ...props}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper>
            <BlockStyled
                {...props}
                $ratio={ratio} 
                svgComponent={svgComponent}
                $width={(blockSize?.width ?? 360) * ratio}
                $height={(blockSize?.height ?? 0) * ratio }
            >
                {hasLogo && (
                    <LogoStyled $ratio={ratio} hasBg={false}/>
                )}
                <ContentWrapper>
                    {props.children}
                </ContentWrapper>
                <Button onClick={onClick} disabled={isDisabledButton}>{buttonText}</Button>
            </BlockStyled>
        </Wrapper>
    )
}