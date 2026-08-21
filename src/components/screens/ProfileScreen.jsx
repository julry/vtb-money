import {FlexWrapper, FlexRowWrapper} from '../shared/ContentWrapper';
import styled from 'styled-components';
import { useSizeRatio } from '../../hooks/useSizeRatio';
import { BackHeader } from '../shared/BackHeader';
import { useProgress } from '../../hooks/useProgress';
import { useLayoutEffect, useRef, useState } from 'react';
import { SCREENS } from '../../constants/screens';
import { Title } from '../shared/Title';
import { Text } from '../shared/Text';
import avatar from '../../assets/images/person/persProfile.webp';
import avatarF from '../../assets/images/person/persProfileF.webp';
import { Button } from '../shared/Button';
import { ProfileModal } from '../shared/modals/ProfileModal';
import { AnimatePresence } from 'framer-motion';
import {MovingBlock} from '../shared/MovingBlock';
import {SubscribeModal} from '../shared/modals/SubscribeModal';
import { ItemsModal } from '../shared/modals/ItemsModal';
import { GENDERS } from '../../constants/genders';

const Wrapper = styled(FlexWrapper)`
    padding: calc(var(--spacing_x4) * 4) ${({ $ratio }) => 25 * $ratio}px ${({ $ratio }) => 45 * $ratio}px;
`;

const PersonalInfo = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing_x5);
    margin-top: calc(var(--spacing_x5) * 1.25);
    width: 100%;
    gap: var(--spacing_x5);
`;

const Avatar = styled.div`
    background: linear-gradient(165.33deg, rgba(173, 207, 245, 0.8) 10.37%, rgba(95, 131, 255, 0.8) 37.88%, rgba(0, 76, 218, 0.8) 76.25%);
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: inset 1.55061px 1.55061px 1.55061px rgba(0, 40, 130, 0.3);
    border-radius: ${({ $ratio }) => 16 * $ratio}px;
    width: ${({ $ratio }) => 122 * $ratio}px;
    height: ${({ $ratio }) => 122 * $ratio}px;
    flex-shrink: 0;

    & img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const TextWrapper = styled.div`
    background: rgba(0, 0, 0, 0.004);
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: inset 1.55061px 1.55061px 1.55061px rgba(0, 40, 130, 0.3);
    border-radius: ${({ $ratio }) => 10 * $ratio}px;
    margin-top: ${({ $ratio, $isFirst }) => $isFirst ? 0 : 10 * $ratio}px;
    color: #FFFFFF;
    width: 100%;
    white-space: nowrap;     
    overflow: hidden;       
    text-overflow: ellipsis; 
    line-height: 100%;
    font-size: var(--font_sm);
    padding:  ${({ $ratio }) => 9 * $ratio}px  ${({ $ratio }) => 9 * $ratio}px  ${({ $ratio }) => 10 * $ratio}px ${({ $ratio }) => 16 * $ratio}px;
`;

const RefLinkWrapper = styled(FlexRowWrapper)`
    margin-top: calc(var(--spacing_x4) - 1px);

    & p {
        width: fit-content;
    }
`;

const Subtite = styled(Text)`
    text-align: left;
    width: 100%;
    font-size: var(--font_sm);
    margin-top: ${({ $isFirst }) => $isFirst ? 0 : 'calc(var(--spacing_x4) - 1px)'};
`;

const FullWidthDiv = styled.div`
    width: 100%;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: calc(var(--spacing_x4) - 1px);
    width: 100%;
    margin-top: ${({ $ratio }) => 35 * $ratio}px;
`;

const ButtonStyled = styled(Button)`
    max-width: unset;
`;

const TitleStyled = styled(Title)`
    font-size: ${({ $ratio }) => 30 * $ratio}px;
`;

const ProfileScreen = ({ onClose }) => {
    const { user, next, isFemale, handleOpenModal, updateUser } = useProgress();
    const ratio = useSizeRatio();
    const linkRef = useRef();
    const [isSuccessCopy, setIsSuccessCopy] = useState(false);
    const isTargeted = user.isTargeted;

    const refLink = `https://tasks.fut.ru/people/${user?.gameId ?? ''}`;

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(refLink).then(() => {
                setIsSuccessCopy(true);

                setTimeout(() => setIsSuccessCopy(false), 3000);
            });
        }
    }

    useLayoutEffect(() => {
        if (!user.hasWatchedProfile) {
            handleOpenModal(
                {
                    Component: <ProfileModal linkRef={linkRef} refLink={refLink}/>,
                    blurSize: 5,
                }
            );
            updateUser({hasWatchedProfile: true});
        }
    }, []);

    const handleClose = () => {
        if (typeof onClose === 'function') {
            onClose();
            return;
        }

        // if (CURRENT_WEEK > 4 || user.gameProgress[12]?.isCompleted) {
        //     next(SCREENS.FINISH);

        //     return;
        // }

        next(SCREENS.LOBBY);
    }

    //TODO: заменить аватар в зависомсти от пола
    // isShownTickets = user.isTargeted;
    // Убрать кнопку, если нет товаров (?)
    return (
        <Wrapper $ratio={ratio}>
            <BackHeader onBack={handleClose} isShownTickets={isTargeted}/>
            <TitleStyled $ratio={ratio}>Профиль</TitleStyled>
            <PersonalInfo>
                <Avatar $ratio={ratio}>
                    <img src={isFemale ? avatarF : avatar} alt="" />
                </Avatar>
                <FullWidthDiv>
                    <TextWrapper $isFirst $ratio={ratio}>
                        {user.name ?? ''}
                    </TextWrapper>
                    <TextWrapper $ratio={ratio}>
                        {user.surname ?? ''}
                    </TextWrapper>
                    <TextWrapper $ratio={ratio}>
                        ID: {user.gameId}
                    </TextWrapper>
                </FullWidthDiv>
            </PersonalInfo>
            <Subtite $isFirst>Вуз</Subtite>
            <TextWrapper $ratio={ratio}>
                {user.university}
            </TextWrapper>
            <Subtite>Факультет</Subtite>
            <TextWrapper $ratio={ratio}>
                {user.faculty}
            </TextWrapper>
             <Subtite>E-mail</Subtite>
            <TextWrapper $ratio={ratio}>
                {user.email}
            </TextWrapper>
            <FullWidthDiv ref={linkRef}>
                <RefLinkWrapper $gap={8 * ratio} onClick={handleCopy}>
                    <Subtite $isFirst>Реферальная ссылка</Subtite>
                    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="11" height="11" rx="3" fill="#004CDA"/>
                        <rect x="3.5" y="2.5" width="10" height="10" rx="2.5" stroke="#004CDA"/>
                    </svg>
                </RefLinkWrapper>
               
                <TextWrapper $ratio={ratio} onClick={handleCopy}>
                    {refLink}
                </TextWrapper>
            </FullWidthDiv>
            <ButtonsWrapper $ratio={ratio}>
                <ButtonStyled onClick={() => handleOpenModal({Component: <SubscribeModal />})}>Подписаться на канал</ButtonStyled>
                {isTargeted && <Button 
                    onClick={() => handleOpenModal({Component: <ItemsModal />})} 
                    disabled={user?.shop?.length < 1}
                >
                    Заказы в магазине
                </Button>}
            </ButtonsWrapper>
            <AnimatePresence>
                {isSuccessCopy && (
                    <MovingBlock top={444} right={-30} width={205}>
                        <p>Скопировано</p>
                    </MovingBlock>
                )}
            </AnimatePresence>
        </Wrapper>
    )
};

export default ProfileScreen;
