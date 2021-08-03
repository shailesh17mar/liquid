import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {ICursor} from '../types';

interface ICursorProps {
  pointer: ICursor;
  framePosition: {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  };
}

const Cursor = ({
  pointer: {id, color, name, x, y},
  framePosition: {width, height, offsetX, offsetY},
}: ICursorProps) => {
  const left = offsetX + x * width;
  const top = offsetY + y * height;
  const StyledSVG = styled.svg`
    display: ${x === 0 && y === 0 ? 'none' : 'block'};
    position: absolute;
    transition: 0.1s;
    transform: translateX(${left + 'px'}) translateY(${top + 'px'});
    transition: transform 0.2s cubic-bezier(0.02, 1.23, 0.79, 1.08);
    left: 0;
    top: 0;
  `;

  const StyledLegend = styled.div`
    display: ${x === 0 && y === 0 ? 'none' : 'block'};
    border: ${`1px solid ${color}`};
    background: ${color};
    transform: translateX(${left + 15 + 'px'}) translateY(${top + 15 + 'px'});
    transition: 0.1s;
    border-radius: 4px;
    position: absolute;
    padding: 3px 6px;
    left: 0;
    top: 0;
  `;

  return (
    <div>
      <StyledSVG
        id={`cursor-${id}`}
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
      >
        <path
          d="M10 20L1 1L20 10L12 12L10 20Z"
          fill={color}
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </StyledSVG>
      <StyledLegend id={`legend-${id}`}>{name}</StyledLegend>
    </div>
  );
};

export default Cursor;
