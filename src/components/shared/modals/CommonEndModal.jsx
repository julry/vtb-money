import {getPluralCoins} from '../../../utils/getPluralCoins';
import { EndModal } from './EndModal';

export const CommonEndModal = ({coins}) => {
    return (
        <EndModal
            title={`Ты заработал ${getPluralCoins(coins)}`} 
            btnText={coins > 0 ? "Забрать" : "Продолжить"}
            subTitle="Прокачаться в игре и заработать больше можно в разделе «Развлечения»"
        />
    )
}