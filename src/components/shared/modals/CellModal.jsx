import { CellLuckModal } from './CellLuckModal';
import {CellMiniGameModal} from './CellMiniGameModal';
import {CellQuizModal} from './CellQuizModal';
import {CellBonusModal} from './CellBonusModal';
import {CellInvestModal} from './CellInvestModal';

export const CellModal = ({cell}) => {
    if (cell.type === 'minigame') {
        return <CellMiniGameModal cellInfo={cell}/>;
    }

    if (cell.type === 'quiz') {
        return <CellQuizModal cellInfo={cell}/>;
    }

    if (cell.type === 'luck') {
        return <CellLuckModal cellInfo={cell} isLuck={Math.random() >= 0.5} />
    }

    if (cell.type === 'bonus') {
        return <CellBonusModal cellInfo={cell} />
    }

    if (cell.type === 'investment') {
        return <CellInvestModal cellInfo={cell} />
    }

    return null;
}