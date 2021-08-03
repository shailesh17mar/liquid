import React, {useEffect, useState, useCallback} from 'react';

import {ICanvas, IUser, ICursor} from './types';

// play
import {
  StyledApp,
  StyledAppHeader,
  StyledAppBody,
  StyledToolDrawer,
} from './canvas.style';
import Framer from './components/Framer';
import Cursor from './components/Cursor';

interface ICanvasProps {
  roomId: string;
  user: IUser;
  rrweb: any;
}
let events: Array<any> = [];
const Canvas = (canvasProps: ICanvasProps) => {
  const {roomId, user, rrweb} = canvasProps;
  const [room, setRoom] = useState<ICanvas | null>(null);
  const [recorder, setRecorder] = useState<(() => void) | undefined>();
  const [cursors, setCursors] = useState<{[id: string]: ICursor} | null>(null);
  const [framePosition, setFramePosition] = useState({
    offsetY: 0,
    offsetX: 0,
    width: 0,
    height: 0,
  });
  const [runtimePort, setRuntimePort] =
    useState<chrome.runtime.Port | null>(null);

  const setupPortListeners = () => {
    const onMessage = (event: any) => {
      const {body, type: messageType} = JSON.parse(event.data);
      const [type, hash] = messageType.split(':');
      switch (type) {
        case 'SETUP_ROOM':
          setRoom({...body, version: 0});
          setCursors(
            (body as ICanvas).currentFrame.users.reduce(
              (cursors: {[id: string]: ICursor}, user: IUser) => {
                cursors[user.id] = {...user, x: 0, y: 0};
                return cursors;
              },
              {}
            )
          );
          break;
        case 'USERS_UPDATED':
          room &&
            setRoom({
              ...room,
              currentFrame:
                room.currentFrame.id === body.id
                  ? {...room.currentFrame, users: body.users}
                  : room.currentFrame,
              allFrames: room.allFrames.map(frame => {
                if (frame.id === body.id) {
                  frame.users = body.users;
                }
                return frame;
              }),
              version: room.version + 1,
            });
          setCursors((previousCursors: {[id: string]: ICursor} | null) =>
            (body as ICanvas).currentFrame.users.reduce(
              (cursors: {[id: string]: ICursor}, user: IUser) => {
                let x = 0;
                let y = 0;
                const previousCursor =
                  previousCursors && previousCursors[user.id];
                if (previousCursor) {
                  x = previousCursor.x;
                  y = previousCursor.y;
                }
                cursors[user.id] = {...user, x, y};
                return cursors;
              },
              {}
            )
          );
          break;
        case 'MOTION':
          setCursors((previousCursors: {[id: string]: ICursor} | null) => {
            return (
              previousCursors && {
                ...previousCursors,
                [body.id]: {
                  ...previousCursors[body.id],
                  x: body.clientX,
                  y: body.clientY,
                },
              }
            );
          });
          //set cursors
          // if (!this.cursors[id]) {
          //   const cursor = setCursors(id, body.name, body.color);
          // } else {
          //   if (this.cursors[id] && id !== this.currentUserId) {
          //     this.cursors[id].pointer.style.left = `${
          //       body.clientX * window.innerWidth
          //     }px`;
          //     this.cursors[id].pointer.style.top = `${
          //       body.clientY * window.innerHeight
          //     }px`;
          //     this.cursors[id].legend.style.left = `${
          //       body.clientX * window.innerWidth + 5
          //     }px`;
          //     this.cursors[id].legend.style.top = `${
          //       body.clientY * window.innerHeight + 5
          //     }px`;
          //   }
          // }
          break;
        default:
      }
    };

    runtimePort!.onMessage.addListener(request => {
      if (request.message) {
        //handle proper socket messages
        onMessage({data: request.message});
      } else if (request.close) {
        console.warn('warn ', request.error);
      } else if (request.error) {
        console.warn('warn ', request.error);
      }
    });
  };

  useEffect(() => {
    const port = chrome.runtime.connect({name: roomId});

    // setTimeout(() => {
    console.log('starting to record');

    // if (!recorder) {
    let stopfn: any;
    let replayer: any;
    setTimeout(() => {
      stopfn = rrweb.record({
        emit(event: any) {
          // push event into the events array
          events.push(event);
          if (stopfn && events.length > 100) {
            // console.log('stopped');
            // stopfn();
          }
          if (events.length === 3) {
            replayer = new rrweb.Replayer(events, {
              liveMode: true,
              unpackFn: rrweb.unpack,
            });
            replayer.startLive();
          } else {
            if (replayer) {
              replayer.addEvent(event);
            }
          }
          // console.log(events.length);
          // events.push(event);
        },
        packFn: rrweb.pack,
      });
    }, 10 * 1000);
    // setRecorder(r);
    // }
    setRuntimePort(port);
  }, [roomId]);

  useEffect(() => {
    if (runtimePort) {
      runtimePort.postMessage(
        JSON.stringify({
          type: `SETUP_ROOM:${roomId.replace('SESSION:', '')}`,
          body: {
            frameUrl: window.location.href.replace(
              window.location.protocol + '//',
              ''
            ),
          },
        })
      );
      setupPortListeners();
    }
  }, [runtimePort]);

  //   useCallback(
  //   () => {
  //     doSomething(a, b);
  //   },
  //   [runtimePort],
  // );
  if (!runtimePort || !room) {
    return <div>Loading...</div>;
  }

  return (
    <StyledApp>
      <StyledAppHeader>
        <button
          onClick={() => {
            if (recorder) recorder();
            console.log('events ', events.length);
            const replayer = new rrweb.Replayer(events);
            replayer.play();
          }}
        >
          Replay
        </button>

        <button
          onClick={() => {
            // events.length = 0;
            // replayer.play();
          }}
        >
          Stop recording
        </button>

        {
          // <img src={logo} className="App-logo" alt="logo" />
        }
      </StyledAppHeader>
      <StyledAppBody>
        {
          // <StyledFrames>
          //   {room.allFrames.map((frame: IFrame, index: number) => (
          //     <StyledPreviewFrame id={frame.id} key={frame.id}>
          //       <div
          //         className={
          //           room.currentFrame.id === frame.id
          //             ? 'frame-container selected'
          //             : 'frame-container'
          //         }
          //       >
          //         <div className="frame">
          //           {frame.title || `Frame ${index + 1}`}
          //         </div>
          //       </div>
          //     </StyledPreviewFrame>
          //   ))}
          // </StyledFrames>
        }
        <Framer
          frames={room.allFrames}
          currentFrame={room.currentFrame}
          runtimePort={runtimePort}
          userId={user.id}
        />
        {
          // setTimeout(() => {
          //   const replayer = new rrweb.Replayer(events);
          //   replayer.play();
          // }, 10 * 1000)
          // <StyledFramesContainer>
          //   <div className="canvas-container">
          //     <div className="canvas">
          //       {room.allFrames.map((frame: IFrame, index: number) => (
          //         <Iframe
          //           key={frame.id}
          //           onMouseMove={onMouseMove}
          //           onResize={onResize}
          //           frame={frame}
          //         ></Iframe>
          //       ))}
          //     </div>
          //   </div>
          // </StyledFramesContainer>
        }

        {cursors &&
          Object.values(cursors).map(cursor => {
            return (
              <Cursor
                key={cursor.id}
                pointer={cursor}
                framePosition={framePosition}
              />
            );
          })}
        <StyledToolDrawer></StyledToolDrawer>
      </StyledAppBody>
    </StyledApp>
  );
};

export default Canvas;
