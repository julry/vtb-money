import { useState, useEffect, useRef, useCallback } from 'react';
import { GRID_SIZE, COLORS, FIRST_GAME_BOARD } from './constants';

export const useGame = ({isRules = false}) => {
    const [board, setBoard] = useState([]);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showShuffle, setShowShuffle] = useState(false);

    const boardRef = useRef([]);
    const touchStartRef = useRef(null);
    const preventClickRef = useRef(false);

    const randomCell = useCallback(() => Math.floor(Math.random() * COLORS.length), []);

    /* --- Проверка совпадений в конкретной клетке --- */
    const hasMatchAt = useCallback((b, r, c) => {
        const val = b[r][c];
        if (val === null || val === undefined) return false;

        let count = 1;
        let i = c - 1;
        while (i >= 0 && b[r][i] === val) { count++; i--; }
        i = c + 1;
        while (i < GRID_SIZE && b[r][i] === val) { count++; i++; }
        if (count >= 3) return true;

        count = 1;
        let j = r - 1;
        while (j >= 0 && b[j][c] === val) { count++; j--; }
        j = r + 1;
        while (j < GRID_SIZE && b[j][c] === val) { count++; j++; }
        return count >= 3;
    }, []);

    /* --- Поиск всех совпадений на поле --- */
    const findMatches = useCallback((b) => {
        const matched = new Set();

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE - 2; c++) {
                const val = b[r][c];
                if (val === null || val === undefined) continue;
                if (b[r][c + 1] === val && b[r][c + 2] === val) {
                    matched.add(`${r},${c}`);
                    matched.add(`${r},${c + 1}`);
                    matched.add(`${r},${c + 2}`);
                    let k = c + 3;
                    while (k < GRID_SIZE && b[r][k] === val) {
                        matched.add(`${r},${k}`);
                        k++;
                    }
                }
            }
        }

        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE - 2; r++) {
                const val = b[r][c];
                if (val === null || val === undefined) continue;
                if (b[r + 1][c] === val && b[r + 2][c] === val) {
                    matched.add(`${r},${c}`);
                    matched.add(`${r + 1},${c}`);
                    matched.add(`${r + 2},${c}`);
                    let k = r + 3;
                    while (k < GRID_SIZE && b[k][c] === val) {
                        matched.add(`${k},${c}`);
                        k++;
                    }
                }
            }
        }

        return matched;
    }, []);

    /* --- Гравитация + заполнение сверху --- */
    const applyGravityAndFill = useCallback((b) => {
        const newBoard = b.map(row => [...row]);
        for (let c = 0; c < GRID_SIZE; c++) {
            let writeRow = GRID_SIZE - 1;
            for (let r = GRID_SIZE - 1; r >= 0; r--) {
                if (newBoard[r][c] !== null && newBoard[r][c] !== undefined) {
                    newBoard[writeRow][c] = newBoard[r][c];
                    if (writeRow !== r) newBoard[r][c] = null;
                    writeRow--;
                }
            }
            for (let r = writeRow; r >= 0; r--) {
                newBoard[r][c] = randomCell();
            }
        }
        return newBoard;
    }, [randomCell]);

    /* --- Проверка, создаёт ли обмен совпадение --- */
    const wouldCreateMatch = useCallback((b, r1, c1, r2, c2) => {
        const temp = b.map(row => [...row]);
        [temp[r1][c1], temp[r2][c2]] = [temp[r2][c2], temp[r1][c1]];
        return hasMatchAt(temp, r1, c1) || hasMatchAt(temp, r2, c2);
    }, [hasMatchAt]);

    /* --- Есть ли хотя бы один возможный ход --- */
    const hasValidMoves = useCallback((b) => {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (c < GRID_SIZE - 1 && wouldCreateMatch(b, r, c, r, c + 1)) return true;
                if (r < GRID_SIZE - 1 && wouldCreateMatch(b, r, c, r + 1, c)) return true;
            }
        }
        return false;
    }, [wouldCreateMatch]);

    /* --- Перемешивание поля --- */
    const shuffleBoard = useCallback((b, attempts = 0) => {
        if (attempts > 100) {
            /* fallback: сгенерировать с нуля */
            let nb = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    do { nb[r][c] = randomCell(); } while (hasMatchAt(nb, r, c));
                }
            }
            return nb;
        }
        let flat = b.flat();
        for (let i = flat.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flat[i], flat[j]] = [flat[j], flat[i]];
        }
        let newB = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            newB.push(flat.slice(i * GRID_SIZE, (i + 1) * GRID_SIZE));
        }
        if (findMatches(newB).size > 0 || !hasValidMoves(newB)) {
            return shuffleBoard(newB, attempts + 1);
        }
        return newB;
    }, [findMatches, hasValidMoves, hasMatchAt, randomCell]);

    /* --- Генерация начального поля --- */
    const generateBoard = useCallback(() => {
        let b = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                do { b[r][c] = randomCell(); } while (hasMatchAt(b, r, c));
            }
        }
        return b;
    }, [randomCell, hasMatchAt]);

    /* --- Обработка цепочек совпадений --- */
    const processMatches = useCallback(async (currentBoard, depth = 0) => {
        if (depth > 10) {
            boardRef.current = currentBoard;
            setBoard(currentBoard);
            return;
        }

        const matches = findMatches(currentBoard);
        if (matches.size === 0) {
            boardRef.current = currentBoard;
            setBoard(currentBoard);
            return;
        }

        setScore(s => s + matches.size * 10);

        /* 1. Удаляем совпавшие (делаем прозрачными) */
        const removed = currentBoard.map(row => [...row]);
        matches.forEach(key => {
            const [r, c] = key.split(',').map(Number);
            removed[r][c] = null;
        });
        setBoard(removed);
        await new Promise(resolve => setTimeout(resolve, 200));

        /* 2. Падение + новые элементы */
        const afterGravity = applyGravityAndFill(removed);
        setBoard(afterGravity);
        boardRef.current = afterGravity;
        await new Promise(resolve => setTimeout(resolve, 150));

        /* 3. Каскадные совпадения */
        await processMatches(afterGravity, depth + 1);
    }, [findMatches, applyGravityAndFill]);

    /* --- Обмен двух клеток --- */
    const handleSwap = useCallback(async (r1, c1, r2, c2) => {
        if (isProcessing) return;
        setIsProcessing(true);

        const currentBoard = boardRef.current;

        /* Невалидный ход — мигнуть и вернуть обратно */
        if (!wouldCreateMatch(currentBoard, r1, c1, r2, c2)) {
            const swapped = currentBoard.map(row => [...row]);
            [swapped[r1][c1], swapped[r2][c2]] = [swapped[r2][c2], swapped[r1][c1]];
            setBoard(swapped);
            await new Promise(resolve => setTimeout(resolve, 200));
            setBoard(currentBoard);
            setIsProcessing(false);
            return;
        }

        /* Валидный ход — обмен, затем обработка совпадений */
        const swapped = currentBoard.map(row => [...row]);
        [swapped[r1][c1], swapped[r2][c2]] = [swapped[r2][c2], swapped[r1][c1]];
        setBoard(swapped);
        boardRef.current = swapped;
        await new Promise(resolve => setTimeout(resolve, 150));

        await processMatches(swapped);

        /* Если ходов не осталось — перемешать */
        if (!hasValidMoves(boardRef.current)) {
            setShowShuffle(true);
            await new Promise(resolve => setTimeout(resolve, 600));
            const shuffled = shuffleBoard(boardRef.current);
            boardRef.current = shuffled;
            setBoard(shuffled);
            setShowShuffle(false);
        }

        setIsProcessing(false);
    }, [isProcessing, wouldCreateMatch, processMatches, hasValidMoves, shuffleBoard]);

    /* --- Клик по клетке (выбор / обмен) --- */
    const handleCellClick = useCallback((r, c) => {
        if (preventClickRef.current) {
            preventClickRef.current = false;
            return;
        }
        if (isProcessing) return;

        if (!selected) {
            setSelected({ r, c });
            return;
        }

        const { r: sr, c: sc } = selected;
        if (sr === r && sc === c) {
            setSelected(null);
            return;
        }

        if (Math.abs(r - sr) + Math.abs(c - sc) === 1) {
            handleSwap(sr, sc, r, c);
            setSelected(null);
        } else {
            setSelected({ r, c });
        }
    }, [isProcessing, selected, handleSwap]);

    /* --- Свайп (тач) --- */
    const handleTouchStart = useCallback((e, r, c) => {
        const touch = e.touches[0];
        setSelected({ r, c });
        touchStartRef.current = { x: touch.clientX, y: touch.clientY, r, c };
    }, []);

    const handleTouchEnd = useCallback((e) => {
        if (!touchStartRef.current) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartRef.current.x;
        const dy = touch.clientY - touchStartRef.current.y;
        const { r, c } = touchStartRef.current;
        touchStartRef.current = null;

        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;

        preventClickRef.current = true;

        let nr = r, nc = c;
        if (Math.abs(dx) > Math.abs(dy)) {
            nc = dx > 0 ? c + 1 : c - 1;
        } else {
            nr = dy > 0 ? r + 1 : r - 1;
        }

        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
            handleSwap(r, c, nr, nc);
            setSelected({});
        }
    }, [handleSwap]);

    /* --- Инициализация --- */
    useEffect(() => {
        let b;
        //TODO: заменить на первый раз и следующие 
        if (true) {
            b = FIRST_GAME_BOARD;
        } else {
            b = generateBoard();

            while (!hasValidMoves(b)) {
                b = generateBoard();
            }
        }
        boardRef.current = b;
        setBoard(b);
        if (!isRules) {
            handleSwap(1, 1, 1, 2);
            setSelected({});
        }
    }, [generateBoard, hasValidMoves]);

    return { score, selected, board, handleCellClick, handleTouchStart, handleTouchEnd, showShuffle, touchStartRef }
}