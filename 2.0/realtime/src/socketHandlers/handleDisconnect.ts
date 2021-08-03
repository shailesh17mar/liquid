import closeTransport from '../socketHelpers/closeTransport'
import ConnectionContext from '../socketHelpers/ConnectionContext'

interface Options {
  exitCode?: number
  reason?: string
}

const handleDisconnect = (connectionContext: ConnectionContext, options: Options = {}) => {
  const {exitCode = 1000, reason} = options
  const { cancelKeepAlive,  socket, isDisconnecting} = connectionContext
  if (isDisconnecting) return
  connectionContext.isDisconnecting = true
  // check if isClosing & if isClosing bail
  clearInterval(cancelKeepAlive!)
  closeTransport(socket, exitCode, reason)
}

export default handleDisconnect

