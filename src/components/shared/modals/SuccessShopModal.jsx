import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import picture from '../../../assets/images/lobby/invest_depos.webp';
import picture2 from '../../../assets/images/runner/collectEffect.webp';
import { InfoModal } from "./InfoModal";
import { Button } from "../Button";
import { useProgress } from "../../../hooks/useProgress";

const ModalStyled = styled(InfoModal)`
    & > div {
        padding-bottom: 0;
    }
`;

const Image = styled.img`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: ${({$ratio}) => $ratio * 237}px;
    height: ${({$ratio}) => $ratio * 186}px;
    object-fit: contain;
`;

const ImageWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: ${({$ratio}) => $ratio * 10}px;
    height: ${({$ratio}) => $ratio * 186}px;

    & img:first-child {
        position: relative;
        z-index: 2;
        width: ${({$ratio}) => $ratio * 165}px;
        height: ${({$ratio}) => $ratio * 165}px;
        object-fit: contain;
    }
`;

const SubTitle = styled.p`
    font-size: ${({$ratio}) => $ratio * 18}px;
    font-weight: 400;
    color: var(--color-accent);
    text-align: center;
    margin-top: var(--spacing_x2);
`;

const ButtonStyled = styled(Button)`
    margin-bottom: var(--spacing_x5);
`;

export const SuccessShopModal = () => {
    const {handleCloseModal} = useProgress();
    const ratio = useSizeRatio();

    return (
        <ModalStyled title={"Ура! Покупка совершена"}>
            <SubTitle>
                Приходи за ней на стойку ВТБ в своём вузе
            </SubTitle>
            <ImageWrapper $ratio={ratio} >
                <img src={picture} alt="" />
                <Image $ratio={ratio} src={picture2} alt="" />
            </ImageWrapper>
            <ButtonStyled onClick={handleCloseModal}>Окей</ButtonStyled>
        </ModalStyled>
    )
}