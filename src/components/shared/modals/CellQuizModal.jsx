import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { Block } from "../Block";
import { Modal } from "./Modal";
import { Title } from "../Title";
import { Text } from "../Text";
import { Button } from "../Button";
import { useProgress } from "../../../hooks/useProgress";
import { useState } from "react";

const BlockStyled = styled(Block)`
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: ${({$ratio}) => $ratio * 582}px;
    padding: ${({$ratio}) => $ratio * 20}px ${({$ratio}) => $ratio * 23}px ${({$ratio}) => $ratio * 23}px;
    ${({$isBlured}) => $isBlured ? 'filter: blur(5px)' : ''};
`;

const TextWrapper = styled.div`
    padding: ${({$ratio}) => $ratio * 10}px 0 ${({$ratio}) => $ratio * 25}px;
`;

const AnswerBlock = styled.button`
    background: ${({$isActive}) => $isActive ? '#D4B7FF' : '#6572FB'};
    box-shadow: 0.694444px 0.694444px 2.08333px rgba(1, 32, 103, 0.6), inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.4);
    width: 100%;
    min-height: ${({$ratio}) => $ratio * 60}px;
    padding: ${({$ratio}) => $ratio * 5}px ${({$ratio}) => $ratio * 20}px;
    display: flex;
    align-items: center;
    color: white;
    font-size: ${({$isSmall, $ratio}) => $isSmall ? $ratio * 12 : $ratio * 15}px;
    text-align: left;
    border-radius:  ${({$ratio}) => $ratio * 15}px;

    & + & {
        margin-top: ${({$ratio}) => $ratio * 10}px;
    }
`;

const ResultModal = styled(Modal)`
    background: rgba(142, 196, 255, 0.4);

    & button {
        max-width: ${({$ratio}) => $ratio * 285}px;
    }
`;

const Result = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing_x1);
    min-height: ${({$ratio}) => $ratio * 60}px;
    color: white;
    text-align: center;
    background-color: ${({$color}) => $color};
    border-radius:  ${({$ratio}) => $ratio * 15}px;
    max-width: ${({$ratio}) => $ratio * 285}px;
`;

export const CellQuizModal = ({cellInfo}) => {
    const ratio = useSizeRatio();
    const [activeVariant, setActiveVariant] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [resultModal, setResultModal] = useState(null);

    const { handleCloseModal, finishCell } = useProgress();

    const handleChoose = () => {
        const isCorrect = activeVariant === cellInfo.correctAnswer;

        if (isAnswered) {
            setResultModal({
                isOpen: true, 
                color: isCorrect ? '#D4B7FF' : '#6572FB', 
                income: isCorrect ? `+${cellInfo.income}` : 0
            })

            return;
        };

        finishCell(cellInfo.id, {coinsAdd: isCorrect ? cellInfo.income : 0, isCorrectAnswer: isCorrect}, isCorrect ? cellInfo.income : 0);
        setIsAnswered(true);
    }

    const handleClickAnswer = (id) => {
        if (isAnswered) {
            return;
        }
       
        setActiveVariant(id);
    }

    return (
        <Modal>
            <BlockStyled $ratio={ratio} $isBlured={resultModal?.isOpen}>
                <Title>{cellInfo.title}</Title>
                <TextWrapper $ratio={ratio}>
                    <Text>{cellInfo.question}</Text>
                </TextWrapper>
                {
                    cellInfo.answers.map((answer, index) => (
                        <AnswerBlock 
                            $ratio={ratio}
                            key={index}
                            onClick={() => handleClickAnswer(index + 1)}
                            $isActive={activeVariant === index + 1}
                            $isSmall={isAnswered && cellInfo.answersInfo[index].length > 100}
                        >
                            {isAnswered ? cellInfo.answersInfo[index] : answer}
                        </AnswerBlock>
                    ))
                }
                <Button mt={'auto'} type={isAnswered ? 'secondary' : 'main'} onClick={handleChoose}>{isAnswered ? 'пропустить' : 'выбрать'}</Button>
             </BlockStyled>
             {resultModal?.isOpen && (
                <ResultModal $ratio={ratio}>
                    <Result $ratio={ratio} $color={resultModal.color}>
                        <p>начисление</p>
                        <p> {resultModal.income}</p>
                    </Result>
                    <Button mt={20 * ratio} onClick={handleCloseModal}>далее</Button>
                </ResultModal>
             )}
        </Modal>
    )
}