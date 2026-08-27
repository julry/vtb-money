import { memo } from "react";
import styled from 'styled-components';
import coin from '../../../../../assets/images/coinImg.webp';
import {useSizeRatio} from "../../../../../hooks/useSizeRatio";
import { coinImageSizes, subjectK, trashImages, trashImagesSizes } from "../constants";

const Wrapper = styled.div`
    position: absolute;
    left: ${({$x}) => $x}px;
    bottom: ${({$y}) => $y}px;
    width: ${({$width, $ratio}) => $width * $ratio}px;
    height: ${({$height, $ratio}) => $height * $ratio}px;
    z-index: 6;
    will-change: opacity;
    contain: layout style paint;
`;

const ImageStyled = styled.img`
    width: ${({$w, $ratio}) => $w * $ratio}px;
    height: ${({$h, $ratio}) => $h * $ratio}px;
    object-fit: contain;
    object-position: 0% 100%;
`;

export const Subject = memo(({ subject, isCollected }) => {
    const sizeRatio = useSizeRatio();
    if (!subject || isCollected) return null;

    const { isTrash, width, height, imageId, position } = subject;
    const sizes = isTrash ? trashImagesSizes[imageId] : coinImageSizes;
    const src = isTrash ? trashImages[imageId] : coin;

    const x = position[0] * sizeRatio;
    const y = position[1] * subjectK * sizeRatio;

    return (
        <Wrapper $x={x} $y={y} $width={width} $height={height} $ratio={sizeRatio}>
            <ImageStyled $w={sizes[0]} $h={sizes[1]} $ratio={sizeRatio} src={src} alt="" fetchPriority="high"/>
        </Wrapper>
    );
});

Subject.displayName = 'Subject';