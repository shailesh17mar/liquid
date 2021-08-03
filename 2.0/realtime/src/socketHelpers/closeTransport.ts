import { WebSocket} from 'uWebSockets.js'

const closeTransport = (transport: WebSocket , code?: number, reason?: string) => {
  if (transport.done) return
  transport.end(code, reason)
}

export default closeTransport

