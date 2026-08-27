import {useMemo, useState, useEffect} from 'react';
import styled from "styled-components";
import { CURRENT_WEEK } from "../../contexts/ProgressProvider";
import { useProgress } from "../../hooks/useProgress";
import { faculties, universities } from "../../constants/universities";
import { Select } from "../shared/Select";
import { FlexWrapper } from "../shared/ContentWrapper";
import { Input } from "../shared/Input";
import { emailRegExp, russianRegExp } from "../../constants/regExp";

import { useSizeRatio } from "../../hooks/useSizeRatio";

import { Title } from "../shared/Title";
import {LogoOutlined} from '../shared/LogoOutlined';
import { Block } from "../shared/Block";
import { Button } from "../shared/Button";
import {preload} from '../../constants/screensComponents';
import { useImagePreloader } from '../../hooks/useImagePreloader';
import { firstLobbyImages } from '../../constants/preloads';

const BlockStyled = styled(Block)`
    margin-top: ${({$ratio}) => $ratio * 27}px;
    padding: ${({$ratio}) => $ratio * 20}px ${({$ratio}) => $ratio * 25}px ${({$ratio}) => $ratio * 25}px;
`;

const InputRadioButton = styled.input`
    display: none;
`;

const RadioIconStyled = styled.div`
    position: relative;
    flex-shrink: 0;
    border: 0.5px solid var(--color-accent);
    border-radius: 6px;
    width: var(--spacing_x5);
    height: var(--spacing_x5);
    margin-right: var(--spacing_x1);
`;

const RadioButtonLabel = styled.label`
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    font-size: var(--font_xxs);
    color: var(--color-accent);
    width: 100%;
    line-height: 110%;
    text-align: left;
    max-width: 300px;
    margin-top: var(--spacing_x4);

    & + &  {
        margin-top: var(--spacing_x1);
    }

    & ${InputRadioButton}:checked + ${RadioIconStyled}::after {
       content: '';
       position: absolute;
       border-radius: 20px;
       top: 47%;
       left: 18%;
       height: 3px;
       width: calc(var(--spacing_x5) / 2.8);
       transform: rotate(45deg);
       background-color: var(--color-accent);
    }

    & ${InputRadioButton}:checked + ${RadioIconStyled}::before {
       content: '';
       position: absolute;
       border-radius: 20px;
       top: 40%;
       left: 31%;
       width: calc(var(--spacing_x5) / 1.8);
       height: 3px;
       background-color: var(--color-accent);
       transform: rotate(-50deg);
    }
`;

const InputStyled = styled(Input)`
    --inputMargin: ${({$isSmall}) => $isSmall ? 'var(--spacing_x2)' : 'var(--spacing_x4)'};

    margin-bottom: ${({$marginTop}) => $marginTop ?? 'var(--inputMargin)'};

    transition: margin 0.25s;
`;

const InputWithError = styled(Input)`

    margin-top: calc(1.5 * var(--spacing_x2));
    margin-bottom: ${({$isSmall}) => $isSmall ? 'calc(0.8 * var(--spacing_x5))' : 'var(--spacing_x5)'};

    transition: margin 0.25s;

    & + & {
        margin-top: 0;
    }
`;

const SelectStyled = styled(Select)`
    --inputMargin: ${({$isSmall}) => $isSmall ? 'var(--spacing_x2)' : 'var(--spacing_x4)'};

    margin-bottom: var(--inputMargin);

    transition: margin 0.25s;
`;

