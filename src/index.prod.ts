import * as http from 'http'
// @ts-ignore
import express from 'express'
import { handler } from '../build/handler.js'
import { env } from '../build/env.js'
import startSocketIO from './lib/socket.server.js'

const app = express();
const server = http.createServer(app)

const path = env('SOCKET_PATH', false)
const host = env('HOST', '0.0.0.0')
const port = env('PORT', !path && '3000')

// Inject SocketIO
startSocketIO(server)

// SvelteKit handlers
app.use(handler)

server.listen({ path, host, port }, () => {
	console.log(`Listening on http://${path ? path : host + ':' + port}`)
})
