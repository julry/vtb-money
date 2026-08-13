import {useContext} from 'react';
import {ProgressContext} from '../contexts/ProgressContext';

export function useProgress() {
    return useContext(ProgressContext);
}
