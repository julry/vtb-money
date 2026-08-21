import pers from '../../../../assets/images/cross/pers.webp';
import persL from '../../../../assets/images/cross/persLeft.webp';
import persR from '../../../../assets/images/cross/persRight.webp';
import persF from '../../../../assets/images/cross/persF.webp';
import persLF from '../../../../assets/images/cross/persFLeft.webp';
import persRF from '../../../../assets/images/cross/persFRight.webp';

import trash1 from '../../../../assets/images/cross/trash1.webp';
import trash2 from '../../../../assets/images/cross/trash2.webp';
import trash3 from '../../../../assets/images/cross/trash3.webp';
import trash4 from '../../../../assets/images/cross/trash4.webp';

import tree1 from '../../../../assets/images/cross/tree1.webp';
import tree2 from '../../../../assets/images/cross/tree2.webp';
import tree3 from '../../../../assets/images/cross/tree3.webp';

export const TILE_SIZE = 65;
export const PERSON_HEIGHT = TILE_SIZE;
export const PERSON_WIDTH = (TILE_SIZE - 10) / 2;
export const VISIBLE_ROWS = 14;
export const GAME_WIDTH_PX = 375;
export const MAX_WIDTH_PX = 600;
export const LANE_HEIGHT = 65;
export const SWIPE_THRESHOLD = 20;
export const TAP_MAX_DURATION = 300;
export const TAP_MAX_MOVE = 10;
export const MIN_ENTITY_GAP = 70;
export const START_LANE = 0;

export const CAMERA_FOLLOW_THRESHOLD = 0.15;
export const CAMERA_SMOOTHING = 0.4;

export const TOP_BUFFER_ROWS = 5;
export const BOTTOM_BUFFER_ROWS = 5;

export const DANGER_TYPES = ['road'];

export const PERS_IMAGES = {
    'up': pers,
    'left': persL,
    'right': persR,
}
export const PERS_IMAGES_F = {
    'up': persF,
    'left': persLF,
    'right': persRF,
}

export const TRASH_IMAGES = [trash1, trash2, trash3, trash4];
export const TRASH_SIZES = [[52, 65], [64, 63], [67, 63], [62, 65]];
export const TREE_IMAGES = [tree1, tree2, tree3];
export const TREE_SIZES = [[65, 105], [40, 44], [48, 45]];
export const TREE_POSITIONS= [[-10, -60], [5, 0], [0, -5]];

export const COLORS = {
    grass: '#E1CEFE',
    grassDark: '#B78EFB',
    road: '#92C1FF',
    roadLine: '#D5E5FF',
    rail: '#5d4037',
    railTie: '#3e2723',
    log: '#8d6e63',
    carRed: '#f44336',
    carBlue: '#2196f3',
    carYellow: '#ffeb3b',
    carGreen: '#4caf50',
    truck: '#ff9800',
    train: '#212121',
    player: '#e91e63',
    playerEye: '#fff',
    playerPupil: '#000',
    coin: '#ffd700',
};