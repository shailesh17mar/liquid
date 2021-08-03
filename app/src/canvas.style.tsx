import React from 'react';
import styled from 'styled-components';

export const StyledApp = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;

export const StyledAppHeader = styled.div`
  position: relative;
  z-index: 6000;
  height: 48px;
  display: flex;
  justify-content: space-between;
  padding: 12px 18px;
  background: #fffff;
  box-shadow: 0 1px 1px rgb(25 25 25 / 10%);
`;

export const StyledAppBody = styled.div`
  display: flex;
  height: 100%;
  padding-bottom: 54px;
`;

export const StyledFrames = styled.div`
  width: 190px;
  flex-shrink: 0;
  display: flex;
  position: relative;
  flex-direction: column;
  box-shadow: 1px 0 0 #dddfe5;
`;

export const StyledFramesContainer = styled.div`
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
    width: calc(200%);
    display: flex;
    flex-wrap: wrap;
    transform: perspective(1px) translateZ(0px) scale(1);
    transform-origin: left top;
    backface-visibility: hidden;
  }
`;

export const StyledPreviewFrame = styled.div`
  width: 180px;
  height: 90px;

  .frame {
    font-size: 12px;
    padding: 0 8px;
    display: flex;
    width: 128px;
    height: 72px;
    margin: 20px auto;
    justify-content: center;
    align-items: center;
    background: #fff;
    border: solid 1px #dddfe5;
  }

  .frame-container.selected .frame {
    border: solid 1px rgb(47, 128, 237);
  }

  .frame-container {
    width: 180px;
    display: flex;
    align-items: center;
  }

  .frame-container.selected {
    background: rgba(47, 128, 237, 0.3);
    border-bottom-right-radius: 6px;
    border-top-right-radius: 6px;
  }
`;

export const StyledToolDrawer = styled.div``;