const Registration = () => {
    const ratio = useSizeRatio();
    const { next, checkEmailRegistrated, updateUser } = useProgress();
    const [univ, setUniv] = useState({});
    const [fac, setFac] = useState({});
    const [otherUniv, setOtherUniv] = useState('');
    const [otherFac, setOtherFac] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isAgreed, setIsAgreed] = useState(true);
    const [isMailsAgreed, setIsMailsAgreed] = useState(true);
    const [isNameCorrect, setIsNameCorrect] = useState(true);
    const [isSurnameCorrect, setIsSurnameCorrect] = useState(true);
    const [isEmailFieldCorrect, setIsEmailFieldCorrect] = useState(true);
    const [promocode, setPromocode] = useState('');
    const [isAlreadyHas, setIsAlreadyHas] = useState(false);

    useImagePreloader(CURRENT_WEEK > 0 ? firstLobbyImages : []);

    useEffect(() => {
        Promise.all([
            preload.sex(),
            ...(CURRENT_WEEK > 0 ? [preload.lobby(), preload.profile(), preload.rules(), () => `import('../shared/modals/OnboardingModal')`] : [preload.waiting()]),
        ]).catch(console.error);
    }, []);

    const handleClick = async () => {
        const isUnivPicked = univ?.id === 'other' ? !!otherUniv.length : !!(univ.name);
        const isFacPicked = (univ.id === 'other' || fac?.id === 'other') ? !!otherFac?.length : !!(fac.name);
        const btnDisabled = !isSurnameCorrect || !isEmailFieldCorrect || !isNameCorrect || !isAgreed || !isUnivPicked || !isFacPicked;

        if (btnDisabled) {
            return;
        }

        if (isSending) return;
        setIsSending(true);

        const hasEmail = await checkEmailRegistrated(email);

        if (hasEmail) {
            setIsAlreadyHas(true);
            setIsSending(false);

            return;
        }

        const university = univ?.id === 'other' ? otherUniv?.trim() : univ?.name;
        const faculty = univ?.id === 'other' || fac?.id === 'other' ? otherFac?.trim() : fac?.name;
        
        updateUser({ 
            name: name.trim(),
            surname: surname.trim(), 
            email: email.trim(), 
            university, 
            universityId: univ?.id,
            faculty,  
            facId: fac?.id,
            isTargeted: !!fac.id && fac?.id !== 'other',
            promocode
        });

        setIsSending(false);

        next();
    }

    const handlePickUniversity = (id, name) => {
        if (univ?.id === id) return;

        if (id === 'other') {
            setFac({id: 'other'});
        } else {
            setFac({});
        }

        setUniv({ id, name });
        setFac({});
        setOtherFac();
    }

    const handleBlur = () => {
        setIsAlreadyHas(false);
        setIsEmailFieldCorrect(!!email.match(emailRegExp));
    };

    const handleNameBlur = () => setIsNameCorrect(name.length > 1 && name.match(russianRegExp));
    const handleSurnameBlur = () => setIsSurnameCorrect(surname.length > 1 && surname.match(russianRegExp));

    const handleChange = (e) => {
        if (isSending) return;
        setIsAlreadyHas(false);
        setIsEmailFieldCorrect(true);
        setEmail(e.target.value);
    };

    const handleChangeName = (e) => {
        if (isSending) return;
        setIsNameCorrect(true);
        setName(e.target.value);
    };
    
    const handleChangeSurname = (e) => {
        if (isSending) return;
        setIsSurnameCorrect(true);
        setSurname(e.target.value);
    };

    const handleFacPick = (id, name) => {
        if (!id || id === 'other') {
            setFac({id: 'other'});

            return;
        }

        setFac({id, name});
    }

    const facultiesFilteres = useMemo(() => (
        faculties.filter(({university, id}) => university === univ.id || id === 'other')
    ), [univ]);

    return (
        <FlexWrapper>
            <LogoOutlined />
            <BlockStyled $ratio={ratio}>
                <Title>Регистрация</Title>
                <InputWithError
                    $isSmall={univ?.id === 'other' || fac?.id === 'other'}
                    type="text"
                    id="name"
                    value={name}
                    isCorrect={isNameCorrect}
                    onChange={handleChangeName}
                    onBlur={handleNameBlur}
                    placeholder="Имя"
                    autoComplete="name"
                    errorText={name.length < 2 ? 'Слишком короткое имя' : 'Принимаем только русские буквы'}
                />

                <InputWithError
                    $isSmall={univ?.id === 'other' || fac?.id === 'other'}
                    type="text"
                    id="surname"
                    value={surname}
                    onChange={handleChangeSurname}
                    onBlur={handleSurnameBlur}
                    placeholder="Фамилия"
                    autoComplete="surname"
                    isCorrect={isSurnameCorrect}
                    errorText={surname.length < 2 ? 'Слишком короткая фамилия' : 'Принимаем только русские буквы'}
                />

                <InputWithError
                    $isSmall={univ?.id === 'other' || fac?.id === 'other'}
                    isCorrect={!isAlreadyHas && isEmailFieldCorrect}
                    type="email"
                    id="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={handleChange}
                    autoComplete="email"
                    onBlur={handleBlur}
                    errorText={isAlreadyHas ? 'Такая почта уже зарегистрирована' : 'Что-то это не похоже на почту'}
                />

                <SelectStyled
                    $isSmall={univ?.id === 'other' || fac?.id === 'other'}
                    value={univ.name}
                    options={universities}
                    onChoose={handlePickUniversity}
                    placeholder="Вуз"
                    zIndex={21}
                />

                {
                    univ?.id !== undefined && univ?.id !== 'other' && (
                        <SelectStyled 
                            $isSmall={univ?.id === 'other' || fac?.id === 'other'}
                            value={fac.name}
                            options={facultiesFilteres}
                            placeholder="Факультет"
                            onChoose={handleFacPick}
                            zIndex={20}
                        />
                    )
                }
                {
                    univ?.id !== undefined && univ?.id === 'other' && (
                        <InputStyled
                            $isSmall={univ?.id === 'other' || fac?.id === 'other'}
                            isCorrect 
                            value={otherUniv}
                            placeholder="ВУЗ"
                            onChange={(e) => setOtherUniv(e.target.value)}
                        />
                    )
                }

                {
                    (univ?.id === 'other' || fac?.id !== undefined && fac?.id === 'other') && (
                        <InputStyled
                            $isSmall={univ?.id === 'other' || fac?.id === 'other'}
                            isCorrect 
                            value={otherFac}
                            placeholder="Факультет"
                            onChange={(e) => setOtherFac(e.target.value)}

                        />
                    )
                }
                {
                    CURRENT_WEEK > 0 && (
                        <InputStyled
                            isCorrect
                            $isSmall
                            type="text"
                            id="promocode"
                            value={promocode}
                            onChange={(e) => setPromocode(e.target.value)}
                            placeholder="Промокод"
                        />
                    )
                }
                <RadioButtonLabel>
                        <InputRadioButton
                            type="checkbox"
                            value={isAgreed}
                            checked={isAgreed}
                            onChange={() => setIsAgreed((prevAgreed) => !prevAgreed)}
                        />
                        <RadioIconStyled />
                        <span>
                            Я даю согласие на{"\u00A0"}
                            <a
                                href={"https://fut.ru/personal_data_agreement"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                обработку
                            </a>{" "}
                            и{"\u00A0"}
                            <a
                                href={"https://fut.ru/personal_data_transfer_agreement"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                передачу
                            </a>{" "}
                            моих персональных данных и соглашаюсь с{" "}
                            <a
                                href={'https://fut.ru/user-agreement'}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Политикой обработки персональных данных
                            </a>
                            , а также с {"\u00A0"}
                            <a
                                href={''}
                                target="_blank"
                                rel="noreferrer"
                            >правилами проведения акции</a>.
                        </span>
                </RadioButtonLabel>
                <RadioButtonLabel>
                    <InputRadioButton
                        type="checkbox"
                        value={isMailsAgreed}
                        checked={isMailsAgreed}
                        onChange={() => setIsMailsAgreed((prevAgreed) => !prevAgreed)}
                    />
                    <RadioIconStyled />
                    <span>
                        Хочу ловить{"\u00A0"}
                        <a
                            href={"https://fut.ru/adv_messages_agreement"}
                            target="_blank"
                            rel="noreferrer"
                        >
                            персональные стажировки от топ‑компаний в рекламной рассылке
                        </a>.
                    </span>
                </RadioButtonLabel>
                <Button mt={15 * ratio} onClick={handleClick}>Готово</Button>
            </BlockStyled>
        </FlexWrapper>
    )
};

export default Registration;
