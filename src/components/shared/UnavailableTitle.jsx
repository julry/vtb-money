import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { BlueText } from "./Texts";

const Wrapper = styled.div`
    position: absolute;
    top: ${({$ratio}) => $ratio * -24}px;
    left: 50%;
    display: flex;
    justify-content: center;
    padding-top: ${({$ratio}) => $ratio * 14}px;
    transform: translateX(-50%);
    width: ${({$ratio}) => $ratio * 215}px;
    height: ${({$ratio}) => $ratio * 98}px;
`;

const SvgWrapper = styled.div`
    position: absolute;
    inset: 0;
    z-index: 1;
`;

const Content = styled.div`
    position: relative;
    z-index: 3;
    text-align: center;
    font-size: ${({$ratio}) => $ratio * 22}px;

    & > p:last-child {
        padding: 0;
        height: ${({$ratio}) => $ratio * 24}px;
        width: ${({$ratio}) => $ratio * 126}px;
    }
`;

const Label = styled.p`
    font-weight: 500;
    margin-bottom: ${({$ratio}) => $ratio * 6}px;
`;

export const UnavailableTitle = ({text}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper $ratio={ratio}>
            <SvgWrapper>
                <svg width="100%" height="100%" viewBox="0 0 215 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M109.281 2.27415C65.1948 -0.174144 26.7969 14.5156 25.8488 16.9639C23.4785 22.4726 25.8488 83.0678 35.8038 78.7833C45.7588 74.4987 85.1048 76.9471 109.281 74.4988C133.458 72.0505 180.863 77.5591 184.655 74.4988C188.447 71.4384 188.921 27.3691 186.551 16.9639C184.181 6.55867 153.368 4.72244 109.281 2.27415Z" fill="white" stroke="#04E061" strokeWidth="3" strokeLinejoin="round"/>
                    <path d="M25.5001 43C17.3334 47.1667 1.5 55.9702 1.5 58.5C1.5 61.5 20.5001 64.5 23.0001 71C25.5001 77.5 11.5596 98.7202 17.0001 96C23.0001 93 38.1669 92.1667 46.5003 89M46.5003 89V75.5M46.5003 89L33.5003 78.5" stroke="#04E061" strokeWidth="3" strokeLinejoin="round"/>
                    <path d="M187.5 42C196.018 45.3897 211.011 50.9141 211.246 53.4329C211.525 56.42 192.886 61.1727 191 67.8769C189.115 74.5811 204.968 94.414 199.298 92.2111C193.045 89.7817 177.866 90.3614 169.275 87.9829M169.275 87.9829L168.02 74.5413M169.275 87.9829L181.5 74.5413" stroke="#04E061" strokeWidth="3" strokeLinejoin="round"/>
                </svg>
            </SvgWrapper>
            <Content $ratio={ratio}>
                <Label $ratio={ratio}>Откроется</Label>
                <BlueText>{text}</BlueText>
            </Content>
        </Wrapper>
    )
}