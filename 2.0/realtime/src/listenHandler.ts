//@ts-ignore
import {us_listen_socket} from 'uWebSockets.js'
import PROD from './PROD'

const listenHandler = (listenSocket: us_listen_socket) => {
  const PORT = Number(PROD ? process.env.PORT : process.env.SOCKET_PORT)
  if (listenSocket) {
    console.log(`\nš„š„š„ Ready for Sockets: Port ${PORT} š„š„š„`)
    // getGraphQLExecutor().subscribe()
  } else {
    console.log(`āāā    Port ${PORT} is in use!    āāā`)
  }
}

export default listenHandler
