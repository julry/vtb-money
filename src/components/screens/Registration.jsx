import { useMemo, useState } from "react";
import styled from "styled-components";
import { CURRENT_WEEK } from "../../contexts/ProgressProvider";
import { useProgress } from "../../hooks/useProgress";
import { faculties, universities } from "../../constants/universities";
import { Select } from "../shared/Select";
import { FlexWrapper } from "../shared/ContentWrapper";
import { Input } from "../shared/Input";
import { emailRegExp, russianRegExp } from "../../constants/regExp";
import { SCREENS } from "../../constants/screens";

import { useSizeRatio } from "../../hooks/useSizeRatio";

import { Title } from "../shared/Title";
import {LogoOutlined} from '../shared/LogoOutlined';
import { Block } from "../shared/Block";
import { Button } from "../shared/Button";

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

const Link = styled.a`
    font-weight: 500;
`;

const InputStyled = styled(Input)`
    margin-top: calc(1.5 * var(--spacing_x5));

    & + & {
        margin-top: var(--spacing_x5);
    }
`;

const SelectStyled = styled(Select)`
    margin-top: var(--spacing_x5);
`;

const Registration = () => {
    const ratio = useSizeRatio();
    const { next, checkEmailRegistrated, registrateUser } = useProgress();
    const [univ, setUniv] = useState({});
    const [fac, setFac] = useState({});
    const [otherUniv, setOtherUniv] = useState('');
    const [otherFac, setOtherFac] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isNetworkError, setIsNetworkError] = useState(false);
    const [isAgreed, setIsAgreed] = useState(true);
    const [isMailsAgreed, setIsMailsAgreed] = useState(true);
    const [isNameCorrect, setIsNameCorrect] = useState(true);
    const [isSurnameCorrect, setIsSurnameCorrect] = useState(true);
    const [isEmailFieldCorrect, setIsEmailFieldCorrect] = useState(true);
    const [isAlreadyHas, setIsAlreadyHas] = useState(false);

     //TODO: че происходит на найденную почту или это на экран раньше спрашивают
    const handleClick = async () => {
        const isUnivPicked = univ?.id === 'other' ? !!otherUniv.length : !!(univ.name);
        const isFacPicked = (univ.id === 'other' || fac?.id === 'other') ? !!otherFac?.length : !!(fac.name);
        const btnDisabled = !isSurnameCorrect || !isEmailFieldCorrect || !isNameCorrect || !isAgreed || !isUnivPicked || !isFacPicked;

        if (btnDisabled) {
            return;
        }

        setIsNetworkError(false);

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
        
        const regRes = await registrateUser({ 
            name: name.trim(), 
            surname: surname.trim(),
            email: email.trim(), 
            university, 
            universityId: univ?.id, 
            isAddsAgreed: isMailsAgreed,
            faculty, 
            facultyId: fac?.id,
            isTargeted: !!fac?.isTargeted,
        });

        setIsSending(false);

        //TODO: remove
        // if (regRes?.isError) {
        //     setIsNetworkError(true);
        //     return;
        // }

        if (CURRENT_WEEK < 1) {
            next(SCREENS.WAITING);

            return;
        }

        next(SCREENS.INTRO_RULES);
    }

    //TODO: че происходит на другое
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
        setIsEmailFieldCorrect(!!email.match(emailRegExp));
    };

    const handleNameBlur = () => setIsNameCorrect(name.length > 1 && name.match(russianRegExp));
    const handleSurnameBlur = () => setIsSurnameCorrect(surname.length > 1 && surname.match(russianRegExp));

    const handleChange = (e) => {
        if (isSending) return;
        setIsAlreadyHas(false);
        setIsEmailFieldCorrect();
        setEmail(e.target.value);
    };

    const handleChangeName = (e) => {
        if (isSending) return;
        setIsNameCorrect(true);
        setName(e.target.value);
    };
    
    const handleChangeSurname = (e) => {
        if (isSending) return;
        setIsNameCorrect(true);
        setName(e.target.value);
    };

    const handleFacPick = (id, name) => {
        if (!id || id === 'other') {
            setFac({id: 'other'});
            setOtherFac(name);

            return;
        }

        setFac({id, name});
    }

    const facultiesFilteres = useMemo(() => (
        faculties.filter(({university}) => university === univ.id)
    ), [univ]);

    return (
        <FlexWrapper>
            <LogoOutlined />
            <BlockStyled $ratio={ratio}>
                <Title>Регистрация</Title>
                <InputStyled
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

                <InputStyled
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

                <InputStyled
                    isCorrect={isEmailFieldCorrect}
                    type="email"
                    id="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={handleChange}
                    autoComplete="email"
                    onBlur={handleBlur}
                    errorText={'Что-то это не похоже на почту'}
                />

                <SelectStyled
                    value={univ.name}
                    options={universities}
                    onChoose={handlePickUniversity}
                    placeholder="Вуз"
                    zIndex={21}
                />

                {
                    univ?.id !== undefined && univ?.id !== 'other' && (
                        <SelectStyled 
                            value={fac.name}
                            options={facultiesFilteres}
                            placeholder="Факультет"
                            onChoose={handleFacPick}
                            zIndex={20}
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
                    <Button mt={15 * ratio}>Готово</Button>
            </BlockStyled>
        </FlexWrapper>
    )
};

export default Registration;
