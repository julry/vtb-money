import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import coin from '../../assets/images/coinImg.webp'

const ImageWrapper = styled.div`
    position: relative;
    width: ${({$ratio}) => $ratio * 100}px;
    height: ${({$ratio}) => $ratio * 123}px;
    background: rgba(0, 76, 218, 0.8);
    background: linear-gradient(165.33deg, rgba(173, 207, 245, 0.8) 10.37%, rgba(95, 131, 255, 0.8) 37.88%, rgba(0, 76, 218, 0.8) 76.25%);
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: inset 1.55061px 1.55061px 1.55061px rgba(0, 40, 130, 0.3);
    border-radius: ${({$ratio}) => $ratio * 16.7}px;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    ${({$isDisabled}) => $isDisabled ? 'filter: blur(5px)' : ''};
`;

const InfoWrapper = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 0;
    left: 0;
    background: #E1E6F3;
    border-width: 0px 0px 0.615966px 0.615966px;
    border-style: solid;
    border-color: rgba(0, 40, 130, 0.5);
    box-shadow: inset -0.615966px -1.23193px 1.7247px rgba(0, 76, 218, 0.2), inset 1.28326px 1.28326px 1.28326px rgba(173, 207, 245, 0.6);
    border-radius: ${({$ratio}) => $ratio * 16.7}px;
    padding: ${({$isCoins, $ratio}) => $isCoins ? $ratio * 3 + 'px ' + $ratio * 7 + 'px ' + $ratio * 2 + 'px ' + $ratio * 5 + 'px ' : $ratio * 7 + 'px ' + $ratio * 9 + 'px ' + $ratio * 7 + 'px ' + $ratio * 11 + 'px'};
    font-size: ${({$ratio}) => $ratio * 12}px;
    color: var(--color-accent);
    font-weight: 500;
`;

const CoinIcon = styled.img`
    width: ${({$ratio}) => $ratio * 24}px;
    height: ${({$ratio}) => $ratio * 24}px;
    object-fit: contain;
    margin-right: 3px;
`;

const DisabledBlock = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    inset: 0;
    z-index: 3;
    background: rgba(0, 40, 130, 0.5);
    color: white;
    text-align: center;
    border-radius: ${({$ratio}) => $ratio * 16.7}px;
    gap: var(--spacing_x3);
    font-weight: 500;
    font-size:  ${({$ratio}) => $ratio * 13.5}px;
`;

export const ShopCard = ({cardInfo, isDisabled, disabledText, shouldShowInfo = true, isCoins = true}) => {
    const ratio = useSizeRatio();

    return (
        <ImageWrapper $ratio={ratio}>
            <Image src={cardInfo.src} alt="" $isDisabled={isDisabled}/>
            {shouldShowInfo && (
                <InfoWrapper $ratio={ratio} $isCoins={isCoins}>
                    {isCoins && <CoinIcon $ratio={ratio} src={coin} alt=""/>}
                    <p>{isCoins ? cardInfo.cost : cardInfo.amount + ' шт.'}</p>
                </InfoWrapper>
            )}
            {isDisabled && (
                <DisabledBlock $ratio={ratio}>
                    <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.918 14.9172C10.514 14.9122 10.1183 15.0379 9.78416 15.2774C9.44998 15.5169 9.19336 15.8587 9.04883 16.2567C8.9043 16.6547 8.8788 17.0899 8.97577 17.5037C9.07274 17.9175 9.28752 18.29 9.59119 18.5711V20.5171C9.59119 20.8884 9.73098 21.2445 9.9798 21.507C10.2286 21.7696 10.5661 21.9171 10.918 21.9171C11.2699 21.9171 11.6073 21.7696 11.8561 21.507C12.105 21.2445 12.2447 20.8884 12.2447 20.5171V18.5711C12.5484 18.29 12.7632 17.9175 12.8602 17.5037C12.9571 17.0899 12.9316 16.6547 12.7871 16.2567C12.6426 15.8587 12.386 15.5169 12.0518 15.2774C11.7176 15.0379 11.3219 14.9122 10.918 14.9172Z" fill="white"/>
                        <rect x="0.917969" y="10.9171" width="20" height="16" rx="2.75122" stroke="white" strokeWidth="1.83415"/>
                        <path d="M5.91797 6.41705C5.91797 3.37949 8.3804 0.917053 11.418 0.917053V0.917053C14.4555 0.917053 16.918 3.37949 16.918 6.41705V10.9171H5.91797V6.41705Z" stroke="white" strokeWidth="1.83415"/>
                    </svg>
                    <p>{disabledText ?? 'товар закончился'}</p>
                </DisabledBlock>
            )}
        </ImageWrapper>
    )
}