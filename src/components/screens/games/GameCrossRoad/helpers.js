import {BOTTOM_BUFFER_ROWS, MIN_ENTITY_GAP, PERSON_WIDTH, TILE_SIZE, TRASH_IMAGES, TRASH_SIZES, TREE_IMAGES, TREE_SIZES} from './constants';
import {generateRandomNumber} from '../../../../utils/generateRandomNumber';
import { COLORS } from '../GameMatch3/constants';

export function randomChoice(arr) { 
  return arr[Math.floor(Math.random() * arr.length)]; 
}

export function overlaps(x1, w1, x2, w2, minGap) {
  return x1 < x2 + w2 + minGap && x1 + w1 + minGap > x2;
}

export function generateLane(index, prevType, maxWidth, safePad = 30) {
  if (index === 0) {
    return { type: 'grass', speed: 0, entities: [], coins: [], index };
  }

  const type = prevType === 'grass' ? 'road' : 'grass';
  const direction = Math.random() > 0.5 ? 1 : -1;
  const laneSpeed = direction * generateRandomNumber(8, 14) / 10;
  const entities = [];

  if (type === 'road') {
    const carCount = generateRandomNumber(2, 3);
    for (let i = 0; i < carCount; i++) {
      let attempts = 0;
      let newEntity;
      const trashId = generateRandomNumber(0, TRASH_IMAGES.length - 1);
      do {
        newEntity = {
          x: TRASH_SIZES[trashId][0],
          w: TRASH_SIZES[trashId][1],
          h: TILE_SIZE - 8,
          speed: laneSpeed,
          imgIndex: trashId,
        };
        attempts++;
      } while (
        attempts < 20 &&
        entities.some(e => overlaps(e.x, e.w, newEntity.x, newEntity.w, MIN_ENTITY_GAP))
      );
      if (attempts < 20) entities.push(newEntity);
    }
  } else if (type === 'grass') {
    const PASSAGE_WIDTH = 2.8 * PERSON_WIDTH;
    // const PASSAGE_WIDTH = 0;
    const playableStart = safePad;
    const playableEnd = maxWidth - safePad;
    
    // Если места мало — оставляем полосу пустой (проход всё равно будет)
    if (playableEnd - playableStart >= PASSAGE_WIDTH + TILE_SIZE) {
      const maxPassageStart = playableEnd - PASSAGE_WIDTH;
      const passageStart = generateRandomNumber(playableStart, maxPassageStart);
      const passageEnd = passageStart + PASSAGE_WIDTH;

      const treeCount = generateRandomNumber(2, 7);
      for (let i = 0; i < treeCount; i++) {
        let attempts = 0;
        let newTree;
        const treeId = generateRandomNumber(0, TREE_IMAGES.length - 1);

        do {
          newTree = {
            x: generateRandomNumber(playableStart, playableEnd - (TILE_SIZE / 2)),
            w: TILE_SIZE / 1.5,
            h: TILE_SIZE,
            imgIndex: treeId,
            speed: 0,
            isTree: true,
          };
          attempts++;
        } while (
          attempts < 50 &&
          (
            (newTree.x + newTree.w > passageStart && newTree.x < passageEnd) ||
            entities.some(e => overlaps(e.x, e.w, newTree.x, newTree.w, 10))
          )
        );
        if (attempts < 50) entities.push(newTree);
      }
    }
  }

  return { type, speed: laneSpeed, entities, index };
}

export function generateInitialLanes(maxWidth, screenHeight, safePad = 30) {
  const lanes = [];
  let prev = 'grass';
  const visibleCount = Math.floor(screenHeight / TILE_SIZE);
  const minCount = visibleCount + BOTTOM_BUFFER_ROWS + 1;
  const laneCount = Math.max(visibleCount + 4, minCount);

  for (let i = 0; i < laneCount; i++) {
    const lane = generateLane(i, prev, maxWidth, safePad);
    lanes.push(lane);
    prev = lane.type;
  }
  return lanes;
}