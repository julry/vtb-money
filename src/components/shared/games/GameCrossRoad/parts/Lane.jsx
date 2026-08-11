import {memo} from 'react';
import styled from 'styled-components';
import {START_LANE, COLORS, TRASH_IMAGES, LANE_HEIGHT} from '../constants';

const LaneDiv = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: ${LANE_HEIGHT}px;
  overflow: hidden;
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
`;

export const Lane = memo(function Lane({ lane, registerLane, registerEntity, isBlured, }) {
  const bg = lane.type === 'road' ? COLORS.road : COLORS.grass;

  return (
    <LaneDiv
      ref={el => registerLane(lane.index, el)}
      style={{ background: bg, ...(isBlured ? {filter: 'blur(20px)'} : {zIndex: 3}) }}
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
          ref={el => registerEntity(lane.index, idx, el)}
          style={{
            width: e.w,
            height: e.h,
            borderRadius: e.isTree ? '2px' : '0px',
            backgroundImage: e.isTree ? '' : `url(${TRASH_IMAGES[e.imgIndex]})`,
            backgroundColor: e.isTree ? 'purple' : undefined,
          }}
        />
      ))}
    </LaneDiv>
  );
});
