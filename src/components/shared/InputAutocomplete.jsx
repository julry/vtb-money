import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { useMemo, useRef, useState } from "react";
import { faculties } from "../../constants/universities";
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "./Input";

const Wrapper = styled.div`
    position: relative;
    width: 100%;
`;

const InputStyled = styled(Input)`
    position: relative;
    z-index: 2;
    text-overflow: ellipsis;
`;

const List = styled(motion.ul)`
    position: absolute;
    background: white;
    border-radius: var(--border-radius-md);
    padding: var(--spacing_x7) calc(1.5 * var(--spacing_x1)) 0;
    width: calc(100% - var(--spacing_x1));
    top: calc(100% - var(--spacing_x7));
    left: calc(var(--spacing_x1) / 2);
    transform-origin: top;
    z-index: ${({ $zIndex }) => $zIndex ?? 20};
    border: 3px solid var(--color-blue);
    z-index: 1;
    overflow: auto;
    max-height: ${({$ratio}) => $ratio * 127}px;
`;

const Option = styled(motion.li)`
    padding: var(--spacing_x2) 0;
    font-size:var(--font_sm);
    text-align: left;
    cursor: pointer;
    list-style-type: none;
    font-weight: 500;
    border-bottom:  2px solid var(--color-blue);

    &:last-child {
        border-bottom: 0;
    }
`;

const Placeholder = styled.p`
    position: absolute;
    inset: 0;
    padding: ${({ $ratio }) => $ratio * 10}px;
    padding-left: ${({ $ratio }) => $ratio * 20}px;
    color: rgba(0,0,0,0.3);
    z-index: 2;
    font-size: ${({ $ratio }) => $ratio * 12}px;
    text-align: left;
`;

const UNIV_TO_SIZE = {
    'u1': 'md',
    'u2': 'xl',
    'u3': 'xl',
    'u4': 'xl',
}
const UNIV_TO_PLACEHOLDER = {
    'u1': 'Введи название своего факультета\n(например, Высшая школа бизнеса)',
    'u2': 'Введи название своего факультета\n(например, Факультет информатики,\nматематики и компьютерных наук)',
    'u3': 'Введи название своей физтех-школы\nили высшей школы (например, Физтех-школа\nприкладной математики и информатики)',
    'u4': 'Введи название своего мегафакультета\n(например, Мегафакультет трансляционных\nинформационных технологий)',
}

export const InputAutocomplete = ({ onPick, univId, ...props }) => {
    const [value, setValue] = useState('');
    const [isOtherPicked, setIsOtherPicked] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const initialFaculties = useMemo(() => faculties.filter(({ university }) => university === univId), [univId]);
    const inputRef = useRef();

    const options = useMemo(() =>
        initialFaculties.filter(({ name, short }) => name?.toLowerCase()?.includes(value?.toLowerCase()) || short?.toLowerCase()?.includes(value?.toLowerCase()))
        , [value, initialFaculties])

    const ratio = useSizeRatio();

    const handleChange = (e) => {
        const textValue = e.target.value;
        setValue(textValue);
        if (options.length) setIsOtherPicked(false);
        if (!isOtherPicked) onPick({ id: 'other', name: textValue })
    }

    const handlePickOther = () => {
        onPick(value);
        setIsOtherPicked(true);
    }

    const handlePick = (fac) => {
        onPick(fac);
        setValue(fac.name);
    }

    const onPlaceholderClick = () => {
        inputRef.current.focus();
    }
    return (
        <Wrapper>
            <InputStyled
                size={UNIV_TO_SIZE[univId]}
                value={value}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                ref={inputRef}
                {...props}
            />
            {!value && !isFocused && (
                <Placeholder $ratio={ratio} onClick={onPlaceholderClick}>
                    {UNIV_TO_PLACEHOLDER[univId]}
                </Placeholder>
            )}
            <AnimatePresence>
                {
                    isFocused && value.length > 0 && !isOtherPicked && (
                        <List
                            $ratio={ratio}
                            initial={{ opacity: 0, scaleY: 0.5 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0.5 }}
                            transition={{ duration: 0.3 }}
                        >
                            {options.length > 0 ? options.map(({ id, name, isTargeted }) => (
                                <Option
                                    key={id}
                                    onClick={() => handlePick({ id, name, isTargeted})}
                                    $ratio={ratio}
                                >
                                    {name}
                                </Option>
                            )) : (
                                <Option
                                    key={'other'}
                                    onClick={handlePickOther}
                                    $ratio={ratio}
                                >
                                    Другое
                                </Option>
                            )}

                        </List>
                    )
                }
            </AnimatePresence>
        </Wrapper>
    )
}