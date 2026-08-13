import styled from 'styled-components';
import {motion} from 'framer-motion';
import { Modal } from './Modal';
import { useSizeRatio } from '../../../hooks/useSizeRatio';
import { useState } from 'react';
import { useProgress } from '../../../hooks/useProgress';
import {Text} from '../Text';

const Description = styled(motion.div)`
    position: absolute;
    top: ${({$ratio}) => $ratio * 326}px;
    right: ${({$ratio}) => $ratio * -89}px;
    width: ${({$ratio}) => $ratio * 394}px;
    color: var(--btn-color-main);
    font-size: ${({$ratio}) => $ratio * 16}px;
    background-color: var(--color-accent);
    z-index: 3;

    padding: ${({$ratio}) => $ratio * 20}px;
    padding-right: ${({$ratio}) => $ratio * 99}px;
    border-radius: var(--border-radius-md);
    box-shadow: inset 2px 2px 2px rgba(255, 255, 255, 0.4);

    text-align: left;
`;

const InfoWrapper = styled.div`
    position: absolute;
    top: ${({$top}) => $top}px;
    left: ${({$left}) => $left}px;
    width: calc(100% - ${({$left}) => 2 * $left}px);
`;

const TextWrapper = styled.div`
    background: rgba(0, 0, 0, 0.004);
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: 0px 0px 14px #FFFFFF, inset 1.55061px 1.55061px 1.55061px rgba(0, 40, 130, 0.3);
    border-radius: ${({ $ratio }) => 10 * $ratio}px;
    margin-top: ${({ $ratio, $isFirst }) => $isFirst ? 0 : 10 * $ratio}px;
    color: #FFFFFF;
    width: 100%;
    white-space: nowrap;     
    overflow: hidden;       
    text-overflow: ellipsis; 
    line-height: 100%;
    font-size: var(--font_sm);
    /* Rectangle 38 */
    padding:  ${({ $ratio }) => 9 * $ratio}px  ${({ $ratio }) => 9 * $ratio}px  ${({ $ratio }) => 10 * $ratio}px ${({ $ratio }) => 16 * $ratio}px;
`;

const Subtite = styled(Text)`
    text-align: left;
    width: 100%;
    color: white;
    font-size: var(--font_sm);
    margin-top: ${({ $isFirst }) => $isFirst ? 0 : 'calc(var(--spacing_x4) - 1px)'};
`;


export const ProfileModal = ({linkRef, refLink}) => {
    const {handleCloseModal} = useProgress();
    const ratio = useSizeRatio();

    return (
        <Modal onClick={handleCloseModal}>
            <Description 
                $ratio={ratio} 
                initial={{x: 394}}
                animate={{x: 0}} 
                exit={{x: 330}}
                transition={{duration: 0.25}}
            >
                <p>
                    Скопируй ссылку и поделись с друзьями со своего факультета
                </p>
                <br />
                <p>
                    За каждого мы начислим коины, когда они зарегистрируются в игре
                </p>
            </Description>
            <InfoWrapper $top={linkRef?.current?.offsetTop} $left={linkRef?.current?.offsetLeft}>
                <Subtite>Реферальная ссылка</Subtite>
                <TextWrapper $ratio={ratio} >{refLink}</TextWrapper>
            </InfoWrapper>
        </Modal>
    )
}