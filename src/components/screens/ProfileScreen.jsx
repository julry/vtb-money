import { FlexWrapper } from '../shared/ContentWrapper';
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

const ProfileScreen = ({ onClose }) => {
    const { user, next, tgInfo, handleOpenModal, updateUser } = useProgress();
    const ratio = useSizeRatio();
    const linkRef = useRef();
    const [isSuccessCopy, setIsSuccessCopy] = useState(false);

    const refLink = `https://tasks.fut.ru/people/${tgInfo?.tgUserId ?? ''}`;
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
            <BackHeader onBack={handleClose} isShownTickets/>
            <Title>Профиль</Title>
            <PersonalInfo>
                <Avatar $ratio={ratio}>
                    <img src={avatar} alt="" />
                </Avatar>
                <FullWidthDiv>
                    <TextWrapper $isFirst $ratio={ratio}>
                        {user.name ?? ''}
                        Артем
                    </TextWrapper>
                    <TextWrapper $ratio={ratio}>
                        {user.surname ?? ''}
                        Кондрашов
                    </TextWrapper>
                    <TextWrapper $ratio={ratio}>
                        ID: 'XXXXXXXXX'
                        {/* {user.id} */}
                    </TextWrapper>
                </FullWidthDiv>
            </PersonalInfo>
            <Subtite $isFirst>Вуз</Subtite>
            <TextWrapper $ratio={ratio}>
                {/* {user.university} */}
                 НИУ ВШЭ Москва
            </TextWrapper>
            <Subtite>Факультет</Subtite>
            <TextWrapper $ratio={ratio}>
                {/* {user.faculty} */}
                Факультет мировой экономики и мировой политики
            </TextWrapper>
             <Subtite>E-mail</Subtite>
            <TextWrapper $ratio={ratio}>
                {user.email}
                akondrashov@futuretoday.ru
            </TextWrapper>
            <FullWidthDiv ref={linkRef}>
                <Subtite>Реферальная ссылка</Subtite>
                <TextWrapper $ratio={ratio}>
                    {refLink}
                </TextWrapper>
            </FullWidthDiv>
            <ButtonsWrapper $ratio={ratio}>
                <ButtonStyled>Подписаться на канал</ButtonStyled>
                <Button>Заказы в магазине</Button>
            </ButtonsWrapper>
        </Wrapper>
    )
};

export default ProfileScreen;
