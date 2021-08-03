import {HttpResponse, WebSocket} from 'uWebSockets.js'
import AuthToken from '../types/AuthToken'
import generateUID from '../generateUID'

class ConnectionContext<T = WebSocket > {
  authToken: AuthToken
  cancelKeepAlive: NodeJS.Timeout | undefined = undefined
  id: string
  isAlive = true
  isDisconnecting?: true
  socket: T
  isReady = false
  constructor(socket: T, authToken: AuthToken) {
    const prefix = 'ws'
    this.authToken = authToken
    this.socket = socket
    this.id = `${prefix}_${generateUID()}`
  }

  ready() {
    this.isReady = true
  }

}

export default ConnectionContext
