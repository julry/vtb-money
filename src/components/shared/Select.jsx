import styled from "styled-components";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { Scrollbar } from "./ScrollBar";

const SelectWrapper = styled.div`
    position: relative;
    z-index:${({$zIndex}) => $zIndex ?? 20};
    width: 100%;
`;

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    border: 0.5px solid var(--color-accent);
    border-radius: ${({$ratio}) => $ratio * 10}px;
    padding: ${({$ratio}) => $ratio * 10}px;
    height: ${({$height}) => $height}px;
    font-size: var(--font_sm);
    font-weight: 400;
    outline: none;
    background: transparent;
    width: 100%;
    cursor: pointer;
    color: var(--color-accent);
    z-index: 2;

    ${({$isOpen}) => $isOpen ? 'border-bottom-right-radius: 0;border-bottom-left-radius: 0;' : ''};

    transition: border-bottom-right-radius 0.1s, border-bottom-left-radius 0.1s;
`; 

const Postfix = styled.div`
    position: absolute;
    top: 50%;
    right: ${({$ratio}) => $ratio * 10}px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({$ratio}) => $ratio * 14}px;
    height: ${({$ratio}) => $ratio * 11}px;
    transition: transform 0.3s;
    transform: translateY(-50%) ${({$isOpen}) => $isOpen ? 'rotate(180deg)' : ''};
`;

const List = styled(motion.ul)`
    position: absolute;
    background: #ABC2FE;
    border-radius: var(--border-radius-md);
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    padding: calc(1.5 * var(--spacing_x1));
    padding-bottom: 0;
    width: 100%;
    top: 100%;
    left: 0;
    height: ${({$ratio}) => $ratio * 115}px;
    transform-origin: top;
    z-index: ${({$zIndex}) => $zIndex ?? 20};
    border: 0.5px solid var(--color-accent);
    border-top: none;
    z-index: 1;
`;

const Option = styled(motion.li)`
    padding: var(--spacing_x1) 0;
    font-size:var(--font_sm);
    text-align: left;
    cursor: pointer;
    list-style-type: none;
    color: var(--color-accent);
    &:last-of-type {
        margin-bottom: calc(1.5 * var(--spacing_x1));
    }
`;

const SelectText = styled.p`
    white-space: nowrap;     
  overflow: hidden;       
  text-overflow: ellipsis; 
  line-height: 100%;

  max-width: calc(100% - ${({$ratio}) => $ratio * 14}px);     
`;

export const Select = (props) => {
    const wrapperRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const ratio = useSizeRatio();
    const {options, placeholder, value, zIndex} = props;

    const handleChoose = (id, name) => {
        props.onChoose?.(id, name);
        setIsOpen(false);
    };

    return (
        <SelectWrapper $zIndex={zIndex}>
            <Wrapper $height={40 * ratio} ref={wrapperRef} $isOpen={isOpen} className={props.className} onClick={() => setIsOpen(prev => !prev)} $ratio={ratio}>
                <SelectText $ratio={ratio}>{value ? value : placeholder}</SelectText>
                <Postfix $isOpen={isOpen} $ratio={ratio}>
                    <svg width="100%" height="100%" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.28401 7.15334C4.68361 7.69716 5.49608 7.69716 5.89568 7.15334L9.9821 1.59214C10.4674 0.931721 9.99581 0 9.17627 0H1.00342C0.183879 0 -0.287697 0.93172 0.197583 1.59214L4.28401 7.15334Z" fill="#004CDA"/>
                    </svg>
                </Postfix>
            </Wrapper>
            <AnimatePresence>
                {
                    isOpen && (
                        <List
                            $ratio={ratio}
                            initial={{ opacity: 0, scaleY: 0.5 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0.5 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Scrollbar top={10} bottom={10} isSimple>
                                {options.map(({id, name}) => (
                                    <Option 
                                        key={id} 
                                        onClick={() => handleChoose(id, name)} 
                                        $ratio={ratio}
                                    >
                                        {name}
                                    </Option>
                                ))}
                            </Scrollbar>
                            
                        </List>
                    )
                }
            </AnimatePresence>
        </SelectWrapper>
    )
}