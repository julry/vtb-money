import styled from "styled-components";
import {BrightScreen} from '../shared/BrightScreen';
import { useSizeRatio } from "../../hooks/useSizeRatio";
import WebApp from "@twa-dev/sdk";

const Picture = styled.div`
    position: absolute;
    top: ${({$ratio}) => $ratio * -65}px;
    width: ${({$ratio}) => $ratio * 241}px;
    height: ${({$ratio}) => $ratio * 103}px;
    left: ${({$ratio}) => $ratio * 68}px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap:var(--spacing_x1);

    margin-top: ${({$ratio}) => $ratio * 50}px;

    & p {
     font-size: var(--font_xl);
    }
`;

export const WaitingGameScreen = () => {
    const ratio = useSizeRatio();

    const handleClick = () => {
        WebApp?.close?.();
    };

    return (
        <BrightScreen 
            buttonText={"Перейти в Telegram"} 
            onClick={handleClick}
            svgComponent={
                <svg width="100%" height="100%" viewBox="0 0 359 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M63.4671 399.567C19.3224 399.567 9.68265 383.533 8.388 375.435C-4.89632 292.35 1.05002 253.067 3.1769 205.378C5.0175 164.108 10.55 66.7169 10.55 32.5674C10.55 -1.58224 63.4672 -0.704163 91.5685 0.35202C119.67 1.4082 284.636 1.72458 316.825 4.189C355.255 7.13123 357.623 36.681 354.628 61.0674C352.093 81.7137 354.628 193.938 354.628 219.759C354.628 255.137 364.865 352.987 352.26 382.992C350.24 387.8 344.948 391.218 335.79 392.818C282.323 402.162 110.579 399.567 63.4671 399.567Z" fill="white"/>
                </svg>
            }
            blockSize={{height: 400}}
        >
           <Picture $ratio={ratio}>
              
           </Picture>
           <Content $ratio={ratio}>
            Ход сделан, ты в игре!
            <p>
                Осталось совсем немного: игра откроется 7 сентября. Мы пришлём напоминание в ТГ-боте в день старта
            </p>
           </Content>
        </BrightScreen>
    )
};
