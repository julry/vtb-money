import styled from 'styled-components';
import bg from '../../../../../assets/images/runner/bg.webp';
import road from '../../../../../assets/images/runner/road.webp';
import { GROUND_HEIGHT } from '../constants';
import { useSizeRatio } from '../../../../../hooks/useSizeRatio';

const WrapperStyled = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background: url(${({$preloadBg}) => $preloadBg}) no-repeat 0 0 / cover;
`;

const BackgroundStyled = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(${bg}) 0% 100%;
    background-repeat: repeat-x;
    will-change: background-position;
`;

const Road = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: ${({$ratio}) => $ratio * GROUND_HEIGHT}px;
    background: url(${road}) 0% 100%;
    background-size: auto ${GROUND_HEIGHT}px;
    background-repeat: repeat-x;
    will-change: background-position;
`;

export const Board = ({ ref, roadRef, $preloadBg, ...rest }) => {
    const sizeRatio = useSizeRatio();
    return (
        <WrapperStyled $preloadBg={$preloadBg} {...rest}>
            <BackgroundStyled ref={ref} $ratio={sizeRatio} />
            <Road ref={roadRef} $ratio={sizeRatio} />
        </WrapperStyled>
    );
};