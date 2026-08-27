import { lazy } from 'react';

const CellLuckModal = lazy(() =>
    import('./CellLuckModal').then((m) => ({ default: m.CellLuckModal }))
);
const CellMiniGameModal = lazy(() =>
    import('./CellMiniGameModal').then((m) => ({ default: m.CellMiniGameModal }))
);
const CellQuizModal = lazy(() =>
    import('./CellQuizModal').then((m) => ({ default: m.CellQuizModal }))
);
const CellBonusModal = lazy(() =>
    import('./CellBonusModal').then((m) => ({ default: m.CellBonusModal }))
);
const CellInvestModal = lazy(() =>
    import('./CellInvestModal').then((m) => ({ default: m.CellInvestModal }))
);

export const CellModal = ({cell, isLuck}) => {
    if (cell.type === 'minigame') {
        return <CellMiniGameModal cellInfo={cell}/>;
    }

    if (cell.type === 'quiz') {
        return <CellQuizModal cellInfo={cell}/>;
    }

    if (cell.type === 'luck') {
        return <CellLuckModal cellInfo={cell} isLuck={isLuck} />
    }

    if (cell.type === 'bonus') {
        return <CellBonusModal cellInfo={cell} />
    }

    if (cell.type === 'investment') {
        return <CellInvestModal cellInfo={cell} />
    }

    return null;
}

export const preloadCellModal = (type) => {
    switch (type) {
        case 'minigame':
            return import('./CellMiniGameModal');
        case 'quiz':
            return import('./CellQuizModal');
        case 'luck':
            return import('./CellLuckModal');
        case 'bonus':
            return import('./CellBonusModal');
        case 'investment':
            return import('./CellInvestModal');
        default:
            return Promise.resolve();
    }
};