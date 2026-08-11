import { useEffect, useRef, useState } from "react";
import female0 from '../../../../../../assets/images/person/persStart.webp';
import female1 from '../../../../../../assets/images/person/persRunR.webp';
import female2 from '../../../../../../assets/images/person/persRunL.webp';
import female3 from '../../../../../../assets/images/person/persJump.webp';
import male0 from '../../../../../../assets/images/person/persStart.webp';
import male1 from '../../../../../../assets/images/person/persRunL.webp';
import male2 from'../../../../../../assets/images/person/persRunR.webp';
import male3 from '../../../../../../assets/images/person/persJump.webp';
import { useProgress } from "../../../../../../contexts/ProgressContext";
// import { SEX } from "../../../constants/sex";

export const STAND_INDEX = 0;
export const JUMP_INDEX = 3;
export const FIRST_INDEX = 1;
export const SECOND_INDEX = 2;

const FEMALE_CHARACTER = [female0, female1, female2, female3];
const MALE_CHARACTER = [male0, male1, male2, male3];

const INDEXES_LOOP = {
    0: 1,
    1: 2,
    2: 1,
};

const SEX_TO_CHARACTER = {
    Female: FEMALE_CHARACTER,
    Male: MALE_CHARACTER
}

export function useAnimate(isPause, isJump) {
    const { user } = useProgress(); 
    const [index, setIndex] = useState(STAND_INDEX);
    const isJumpRef = useRef(isJump);
    
    isJumpRef.current = isJump;

    const sexSource = SEX_TO_CHARACTER?.[user?.sex ?? 'Female'] ?? FEMALE_CHARACTER;
    const source = sexSource?.[index];

    useEffect(() => {
        if (isJump) {
            setIndex(JUMP_INDEX);
        }

        isJumpRef.current = isJump;
    }, [isJump]);

    useEffect(() => {
        if (isPause || isJump) return; 

        const timer = setTimeout(() => {
            if (isJumpRef.current) return; 
            setIndex(prev => prev in INDEXES_LOOP ? INDEXES_LOOP[prev] : FIRST_INDEX);
        }, index === STAND_INDEX ? 50 : 350);

        return () => clearTimeout(timer);
    }, [index, isPause, isJump]);

    return source;
}