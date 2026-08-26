import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

const Wrapper = styled(motion.div)`
    position: absolute;
    inset: 0;
    z-index: 1000;
    will-change: opacity;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${({$isLighten}) => $isLighten ? 'rgba(142, 196, 255, 0.4)' : 'transparent'};
`;

export const Modal = ({ isDisabledAnimation, isLighten, ...props }) => (
    <Wrapper
        {...props}
        initial={{
            opacity: isDisabledAnimation ? 1 : 0,
        }}
        $isLighten={isLighten}
        animate={!isDisabledAnimation && { opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
    />
)