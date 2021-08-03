import React, {useEffect, useRef} from 'react';
import {IFrame} from '../types';
import styled from 'styled-components';
import Iframe from './IFrame';
// import logo from './logo.svg';

interface IFramerProps {
  userId: string;
  currentFrame: IFrame;
  frames: Array<IFrame>;
  runtimePort: chrome.runtime.Port;
}

const Framer = (framerProps: IFramerProps) => {
  const {currentFrame, frames, runtimePort, userId} = framerProps;
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const StyledFramesContainer = styled.div`
    margin: 12px;
    padding-bottom: 54px;
    margin-bottom: 0;
    display: flex;
    flex: 1;
    overflow: hidden;
    align-items: center;
    position: relative;
    flex-direction: column;
    position: relative;
    overflow: hidden;

    .canvas-container {
      position: absolute;
      inset: 0px;
      overflow: scroll;
      margin-right: 0px;
      margin-bottom: 0px;
    }
    .canvas-container .canvas {
      width: calc(${(frames.length + 1) * 1280}px);
      display: flex;
      flex-wrap: wrap;
      transform: perspective(1px) translateZ(0px) scale(1);
      transform-origin: left top;
      backface-visibility: hidden;
    }
  `;

  useEffect(() => {
    if (canvasRef) {
      let enableCall = true;
      console.log('canvas ref: ', canvasRef.current);
      canvasRef.current?.addEventListener('mousemove', e => {
        if (!enableCall) return;

        enableCall = false;

        const {clientX, clientY} = e;
        console.log(clientY, clientX);
        runtimePort.postMessage(
          JSON.stringify({
            type: `MOTION:${currentFrame.id.replace('FRAME:', '')}`,
            body: {
              clientX: (clientX / (frames.length + 1)) * 1280,
              clientY: clientY / 800,
              id: userId,
            },
          })
        );
        setTimeout(() => (enableCall = true), 20);
      });
    }
  }, [canvasRef]);

  return (
    <StyledFramesContainer>
      <div className="canvas-container">
        <div className="canvas" ref={canvasRef}>
          {frames.map((frame: IFrame) => (
            <Iframe key={frame.id} frame={frame}></Iframe>
          ))}
        </div>
      </div>
    </StyledFramesContainer>
  );
};

export default Framer;
