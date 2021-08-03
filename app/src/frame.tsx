import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as rrweb from '../rrweb/lib/rrweb-all';

import Canvas from './Canvas';

const mountNode = document.getElementById('LIQUID-ROOT');
/*
 * roomId
 * currentFrame
 * allFrames
 */
// let events: any = [];
// function save() {
//   if (events.length > 0) {
//     chrome.runtime.sendMessage(
//       {
//         message: 'RECORD_SESSION',
//         payload: events,
//       },
//       res => {
//         console.log('res: ', res);
//       }
//     );
//     // const body = JSON.stringify({events});
//     // events = [];
//     // fetch('http://localhost:3000/session/hello', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body,
//     // });
//   }
// }
chrome.runtime.sendMessage(
  {
    message: 'INIT_LIQUID',
    frameUrl: window.location.href.replace(window.location.protocol + '//', ''),
  },
  ({roomId, user}) => {
    if (roomId) {
      // chrome.contextMenus.create({
      //   title: 'Open Link in a new Frame',
      //   onclick: () => {},
      //   targetUrlPatterns: [window.location.origin + '/*'],
      // });
      //

      // setTimeout(() => {
      //   const replayer = new rrweb.Replayer(events);
      //   replayer.play();
      // }, 10 * 1000);

      // this function will send events to the backend and reset the events array

      // save events every 10 seconds
      // setInterval(save, 1 * 1000);
      ReactDOM.render(
        <Canvas
          roomId={roomId}
          rrweb={rrweb}
          user={{
            name: user.name,
            id: user.sub,
            picture: user.picture,
            color: '#FFFFFF',
          }}
        />,
        mountNode
      );
    }
  }
);
