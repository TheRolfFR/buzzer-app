import { Server } from 'socket.io'
import type { Server as HttpServer } from 'http'

export default function(server: HttpServer) {
  const io = new Server(server)

  io.on('connection', socket => {
    // listen for incoming messages
    socket.on('message', (message) => {
      // broadcast to all connected clients
      io.emit(message.channel, message)
    });
  });
}
