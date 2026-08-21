import { useState } from "react";
import { useProgress } from "../../../hooks/useProgress"
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { Button } from "../Button";
import { Text } from "../Text";
import { InfoModal } from "./InfoModal"

export const SettingsModal = () => {
    const [doneButtons, setDoneButtons] = useState([]);
    const ratio = useSizeRatio();
    const { user, updateUser } = useProgress();

    return (
        <InfoModal>
            <Text>Модальное окно для теста, в приложении его <b>НЕ БУДЕТ</b></Text>
            <Button
                mt={10 * ratio}
                onClick={() => updateUser({ turns: 5 }).then(() => setDoneButtons(prev => [...prev, 1]))}
                disabled={doneButtons.includes(1)}
            >
                Обнулить ходы
            </Button>
            <Button
                mt={10 * ratio}
                onClick={() => updateUser({ infiniteCoins: [0, 0, 0, 0] }).then(() => setDoneButtons(prev => [...prev, 2]))}
                disabled={doneButtons.includes(2)}
            >
                Сбросить недельный лимит (игры)
            </Button>
            <Button
                mt={10 * ratio}
                onClick={() => updateUser({ totalCoins: user.totalCoins + 1000 }).then(() => setDoneButtons(prev => [...prev, 3]))}
                disabled={doneButtons.includes(3)}
            >
                Добавить 1000 койнов
            </Button>
            <Button
                mt={10 * ratio}
                onClick={() => updateUser({ cells: [] }).then(() => setDoneButtons(prev => [...prev, 0]))}
                disabled={doneButtons.includes(0)}
            >
                Стереть прогресс клеток (cells)*
            </Button>
            <Button
                mt={10 * ratio}
                onClick={() => updateUser({ lastOpenedCell: null }).then(() => setDoneButtons(prev => [...prev, 4]))}
                disabled={doneButtons.includes(4)}
            >
                Убрать фикс на последней клетке*
            </Button>
            <Text style={{ fontSize: 'var(--font_xs)' }}>*нужно перезайти в лобби или обновиться, чтобы отобразилось</Text>
        </InfoModal>
    )
}