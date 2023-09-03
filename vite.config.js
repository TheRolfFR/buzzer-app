import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Server } from 'socket.io';
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
				const io = new Server(server.httpServer);
				
				io.on('connection', socket => {
					// random username
					const username = `User ${Math.round(Math.random() * 999999)}`;
					socket.emit('username', username);
					
					// listen for incoming messages
					socket.on('message', message => {
						// broadcast to all connected clients
						io.emit('message', {
							username,
							message,
							time: new Date().toLocaleString(),
						})
					});
				});
			}
		},
	]
});
