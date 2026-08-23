import styled from "styled-components";
import cart from '../../../../../assets/images/doodle/cart.webp';
import arrow from '../../../../../assets/images/arrowLeft.webp';
import { Modal } from "../../../../shared/modals";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { useProgress } from "../../../../../hooks/useProgress";
import { MovingBlock } from "../../../../shared/MovingBlock";

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

const Cart = styled.img`
    position: absolute;
    left: 29px;
    bottom: 42px;
    width: 133px;
    height: 117px;
    z-index: 4;
`;

export const RulesModal = () => {
    const ratio = useSizeRatio();
    const {handleCloseModal} = useProgress()

    return (
        <Modal $ratio={ratio} isDisabledAnimation onClick={handleCloseModal}>
            <MovingBlock $top={75} onClose={handleCloseModal}>
                <p>
                    Тапай на левую или правую часть экрана, чтобы двигать корзинку влево или вправо, и лови полезные предметы, избегая опасных 
                </p>
            </MovingBlock>
            <AreasWrapper $ratio={ratio}>
                <Area><Arrow $ratio={ratio} src={arrow} alt="" /></Area>
                <Area><Arrow $ratio={ratio} src={arrow} alt="" $isMirror/></Area>
            </AreasWrapper>
            <Cart src={cart} alt=""/>
        </Modal>
    )
}

