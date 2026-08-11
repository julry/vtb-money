import { getPluralWord } from "./getPluralWord";

export const getPluralCoins = (count) => `${count} ${getPluralWord(['коин', 'коина', 'коинов'], count)}`;
