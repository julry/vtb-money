import {FIGURE_SIZE, CHUNK_WIDTH, TRASH_WIDTH, JUMP_CLEARANCE, trashImagesSizes, MIN_TRASH_BOTTOM, MIN_FIGURE_BOTTOM, MAX_JUMP, AVERAGE_TRASH_HEIGHT} from './constants';
import {generateRandomNumber} from '../../../../utils/generateRandomNumber';

const overlaps = (x, w, items, gap) => items.some(
    ([ox1, ox2]) => x < ox2 + gap && x + w > ox1 - gap
);

export function generateChunk(chunkIndex, gap) {
    const isStartChunk = chunkIndex === 0;
    const safeZone = 400;
    const trashCount = isStartChunk ? 2 : (2 + Math.floor(Math.random() * 2));
    const figureCount = isStartChunk 
        ? (1 + Math.floor(Math.random() * 2))
        : (1 + Math.floor(Math.random() * 3));

    const trashes = [];
    const figures = [];
    const occupied = [];

    // мусор
    for (let i = 0; i < trashCount; i++) {
        let x, attempts = 0;
        do {
            x = safeZone + Math.random() * (CHUNK_WIDTH - safeZone - 80);
            attempts++;
        } while (overlaps(x, TRASH_WIDTH, occupied, gap) && attempts < 50);

        if (attempts < 50) {
            const trashId = generateRandomNumber(0, 2);
            const width = trashImagesSizes[trashId][0];

            occupied.push([x, x + TRASH_WIDTH]);
            trashes.push({
                id: `trash-${chunkIndex}-${i}`,
                width,
                height: trashImagesSizes[trashId][1],
                x,
                imageId: trashId,
                isTrash: true,
                y: MIN_TRASH_BOTTOM,
            });
        }
    }

    // фигуры над trash
    const placedFigures = [];
    
    for (const trash of trashes) {
        const isShown = Math.random() > 0.45;
        if (placedFigures.length >= figureCount || !isShown) break;
        
        const centerX = trash.x + (TRASH_WIDTH - FIGURE_SIZE) / 2;
        let x = centerX + generateRandomNumber(-MAX_JUMP / 2, MAX_JUMP / 1.8);
        
        x = Math.max(safeZone, Math.min(x, CHUNK_WIDTH - FIGURE_SIZE));
        
        const figureBounds = placedFigures.map(f => [f.x, f.x + FIGURE_SIZE]);
        if (!overlaps(x, FIGURE_SIZE, figureBounds, gap)) {
            placedFigures.push({
                id: `figure-${chunkIndex}-${placedFigures.length}`,
                width: FIGURE_SIZE,
                height: FIGURE_SIZE,
                x,
                y: MIN_FIGURE_BOTTOM + generateRandomNumber(JUMP_CLEARANCE, MAX_JUMP - 30),
            });
        }
    }

    // оставшиеся фигуры в случайные свободные места
    while (placedFigures.length < figureCount) {
        let x, attempts = 0;
        const figureBounds = placedFigures.map(f => [f.x, f.x + FIGURE_SIZE]);
        
        do {
            x = safeZone + Math.random() * (CHUNK_WIDTH - safeZone - 80);
            attempts++;
        } while (overlaps(x, FIGURE_SIZE, figureBounds, gap) && attempts < 50);
        
        if (attempts < 50) {
            placedFigures.push({
                id: `figure-${chunkIndex}-${placedFigures.length}`,
                width: FIGURE_SIZE,
                height: FIGURE_SIZE,
                x,
                isTrashLike: true,
                y: generateRandomNumber(MIN_TRASH_BOTTOM + AVERAGE_TRASH_HEIGHT / 2, MIN_FIGURE_BOTTOM), 
            });
        } else {
            break;
        }
    }

    figures.push(...placedFigures);

    return { index: chunkIndex, trashes, figures };
}