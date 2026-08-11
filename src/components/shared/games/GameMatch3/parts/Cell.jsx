import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.2s ease, box-shadow 0.15s ease;
  position: relative;
    background: rgba(255, 255, 255, 0.3);
    background-position: center;
    background-size: 90%;
    background-repeat: no-repeat;
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.4) ${({$isSelected}) => $isSelected ? ', 0px 0px 10px rgba(0, 76, 218, 0.5)' : ''};
    border-radius: 10px;

  &:active {
    box-shadow: inset 1.38889px 1.38889px 1.38889px rgba(255, 255, 255, 0.4);
  }
`;

export const Cell = ({cellStyle, isSelected, onClick, isDisabled, onTouchStart, onTouchEnd}) => (
    <Wrapper
        style={cellStyle}
        onClick={onClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        $isSelected={isSelected}
        $isDisabled={isDisabled}
    />
)