import { WebSocket, WebSocketBehavior } from "uWebSockets.js";
import ConnectionContext from "../socketHelpers/ConnectionContext";
import keepAlive from "../socketHelpers/keepAlive";

const handleOpen: WebSocketBehavior["open"] = async (socket: WebSocket) => {
  const { authToken } = socket;
  const connectionContext = (socket.connectionContext = new ConnectionContext(
    socket,
    authToken
  ));
  // messages will start coming in before handleConnect completes & sit in the readyQueue
  // const nextAuthToken = await handleConnect(connectionContext)

  // socket.send(JSON.stringify({ authToken }));
  keepAlive(connectionContext);
};

export default handleOpen;
