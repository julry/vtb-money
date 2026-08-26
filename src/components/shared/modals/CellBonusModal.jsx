import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import picture from '../../../assets/images/coinImg.webp'; 
import { Block } from "../Block";
import { Modal } from "./Modal";
import { Title } from "../Title";
import { Text } from "../Text";
import { Button } from "../Button";
import { useProgress } from "../../../hooks/useProgress";

const BlockStyled = styled(Block)`
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: ${({$ratio}) => $ratio * 582}px;
    max-height: ${({$ratio}) => $ratio * 582}px;
    padding: ${({$ratio}) => $ratio * 20}px ${({$ratio}) => $ratio * 23}px ${({$ratio}) => $ratio * 23}px;
    
    & button {
        position: relative;
        z-index: 2;
    }
`;

const TextWrapper = styled.div`
    padding: ${({$ratio}) => $ratio * 10}px 0 ${({$ratio}) => $ratio * 10}px;
`;

const ImageWrapper = styled.div`
    width: 100%;
    height: stretch;
    overflow: ${($overflow) => $overflow ?? 'hidden'};

    position: relative;

    & img {
        ${({$imgStyle}) => $imgStyle};
        width: ${({$imgStyle, $ratio}) => $imgStyle?.width ? $imgStyle.width * $ratio + 'px' : '100%'};
        height: ${({$imgStyle, $ratio}) => $imgStyle?.height ? $imgStyle.height * $ratio + 'px' : '100%'};
        object-fit: contain;
    }
`;

const Result = styled.div`
    width: calc(100% - ${({$ratio}) => $ratio * 46}px);
    position: absolute;
    bottom:  ${({$ratio}) => $ratio * 81}px;
    left: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing_x1);
    transform: translateX(-50%);
    min-height: ${({$ratio}) => $ratio * 60}px;
    color: white;
    text-align: center;
    background-color: var(--color-pink);
    border-radius:  ${({$ratio}) => $ratio * 15}px;
`;

export const CellBonusModal = ({cellInfo}) => {
    const ratio = useSizeRatio();

    const { handleCloseModal, finishCell } = useProgress();

    const onClose = () => {
        console.log('cellInfo.id', cellInfo.id);
        finishCell(cellInfo.id, {coinsAdd: cellInfo.income}, cellInfo.income);
        handleCloseModal();
    }

    return (
        <Modal isLighten>
            <BlockStyled $ratio={ratio}>
                <Title>{cellInfo.title}</Title>
                <TextWrapper $ratio={ratio}>
                    <Text>{cellInfo.description}</Text>
                </TextWrapper>
                <ImageWrapper $overflow={cellInfo.imgStyle?.overflow} $ratio={ratio} $imgStyle={cellInfo.imgStyle ?? {}}>
                    <img src={cellInfo.modalImage ?? picture} alt=""/>
                </ImageWrapper>
                <Result $ratio={ratio}>
                  <p>сразу</p>
                  <p>+{cellInfo.income}</p>
                </Result>
                <Button mt={40 * ratio} onClick={onClose}>забрать</Button>
             </BlockStyled>
        </Modal>
    )
}