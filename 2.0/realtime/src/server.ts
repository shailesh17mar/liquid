// @ts-ignore
import uws, { SHARED_COMPRESSOR, WebSocket } from "uWebSockets.js";
import Redis from "ioredis";
import ConnectionContext from "./socketHelpers/ConnectionContext";
import keepAlive from "./socketHelpers/keepAlive";

import listenHandler from "./listenHandler";
import { getRoom, joinFrame, leaveFrame } from "./db";
import authHandler from "./authHandler";
import qs from "querystring";
import * as crypto from "crypto";
import PROD from "./PROD";

import {
  Observable,
  interval,
  of,
  zip,
  mergeMap,
  BehaviorSubject,
  flatMap,
  from,
  tap,
  filter,
  map,
} from "rxjs";

const redisClient = new Redis(6379);

type StreamToken = [string, Array<string>];
type RedisTuple = [string, Array<StreamToken>];

function stream(sessionId: string, id: string): Promise<RedisTuple[]> {
  if (id === "$") {
    return new Promise((resolve, reject) => {
      redisClient.xread(
        "BLOCK",
        "1000",
        "STREAMS",
        `activity:${sessionId}`,
        0,
        (err: Error | null, data: RedisTuple[]) =>
          err ? reject(err) : resolve(data)
      );
    });
  }
  return new Promise((resolve, reject) => {
    redisClient.xread(
      "BLOCK",
      "1000",
      "STREAMS",
      `activity:${sessionId}`,
      id,
      (err: Error | null, data: RedisTuple[]) =>
        err ? reject(err) : resolve(data)
    );
  });
}

function streamScreen(sessionId: string) {
  const propagateId = (id: string) => zip(from(stream(sessionId, id)), of(id));

  const load$ = new BehaviorSubject("$");

  return load$.pipe(
    mergeMap((id) => propagateId(id)),

    tap(([data, prev_id]: [RedisTuple[], string]) => {
      const id = data ? data[0][1][data[0][1].length - 1][0] : prev_id;

      load$.next(`${id}`);
    }),

    filter(([data]: [RedisTuple[], string]) => data !== null),

    mergeMap(([data]: [RedisTuple[], string]) => data),
    map((data) => {
      console.log("shailesh", data);
      // console.log('shailesh', data[0]);
      // console.log('shailesh 2', data);

      return {
        data: {
          data,
        },
      };
    })
  );
}

if (PROD) {
  // tracer.init()
}

var COLORS = [
  "#001f3f",
  "#0074D9",
  "#7FDBFF",
  "#39CCCC",
  "#3D9970",
  "#2ECC40",
  "#01FF70",
  "#FFDC00",
  "#FF851B",
  "#FF4136",
  "#85144b",
  "#F012BE",
  "#B10DC9",
  "#111111",
  "#AAAAAA",
  "#DDDDDD",

  // NAVY: "#001f3f",
  // BLUE: "#0074D9",
  // AQUA: "#7FDBFF",
  // TEAL: "#39CCCC",
  // OLIVE: "#3D9970",
  // GREEN: "#2ECC40",
  // LIME: "#01FF70",
  // YELLOW: "#FFDC00",
  // ORANGE: "#FF851B",
  // RED: "#FF4136",
  // MAROON: "#85144b",
  // FUCHSIA: "#F012BE",
  // PURPLE: "#B10DC9",
  // // BLACK: "#111111",
  // GRAY: "#AAAAAA",
  // SILVER: "#DDDDDD",
];

const decoder = new TextDecoder("utf-8");
const PORT = Number(PROD ? process.env.PORT : process.env.SOCKET_PORT);
if (!PROD) {
  process.on("SIGINT", async () => {
    process.exit();
  });
}

const users: any = {};

const PONG = 65;
const isPong = (messageBuffer: Buffer) =>
  messageBuffer.length === 1 && messageBuffer[0] === PONG;

const MESSAGE_ENUM = Object.freeze({
  SELF_CONNECTED: "SELF_CONNECTED",
  INIT_CLIENT: "INIT_CLIENT",
  CLIENT_CONNECTED: "CLIENT_CONNECTED",
  CLIENT_DISCOVERED: "CLIENT_DISCOVERED",
  DISCOVER_CLIENT: "DISCOVER_CLIENT",
  CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
  SETUP_ROOM: "SETUP_ROOM",
  JOIN_FRAME: "JOIN_FRAME",
  LEAVE_FRAME: "LEAVE_FRAME",
  USERS_UPDATED: "USERS_UPDATED",
  MOTION: "MOTION",
});
export const SOCKETS: any = [];
let nextColor = 0;

