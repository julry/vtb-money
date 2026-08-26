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
    display: flex;
    align-items: center;
    gap: var(--spacing_x1);
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

const ShareButton = styled(Button)`
    height: ${({ $ratio }) => 26 * $ratio}px;
    min-height: ${({ $ratio }) => 26 * $ratio}px;
    padding: 0;
    padding-left: ${({ $ratio }) => 2 * $ratio}px;
    border-radius: ${({ $ratio }) => 6 * $ratio}px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0.5px 0.5px 1px rgba(1, 32, 103, 0.5), inset 1.38889px 1.38889px 1.38889px rgba(173, 207, 245, 0.5);
`;

const TextWrapperLink = styled(TextWrapper)`
    justify-content: space-between;
`;

const ProfileScreen = ({ onClose }) => {
    const { user, next, isFemale, handleOpenModal, updateUser, platform, isVkPlatform } = useProgress();
    const ratio = useSizeRatio();
    const linkRef = useRef();
    const [isSuccessCopy, setIsSuccessCopy] = useState(false);
    const isTargeted = user.isTargeted;

    const refLink = `https://tasks.fut.ru/people/${user?.gameId ?? ''}`;

    const handleCopy = (copyLink = refLink) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(copyLink).then(() => {
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

        // if (CURRENT_WEEK > 4) {
        //     next(SCREENS.FINISH);

        //     return;
        // }

        next(SCREENS.LOBBY);
    }

    const handleShare = async (e) => {
        e.stopPropagation();

        const shareData = {
            url: refLink
        };

        if (navigator.share) {
            try {
            await navigator.share(shareData);
            } catch (err) {
                console.log('Шаринг отменён или ошибка:', err);
            }
        } 
    };

    const handleSubscribe = () => {
        if (!platform) {
            handleOpenModal({Component: <SubscribeModal />})

            return;
        }

        let link = 'https://t.me/futru';

        if (isVkPlatform) {
            link = 'https://vk.ru/futuretoday';
        }

        window.open(link, '_blank');
    }

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
                    <TextWrapper $ratio={ratio} onClick={() => handleCopy(user.gameId)}>
                        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="11" height="11" rx="3" fill="#FFFFFF"/>
                            <rect x="3.5" y="2.5" width="10" height="10" rx="2.5" stroke="#FFFFFF"/>
                        </svg>
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
                <RefLinkWrapper $gap={8 * ratio} onClick={() => handleCopy()}>
                    <Subtite $isFirst>Реферальная ссылка</Subtite>
                    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="11" height="11" rx="3" fill="#004CDA"/>
                        <rect x="3.5" y="2.5" width="10" height="10" rx="2.5" stroke="#004CDA"/>
                    </svg>
                </RefLinkWrapper>
               
                <TextWrapperLink $ratio={ratio} onClick={() => handleCopy()}>
                    {refLink}
                    {navigator?.share && (
                        <ShareButton width={32} $ratio={ratio} onClick={handleShare}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.9318 6.08337H14.75C15.8546 6.08337 16.75 6.9788 16.75 8.08337V14.75C16.75 15.8546 15.8546 16.75 14.75 16.75H2.75C1.64543 16.75 0.75 15.8546 0.75 14.75V8.08338C0.75 6.97881 1.64543 6.08337 2.75 6.08337H6.56818" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M8.75391 9.63895V0.750061" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M11.4206 2.52784L8.75391 0.750061" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M6.08724 2.52784L8.75391 0.750061" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </ShareButton>
                    )}
                </TextWrapperLink>
            </FullWidthDiv>
            <ButtonsWrapper $ratio={ratio}>
                <ButtonStyled onClick={handleSubscribe}>Подписаться на канал</ButtonStyled>
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
