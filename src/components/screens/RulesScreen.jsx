import styled from "styled-components"
import { BackHeader } from "../shared/BackHeader"
import { Title } from "../shared/Title"
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { Text } from "../shared/Text";
import { Button } from "../shared/Button";
import { useProgress } from "../../hooks/useProgress";
import { RuleTextModal } from '../shared/modals/RuleTextModal';
import { rulesTexts } from '../../constants/rulesTexts';
import { RulePrizeModal } from "../shared/modals/RulePrizeModal";
import { RuleIncomeModal } from '../shared/modals/RuleIncomeModal';
import { shopInfo } from "../../constants/shopInfo";
import { SCREENS } from "../../constants/screens";

const Wrapper = styled.div`
    padding: ${({ $ratio }) => $ratio * 64}px ${({ $ratio }) => $ratio * 25}px;
`;

const TextStyled = styled(Text)`
    text-align: center;
    margin: ${({ $ratio }) => $ratio * 10}px 0 ${({ $ratio }) => $ratio * 40}px;
`;

const ButtonsWrapper = styled.div`
    & button + button {
        margin-top: ${({ $ratio }) => $ratio * 10}px;
    }
`;

const RulesScreen = () => {
    const ratio = useSizeRatio();
    const { handleOpenModal, next } = useProgress();

    return (
        <>
            <BackHeader onBack={() => next(SCREENS.LOBBY)}/>
            <Wrapper $ratio={ratio}>
                <Title>Правила</Title>
                <TextStyled $ratio={ratio}>Здесь ты можешь узнать, как играть в игру и участвовать в розыгрыше.{'\n'}Жми на нужный раздел</TextStyled>
                <ButtonsWrapper $ratio={ratio}>
                    <Button
                        onClick={() =>
                            handleOpenModal({
                                Component: (
                                    <RuleTextModal
                                        title="Цель игры"
                                        text={rulesTexts.aim}
                                    />
                                )
                            })
                        }
                    >
                        Цель игры
                    </Button>
                    <Button
                        onClick={() =>
                            handleOpenModal({
                                Component: (
                                    <RuleIncomeModal />
                                )
                            })
                        }

                    >Как увеличить доход?</Button>
                    <Button
                        onClick={() =>
                            handleOpenModal({
                                Component: (
                                    <RuleTextModal
                                        title={"Как сделать ход?"}
                                        text={rulesTexts.move}
                                    />
                                )
                            })
                        }
                    >
                        Как сделать ход?
                    </Button>
                    <Button
                        onClick={() =>
                            handleOpenModal({
                                Component: (
                                    <RuleTextModal
                                        title={"Как работает\nмагазин?"}
                                        text={rulesTexts.shop}
                                    />
                                )
                            })
                        }
                    >
                        Как работает магазин?
                    </Button>
                    {/* {user.isTargeted && ( */}
                    <Button
                        onClick={() =>
                            handleOpenModal({
                                Component: (
                                    <RuleTextModal
                                        title="Билетики"
                                        text={rulesTexts.ticket}
                                    />
                                )
                            })
                        }
                    >
                        Билетики
                    </Button>
                    {/* )} */}
                    <Button
                        onClick={() =>
                            handleOpenModal({
                                Component: (
                                    <RulePrizeModal isTargeted
                                    // isTargeted={user.isTargeted}
                                    />
                                )
                            })
                        }
                    >Розыгрыш</Button>
                </ButtonsWrapper>
            </Wrapper>
        </>
    )
}

export default RulesScreen;
