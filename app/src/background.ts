import Auth from './auth';
import {startRealtimeCollab, getHash} from './realtime';
import {fetchSessions, recordSession, startSession} from './session';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const messageType = request.message.toUpperCase();
  switch (messageType) {
    case 'INIT_LIQUID':
      const frameKey = getHash(request.frameUrl);
      chrome.storage.sync.get([frameKey], response => {
        sendResponse({
          roomId: response[frameKey],
          user: Auth.getUser(),
        });
      });
      break;
    case 'LOGIN':
      Auth.authenticate(sendResponse);
      break;
    case 'LOGOUT':
      Auth.userSignedIn = false;
      chrome.browserAction.setPopup({popup: './popup.html'}, () => {
        sendResponse('success');
      });
      break;
    case 'IS_LOGGED_IN':
      sendResponse(Auth.userSignedIn);
      break;
    case 'SYNC_SCREENS':
      console.log('SYNC REQUEST: ', request);
      startRealtimeCollab(request.frameUrl, request.roomId);
      break;
    case 'FETCH_SESSIONS':
      fetchSessions(request.payload.url, sendResponse);
      break;
    case 'START_SESSION':
      startSession(request.payload, Auth.getUser(), sendResponse);
      break;
    case 'RECORD_SESSION':
      recordSession(request.payload, sendResponse);
      break;
    // case 'STOP_SESSION':
    //   stopSession();
    //   break;
    // case 'JOIN_SESSION':
    //   joinSession();
    //   break;
    default:
      throw new Error('Invalid message');
  }
  return true;
});

class Socket {
  private static instance: Socket;
  socket: WebSocket;

  private constructor() {
    this.socket = new WebSocket(`ws://localhost:8080?token=${Auth.token}`);
  }

  public static getInstance(): Socket {
    if (
      !Socket.instance ||
      Socket.instance.socket.readyState === Socket.instance.socket.CLOSED ||
      Socket.instance.socket.readyState === Socket.instance.socket.CLOSING
    ) {
      Socket.instance = new Socket();
    }

    return Socket.instance;
  }
}

const send = (ws: WebSocket, message: any, callback?: Function) => {
  waitForConnection(
    ws,
    () => {
      ws.send(message);
      if (typeof callback !== 'undefined') {
        callback();
      }
    },
    500
  );
};

const waitForConnection = (
  ws: WebSocket,
  callback: Function,
  interval: number
) => {
  if (ws.readyState === 1) {
    callback();
  } else {
    // optional: implement backoff for interval here
    setTimeout(() => {
      waitForConnection(ws, callback, interval);
    }, interval);
  }
};
const setupPortFor = (port: chrome.runtime.Port) => {
  console.assert(port.name === 'socket' || port.name.indexOf('SESSION:') >= 0);
  let keepAliveTimeoutId: number | undefined = undefined;

  const PONG: Uint8Array = new Uint8Array([65]);
  const PING = 57;

  function isPing(data: any) {
    if (typeof data === 'string') return false;
    const buffer = new Uint8Array(data);
    console.log('is PING: ', buffer.length === 1 && buffer[0] === PING);
    return buffer.length === 1 && buffer[0] === PING;
  }

  function keepAlive(socket: WebSocket) {
    if (keepAliveTimeoutId) clearTimeout(keepAliveTimeoutId);
    // per the protocol, the server sends a ping every 10 seconds
    // if it takes more than 5 seconds to receive that ping, something is wrong
    console.log('PONG time: ', new Date());
    keepAliveTimeoutId = window.setTimeout(() => {
      console.log('END time: ', new Date());
      keepAliveTimeoutId = undefined;
      socket.close(1000);
    }, 10000 * 1.5);
  }

  console.log('will open socket');
  const socket = new WebSocket(`ws://localhost:8080?token=${Auth.token}`);
  socket.binaryType = 'arraybuffer';

  const onSocketClose = () => port.postMessage({close: true});
  socket.addEventListener('close', onSocketClose);
  socket.addEventListener('message', event => {
    if (isPing(event.data)) {
      keepAlive(socket);
      send(socket, PONG);
    } else {
      port.postMessage({message: event.data});
    }
  });
  socket.addEventListener('error', event => console.error('error!', event));

  console.log(port.name);
  port.onMessage.addListener(message => {
    send(socket, message);
  });
  console.log(port);
  port.onDisconnect.addListener(() => {
    socket.removeEventListener('close', onSocketClose);
    socket.close();
  });
  port.postMessage({ready: true});
  // port.onMessage.addListener(event => {
  //   send(socket, event);
  // });
};

chrome.runtime.onConnect.addListener(port => {
  setupPortFor(port);
});
