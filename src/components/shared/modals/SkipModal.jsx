import styled from "styled-components";
import { Modal } from "./Modal";
import { Block } from "../Block";
import { Button } from "../Button";
import { RedStroke2Line } from "../RedStrokes";
import { MarkeredText } from "../Texts";
import { useSizeRatio } from "../../../hooks/useSizeRatio";

const ModalStyled = styled(Modal)`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: var(--font_sm);
`;

const ButtonWrapper= styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing_x4);
    width: 100%;
    padding-bottom: var(--spacing_x6);
    margin-top: calc(var(--spacing_x5) - var(--spacing_x1)/2);
`;

export const SkipModal = ({ isOpen, onClose, onExit }) => {
    const ratio = useSizeRatio();

    return (
    <ModalStyled isDarken isOpen={isOpen}>
        <Block>
            <RedStroke2Line>
                Ты собираешься вернуться на главный экран
            </RedStroke2Line>
            <p>Прогресс текущего уровня{'\n'}
                <MarkeredText 
                    text="не будет сохранен"
                    svgElement={
                        <svg width="100%" height="100%" viewBox="0 0 127 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M109.511 1.22957C103.278 1.14278 96.7047 1.01257 90.1314 0.969173C86.6181 0.925777 83.1048 0.925793 79.5915 0.795603C76.8716 0.70881 74.1516 0.535218 71.3183 0.491821C64.065 0.274839 23.2249 0.144644 15.8583 0.18804C11.7784 0.18804 7.81178 0.101263 3.73181 0.0144696C2.71181 0.0144696 1.35181 -0.115736 1.01182 0.405023C0.558487 0.925782 -0.402885 1.63329 0.445152 2.0975C1.29319 2.56171 1.01182 5.33328 1.01182 6.40994C1.01182 7.48661 1.01182 7.18327 1.01182 7.71184C1.01182 8.24041 0.44516 11.4118 0.286942 11.9404C0.128731 12.469 -0.348175 13.3806 0.445152 13.7278C0.898483 13.9448 1.46511 14.1183 1.69177 14.3787C1.91844 14.6825 2.48516 14.7693 3.16516 14.7259C4.86514 14.6825 6.56512 14.9863 8.26511 14.9429C9.17176 14.9429 10.0784 14.9429 10.8717 15.1599C11.4384 15.3334 12.1184 15.29 12.685 15.29C18.6916 15.29 58.285 15.3335 64.405 15.3335C68.2583 15.3335 71.9982 15.4202 75.7382 15.4636C82.1981 15.5504 88.7714 15.4636 95.3447 15.5504C99.878 15.5938 104.525 15.6806 109.058 15.8108C110.418 15.8542 111.778 15.7674 113.138 15.7674C115.971 15.7674 118.691 16.0712 121.524 15.9844C122.318 15.941 123.111 15.9844 123.904 15.8976C125.264 15.8108 126.058 15.3768 125.944 14.8561C125.378 12.8598 125.491 10.8636 125.944 8.86735C126.284 7.52206 125.944 6.17677 126.624 4.83148C127.078 4.05034 127.078 3.26919 126.851 2.48805C126.738 2.05409 126.284 1.92391 125.491 1.88052C124.698 1.83712 123.904 1.66353 123.111 1.66353C118.804 1.70693 114.498 1.05598 109.511 1.22957Z" fill="#04E061" fill-opacity="0.3"/>
                        </svg>
                    }
                    svgProps={{width: 127* ratio, height: 16 * ratio, top: 3 * ratio, left: -2 * ratio}}
                />.{' '}
            Все равно выйти?</p>
        </Block>
        <ButtonWrapper>
            <Button onClick={onExit}>Выйти на главный экран</Button>
            <Button type="secondary" onClick={onClose}>Продолжить уровень</Button>
        </ButtonWrapper>
    </ModalStyled>
);

}