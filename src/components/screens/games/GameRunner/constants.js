import trash1 from '../../../../assets/images/runner/trash1.webp';
import trash2 from '../../../../assets/images/runner/trash2.webp';
import trash3 from '../../../../assets/images/runner/trash3.webp';

export const GAME_HEIGHT = 600;
export const GROUND_HEIGHT = 175;
export const subjectK = 1;
export const SCALE_K = 1;
export const LG_KOEF = SCALE_K * subjectK;
export const DISTANCE_KOEF = 25;

export const CHARACTER_SIZE = [140 * subjectK, 222 * subjectK];
export const CHARACTER_SIZE_LG = [140 * LG_KOEF, 222 * LG_KOEF];

export const EDGES_TO_COINS = {
    50: 300,
    25: 120,
    0: 30
};

export const INITIAL_Y = 75;

export const CHUNK_WIDTH = 1000;
export const VISIBLE_AHEAD = 2;
export const VISIBLE_BEHIND = 1;
export const CHARACTER_SCREEN_X = 20;

export const FIGURE_SIZE = 120;
export const TRASH_WIDTH = 120;
export const COIN_SIZE = 120;

export const BASE_SPEED = 4.8;
export const MAX_SPEED = 6;
export const ACCELERATION_DISTANCE = 6000;

export const MIN_FIGURE_BOTTOM = GROUND_HEIGHT;
export const MIN_TRASH_BOTTOM = Math.floor(GROUND_HEIGHT / 2);
export const MAX_JUMP = 180;
export const JUMP_CLEARANCE = MAX_JUMP / 2.5;
export const JUMP_DISTANCE = 350;

export const GAP_CHARACTER_MULTIPLIER = 5.5;
export const DEFAULT_CHARACTER_WIDTH = 180;
export const MIN_SPACE_FOR_FIGURE = 10; 
export const AVERAGE_TRASH_HEIGHT = 110;

export const trashImages = [trash1, trash2, trash3];
export const trashImagesSizes = [[149, 120], [131, 105], [131, 105]];
export const coinImageSizes = [120, 90];