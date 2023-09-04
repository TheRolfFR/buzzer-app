import type { UserAuthConnect } from "$stores/userAuthStore"
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface BuzzPayload {
			sound: string,
			channel: string,
			user: UserAuthConnect
		}
	}
}

export {};
