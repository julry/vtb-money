import { useState } from "react";
import styled from "styled-components";
import { CURRENT_WEEK, useProgress } from "../../contexts/ProgressContext";
import { universities } from "../../constants/universities";
import { Select } from "../shared/Select";
import { FlexWrapper } from "../shared/ContentWrapper";
import { Input } from "../shared/Input";
import { emailRegExp } from "../../constants/regExp";
import { SCREENS } from "../../constants/screens";
import { BrightScreen } from "../shared/BrightScreen";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { PurpleText } from "../shared/Texts";
import { InputAutocomplete } from "../shared/InputAutocomplete";

const PurpleTextBold = styled(PurpleText)`
    position: relative;
    z-index: 2;
    font-size: calc(1.6 * var(--font_xl));
    margin-bottom: calc(var(--spacing_x6) * 2);
    margin-top: calc(var(--spacing_x3) * 1.1);
`;

const Content = styled(FlexWrapper)`
    z-index: 2;
    padding: 0;
    flex-grow: 1;
    min-width: ${({$ratio}) => $ratio * 300}px;
    max-width: ${({$ratio}) => $ratio * 300}px;
    gap: var(--spacing_x2);
`;

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const Picture = styled.div`
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: ${({$ratio}) => $ratio * 88}px;
`;

const WrongText = styled.p`
    margin-top: var(--spacing_x2);
    color: var(--color-green);
    font-size: var(--font_xs);
`;

const InfoIconWrapper = styled.div`
    position: absolute;
    right: calc(var(--spacing_x2) * 1.5);
    top: 50%;
    transform: translateY(-50%);
    width: ${({$ratio}) => $ratio * 20}px;
    height: ${({$ratio}) => $ratio * 20}px;
`;

const InputRadioButton = styled.input`
    display: none;
`;

const RadioIconStyled = styled.div`
    position: relative;
    flex-shrink: 0;
    width: calc(var(--spacing_x3) + var(--spacing_x1) / 2);
    height: calc(var(--spacing_x3) + var(--spacing_x1) / 2);
    background-color: var(--color-white);
    box-shadow: inset 0 0 0 2px var(--color-white);
    border-radius: var(--border-radius-xs);
    margin-right: var(--spacing_x1);
    margin-top: calc(var(--spacing_x1) / 2);
    border-radius: 50%;
    background: #CFCFCF;
`;

const RadioButtonLabel = styled.label`
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    font-size: var(--font_xxs);
    color: var(--color-black);
    width: 100%;
    text-align: left;
    max-width: 300px;
    margin-top: var(--spacing_x4);

    & + &  {
        margin-top: var(--spacing_x1);
    }

    & ${InputRadioButton}:checked + ${RadioIconStyled} {
        background: #7CDB01;
    }

    & ${InputRadioButton}:checked + ${RadioIconStyled}::after {
       content: '';
       position: absolute;
       border-radius: 20px;
       top: 47%;
       left: 21%;
       height: 2px;
       width: 4px;
       transform: rotate(45deg);
       background-color: white;
    }

    & ${InputRadioButton}:checked + ${RadioIconStyled}::before {
       content: '';
       position: absolute;
       border-radius: 20px;
       top: 40%;
       left: 33%;
       width: 7px;
       height: 2px;
       background-color: white;
       transform: rotate(-40deg);
    }
`;

const Link = styled.a`
    font-weight: 500;
`;

