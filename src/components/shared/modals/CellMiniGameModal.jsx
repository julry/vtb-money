import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import picture from '../../../assets/images/minigamecell.webp'; 
import { Block } from "../Block";
import { Modal } from "./Modal";
import { Title } from "../Title";
import { Text } from "../Text";
import { Button } from "../Button";
import { useProgress } from "../../../hooks/useProgress";

const BlockStyled = styled(Block)`
    position: relative;
    padding: ${({$ratio}) => $ratio * 20}px ${({$ratio}) => $ratio * 23}px ${({$ratio}) => $ratio * 23}px;
    & button {
        position: relative;
        z-index: 2;
    }
`;

const TextWrapper = styled.div`
    padding: ${({$ratio}) => $ratio * 10}px 0 ${({$ratio}) => $ratio * 3}px;
    height: ${({$ratio}) => $ratio * 86}px;
`;

const Image = styled.img`
    height: ${({$ratio}) => $ratio * 241}px;
    width: ${({$ratio}) => $ratio * 307}px;
    margin-left: ${({$ratio}) => $ratio * -13}px;
    object-fit: contain;
`;

const InfoBlock = styled.div`
    position: absolute;
    top: ${({$ratio}) => $ratio * 340}px;
    left: ${({$ratio}) => $ratio * 23}px;
    right: ${({$ratio}) => $ratio * 23}px;
    gap: ${({$ratio}) => $ratio * 14}px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const InfoStyled = styled.div`
    height: ${({$ratio}) => $ratio * 60}px;
    background: var(--color-pink);
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0.694444px 0.694444px 2.08333px rgba(1, 32, 103, 0.6), inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.4);
    border-radius:  ${({$ratio}) => $ratio * 15}px;
`;

export const CellMiniGameModal = ({cellInfo}) => {
    const ratio = useSizeRatio();
    const { next } = useProgress();

    const incomes = [...cellInfo.incomes].reverse();

    return (
        <Modal isLighten>
            <BlockStyled $ratio={ratio}>
                <Title>{cellInfo.title}</Title>
                <TextWrapper $ratio={ratio}>
                    <Text>{cellInfo.description}</Text>
                </TextWrapper>
                <Image $ratio={ratio} src={picture} alt=""/>
                <InfoBlock $ratio={ratio}>
                    {incomes.map((income) => (
                        <InfoStyled $ratio={ratio} key={income}>+{income}</InfoStyled>
                    ))}
                </InfoBlock>
                <Button mt={45 * ratio} onClick={() => next(cellInfo.screen)}>играть</Button>
             </BlockStyled>
        </Modal>
    )
}