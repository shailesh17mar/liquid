const LocalStorageKey = {
  USER_DETAILS: 'Liquid:user',
};

interface Cursor {
  pointer: SVGElement;
  legend: HTMLDivElement;
}

interface User {
  id: string;
  name: string;
  color: string;
  picture: string;
  hash: string;
  others: Array<User>;
}

interface IMetadata {
  token: string;
  roomId?: string | undefined;
}

interface IControl {
  icon: string;
  label: string;
  onTap: Function;
  sticky?: boolean;
}

class Liquid {
  private port: chrome.runtime.Port;
  private keepAliveTimeoutId?: number;
  private timeout = 10000;
  private isRealtimeCollabEnabled = false;
  private controls: Array<IControl>;
  private MESSAGE_ENUM: Readonly<{
    SELF_CONNECTED: string;
    FETCH_SESSIONS: string;
    START_SESSION: string;
    INIT_CLIENT: string;
    CLIENT_CONNECTED: string;
    CLIENT_DISCOVERED: string;
    DISCOVER_CLIENT: string;
    CLIENT_DISCONNECTED: string;
    MOTION: string;
    RESIZED: string;
    SYNC_SCREENS: string;
  }>;
  private readonly PING = 57;
  private readonly PONG: Uint8Array = new Uint8Array([65]);
  private currentUserId?: string;
  private cursors: {
    [key: string]: Cursor;
  } = {};
  private canConnect = true;
  private reconnectTimeoutId?: number;
  private reconnectAttempts = 0;
  private backoff: number[] = [1000, 2000, 5000, 10000];
  private liveUserCount = 0;
  private metadata: any;
  private controlPad?: HTMLDivElement;
  private roomsDropdown?: HTMLDivElement;
  private connectionHash?: string;
  // private user?: string;
  private user?: User;

  private static _liquidInstance: Liquid;

  private constructor(metadata: IMetadata) {
    this.MESSAGE_ENUM = Object.freeze({
      SELF_CONNECTED: 'SELF_CONNECTED',
      FETCH_SESSIONS: 'FETCH_SESSIONS',
      START_SESSION: 'START_SESSION',
      INIT_CLIENT: 'INIT_CLIENT',
      CLIENT_CONNECTED: 'CLIENT_CONNECTED',
      CLIENT_DISCOVERED: 'CLIENT_DISCOVERED',
      DISCOVER_CLIENT: 'DISCOVER_CLIENT',
      CLIENT_DISCONNECTED: 'CLIENT_DISCONNECTED',
      MOTION: 'MOTION',
      RESIZED: 'RESIZED',
      SYNC_SCREENS: 'SYNC_SCREENS',
    });
    this.metadata = metadata;
    this.controls = [
      {
        icon: ` <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="#828282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="#828282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="#828282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.58984 13.5098L15.4198 17.4898" stroke="#828282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.4098 6.50977L8.58984 10.4898" stroke="#828282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      `,
        label: 'Realtime Collaboration',
        onTap: this.startRealtimeCollaboration,
        sticky: true,
      },
      {
        label: 'Annotate',
        onTap: this.fetchSessions,
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="#828282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
        sticky: true,
      },
    ];

    this.port = chrome.runtime.connect({name: 'socket'});
    this.fetchSessions();
    this.initConnection();
    // this.port = chrome.runtime.connect({name: 'socket'});
  }

  static getInstance(metadata: IMetadata): Liquid {
    if (!this._liquidInstance) {
      this._liquidInstance = new Liquid(metadata);
    }
    return this._liquidInstance;
  }

  private fetchSessions = () => {
    chrome.runtime.sendMessage(
      {
        message: this.MESSAGE_ENUM.FETCH_SESSIONS,
        payload: {
          url: window.location.href.replace(
            window.location.protocol + '//',
            ''
          ),
        },
      },
      (rooms: Array<JSON>) => {
        this.setupRoomsDropdown(rooms);
      }
    );
  };

