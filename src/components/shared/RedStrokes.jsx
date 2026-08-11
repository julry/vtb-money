import styled from "styled-components"
import { useSizeRatio } from "../../hooks/useSizeRatio";

const Wrapper = styled.div`
    position: relative;
    font-size: var(--font_lg);
    font-weight: 500;
    width: ${({$ratio}) => $ratio * 296}px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
`;

const Wrapper1Line = styled(Wrapper)`
    width: ${({$ratio}) => $ratio * 296}px;
    height: ${({$ratio}) => $ratio * 41}px;
    padding-top: ${({$ratio}) => $ratio * 9}px;
    padding-bottom: ${({$ratio}) => $ratio * 10}px;
`;

const Wrapper2Line = styled(Wrapper)`
    width: ${({$ratio}) => $ratio * 296}px;
    height: ${({$ratio}) => $ratio * 53}px;
    padding-top: ${({$ratio}) => $ratio * 6.5}px;
    padding-bottom: ${({$ratio}) => $ratio * 7.5}px;
`;

const Wrapper3Line = styled(Wrapper)`
    height: ${({$ratio}) => $ratio * 82}px;
    padding-top: ${({$ratio}) => $ratio * 12}px;
    padding-bottom: ${({$ratio}) => $ratio * 12}px;
`;

const Wrapper3LineXL = styled(Wrapper)`
    width: ${({$ratio}) => $ratio * 333}px;
    height: ${({$ratio}) => $ratio * 85}px;
    padding-top: ${({$ratio}) => $ratio * 9}px;
    padding-bottom: ${({$ratio}) => $ratio * 12}px;
`;

const SvgWrapper = styled.div`
    position: absolute;
    inset: 0;
    z-index: -1;
`;

export const RedStroke1Line = ({children, props}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper1Line $ratio={ratio} {...props}>
            <SvgWrapper>
                <svg width="100%" height="100%" viewBox="0 0 296 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.8583 2.68376C7.71867 3.47611 4.11391 10.7174 4.45398 14.2389C3.18709 18.5309 -3.19761 34.7081 8.02475 37.6794C19.2471 40.6507 136.184 37.6794 167.908 37.6794H281.442C300.316 37.6794 293.175 28.4353 293.175 15.2294C293.175 2.02346 281.442 4.3345 277.361 2.68376C273.281 1.03302 169.219 2.68376 159.017 4.3345C148.814 5.98524 46.2828 1.69332 24.8583 2.68376Z" stroke="#FF4052" strokeWidth="3"/>
                </svg>
            </SvgWrapper>
            <p>{children}</p>
        </Wrapper1Line>
    )
}

export const RedStroke2Line = ({children, props}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper2Line $ratio={ratio} {...props}>
            <SvgWrapper>
                <svg width="100%" height="100%" viewBox="0 0 296 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.8583 2.424C7.71867 3.49475 4.11391 13.2802 4.45398 18.0391C3.18709 23.839 -3.19761 45.7001 8.02475 49.7154C19.2471 53.7307 136.184 49.7154 167.908 49.7154H281.442C300.316 49.7154 293.175 37.2233 293.175 19.3775C293.175 1.5317 281.442 4.65473 277.361 2.424C273.281 0.19327 169.219 2.424 159.017 4.65473C148.814 6.88545 46.2828 1.08556 24.8583 2.424Z" stroke="#FF4052" strokeWidth="3"/>
                </svg>
            </SvgWrapper>
            <p>{children}</p>
        </Wrapper2Line>
    )
}

export const RedStroke3Line = ({children, props}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper3Line $ratio={ratio} {...props}>
            <SvgWrapper>
                <svg width="100%" height="100%" viewBox="0 0 296 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.8583 2.95992C7.71867 4.6517 4.11391 20.1127 4.45398 27.6318C3.18709 36.7956 -3.19761 71.3362 8.02475 77.6804C19.2471 84.0246 136.184 77.6804 167.908 77.6804H281.442C300.316 77.6804 293.175 57.9429 293.175 29.7465C293.175 1.55008 281.442 6.48447 277.361 2.95992C273.281 -0.564634 169.219 2.95992 159.017 6.48447C148.814 10.009 46.2828 0.845186 24.8583 2.95992Z" stroke="#FF4052" strokeWidth="3"/>
                </svg>

            </SvgWrapper>
            <p>{children}</p>
        </Wrapper3Line>
    )
}

export const RedStroke3LineXl = ({children, props}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper3LineXL $ratio={ratio} {...props}>
            <SvgWrapper>
                <svg width="100%" height="100%" viewBox="0 0 333 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.2282 3.31202C8.98274 5.05067 4.93507 20.94 5.31693 28.6673C3.89438 38.085 -3.27479 73.5823 9.32643 80.1023C21.9277 86.6222 153.233 80.1023 188.854 80.1023H316.338C337.531 80.1023 329.512 59.818 329.512 30.8406C329.512 1.86313 314.685 7.17363 310.103 3.55145C305.52 -0.0707343 190.326 3.31202 178.87 6.9342C167.414 10.5564 52.2851 1.13871 28.2282 3.31202Z" stroke="#FF4052" strokeWidth="3"/>
                </svg>
            </SvgWrapper>
            <p>{children}</p>
        </Wrapper3LineXL>
    )
}