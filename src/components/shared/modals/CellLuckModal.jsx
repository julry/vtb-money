import styled from "styled-components";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import picture from '../../../assets/images/luckModal.webp';
import { Block } from "../Block";
import { Modal } from "./Modal";
import { Title } from "../Title";
import { Text } from "../Text";
import { Button } from "../Button";
import { useProgress } from "../../../hooks/useProgress";
import { motion, scale } from "framer-motion";

const BlockStyled = styled(Block)`
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: ${({ $ratio }) => $ratio * 562}px;
    max-height: ${({ $ratio }) => $ratio * 582}px;
    padding: ${({ $ratio }) => $ratio * 20}px ${({ $ratio }) => $ratio * 23}px ${({ $ratio }) => $ratio * 23}px;
    & button {
        position: relative;
        z-index: 2;
    }
`;

const TextWrapper = styled.div`
    padding: ${({ $ratio }) => $ratio * 10}px 0 ${({ $ratio }) => $ratio * 10}px;
`;

const ImageWrapper = styled.div`
    width: 100%;
    height: stretch;
    overflow: hidden;

    & img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const Result = styled.div`
    width: calc(100% - ${({ $ratio }) => $ratio * 46}px);
    position: absolute;
    bottom:  ${({ $ratio }) => $ratio * 81}px;
    left: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing_x1);
    transform: translateX(-50%);
    min-height: ${({ $ratio }) => $ratio * 60}px;
    color: white;
    text-align: center;
    background-color: ${({ $color }) => $color};
    border-radius:  ${({ $ratio }) => $ratio * 15}px;
`;

const NotificationWrapper = styled.div`
    position: relative;
    width: 100%;
    height: ${({ $ratio, $height }) => $ratio * ($height ?? 80)}px;
    flex-shrink: 0;
`;

const Notification = styled(motion.div)`
    position: absolute;
    right: ${({ $ratio }) => $ratio * -38}px;
    top: 0;
    width:  100%;
    padding: ${({ $ratio }) => $ratio * 15}px;
    background:#145ade;
    border: 0.520833px solid rgba(0, 76, 218, 0.5);
    box-shadow: 0.694444px 0.694444px 1.38889px rgba(1, 32, 103, 0.8), inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.4);
    border-radius: ${({ $ratio }) => $ratio * 15}px;

    color: #FFFFFF;
    font-size: ${({ $ratio }) => $ratio * 14}px;
    font-weight: 500;
    text-align: center;
`;

const NotificationPip = styled.svg`
    position: absolute;
    bottom: ${({ $ratio }) => $ratio * -22}px;
    right: ${({ $ratio }) => $ratio * 8}px;
`;

export const CellLuckModal = ({ cellInfo }) => {
    const ratio = useSizeRatio();
    const { user } = useProgress();
    const isLuck = user.cells?.find(({ name }) => name === cellInfo.id)?.isLuck;
    // const isLuck = true;

    const description = isLuck ? cellInfo.luckDescription : cellInfo.badluckDescription;
    const additional = isLuck ? cellInfo.luckAdditional : cellInfo.badluckAdditional;
    const notifHeight = isLuck ? cellInfo.notification?.luckHeight : cellInfo.notification?.badluckHeight;
    const notification = isLuck ? cellInfo?.notification?.luck : cellInfo?.notification?.badluck;
    const changedCoins = isLuck ? cellInfo.income : cellInfo.cost;

    const { handleCloseModal, finishCell } = useProgress();

    const onClose = () => {
        const cellData = isLuck ? { coinsAdd: cellInfo.income } : { cost: cellInfo.cost };

        finishCell(cellInfo.id, cellData, changedCoins);
        handleCloseModal();
    }

    return (
        <Modal isLighten>
            <BlockStyled $ratio={ratio}>
                <Title>{cellInfo.title}</Title>
                <TextWrapper $ratio={ratio}>
                    <Text>{description}</Text>
                </TextWrapper>
                {notification?.length > 0 && (
                    <NotificationWrapper
                        $ratio={ratio}
                        $height={notifHeight}
                    >
                        <Notification
                            $ratio={ratio}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.2 }}
                        >
                            <NotificationPip $ratio={ratio} width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_3003_15" maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="22">
                                    <rect width="30" height="22" fill="white" />
                                </mask>
                                <g mask="url(#mask0_3003_15)">
                                    <g filter="url(#filter0_di_3003_15)">
                                        <path d="M19 -71C27.2841 -70.9998 34 -64.2841 34 -56V-14C33.9998 -7.44332 29.7916 -1.87153 23.9297 0.167969C23.1784 7.87463 24.7085 14.9141 28.209 18.874C28.5686 19.281 28.1624 20.0791 27.6357 19.9463C11.6849 15.9237 3.12157 7.77683 0.103516 1H-224C-232.284 1 -239 -5.71594 -239 -14V-56C-239 -64.2843 -232.284 -71 -224 -71H19Z" fill="#145ADE" />
                                    </g>
                                </g>
                                <defs>
                                    <filter id="filter0_di_3003_15" x="-239.694" y="-71.6944" width="275.778" height="93.7388" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                        <feOffset dx="0.694444" dy="0.694444" />
                                        <feGaussianBlur stdDeviation="0.694444" />
                                        <feComposite in2="hardAlpha" operator="out" />
                                        <feColorMatrix type="matrix" values="0 0 0 0 0.00460681 0 0 0 0 0.126924 0 0 0 0 0.402137 0 0 0 0.8 0" />
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3003_15" />
                                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                        <feOffset dx="1.38889" dy="1.38889" />
                                        <feGaussianBlur stdDeviation="0.694444" />
                                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
                                        <feBlend mode="normal" in2="shape" result="effect2_innerShadow_3003_15" />
                                        <feBlend mode="normal" in="effect2_innerShadow_3003_15" in2="effect1_dropShadow_3003_15" result="effect2_innerShadow_3003_15" />
                                    </filter>
                                </defs>
                            </NotificationPip>
                            <p>
                                {notification}
                            </p>
                        </Notification>
                    </NotificationWrapper>
                )}
                {additional?.length >0 && (
                    <TextWrapper $ratio={ratio}>
                        <Text>{additional}</Text>
                    </TextWrapper>
                )}
                <ImageWrapper>
                    <img src={picture} alt="" />
                </ImageWrapper>
                <Result $ratio={ratio} $color={isLuck ? 'var(--color-pink)' : 'var(--color-purple)'}>
                    <p>{isLuck ? 'зачисление' : 'списание'}</p>
                    <p>{changedCoins}</p>
                </Result>
                <Button mt={66 * ratio} onClick={onClose}>далее</Button>
            </BlockStyled>
        </Modal>
    )
}