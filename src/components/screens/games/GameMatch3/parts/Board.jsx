import styled from 'styled-components';
import { useSizeRatio } from '../../../../../hooks/useSizeRatio';
import { CONTAINER_SIZE } from '../../Game2048/constants';
import { COLORS, RULES_COLUMNS, RULES_ROW } from '../constants';
import { Cell } from './Cell';

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: var(--spacing_x1);
    aspect-ratio: 1;
    width: 100%;
    background: rgb(201 216 254);
    border-radius: var(--border-radius-lg);
    border: 0.5px solid var(--color-blue-light);
    padding: var(--spacing_x2);
    box-sizing: border-box;
    touch-action: none;
    margin: 0 auto;
`;

export const Board = ({ board, selected, handleCellClick, handleTouchStart, handleTouchEnd, isRules }) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper $ratio={ratio}>
            {board.map((row, r) =>
                row.map((cell, c) => {
                    const isSelected = selected && selected.r === r && selected.c === c;
                    const isRulesCell = isRules && r === RULES_ROW && RULES_COLUMNS.includes(c);
                    const isDisabled = isRules && !isRulesCell;

                    return (
                        <Cell
                            key={`${r}-${c}`}
                            isSelected={isSelected || isRulesCell}
                            cellStyle={{
                                backgroundImage: cell !== null && cell !== undefined ? `url(${COLORS[cell]})` : undefined,
                                opacity: cell !== null && cell !== undefined ? isDisabled ? 0.3 : 1 : 0,
                            }}
                            onClick={() => isDisabled ? {} : handleCellClick(r, c)}
                            onTouchStart={(e) => isDisabled ? {} : handleTouchStart(e, r, c)}
                            onTouchEnd={handleTouchEnd}
                        />
                    );
                })
            )}
        </Wrapper>
    )
}