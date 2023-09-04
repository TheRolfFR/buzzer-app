import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	server: {
		port: 3000
	},
	preview: {
		port: 3000
	},
	plugins: [
    basicSsl(),
		sveltekit(),
		// this is our custom vite plugin to implement socket.io
		{
			name: 'sveltekit-socket-io',
			configureServer(server) {
				const io = new Server(server.httpServer as HttpServer);

				io.on('connection', socket => {
					// listen for incoming messages
					socket.on('message', (message: App.BuzzPayload) => {
						// broadcast to all connected clients
						io.emit(message.channel, message)
					});
				});
			}
		},
	]
});
