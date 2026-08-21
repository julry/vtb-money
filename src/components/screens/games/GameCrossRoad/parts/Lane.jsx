import {memo} from 'react';
import styled from 'styled-components';
import grass from '../../../../../assets/images/cross/grass.webp';

import {START_LANE, COLORS, TRASH_IMAGES, LANE_HEIGHT, TREE_IMAGES, TREE_SIZES, TREE_POSITIONS} from '../constants';

const LaneDiv = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: ${LANE_HEIGHT}px;
  overflow: visible;
`;

const RoadMarking = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    ${COLORS.roadLine} 0px,
    ${COLORS.roadLine} 20px,
    transparent 20px,
    transparent 40px
  );
  transform: translateY(-50%);
`;

const EntityDiv = styled.div`
  position: absolute;
  top: 2px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 10;

  & img {
    position: absolute;
    object-fit: contain;
  }
`;

export const Lane = memo(function Lane({ lane, registerLane, registerEntity, isBlured, }) {
  const bg = lane.type === 'road' ? COLORS.road : `url(${grass})`;

  return (
    <LaneDiv
      ref={el => registerLane(lane.index, el)}
      style={{ 
        background: bg,
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat-x',
         ...(isBlured ? {filter: 'blur(20px)'} : {zIndex: lane.type === 'road' ? 1 : 15 - lane.index % 10}) 
        }}
    >
      {lane.type === 'road' && <RoadMarking />}
      {lane.type === 'grass' && lane.index < START_LANE && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: lane.index % 2 === 0 ? 'rgba(0,0,0,0.03)' : 'transparent'
        }} />
      )}

      {lane.entities.map((e, idx) => (
        <EntityDiv
          key={idx}
          ref={el => registerEntity(lane.index, idx, el, e.isTree)}
          style={{
            width: e.w,
            height: e.h,
            borderRadius: e.isTree ? '2px' : '0px',
            backgroundImage: e.isTree ? undefined : `url(${TRASH_IMAGES[e.imgIndex]})`,
          }}
        >
          {e.isTree && (
            <img 
              src={TREE_IMAGES[e.imgIndex]} 
              width={TREE_SIZES[e.imgIndex][0]} 
              height={TREE_SIZES[e.imgIndex][1]}
              style={{
                top:TREE_POSITIONS[e.imgIndex][1],
                left: TREE_POSITIONS[e.imgIndex][0],
              }}
            />)}
        </EntityDiv>
      ))}
    </LaneDiv>
  );
});