export const Registration = () => {
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
    const [isNameCorrect, setIsNameCorrect] = useState();
    const [isSurnameCorrect, setIsSurnameCorrect] = useState();
    const [isEmailFieldCorrect, setIsEmailFieldCorrect] = useState();
    const [isAlreadyHas, setIsAlreadyHas] = useState(false);

    const handleClick = async () => {
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

    const handleNameBlur = () => setIsNameCorrect(name.length > 1);
    const handleSurnameBlur = () => setIsSurnameCorrect(surname.length > 1);

    const handleChange = (e) => {
        if (isSending) return;
        setIsAlreadyHas(false);
        setIsEmailFieldCorrect();
        setEmail(e.target.value);
    };

    const handleFacPick = (fac) => {
        if (!fac.id || fac.id === 'other') {
            setFac({id: 'other'});
            setOtherFac(fac);

            return;
        }

        setFac(fac);
    }

    const isUnivPicked = univ?.id === 'other' ? !!otherUniv.length : !!(univ.name);
    const isFacPicked = (univ.id === 'other' || fac?.id === 'other') ? !!otherFac?.length : !!(fac.name);
    const btnDisabled = !isSurnameCorrect || !isEmailFieldCorrect || !isNameCorrect || !isAgreed || !isUnivPicked || !isFacPicked;

    const getIcon = (isCorrect) => {
        if (typeof isCorrect !== "boolean") return;

        if (isCorrect) return (
            <InfoIconWrapper $ratio={ratio}>
                <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 10L7.5 14.5L17 5" stroke="#2DE500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </InfoIconWrapper>
        )

        return (
            <InfoIconWrapper  $ratio={ratio}>
                <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 5L15.5 15.5M15.5 5L5 15.5" stroke="#ED3125" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </InfoIconWrapper>
        )
    }

    return (
        <BrightScreen 
            $ratio={ratio} 
            onClick={handleClick} 
            buttonText={"Готово"} 
            isDisabledButton={btnDisabled}
            hasLogo={false}
            svgComponent={
                <svg width="100%" height="100%" viewBox="0 0 357 606" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M61.9172 605.542C17.7725 605.542 8.13271 583.357 6.83805 572.154C-6.44626 457.2 4.18163 299.16 1.62696 284.06C-0.927711 268.96 14.9113 93.6069 14.9113 46.3588C14.9113 -0.889282 61.9172 -1.06744 90.0185 0.393799C118.12 1.8551 283.086 2.29291 315.275 5.70251C353.705 9.77325 354.703 58.9262 351.709 92.6662C349.173 121.232 353.078 268.231 353.078 303.957C353.078 352.904 363.315 541.095 350.71 582.609C348.69 589.262 343.399 593.99 334.241 596.205C280.773 609.132 109.029 605.542 61.9172 605.542Z" fill="white"/>
                </svg>

            }
            blockSize={{height: 606, width: 357}}
        >
            <PurpleTextBold>Регистрация</PurpleTextBold>
            <Picture $ratio={ratio}>
                <svg width="100%" height="100%" viewBox="0 0 330 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_2016_1218)">
                    <path d="M282.592 72.4851C282.397 72.6563 282.159 72.7786 282.233 73.0596C282.594 73.8659 282.594 73.8659 283.48 73.6944C283.303 74.281 282.869 74.5745 282.564 75.0145C282.064 75.6257 283.103 75.9246 282.926 76.5112C282.022 76.2673 282.022 76.2673 281.746 75.5587C281.63 75.2288 281.398 75.2595 281.166 75.2901C281.019 75.4185 280.964 75.5529 280.818 75.6813C280.989 75.8767 281.16 76.0721 280.916 76.2861C280.77 76.4145 280.55 76.2619 280.372 76.1581C280.037 76.366 279.97 76.6837 279.903 77.0014C280.521 78.1009 280.472 78.1437 279.673 79.1033C279.985 79.9523 280.896 80.1047 281.501 80.697C282.894 80.513 283.882 79.4739 285.03 78.8135C286.66 77.8169 288.205 76.7225 289.749 75.6281C290.616 75.0412 290.616 75.0412 291.442 75.7862C292.744 76.9769 293.852 78.3388 295.258 79.3523C296.004 79.908 296.517 79.8039 296.986 78.9605C297.2 78.5144 297.321 78.0622 297.26 77.5979C297.007 75.8324 296.804 74.024 296.46 72.2524C296.288 71.3666 296.465 70.7799 297.191 70.2297C298.785 69.0925 300.249 67.8088 301.971 66.8182C302.069 66.7327 302.215 66.6043 302.313 66.5187C302.85 66.048 303.522 65.6322 303.441 64.7525C303.343 64.1477 302.083 63.0058 301.307 62.9084C299.939 62.7258 298.625 62.4087 297.177 62.7271C295.357 63.1129 294.838 62.6182 294.732 60.7243C294.694 59.8934 294.565 59.0565 294.57 58.2744C294.507 56.4293 294.299 56.0934 292.515 55.2389C292.026 55.6668 291.764 56.1558 291.63 56.7912C291.259 58.2394 290.136 59.2236 289.453 60.513C289.301 60.7331 289.105 60.9042 288.996 61.1731C288.374 62.9269 287.177 62.9397 285.576 62.7877C283.975 62.6357 282.307 62.1111 280.658 62.6923C280.377 62.7657 279.974 62.601 279.656 62.5339C278.887 63.0353 278.435 63.6037 278.876 64.5994C278.956 64.7887 278.895 65.0148 278.926 65.247C279.091 65.534 279.305 65.7783 279.666 65.8942C280.753 66.1503 281.542 66.7548 282.08 67.6649C282.594 68.2511 283.2 68.8435 283.909 69.2586C284.049 69.2219 284.245 69.0507 284.287 69.0996C284.459 69.295 284.178 69.3684 284.123 69.5029C284.16 69.6434 284.105 69.7778 284.142 69.9183C284.613 70.4558 283.855 70.7738 283.923 71.1465C284.04 72.1667 283.429 72.3564 282.592 72.4851Z" fill="#00AAFF"/>
                    <path d="M279.673 79.1034C280.472 78.1438 280.478 78.0522 279.903 77.0016C279.354 77.6556 278.89 78.4073 278.787 79.2749C278.72 79.5927 278.647 80.002 279.008 80.118C279.815 80.4475 280.5 81.2292 281.501 80.6972C280.895 80.1048 279.985 79.9525 279.673 79.1034C279.532 79.1402 279.441 79.1341 279.538 79.0485L279.673 79.1034Z" fill="#00AAFF"/>
                    <path d="M281.123 75.2413C281.355 75.2107 281.587 75.18 281.703 75.5099C281.979 76.2185 281.979 76.2185 282.883 76.4624C283.152 75.8819 282.021 75.577 282.521 74.9658C282.869 74.5746 283.309 74.1894 283.436 73.6456C282.551 73.8171 282.551 73.8171 282.19 73.0108C281.775 73.7197 281.048 74.2699 281.123 75.2413Z" fill="#00AAFF"/>
                    <path d="M278.925 65.2469C278.937 65.0636 278.955 64.7886 278.876 64.5993C278.478 63.6525 278.935 62.9924 279.656 62.5338C278.983 62.2592 278.446 62.7299 277.97 62.9746C277.445 63.262 277.354 63.9463 277.69 64.4288C277.941 64.8135 278.229 65.3389 278.925 65.2469Z" fill="#00AAFF"/>
                    <path d="M282.592 72.4849C283.38 72.3989 284.083 72.2153 283.831 71.1401C283.764 70.7675 284.521 70.4494 284.05 69.912C283.538 70.7065 282.756 71.3912 282.592 72.4849Z" fill="#00AAFF"/>
                    <path d="M282.032 67.7078C281.493 66.7977 280.661 66.1444 279.617 65.9372C280.387 66.8166 281.219 67.4699 282.032 67.7078Z" fill="#00AAFF"/>
                    <path d="M280.421 76.1154C280.549 76.262 280.727 76.3657 280.965 76.2434C281.209 76.0295 280.995 75.7852 280.866 75.6386C280.671 75.8098 280.525 75.9382 280.421 76.1154Z" fill="#00AAFF"/>
                    <path d="M284.031 69.4967C284.086 69.3622 284.367 69.2888 284.196 69.0933C284.153 69.0445 283.957 69.2157 283.817 69.2524C283.903 69.3501 283.945 69.3989 284.031 69.4967Z" fill="#00AAFF"/>
                    <path d="M279.673 79.1038C279.63 79.0549 279.538 79.0489 279.538 79.0489C279.532 79.1405 279.532 79.1405 279.673 79.1038Z" fill="#00AAFF"/>
                    <path d="M43.3112 35.6692C41.3548 36.5762 39.7567 35.6983 38.2232 34.7018C37.8329 34.4303 37.6 34.0112 37.2376 33.8293C35.3699 32.7405 34.8134 32.9145 34.233 34.9657C33.5146 37.552 32.8608 40.0197 32.2351 42.5771C31.7108 44.8075 30.2742 45.7487 28.0462 45.4614C27.6192 45.3982 27.1361 45.1557 26.9959 44.7075C26.7156 43.8112 26.2498 42.9728 26.3124 41.8708C26.3623 39.0999 26.1986 36.2974 26.1557 33.5556C26.1623 32.2743 25.8453 31.5862 24.3873 31.1565C21.8983 30.3605 19.3533 29.3852 17.0304 28.1436C15.5811 27.416 13.6961 26.9231 13.3576 24.8641C12.9264 22.8341 13.3427 22.2119 15.4026 21.9613C17.2489 21.6791 19.0304 21.5156 20.9047 21.323C21.0902 21.265 21.3965 21.2676 21.582 21.2096C24.1789 20.3975 24.7375 21.2068 24.5997 17.5106C24.3779 13.5455 25.2884 9.61984 26.5613 5.87611C26.8288 5.10363 29.2877 4.82669 29.6327 5.60441C31.0495 8.50701 34.2545 9.96477 35.5785 12.8964C35.9516 13.7637 36.5101 14.5731 36.976 15.4114C37.3857 16.0705 37.9336 16.1944 38.6755 15.9624C40.5305 15.3823 42.1526 14.383 43.6625 13.0252C45.2651 11.6383 46.8245 11.7411 48.2199 13.2728C48.8431 13.9635 48.9747 14.7096 48.6144 15.5111C48.485 15.7484 48.3835 16.0752 48.1614 16.3415C46.041 18.6775 44.5806 21.4959 42.3955 23.9504C41.6362 24.7783 41.5261 25.4031 42.02 26.3311C43.0077 28.1871 43.8099 30.1011 44.8903 31.9281C46.1562 33.697 45.9922 35.1259 43.3112 35.6692Z" fill="#FF4052"/>
                    <path d="M308.006 40.7176C307.924 39.5682 308.745 39.1576 309.566 38.7471C311.209 38.0903 311.209 38.0903 310.881 36.3662C310.881 36.1199 310.799 35.8736 310.799 35.5452C310.634 33.4105 310.963 33 313.099 33C314.167 33 314.495 33.4105 314.577 34.3136C314.659 35.0526 314.906 35.8736 314.906 36.6125C314.906 37.6798 315.317 38.1724 316.467 38.0903C317.124 38.0082 317.781 38.0903 318.438 38.1724C319.752 38.1724 320.656 39.3219 320.41 40.5534C320.328 41.1281 319.999 41.5386 319.342 41.6207C318.603 41.7028 317.781 41.867 317.042 41.9491C315.645 42.1133 315.645 42.1133 315.81 43.509C315.892 44.0017 315.974 44.4943 316.056 45.069C316.22 46.2184 315.727 47.2857 314.824 47.45C313.838 47.6963 312.852 47.0394 312.442 45.9721C312.277 45.4795 312.113 44.9869 311.949 44.4943C311.538 42.6059 311.538 42.6059 309.566 42.5238C308.416 42.1954 308.006 41.7849 308.006 40.7176Z" fill="#04E061"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_2016_1218">
                    <rect width="330" height="88" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
            </Picture>
            <Content $ratio={ratio}>
                 <InputWrapper>
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            isCorrect={isNameCorrect}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleNameBlur}
                            placeholder="Имя"
                            autoComplete="name"
                        />
                        {getIcon(isNameCorrect)}
                    </InputWrapper>
                    <InputWrapper>
                        <Input
                            type="text"
                            id="surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            onBlur={handleSurnameBlur}
                            placeholder="Фамилия"
                            autoComplete="surname"
                            isCorrect={isSurnameCorrect}
                        />
                        {getIcon(isSurnameCorrect)}
                    </InputWrapper>
                    <InputWrapper>
                        <Input
                            isCorrect={isEmailFieldCorrect}
                            type="email"
                            id="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={handleChange}
                            autoComplete="email"
                            onBlur={handleBlur}
                        />
                        {getIcon(isEmailFieldCorrect)}
                    </InputWrapper>
                    <Select
                        value={univ.name}
                        options={universities}
                        onChoose={handlePickUniversity}
                        placeholder="Вуз"
                        zIndex={21}
                    />
                    {univ.id === 'other' ? (
                        <>
                            <Input
                                type="text"
                                id="university"
                                value={otherUniv}
                                onChange={(e) => setOtherUniv(e.target.value)}
                                placeholder="Введи название своего вуза"
                                autoComplete="university"
                            />
                            <Input
                                type="text"
                                id="faculty"
                                value={otherFac}
                                onChange={(e) => setOtherFac(e.target.value)}
                                placeholder="Введи название своего факультета"
                                autoComplete="faculty"
                            />
                        </>
                    ) : 
                        univ.name && (
                            <InputAutocomplete key={univ.id} onPick={handleFacPick} univId={univ.id}/>
                        )
                    }
                   
                    {isAlreadyHas && (
                        <WrongText>Ой! Эта почта уже зарегистрирована. Попробуй ввести снова.</WrongText>
                    )}
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
                            <Link
                                href={"https://fut.ru/personal_data_agreement"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                обработку
                            </Link>{" "}
                            и{"\u00A0"}
                            <Link
                                href={"https://fut.ru/personal_data_transfer_agreement"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                передачу
                            </Link>{" "}
                            моих персональных данных и соглашаюсь с{" "}
                            <Link
                                href={'https://fut.ru/user-agreement'}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Политикой обработки персональных данных
                            </Link>
                            , а также с {"\u00A0"}
                            <Link
                                href={'https://avito-maze.fut.ru/agreement.pdf'}
                                target="_blank"
                                rel="noreferrer"
                            >правилами проведения акции</Link>.
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
                            <Link
                                href={"https://fut.ru/adv_messages_agreement"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                персональные стажировки от топ‑компаний в рекламной рассылке
                            </Link>.
                        </span>
                    </RadioButtonLabel>
                    {isNetworkError && (
                        <WrongText>Ой! Что-то пошло не так, попробуй позже.</WrongText>
                    )}
            </Content>

        </BrightScreen>
    )
}