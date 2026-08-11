import {useCallback, useRef} from "react";

export function useCallbackRef(callback) {
    const callbackRef = useRef()
    callbackRef.current = callback

    return useCallback((...args) => callbackRef.current(...args), [])
}