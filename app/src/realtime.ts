import queryString from 'query-string';
import Auth from './auth';
import devices from './devices';

interface ICurrentTab {
  id: number;
  url: string;
  frameId: number;
}

export const getHash = (input: string) => {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return `PANE:${hash}`;
};

const injectContents = (tab: chrome.tabs.Tab) => {
  chrome.tabs.executeScript(tab.id!, {
    file: 'init.js',
  });

  chrome.tabs.executeScript(tab.id!, {
    file: 'collabMode.js',
  });
};

const startRealtimeCollab = async (frameUrl: string, roomId: string) => {
  const queryOptions = {active: true, currentWindow: true};
  console.log('realtime: ', {[getHash(frameUrl)]: roomId});
  chrome.storage.sync.set({[getHash(frameUrl)]: roomId});
  chrome.tabs.query(queryOptions, tabs => {
    if (tabs && tabs.length === 0) return;
    const tab = tabs[0]!;
    if (!tab || !tab.id) return;
    let state = {};

    let started = false;

    console.log('starting ...');

    //reload tab
    chrome.tabs.executeScript(tab.id, {
      code: 'window.location.reload()',
    });

    const tabHostname = Auth.extractHostname(tab.url!);

    const onHeadersReceived = function (
      details: chrome.webRequest.WebResponseHeadersDetails
    ) {
      const headers = details.responseHeaders;

      // if (details.frameId === 0) {
      return {
        responseHeaders: headers,
      };
      // }

      // const responseHeaders = headers?.filter((header: {name: string}) => {
      //   const name = header.name.toLowerCase();
      //   return (
      //     [
      //       'x-frame-options',
      //       'content-security-policy',
      //       'frame-options',
      //     ].indexOf(name) === -1
      //   );
      // });
      //
      // return {
      //   responseHeaders,
      // };
    };

    const onWebNavigationComplete = function (details: {
      tabId: number;
      url: string;
      frameId: number;
    }) {
      if (tab.id !== details.tabId) {
        return;
      }

      if (details.url === 'about:blank') {
        return;
      }

      // if (details.frameId === 0) {
      console.log('main frame', started);
      if (started === false) {
        started = true;
        injectContents(tab!);
        return;
      }
      return;
      // }
      // console.log('url :', {[getHash(frameUrl)]: roomId});

      // if (Auth.extractHostname(details.url) !== tabHostname) {
      //   return;
      // }

      // chrome.tabs.executeScript(details.tabId, {
      //   file: 'syncedEvents.js',
      //   frameId: details.frameId,
      //   runAt: 'document_start',
      // });
    };

    const onBeforeNavigate = function (details: {frameId: number}) {
      if (started === true) {
        chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived);
        chrome.webRequest.onBeforeSendHeaders.removeListener(
          onBeforeSendHeaders
        );

        chrome.webNavigation.onCompleted.removeListener(
          onWebNavigationComplete
        );

        chrome.webNavigation.onCommitted.removeListener(onBeforeNavigate);

        chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest);

        // chrome.runtime.onMessage.removeListener(onMessages);
      }
    };

    const onBeforeRequest = (
      details: chrome.webRequest.WebRequestBodyDetails
    ): void | chrome.webRequest.BlockingResponse => {
      // if (details.frameId === 0) {
      return {
        cancel: true,
      };
      // }
    };

    const onMessages = function (
      request: {message: any; frameId: number; state: {}},
      sender: chrome.runtime.MessageSender,
      sendResponse: Function
    ) {
      if (sender.tab?.id !== tab.id) {
        return;
      }

      switch (request.message) {
        case 'GET_TAB_URL':
          sendResponse({
            tabUrl: tab.url,
          });
          break;

        case 'CAPTURE_SCREEN':
          chrome.tabs.captureVisibleTab(image => {
            console.log('image captured', image);
            sendResponse({
              image,
            });
          });
          break;

        case 'SET_FRAME_ID':
          if (sender.frameId) {
            // frames[sender.frameId] = request.frameId;

            chrome.tabs.sendMessage(
              tab.id!,
              {
                message: 'SET_FRAME',
                screenId: sender.frameId,
                tabId: tab.id,
                chromeFrameId: request.frameId,
              },
              () => {
                console.log('done ..');
              }
            );
          }

          break;

        case 'LOAD_STATE':
          state = request.state;
          break;
        default:
          // do nothing.
          sendResponse({});
          break;
      }

      return true;
    };

    const onBeforeSendHeaders = function (
      details: chrome.webRequest.WebRequestHeadersDetails
    ) {
      // if (details.tabId !== tab.id || tab.frameId === 0) {
      //   return {
      //     requestHeaders: details.requestHeaders,
      //   };
      // }

      // if (!frames[details.frameId]) {
      //   const parsed = queryString.parseUrl(details.url);
      //   if (parsed && parsed.query && parsed.query._RSSID_) {
      //     frames[details.frameId] = parsed.query._RSSID_;
      //   }
      // }

      // const screenId = frames[details.frameId];

      // const screen = state.screens.find(screen => screen.id === screenId);

      // if (!screenId || !screen) {
      // return {
      //   requestHeaders: details.requestHeaders,
      // };
      // }

      // let userAgent = screen.userAgent;
      //
      // const userAgents = state && state.userAgents ? state.userAgents : devices;
      //
      // const value = userAgents.find(agent => agent.name === userAgent);
      //
      // if (value) {
      //   userAgent = value.value;
      // }
      //
      // details.requestHeaders = details.requestHeaders!.filter(
      //   (header: {name: string}) => header.name !== 'User-Agent'
      // );
      //
      const userAgent = {
        name: 'Google Chrome',
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
      };
      details.requestHeaders?.push({
        name: 'User-Agent',
        value: userAgent.value,
      });
      //
      return {requestHeaders: details.requestHeaders};
    };

    chrome.webRequest.onHeadersReceived.addListener(
      onHeadersReceived,
      {
        urls: ['<all_urls>'],
        types: ['sub_frame'],
        tabId: tab.id,
      },
      ['blocking', 'responseHeaders', 'extraHeaders']
    );
    chrome.webRequest.onBeforeRequest.addListener(
      onBeforeRequest,
      {
        urls: ['<all_urls>'],
        types: [
          'stylesheet',
          'script',
          'font',
          'object',
          'xmlhttprequest',
          'ping',
          'csp_report',
          'media',
          'websocket',
        ],
        tabId: tab.id,
      },
      ['blocking']
    );

    chrome.webNavigation.onCompleted.addListener(onWebNavigationComplete);

    chrome.webNavigation.onCommitted.addListener(onBeforeNavigate);

    // chrome.runtime.onMessage.addListener(onMessages);

    chrome.webRequest.onBeforeSendHeaders.addListener(
      onBeforeSendHeaders,
      {urls: ['<all_urls>'], types: ['sub_frame'], tabId: tab.id},
      ['blocking', 'requestHeaders']
    );
  });
};

export {startRealtimeCollab};
