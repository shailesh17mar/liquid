import handleDisconnect from "./handleDisconnect";
import { WebSocket } from "uWebSockets.js";

const handleClose = (ws: WebSocket) => {
  if (!ws.connectionContext) return;
  ws.done = true;
  try {
    handleDisconnect(ws.connectionContext);
  } catch (error) {
    throw error;
  }
};
export default handleClose;
