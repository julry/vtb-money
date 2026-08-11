import styled from "styled-components";
import {motion} from "framer-motion";

const ImageStyled = styled(motion.img)`
    object-fit: contain;
    pointer-events: none;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
`;

export const Image = ({src, className, ...rest}, ref) => <ImageStyled ref={ref} className={className} src={src} {...rest} />
