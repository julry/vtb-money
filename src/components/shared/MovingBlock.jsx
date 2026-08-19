import styled from 'styled-components';
import {motion} from 'framer-motion';
import { useSizeRatio } from '../../hooks/useSizeRatio';

const Description = styled(motion.div)`
    position: absolute;
    top: ${({$ratio, $top}) => $ratio * $top}px;
    right: ${({$ratio, $right}) => $ratio * $right}px;
    width: ${({$ratio, width}) => $ratio * width}px;
    color: var(--btn-color-main);
    font-size: ${({$ratio}) => $ratio * 16}px;
    background-color: var(--color-accent);
    z-index: 3;

    padding: ${({$ratio}) => $ratio * 20}px;
    padding-right: ${({$ratio}) => $ratio * 99}px;
    border-radius: var(--border-radius-md);
    box-shadow: inset 2px 2px 2px rgba(255, 255, 255, 0.4);

    text-align: left;
`;

export const MovingBlock = ({children, top = 326, right = -89, width = 394, ...props}) => {
    const ratio = useSizeRatio();

    return (
        <Description 
            $ratio={ratio} 
            initial={{x: width * ratio}}
            $width={width}
            $top={top}
            $right={right}
            animate={{x: 0}} 
            exit={{x: width * ratio}}
            transition={{duration: 0.25}}
            {...props}
        >
            {children}
        </Description>
    )
}