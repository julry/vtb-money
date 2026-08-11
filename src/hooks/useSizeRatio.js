import { useContext } from "react";
import { SizeRatioContext } from "../contexts/SizeRatioContext";

export function useSizeRatio() {
    return useContext(SizeRatioContext)
}