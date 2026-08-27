import { useSizeRatio } from "../../../hooks/useSizeRatio"
import { Button } from "../Button";
import { InfoModal } from "./InfoModal"

export const SubscribeModal = () => {
    const ratio = useSizeRatio();

    return (
        <InfoModal title={'Подписаться\nна канал:'}>
            <Button mt={ratio * 25}>ВКонтакте</Button>
            <Button mt={ratio * 10}>Телеграм</Button>
        </InfoModal>
    )
}