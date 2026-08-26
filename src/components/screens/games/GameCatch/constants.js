import trash1 from '../../../../assets/images/runner/trash1.webp';
import trash2 from '../../../../assets/images/runner/trash2.webp';

import coin from '../../../../assets/images/coinImg.webp';
import card from '../../../../assets/images/match/card.webp';
import cash from '../../../../assets/images/match/cash.webp';

export const WIDTH = 375;
export const HEIGHT = 667;
export const JUMP_FORCE = -4.8;
export const GRAVITY = 0.07;
export const MOVE_SPEED = 5.7;
export const PLATFORM_WIDTH = 123;
export const PLATFORM_HEIGHT = 24;
export const PLAYER_SIZE = 133;
export const PLAYER_HEIGHT = 117;
export const COIN_SIZE = 70;
export const GAP_MIN = 105 + PLATFORM_HEIGHT;
export const GAP_MAX = 115 + PLATFORM_HEIGHT;
export const FLOOR_HEIGHT = 50;
export const PLATFORM_COLORS = ['#004CDA', '#8E9BFF', '#3987FC'];

export const PLAYER_Y = 42;

export const GOOD_ITEMS = [
  { img: coin, width: 50, height: 50 },
  { img: card, width: 50 * 1.2, height: 36 * 1.2 },
  { img: cash, width: 50 * 1.2, height: 42 * 1.2 },
];

export const BAD_ITEMS = [
  { img: trash1, width: 50 * 1.5, height: 40 * 1.5 },
  { img: trash2, width: 50 * 1.2, height: 40 * 1.2 },
];
