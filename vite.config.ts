// @ts-ignore
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import startSocketIO from './src/lib/socket.server';
import type { Server as HttpServer } from 'http';

const VITE_CONFIG_CODE_MINIFIED = undefined
const VITE_CONFIG_CODE_NOT_MINIFIED = false
const computeMinify = (mode: string) => {
	if(mode === 'development') return VITE_CONFIG_CODE_NOT_MINIFIED

	const dontMinify = process.env.NO_MINIFY === 'true'
	if(dontMinify)
		console.info("Code not minified")
	else
		console.info("Code minified")

	return dontMinify ? VITE_CONFIG_CODE_NOT_MINIFIED : VITE_CONFIG_CODE_MINIFIED
}

export default defineConfig(({ mode }) => ({
	build: {
		minify: computeMinify(mode),
	},
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
				if (mode === 'development') {
					startSocketIO(server.httpServer as unknown as HttpServer)
				}
			}
		},
	],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData:
`@use '$scss/global' as *;
`,
			}
		}
	}
}));