const app = uws
  .App()
  // .App({
  //   key_file_name: "certs/private.key",
  //   cert_file_name: "certs/certificate.crt",
  // })
  .get("/*", (res, req) => {
    res.end("Hello World!");
  })
  .ws("/*", {
    compression: SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 16,
    /* Handlers */
    upgrade: async (res, req, context) => {
      const aborted = { done: false };
      // const protocol = req.getHeader("sec-websocket-protocol");
      const query = req.getQuery();
      const { token } = qs.parse(query);
      res.onAborted(() => {
        aborted.done = true;
      });

      const key = req.getHeader("sec-websocket-key");
      const protocol = req.getHeader("sec-websocket-protocol");
      const extensions = req.getHeader("sec-websocket-extensions");
      const jwtToken = await authHandler(token);
      if (!jwtToken) {
        res.writeStatus("401").end();
        return;
      }
      const { sub, name, picture } = jwtToken;
      //validate token first

      if (aborted.done) return;

      res.upgrade(
        {
          authToken: jwtToken,
          id: sub,
          name,
          picture,
          connectionHash: crypto
            .createHash("sha256")
            .update("124")
            .digest("hex"),
        },
        /* Spell these correctly */
        key,
        protocol,
        extensions,
        context
      );
    },
    open: (socket: WebSocket) => {
      console.log("i am here");
      const { authToken } = socket;
      const connectionContext = (socket.connectionContext =
        new ConnectionContext(socket, authToken));
      // messages will start coming in before handleConnect completes & sit in the readyQueue
      // const nextAuthToken = await handleConnect(connectionContext)

      // socket.send(JSON.stringify({ authToken }));
      // if (socket.id) {
      //   var id: any = socket.id;
      // } else {
      //   var id: any = Math.random().toString(36).substr(2, 9);
      // }
      const { connectionHash, id, name, picture } = socket;
      // const connectionHash: string = crypto
      //   .createHash("sha256")
      //   .update(url)
      //   .digest("hex");
      if (nextColor === COLORS.length - 1) {
        //reset array
        const usedColors = SOCKETS.map((s: any) => s.color);
        const unusedColors = COLORS.filter(
          (color: any) =>
            usedColors.findIndex((c: string) => c === color) === -1
        );
        COLORS = [...usedColors, ...unusedColors];
        nextColor = usedColors.length;
      }
      const color = COLORS[nextColor];
      nextColor++;

      socket.color = color;
      // }

      //subscribe to topics
      socket.subscribe(`${MESSAGE_ENUM.CLIENT_CONNECTED}:${connectionHash}`);
      socket.subscribe(`${MESSAGE_ENUM.CLIENT_DISCONNECTED}:${connectionHash}`);
      //
      console.log(
        SOCKETS.filter((connection: any) => connection.id !== id).map(
          (connection: any) => {
            const { id, name, picture, color } = connection;
            return {
              id,
              name,
              picture,
              color,
            };
          }
        )
      );
      // if (SOCKETS.findIndex((s: any) => s.id !== id) === -1) {
      SOCKETS.push(socket);
      // }
      console.log(SOCKETS.length);

      const selfMessage = {
        type: `${MESSAGE_ENUM.SELF_CONNECTED}:${connectionHash}`,
        body: {
          id,
          color,
          name,
          picture,
          hash: connectionHash,
          others: SOCKETS.filter((connection: any) => connection.id !== id).map(
            (connection: any) => {
              const { id, name, picture, color } = connection;
              return {
                id,
                name,
                picture,
                color,
              };
            }
          ),
        },
      };

      //send to connected socket only
      socket.send(JSON.stringify(selfMessage));

      app.publish(
        `${MESSAGE_ENUM.CLIENT_CONNECTED}:${connectionHash}`,
        JSON.stringify({
          type: `${MESSAGE_ENUM.CLIENT_CONNECTED}:${connectionHash}`,
          body: {
            id,
            color,
            name,
            picture,
          },
        })
      );
      keepAlive(connectionContext);
    },
    message: async (
      socket: WebSocket,
      packet: ArrayBuffer,
      isBinary: boolean
    ) => {
      const { connectionContext } = socket;
      const messageBuffer = Buffer.from(packet);

      if (isPong(messageBuffer)) {
        keepAlive(connectionContext);
        return;
      }

      /* Ok is false if backpressure was built up, wait for drain */
      const message = JSON.parse(decoder.decode(packet));
      const [type, hash] = message.type.split(":");
      switch (type) {
        case MESSAGE_ENUM.DISCOVER_CLIENT:
          const user = SOCKETS.find(
            (connection: any) => connection && connection.id === message.body.id
          );
          socket.send(
            JSON.stringify({
              type: `${MESSAGE_ENUM.CLIENT_DISCOVERED}:${hash}`,
              body: {
                id: message.body.id,
                name: user && user.name,
                picture: user && user.picture,
                color: user && user.color,
              },
            })
          );
          break;
        case MESSAGE_ENUM.INIT_CLIENT:
          // socket.id = message.body.id;
          // socket.color = message.body.color;
          // socket.name = message.body.name;
          // SOCKETS.push(socket);

          // app.publish(
          //   MESSAGE_ENUM.CLIENT_CONNECTED,
          //   JSON.stringify({
          //     type: MESSAGE_ENUM.CLIENT_CONNECTED,
          //     body: message.body,
          //   })
          // );

          break;
        case MESSAGE_ENUM.MOTION:
          app.publish(
            `${MESSAGE_ENUM.MOTION}:${hash}`,
            JSON.stringify(message)
          );
          break;
        case MESSAGE_ENUM.SETUP_ROOM:
          //join frame
          const frameId = crypto
            .createHash("sha256")
            .update(message.body.frameUrl)
            .digest("hex");
          await joinFrame(`FRAME:${frameId}`, {
            id: socket.id,
            name: socket.name,
            picture: socket.picture,
            color: socket.color,
          });
          const room = await getRoom("SESSION:" + hash, `FRAME:${frameId}`);
          socket.subscribe(`${MESSAGE_ENUM.MOTION}:${frameId}`);
          //get the room with users by frame
          socket.send(
            JSON.stringify({
              type: `${MESSAGE_ENUM.SETUP_ROOM}:${hash}`,
              body: room,
            })
          );
          // app.publish(
          //   `${MESSAGE_ENUM.CLIENT_DISCONNECTED}:${socket.connectionHash}`,
          //   JSON.stringify(broadcastMessage)
          // );
          //broadcast someone has joined the frame
          break;
        case MESSAGE_ENUM.JOIN_FRAME:
          const allUsersInFrame = await joinFrame(message.body.id, {
            id: socket.id,
            name: socket.id,
            picture: socket.id,
            color: socket.id,
          });
          socket.subscribe(`${MESSAGE_ENUM.MOTION}:${message.body.id}`);
          app.publish(
            `${MESSAGE_ENUM.USERS_UPDATED}:${hash}`,
            JSON.stringify({
              type: `${MESSAGE_ENUM.USERS_UPDATED}:${hash}`,
              body: {
                id: message.body.id,
                users: allUsersInFrame,
              },
            })
          );
        case MESSAGE_ENUM.LEAVE_FRAME:
          const usersLeftInFrame = await leaveFrame(message.body.id, socket.id);
          socket.unsubscribe(`${MESSAGE_ENUM.MOTION}:${message.body.id}`);
          app.publish(
            `${MESSAGE_ENUM.USERS_UPDATED}:${hash}`,
            JSON.stringify({
              type: `${MESSAGE_ENUM.USERS_UPDATED}:${hash}`,
              body: {
                id: message.body.id,

                users: usersLeftInFrame,
              },
            })
          );
        default:
          console.error("Unknown message type");
      }
    },
    drain: (socket: WebSocket) => {
      console.log("WebSocket backpressure: " + socket.getBufferedAmount());
    },
    close: (socket: WebSocket) => {
      SOCKETS.find((connection: any, index: number) => {
        if (connection && connection.id === socket.id) {
          console.log("DELETED: ", socket.id);
          SOCKETS.splice(index, 1);
          //get the color index
          //if nextColor < colorIndex
          //remove the color
        }
      });
      const broadcastMessage = {
        type: `${MESSAGE_ENUM.CLIENT_DISCONNECTED}:${socket.connectionHash}`,
        body: {
          id: socket.id,
        },
      };

      app.publish(
        `${MESSAGE_ENUM.CLIENT_DISCONNECTED}:${socket.connectionHash}`,
        JSON.stringify(broadcastMessage)
      );

      clearInterval(socket.connectionContext.cancelKeepAlive!);
      console.log("close called");
    },
  })
  .listen(PORT, listenHandler);
