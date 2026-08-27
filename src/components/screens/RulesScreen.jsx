import styled from "styled-components"
import { BackHeader } from "../shared/BackHeader"
import { Title } from "../shared/Title"
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { Text } from "../shared/Text";
import { Button } from "../shared/Button";
import { useProgress } from "../../hooks/useProgress";
import { rulesTexts } from '../../constants/rulesTexts';
import { SCREENS } from "../../constants/screens";
import { lazy } from "react";

const RulePrizeModal = lazy(() => import('./../shared/modals/RulePrizeModal').then((m) => ({ default: m.RulePrizeModal })));
const RuleTextModal = lazy(() => import('./../shared/modals/RuleTextModal').then((m) => ({ default: m.RuleTextModal })));
const RuleIncomeModal = lazy(() => import('./../shared/modals/RuleIncomeModal').then((m) => ({ default: m.RuleIncomeModal })));

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
    const { handleOpenModal, next, user } = useProgress();

    return (
        <>
            <BackHeader onBack={() => next(SCREENS.LOBBY)} />
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
                    {user.isTargeted && (
                        <>
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
                        </>
                    )}
                    <Button
                        onClick={() =>
                            handleOpenModal({
                                Component: (
                                    <RulePrizeModal isTargeted={user.isTargeted}/>
                                )
                            })
                        }
                    >Розыгрыш
                    </Button>
                    <Button
                        onClick={() =>
                            handleOpenModal({
                                Component: (
                                    <RuleTextModal
                                        title={"Написать\nв поддержку"}
                                        text={rulesTexts.support}
                                    />
                                )
                            })
                        }
                    >
                        Написать в поддержку
                    </Button>
                </ButtonsWrapper>
            </Wrapper>
        </>
    )
}

export default RulesScreen;
