import styled from "styled-components"
import { Text } from "../Text"
import { InfoModal } from "./InfoModal"
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import money from '../../../assets/images/lobby/moneyrect.webp';
import edu from '../../../assets/images/lobby/quizrect.webp';
import cart from '../../../assets/images/lobby/investrect.webp';
import luck from '../../../assets/images/lobby/luckrect.webp';
import play from '../../../assets/images/lobby/gamerect.webp';

const ModalStyled = styled(InfoModal)`
    & > div {
        padding-bottom: 0;
    }
`;

const TextStyled = styled(Text)`
    margin-top: var(--spacing_x5);
    margin-bottom: calc(2 * var(--spacing_x5));
    font-size: calc(var(--font_md) + 2px);
`;

const CardText = styled(Text)`
    font-size: var(--font_sm);
`;

const Card = styled.div`
    position: relative;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.5px solid #004CDA;
    border-radius: ${({$ratio}) => $ratio * 15}px;
    height: ${({$ratio}) => $ratio * 74}px;
    padding: ${({$ratio}) => $ratio * 30}px ${({$ratio}) => $ratio * 15}px ${({$ratio}) => $ratio * 15}px;
    width: ${({$ratio}) => $ratio * 259}px;

    & + & {
        margin-top: ${({$ratio}) => $ratio * 30}px;
    }

    &:last-child { 
        margin-bottom: ${({$ratio}) => $ratio * 30}px;
    }
`;

const CardIcon = styled.img`
    position: absolute;
    top: ${({$ratio}) => $ratio * -28}px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    width: ${({$ratio}) => $ratio * 65}px;
    height: ${({$ratio}) => $ratio * 60}px;
`;

const cards = [
    {
        id: 0,
        text: 'Инвестиции требуют вложений и приносят еженедельный доход',
        src: cart,
    },
    {
        id: 1,
        text: 'Бонусы приносят разовые\nвыплаты',
        src: money,
    },
    {
        id: 2,
        text: 'Удача может принести как удачу, так и значительные затраты',
        src: luck,
    },
    {
        id: 3,
        text: 'Мини-игры дают заработок за прохождение мини-игр',
        src: play,
    },
    {
        id: 4,
        text: 'Вопросы на засыпку проверяют твою смекалку и вознаграждают её',
        src: edu,
    },
];

export const RuleIncomeModal = () => {
    const ratio = useSizeRatio();
    return (
        <ModalStyled title={"Как увеличить\nдоход?"}>
            <TextStyled>
                На игровом поле есть{'\n'}разные типы клеток: 
            </TextStyled>
            {cards.map(({id, text, src}) => (
                <Card key={id} $ratio={ratio}>
                    <CardIcon $ratio={ratio} src={src} alt="" />
                    <CardText>{text}</CardText>
                </Card>
            ))}
        </ModalStyled>
    )
}