import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {IFrame} from '../types';

interface IFrameProps {
  frame: IFrame;
}

const getHeight = () =>
  (window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight) - 150;

const Iframe = ({frame}: IFrameProps) => {
  const {id, versionedUrl, screen} = frame;
  const [scrolling, setScrolling] = useState(true);

  //get the viewport
  //get the resolution
  // document.addEventListener('onscroll', () => {
  //   // this.reOffset();
  // });
  // document.addEventListener('onresize', () => {
  // });

  const iframeUrl =
    versionedUrl.indexOf('?') >= 0
      ? `${versionedUrl}&_RSSID_=${id}`
      : `${versionedUrl}?_RSSID_=${id}`;

  useEffect(() => {
    let isShift = false;

    const up = () => {
      if (!isShift) {
        return;
      }
      isShift = false;
      setScrolling(true);
    };

    const down = (e: KeyboardEvent) => {
      if (!e.shiftKey) {
        return;
      }
      isShift = true;
      setScrolling(false);
    };

    document.addEventListener('keyup', up);
    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, []);

  const iframeWidth = 1280;
  const iframeHeight = 800;

  return (
    <div>
      <StyledBrowserFrame>
        <div className="row">
          <div className="column left">
            <span className="dot" style={{background: '#ED594A'}}></span>
            <span className="dot" style={{background: '#FDD800'}}></span>
            <span className="dot" style={{background: '#5AC05A'}}></span>
          </div>
        </div>

        <div className="content">
          <iframe
            scrolling={scrolling ? 'auto' : 'no'}
            id={id}
            className={'iframe'}
            sandbox="allow-scripts allow-forms allow-same-origin allow-presentation allow-orientation-lock allow-modals allow-popups-to-escape-sandbox allow-pointer-lock"
            key={`screen-${screen.timestamp}`}
            // title={`${screen.name} - ${width}x${height}`}
            style={{
              width: iframeWidth,
              height: iframeHeight,
            }}
            src={'https://' + iframeUrl}
          />
        </div>
      </StyledBrowserFrame>
    </div>
  );
};

const StyledBrowserFrame = styled.div`
  border: 3px solid #f1f1f1;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  .row {
    padding: 10px;
    background: #f1f1f1;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .left {
    width: 15%;
  }
  .row:after {
    content: '';
    display: table;
    clear: both;
  }
  /* Three dots */
  .dot {
    margin-top: 4px;
    margin-right: 4px;
    height: 12px;
    width: 12px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
  }
  .content {
    padding: 0;
  }
  .content iframe {
    background-color: #fff;
    border: none;
    border-radius: 2;
    display: block;
  }
`;

const StyledIFrame = styled(Iframe)`
  position: relative;
  transition: all ease 0.5s;

  .highlighted {
    box-shadow: 0 0 0 4px red;
    transform: scale(1.02);
    transition: all ease 0.5s;
  }

  .progress {
    position: absolute;
    top: 0;
    width: 100%;
  }
`;

export default StyledIFrame;
