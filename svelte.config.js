import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$components: path.resolve("./src/components"),
			$stores: path.resolve("./src/stores"),
			$locales: path.resolve("./src/locales"),
			$static: path.resolve("./static")
		}
	},
	preprocess: vitePreprocess(),
};

export default config;
