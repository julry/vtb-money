import styled from "styled-components";
import { motion } from "framer-motion";
import arrow from '../../../../../assets/images/doodle/arrowLeft.webp';
import { Modal } from "../../../modals";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { useProgress } from "../../../../../contexts/ProgressContext";

const AreasWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    gap: ${({$ratio}) => $ratio * 9}px;
    padding: ${({$ratio}) => $ratio * 10}px;
`;

const Area = styled.div`
    height: 100%;
    flex: 1;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.7), inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.6);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Arrow = styled.img`
    width: ${({$ratio}) => $ratio * 120}px;
    height: ${({$ratio}) => $ratio * 120}px;
    transform: scale(${({$isMirror}) => $isMirror ? '-1, 1' : 1});
`;

const Description = styled(motion.div)`
    position: absolute;
    top: ${({$ratio}) => $ratio * 75}px;
    left: ${({$ratio}) => $ratio * 60}px;
    width: ${({$ratio}) => $ratio * 394}px;
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

export const RulesModal = () => {
    const ratio = useSizeRatio();
    const {handleCloseModal} = useProgress()

    return (
        <Modal $ratio={ratio} isDisabledAnimation onClick={handleCloseModal}>
            <Description $ratio={ratio} exit={{x: 330}} transition={{duration: 0.25}}>
                <p>
                    Тапай на левую или правую часть экрана, чтобы двигаться влево или вправо, и прыгай по платформам так высоко, как можешь
                </p>
            </Description>
            <AreasWrapper $ratio={ratio}>
                <Area><Arrow $ratio={ratio} src={arrow} alt="" /></Area>
                <Area><Arrow $ratio={ratio} src={arrow} alt="" $isMirror/></Area>
            </AreasWrapper>
        </Modal>
    )
}