  private setupRoomsDropdown(rooms: Array<any>) {
    const controlPanel = document.querySelector('.liquid-bar');
    if (this.roomsDropdown) this.roomsDropdown.remove();
    const dropdown = document.createElement('div');
    dropdown.classList.add('liquid-dropdown');

    rooms.forEach(room => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.innerText = room.name;
      a.onclick = e => {
        e.preventDefault();
        this.roomsDropdown?.classList.toggle('active');
        const {orgId, _id: id, templateId, name, duration} = room;
        if (!templateId) {
          chrome.runtime.sendMessage(
            {
              message: this.MESSAGE_ENUM.START_SESSION,
              payload: {
                orgId,
                name,
                duration,
                templateId: id,
                panes: [
                  {
                    title: document.title,
                    url: window.location.href.replace(
                      window.location.protocol + '//',
                      ''
                    ),
                  },
                ],
              },
            },
            response => {
              this.syncScreens(response._id);
            }
          );
        } else {
          this.syncScreens(id);
        }
      };
      li.appendChild(a);
      dropdown.appendChild(li);
    });
    this.roomsDropdown = dropdown;
    controlPanel?.appendChild(dropdown);
  }

  private startRealtimeCollaboration = () => {
    this.isRealtimeCollabEnabled = true;
    //this function can only be called if page has multiple participants right
    //now

    this.roomsDropdown?.classList.toggle('active');
    // chrome.runtime.sendMessage(
    //   {
    //     message: this.MESSAGE_ENUM.START_SESSION,
    //     payload: {
    //       url: window.location.href.replace(
    //         window.location.protocol + '//',
    //         ''
    //       ),
    //     },
    //   },
    //   response => {
    //     console.log(response);
    //     // this.syncScreens();
    //     // this.startTracking();
    //   }
    // );
  };

  private followUser(id: string) {}

  private syncScreens(id: string) {
    chrome.runtime.sendMessage({
      message: this.MESSAGE_ENUM.SYNC_SCREENS,
      roomId: id,
      frameUrl: window.location.href.replace(
        window.location.protocol + '//',
        ''
      ),
    });
  }

  private initializeControlPad() {
    const controlPad = document.createElement('div');
    const controlArray = document.createElement('div');
    const controls = document.createElement('ul');
    controlPad.classList.add('liquid-bar');
    document.querySelector('body')!.appendChild(controlPad);
    this.controlPad = controlPad;

    const action = document.createElement('div');
    action.classList.add('liquid-action-button');
    const icon = document.createElement('button');
    controlArray.style.width = '0px';
    icon.onclick = (e: any) => {
      e.preventDefault();
      if (controlPad.classList.toggle('open'))
        controlArray.style.width = '96px';
      else controlArray.style.width = '0px';
    };
    icon.classList.add('code');
    icon.classList.add('icon');
    action.appendChild(icon);

    controlArray.classList.add('liquid-action-array');
    this.controls.forEach(control => {
      const li = document.createElement('li');
      li.classList.add('liquid-control');
      li.insertAdjacentHTML('beforeend', control.icon);
      li.setAttribute('title', control.label);
      li.onclick = e => {
        e.preventDefault();
        if (control.sticky) {
          li.classList.toggle('selected');
        }
        control.onTap();
      };
      controls.appendChild(li);
    });
    controlArray.appendChild(controls);
    controlPad.appendChild(controlArray);
    controlPad.appendChild(action);
  }

  private addUser(id: string, name: string, picture: string, color: string) {
    if (!this.controlPad) return;
    if (this.user?.others.find(u => u.id === id)) return;
    this.user?.others.push({
      id,
      name,
      picture,
      color,
    } as User);
    this.liveUserCount++;
    if (this.liveUserCount < 6) {
      const avatar = document.createElement('div');
      avatar.setAttribute('data-avatar', id);
      avatar.classList.add('liquid-avatar');

      // avatar.style.backgroundColor = color;
      // avatar.style.backgroundImage = `url("${`https://avatars.dicebear.com/api/micah/${id}.svg?background=${color.replace(
      avatar.style.backgroundImage = `url("${picture}")`;
      avatar.style.backgroundSize = 'contain';
      avatar.style.border = `solid 2px ${color}`;
      this.controlPad.appendChild(avatar);
    } else {
      let counter = document.querySelector('.liquid-user-counter');
      if (!counter) {
        counter = document.createElement('div');
        counter.classList.add('liquid-user-counter');
        this.controlPad.appendChild(counter);
      }
      counter.textContent = '+' + this.liveUserCount;
    }
  }

  initConnection = () => {
    this.port.onMessage.addListener(request => {
      if (request.message) {
        //handle proper socket messages
        this.onMessage({data: request.message});
      } else if (request.close) {
        // this.deactivate(false);
        // updateCount();
      } else if (request.ready) {
        // Send first value to init tab
        this.initializeControlPad();
        // updateCount();
      } else if (request.error) {
        console.warn('warn ', request.error);
        // this.deactivate(false);
      }
    });
  };

  setup() {
    // this.port.onMessage.addListener(this.onMessage);
  }

  onMessage = (event: any) => {
    // console.log('event: ', event);
    if (event.isTrusted) return;
    const {data} = event;
    if (this.isPing(data)) {
      this.keepAlive();
      this.port.postMessage(this.PONG);
    } else {
      const {body, type: messageType} = JSON.parse(data);
      const id = body.id;
      const [type, connectionHash] = messageType.split(':');
      this.connectionHash = connectionHash;
      switch (type) {
        case this.MESSAGE_ENUM.SELF_CONNECTED:
          this.currentUserId = id;
          this.setUser(JSON.stringify({...body, others: []}));
          if (this.isRealtimeCollabEnabled) this.startTracking();
          this.addUser(id, body.name, body.picture, body.color);
          if (body.others) {
            body.others.forEach((user: any) => {
              Liquid._liquidInstance.addUser(
                user.id,
                user.name,
                user.picture,
                user.color
              );
            });
          }
          break;
        case this.MESSAGE_ENUM.CLIENT_CONNECTED:
        case this.MESSAGE_ENUM.CLIENT_DISCOVERED:
          if (!this.cursors[id]) {
            const cursor = this.createCursor(id, body.name, body.color);
            this.cursors[id] = cursor;
          }
          if (id !== this.currentUserId) {
            this.addUser(id, body.name, body.picture, body.color);
          }
          break;
        case this.MESSAGE_ENUM.CLIENT_DISCONNECTED:
          this.removeUser(id);
          break;
        case this.MESSAGE_ENUM.MOTION:
          if (!this.cursors[id]) {
            this.port.postMessage(
              JSON.stringify({
                type: `${this.MESSAGE_ENUM.DISCOVER_CLIENT}:${this.connectionHash}`,
                body: {
                  id,
                },
              })
            );
          } else {
            if (this.cursors[id] && id !== this.currentUserId) {
              this.cursors[id].pointer.style.left = `${
                body.clientX * window.innerWidth
              }px`;
              this.cursors[id].pointer.style.top = `${
                body.clientY * window.innerHeight
              }px`;
              this.cursors[id].legend.style.left = `${
                body.clientX * window.innerWidth + 5
              }px`;
              this.cursors[id].legend.style.top = `${
                body.clientY * window.innerHeight + 5
              }px`;
            }
          }
          break;
        default:
      }
    }
  };

  private tryReconnect() {
    if (!this.canConnect) return;
    if (!this.reconnectTimeoutId) {
      const backoffInterval = Math.min(
        this.reconnectAttempts,
        this.backoff.length - 1
      );
      const delay = this.backoff[backoffInterval] + Math.random() * 500;
      this.reconnectTimeoutId = window.setTimeout(() => {
        this.reconnectTimeoutId = undefined;
        this.reconnectAttempts++;
        this.setup();
      }, delay);
    }
  }

  private getUser() {
    if (!window) return;
    const user = window.localStorage.getItem(LocalStorageKey.USER_DETAILS);
    return user && JSON.parse(user);
  }

  private setUser(user: string) {
    // this.user = user;
    if (!user) {
      this.user = undefined;
      window.localStorage.removeItem(LocalStorageKey.USER_DETAILS);
      return;
    }
    try {
      this.user = JSON.parse(user);
    } catch (e) {
      this.user = undefined;
      // this.user = null;
    }

    if (!this.user) return;
    const {id} = this.user;
    // if (exp < Date.now() / 1000) {
    // this.user = null;
    // this.userObj = null;
    // window.localStorage.removeItem(LocalStorageKey.USER_DETAILS);
    // } else {
    this.currentUserId = id;
    window.localStorage.setItem(LocalStorageKey.USER_DETAILS, user);
    // }
  }

  private removeUser(id: string) {
    if (!this.controlPad) throw new Error('Controlpad missing');
    if (this.cursors[id]) {
      const body = document.querySelector('body')!;
      const cursor = document.getElementById(`cursor-${id}`);
      const legend = document.getElementById(`legend-${id}`);

      if (cursor) body.removeChild(cursor);
      if (legend) body.removeChild(legend);

      const avatar = document.querySelector(`div[data-avatar="${id}"]`);
      if (avatar) this.controlPad.removeChild(avatar);
      delete this.cursors[id];
    }
  }

  private startTracking = () => {
    document.addEventListener('mousemove', e => {
      const {clientX, clientY} = e;
      this.port.postMessage(
        JSON.stringify({
          type: `${this.MESSAGE_ENUM.MOTION}:${this.connectionHash}`,
          body: {
            id: this.currentUserId,
            clientX: clientX / window.innerWidth,
            clientY: clientY / window.innerHeight,
          },
        })
      );
    });
    //get the viewport
    //get the resolution
    document.addEventListener('onscroll', () => {
      // this.reOffset();
    });
    document.addEventListener('onresize', () => {
      const body = {
        id: this.currentUserId,
        w: window.innerWidth,
        h: window.innerHeight,
      };
      this.port.postMessage(
        JSON.stringify({
          type: `${this.MESSAGE_ENUM.RESIZED}:${this.connectionHash}`,
          body,
        })
      );
      // this.reOffset();
    });
  };

  keepAlive() {
    clearTimeout(this.keepAliveTimeoutId);
    // per the protocol, the server sends a ping every 10 seconds
    // if it takes more than 5 seconds to receive that ping, something is wrong
    this.keepAliveTimeoutId = window.setTimeout(() => {
      this.keepAliveTimeoutId = undefined;
    }, this.timeout * 1.5);
  }

  isPing(data: any) {
    if (typeof data === 'string') return false;
    const buffer = new Uint8Array(data);
    return buffer.length === 1 && buffer[0] === this.PING;
  }

  defaultDecode(packet: string) {
    const parsedData = JSON.parse(packet);
    if (!Array.isArray(parsedData)) return {message: parsedData};
    const [message, mid] = parsedData;
    return {message, mid};
  }

  createCursor(id: string, name: string, color: string): Cursor {
    if (!this.controlPad) throw new Error('Invalid initialization');
    const pointer = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    pointer.setAttribute('id', `cursor-${id}`);
    pointer.setAttribute('width', '21');
    pointer.setAttribute('height', '21');
    pointer.setAttribute('viewbox', '0 0 21 21');
    pointer.setAttribute('fill', 'none');
    pointer.classList.add('cursor');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M10 20L1 1L20 10L12 12L10 20Z');
    path.setAttribute('fill', color);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    pointer.appendChild(path);

    // const cursor = document.createElement("div");
    // cursor.setAttribute("id", `cursor-${id}`);
    const legend = document.createElement('div');
    legend.setAttribute('id', `legend-${id}`);
    legend.classList.add('nametag');
    legend.style.border = `1px solid ${color}`;
    legend.style.background = color;
    legend.style.borderRadius = '4px';
    legend.style.position = 'absolute';
    legend.style.padding = '3px 6px';
    legend.textContent = name;
    // cursor.appendChild(pointer);
    // cursor.appendChild(legend);
    const body = document.querySelector('body')!;
    body.appendChild(legend);
    body.appendChild(pointer);
    return {
      pointer,
      legend,
    };
  }
}

export {Liquid};
// console.log('I am called 2');
declare global {
  interface Window {
    liquid: Liquid;
  }
}

// window.Liquid = Liquid;
chrome.storage.sync.get(['token'], ({token}) => {
  chrome.runtime.sendMessage(
    {
      message: 'INIT_LIQUID',
      frameUrl: window.location.href.replace(
        window.location.protocol + '//',
        ''
      ),
    },
    ({roomId}) => {
      if (roomId) {
        Liquid.getInstance({token, roomId});
      } else {
        Liquid.getInstance({token});
      }
    }
  );
});

// const script = document.createElement('script');
// script.src = chrome.runtime.getURL('rrweb.js');
// script.onload = function () {};
// (document.head || document.documentElement).appendChild(script);
