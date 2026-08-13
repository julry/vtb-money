import styled from "styled-components"
import { useSizeRatio } from "../../hooks/useSizeRatio"
import { Block } from "./Block";
import { Logo } from "./Logo";

const Wrapper = styled(Block)`
    display: flex;
    align-items: center;
    margin-top: -1px;
    width: ${({$ratio}) => $ratio * 109}px;
    height: ${({$ratio}) => $ratio * 54}px;
    padding-left: ${({$ratio}) => $ratio * 20}px;
    border-radius: ${({$ratio}) => $ratio * 20}px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
`;

export const LogoOutlined = ({className, ...props}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper $ratio={ratio} className={className}>
            <Logo {...props} />
        </Wrapper>
    )
}