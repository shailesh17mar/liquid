import handleDisconnect from "../socketHandlers/handleDisconnect";
import ConnectionContext from "./ConnectionContext";

const PING = new Uint8Array([57]);

const keepAlive = (connectionContext: ConnectionContext) => {
  connectionContext.isAlive = true;
  clearInterval(connectionContext.cancelKeepAlive!);
  connectionContext.cancelKeepAlive = setInterval(() => {
    if (connectionContext.isAlive === false) {
      handleDisconnect(connectionContext);
    } else {
      connectionContext.isAlive = false;
    }
    const { socket } = connectionContext;
    socket.send(PING, true);
  }, 10000);
};

export default keepAlive;
