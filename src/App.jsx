import {ProgressProvider} from "./contexts/ProgressContext.jsx";
import {ScreenTemplate} from "./components/ScreenTemplate.jsx";
import {ScreenContent} from "./components/ScreenContent.jsx";

export function App() {
    return (
        <ProgressProvider>
            <ScreenTemplate>
                <ScreenContent />
            </ScreenTemplate>
        </ProgressProvider>
    );
};
