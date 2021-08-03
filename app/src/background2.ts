// import {KJUR, b64utoutf8} from 'jsrsasign';
// import queryString from 'query-string';
// import devices from './devices';
//
// const extractHostname = (url: string): string => {
//   let hostname;
//   //find & remove protocol (http, ftp, etc.) and get hostname
//
//   if (url.indexOf('//') > -1) {
//     hostname = url.split('/')[2];
//   } else {
//     hostname = url.split('/')[0];
//   }
//
//   //find & remove port number
//   hostname = hostname.split(':')[0];
//   //find & remove "?"
//   hostname = hostname.split('?')[0];
//
//   return hostname;
// };
//
// const CLIENT_ID = encodeURIComponent(
//   '1077167489512-so5ln69eqbbjqpckatnmt9hf8kbues2b.apps.googleusercontent.com'
// );
// const RESPONSE_TYPE = encodeURIComponent('id_token');
// const REDIRECT_URI = encodeURIComponent(
//   'https://iilocmnalcgcmhllmglddcpinbmobpag.chromiumapp.org/'
// );
// const SCOPE = encodeURIComponent('openid email profile');
// const STATE = encodeURIComponent(
//   'meet' + Math.random().toString(36).substring(2, 15)
// );
// const PROMPT = encodeURIComponent('consent');
//
// let user_signed_in = false;
// let token: string = null;
// let socket: WebSocket = null;
//
// type UserInfo = {
//   iss: string;
//   aud: string;
// };
// function is_user_signed_in() {
//   return user_signed_in;
// }
//
// function create_auth_endpoint() {
//   const nonce = encodeURIComponent(
//     Math.random().toString(36).substring(2, 15) +
//       Math.random().toString(36).substring(2, 15)
//   );
//
//   const openId_endpoint_url = `https://accounts.google.com/o/oauth2/v2/auth
// ?client_id=${CLIENT_ID}
// &response_type=${RESPONSE_TYPE}
// &redirect_uri=${REDIRECT_URI}
// &scope=${SCOPE}
// &state=${STATE}
// &nonce=${nonce}
// &prompt=${PROMPT}`;
//
//   return openId_endpoint_url;
// }
//
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.message === 'login') {
//     chrome.identity.launchWebAuthFlow(
//       {
//         url: create_auth_endpoint(),
//         interactive: true,
//       },
//       (redirect_url?: string) => {
//         if (chrome.runtime.lastError || !redirect_url) {
//           // return true;
//           // problem signing in
//         } else {
//           let id_token = redirect_url.substring(
//             redirect_url.indexOf('id_token=') + 9
//           );
//           id_token = id_token.substring(0, id_token.indexOf('&'));
//           const user_info = KJUR.jws.JWS.readSafeJSONString(
//             b64utoutf8(id_token.split('.')[1])
//           );
//           const user = user_info! as UserInfo;
//
//           if (
//             (user.iss === 'https://accounts.google.com' ||
//               user.iss === 'accounts.google.com') &&
//             user.aud === CLIENT_ID
//           ) {
//             console.log('User successfully signed in.');
//             user_signed_in = true;
//             token = id_token;
//
//             chrome.storage.sync.set({token}, () => {
//               chrome.browserAction.setPopup(
//                 {popup: './popup-signedin.html'},
//                 () => {
//                   console.log('sending success ', token);
//                   sendResponse('success');
//                 }
//               );
//             });
//           } else {
//             // invalid credentials
//             console.log('Invalid credentials.');
//           }
//         }
//       }
//     );
//     // return true;
//   } else if (request.message === 'logout') {
//     user_signed_in = false;
//     chrome.browserAction.setPopup({popup: './popup.html'}, () => {
//       sendResponse('success');
//     });
//     // return true;
//   } else if (request.message === 'isUserSignedIn') {
//     sendResponse(is_user_signed_in());
//   } else if (request.message === 'INIT_CONNECTION') {
//     console.log('socket: ', socket);
//     if (!socket) {
//       socket = new WebSocket(`ws://localhost:8080?token=${token}`);
//       console.log('new socket: ', socket);
//     }
//     setup();
//     // sendResponse('success');
//     // return true;
//   } else if (request.message === 'realtime-mode') {
//     console.log('starting magic');
//     start(request.tab);
//   }
//   console.log('returning true');
//   return true;
// });
//
// const MESSAGE_ENUM = Object.freeze({
//   SELF_CONNECTED: 'SELF_CONNECTED',
//   INIT_CLIENT: 'INIT_CLIENT',
//   CLIENT_CONNECTED: 'CLIENT_CONNECTED',
//   CLIENT_DISCOVERED: 'CLIENT_DISCOVERED',
//   DISCOVER_CLIENT: 'DISCOVER_CLIENT',
//   CLIENT_DISCONNECTED: 'CLIENT_DISCONNECTED',
//   MOTION: 'MOTION',
//   RESIZED: 'RESIZED',
//   SYNC_SCREENS: 'SYNC_SCREENS',
// });
//
// let portal = null;
//
// const onMessage = (event: any) => {
//   console.log('message ', event);
//   portal.postMessage(event);
// };
//
// function setup() {
//   console.log('setting up socket');
//   // portal = chrome.runtime.connect({name: 'socket'});
//   socket.onmessage = onMessage;
//   // port.onMessage.addListener((event: any) => {
//   //   socket.send(event);
//   // });
//
//   socket.onerror = () => {
//     // if (this.canConnect === undefined) {
//     // this.canConnect = false;
//     // this.emit('supported', false)
//     // }
//   };
//
//   socket.onclose = event => {
//     // if the user or the firewall caused the close, don't reconnect & don't announce the disconnect
//     // const {code, reason} = event;
//     // if (reason) {
//     //   // if there's a reason to close, keep it closed
//     //   this.canConnect = false;
//     // }
//     // // this.emit('close', {code, reason})
//     // if (this.canConnect) {
//     //   if (this.reconnectAttempts === 0) {
//     //     // only send the message once per disconnect
//     //     // this.emit('disconnected')
//     //   }
//     //   this.tryReconnect();
//     // }
//   };
// }
//
// chrome.runtime.onConnect.addListener(port => {
//   if (!portal) {
//     portal = port;
//   }
//   port.onMessage.addListener(event => {
//     socket.send(event);
//   });
//   // port.postMessage({greeting: 'hello'});
// });
//
// const frames: any = {};
//
// const injectContents = tab => {
//   // chrome.tabs.executeScript(tab.id, {
//   //   file: 'content.js',
//   // });
//   // chrome.tabs.insertCSS(tab.id, {
//   //   file: 'static/css/main.css',
//   // });
//   //
//   // chrome.tabs.executeScript(tab.id, {
//   //   file: 'static/js/main.js',
//   // });
// };
//
// const start = tab => {
//   let state = {};
//
//   let started = false;
//
//   console.log('starting ...');
//
//   chrome.tabs.executeScript(tab.id, {
//     code: 'window.location.reload()',
//   });
//
//   const tabHostname = extractHostname(tab.url);
//
//   const onHeadersReceived = function (details) {
//     const headers = details.responseHeaders;
//
//     if (details.frameId === 0) {
//       return {
//         responseHeaders: headers,
//       };
//     }
//
//     const responseHeaders = headers.filter(header => {
//       const name = header.name.toLowerCase();
//       return (
//         ['x-frame-options', 'content-security-policy', 'frame-options'].indexOf(
//           name
//         ) === -1
//       );
//     });
//
//     return {
//       responseHeaders,
//     };
//   };
//
//   const onWebNavigationComplete = function (details) {
//     if (tab.id !== details.tabId) {
//       return;
//     }
//
//     if (details.url === 'about:blank') {
//       return;
//     }
//
//     if (details.frameId === 0) {
//       console.log('main frame', started);
//       if (started === false) {
//         started = true;
//         injectContents(tab);
//         return;
//       }
//       return;
//     }
//
//     if (extractHostname(details.url) !== tabHostname) {
//       return;
//     }
//
//     chrome.tabs.executeScript(details.tabId, {
//       file: 'syncedEvents.js',
//       frameId: details.frameId,
//       runAt: 'document_start',
//     });
//   };
//
//   const onBeforeNavigate = function (details) {
//     if (details.frameId === 0 && started === true) {
//       chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived);
//       chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeaders);
//
//       chrome.webNavigation.onCompleted.removeListener(onWebNavigationComplete);
//
//       chrome.webNavigation.onCommitted.removeListener(onBeforeNavigate);
//
//       chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest);
//
//       chrome.runtime.onMessage.removeListener(onMessages);
//     }
//   };
//
//   const onBeforeRequest = details => {
//     if (details.frameId === 0) {
//       return {
//         cancel: true,
//       };
//     }
//   };
//
//   const onMessages = function (request, sender, sendResponse) {
//     if (sender.tab.id !== tab.id) {
//       return;
//     }
//
//     switch (request.message) {
//       case 'GET_TAB_URL':
//         sendResponse({
//           tabUrl: tab.url,
//         });
//         break;
//
//       case 'CAPTURE_SCREEN':
//         chrome.tabs.captureVisibleTab(null, {}, image => {
//           console.log('image captured', image);
//           sendResponse({
//             image,
//           });
//         });
//         break;
//
//       case 'SET_FRAME_ID':
//         frames[sender.frameId] = request.frameId;
//
//         chrome.tabs.sendMessage(
//           tab.id,
//           {
//             message: 'SET_FRAME',
//             screenId: sender.frameId,
//             tabId: tab.id,
//             chromeFrameId: request.frameId,
//           },
//           () => {
//             console.log('done ..');
//           }
//         );
//
//         break;
//
//       case 'LOAD_STATE':
//         state = request.state;
//         break;
//       default:
//         // do nothing.
//         sendResponse({});
//         break;
//     }
//
//     return true;
//   };
//
//   const onBeforeSendHeaders = function (details: any) {
//     if (details.tabId !== tab.id || tab.frameId === 0) {
//       return {
//         requestHeaders: details.requestHeaders,
//       };
//     }
//
//     if (!frames[details.frameId]) {
//       const parsed = queryString.parseUrl(details.url);
//       if (parsed && parsed.query && parsed.query._RSSID_) {
//         frames[details.frameId] = parsed.query._RSSID_;
//       }
//     }
//
//     const screenId = frames[details.frameId];
//
//     const screen = state.screens.find(screen => screen.id === screenId);
//
//     if (!screenId || !screen) {
//       return {
//         requestHeaders: details.requestHeaders,
//       };
//     }
//
//     let userAgent = screen.userAgent;
//
//     const userAgents = state && state.userAgents ? state.userAgents : devices;
//
//     const value = userAgents.find(agent => agent.name === userAgent);
//
//     if (value) {
//       userAgent = value.value;
//     }
//
//     details.requestHeaders = details.requestHeaders.filter(
//       header => header.name !== 'User-Agent'
//     );
//
//     details.requestHeaders.push({
//       name: 'User-Agent',
//       value: userAgent,
//     });
//
//     return {requestHeaders: details.requestHeaders};
//   };
//
//   chrome.webRequest.onHeadersReceived.addListener(
//     onHeadersReceived,
//     {
//       urls: ['<all_urls>'],
//       types: ['sub_frame'],
//       tabId: tab.id,
//     },
//     ['blocking', 'responseHeaders', 'extraHeaders']
//   );
//   chrome.webRequest.onBeforeRequest.addListener(
//     onBeforeRequest,
//     {
//       urls: ['<all_urls>'],
//       types: [
//         'stylesheet',
//         'script',
//         'image',
//         'font',
//         'object',
//         'xmlhttprequest',
//         'ping',
//         'csp_report',
//         'media',
//         'websocket',
//       ],
//       tabId: tab.id,
//     },
//     ['blocking']
//   );
//
//   chrome.webNavigation.onCompleted.addListener(onWebNavigationComplete);
//
//   chrome.webNavigation.onCommitted.addListener(onBeforeNavigate);
//
//   chrome.runtime.onMessage.addListener(onMessages);
//
//   chrome.webRequest.onBeforeSendHeaders.addListener(
//     onBeforeSendHeaders,
//     {urls: ['<all_urls>'], types: ['sub_frame'], tabId: tab.id},
//     ['blocking', 'requestHeaders']
//   );
// };
