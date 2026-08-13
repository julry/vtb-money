import { createContext } from "react";
import { SCREENS } from "../constants/screens";

export const ProgressContext = createContext({ currentScreen: SCREENS.RULES, isLoading: true });
