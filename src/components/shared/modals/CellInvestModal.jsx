import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import picture from '../../../assets/images/coinImg.webp'; 
import { Block } from "../Block";
import { Modal } from "./Modal";
import { Title } from "../Title";
import { Text } from "../Text";
import { Button } from "../Button";
import { useProgress } from "../../../hooks/useProgress";
import { FlexRowWrapper } from "../ContentWrapper";

const BlockStyled = styled(Block)`
    display: flex;
    flex-direction: column;
    position: relative;
    line-height: 110%;
    min-height: ${({$ratio}) => $ratio * 582}px;
    padding: 0;
    max-height: calc(100% - ${({$ratio}) => $ratio * 80}px);
    overflow-x: visible;
    max-width: ${({$ratio}) => $ratio * 326}px;
    
    & button {
        position: relative;
        z-index: 2;
    }
`;

const TitleStyled = styled(Title)`
    margin-top: var(--spacing_x5);
`;

const TextWrapper = styled.div`
    padding: ${({$ratio}) => $ratio * 10}px ${({$ratio, $commonMarginH}) => $ratio * ($commonMarginH ?? 23)}px;

    & ${Text} {
        line-height: 110%;
    }
`;

const ImageWrapper = styled.div`
    overflow: hidden;
    margin-top: ${({$imgStyle, $ratio}) => ($imgStyle?.marginTop ?? 0) * $ratio}px;
    margin-left: ${({$imgStyle, $ratio}) => (($imgStyle?.marginLeft ?? 0) + 23) * $ratio}px;
    margin-bottom: ${({$imgStyle, $ratio}) => ($imgStyle?.marginBottom ?? 0) * $ratio}px;
    width: ${({$imgStyle, $ratio}) => $imgStyle?.width ? $imgStyle.width * $ratio + 'px' : '100%'};
    height: ${({$imgStyle, $ratio}) => $imgStyle?.height ? $imgStyle.height * $ratio + 'px' : '100%'};

    & img {
        width: 100%;
        height: 100%;
        
        object-fit: contain;
    }
`;

const Result = styled(FlexRowWrapper)`
    width: 100%;
    position: absolute;
    padding-left: ${({$ratio}) => $ratio * 23}px;
    padding-right: ${({$ratio}) => $ratio * 23}px;
    top: ${({$ratio}) => $ratio * -80}px;
    left: 50%;
    gap: ${({$ratio}) => $ratio * 9}px;
    transform: translateX(-50%);
    height: ${({$ratio}) => $ratio * 60}px;
    color: white;
    text-align: center;
`;

const InfoBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: ${({$ratio}) => $ratio * 12}px;
    ${({$flex}) => $flex ? 'flex: 1' : ''};
    gap: var(--spacing_x1);
    border-radius:  ${({$ratio}) => $ratio * 15}px;
    background-color: ${({$color = 'var(--color-pink)'}) => $color};
    box-shadow: 0.694444px 0.694444px 2.08333px rgba(1, 32, 103, 0.6), inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.4);
`;

const ButtonsWrapper = styled.div`
    position: relative;
    margin-top: auto;
    width: 100%;
    padding-left: ${({$ratio}) => $ratio * 23}px;
    padding-right: ${({$ratio}) => $ratio * 23}px;
    padding-bottom: ${({$ratio}) => $ratio * 23}px;
`;

export const CellInvestModal = ({cellInfo}) => {
    const ratio = useSizeRatio();

    const { handleCloseModal, finishCell, user } = useProgress();

    const isDisabled = user.totalCoins < -cellInfo.cost;

    const onBuy = () => {
        if (isDisabled) { 
            return;
        }
        const addCoins = cellInfo.isPercent ? 0 : cellInfo.income;
        const allIncome = addCoins + cellInfo.cost;
        const additionalData = {};

        if (cellInfo.isPercent) {
            additionalData.coinsKoefs = (user.coinsKoefs ?? 1) + cellInfo.percent / 100;
        } else {
            additionalData.newWeekCoins = (user.newWeekCoins ?? 0) + cellInfo.income;
        }

        finishCell(cellInfo.id, {coinsAdd: addCoins, cost: cellInfo.cost, investigation: cellInfo.incomeNextWeeks}, allIncome, additionalData);

        handleCloseModal();
    }

    const onSkip = () => {
        finishCell(cellInfo.id);
        handleCloseModal();
    };

    return (
        <Modal isLighten>
            <BlockStyled $ratio={ratio}>
                {/* <Scrollbar offset={4 * ratio} top={30 * ratio} bottom={30 * ratio} additionalPadding={2}> */}
                    <TitleStyled>{cellInfo.title}</TitleStyled>
                    <TextWrapper $ratio={ratio} $commonMarginH={cellInfo.commonMarginH}>
                        <Text>{cellInfo.description}</Text>
                    </TextWrapper>
                    <ImageWrapper $ratio={ratio} $imgStyle={cellInfo.imgStyle ?? {}}>
                        <img src={cellInfo.modalImage ?? picture} alt=""/>
                    </ImageWrapper>
                    
                    <ButtonsWrapper $ratio={ratio}>
                        <Result $ratio={ratio}>
                            {
                                cellInfo.isPercent ? (
                                    <InfoBlock $ratio={ratio}>
                                        <p>ко всему доходу</p>
                                        <p><b>{cellInfo.income} с дивидендами</b></p>
                                    </InfoBlock>
                                ) : (
                                    <>
                                        <InfoBlock $ratio={ratio}>
                                            <p>сразу</p>
                                            <p><b>+{cellInfo.income}</b></p>
                                        </InfoBlock>
                                        <InfoBlock $ratio={ratio}>
                                            <p>каждый пн</p>
                                            <p><b>+{cellInfo.incomeNextWeeks}</b></p>
                                        </InfoBlock>
                                    </>
                                )
                            }
                            <InfoBlock $flex $ratio={ratio} $color="var(--color-purple)">
                                <p>разово</p>
                                <p><b>{cellInfo.cost}</b></p>
                            </InfoBlock>
                        </Result>
                        <Button disabled={isDisabled} onClick={onBuy}>купить</Button>
                        <Button type="secondary" mt={10 * ratio} onClick={onSkip}>пропустить</Button>
                    </ButtonsWrapper>
                {/* </Scrollbar> */}
             </BlockStyled>
        </Modal>
    )
}