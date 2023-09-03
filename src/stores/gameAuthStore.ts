import { createJSONStore } from "$lib/createStore"
import { derived, type Writable } from "svelte/store"
// @ts-ignore
import Hashes from "jshashes"
import { isGameMaster } from "./userAuthStore"
import { PUBLIC_URL } from "$env/static/public"
import { dev } from "$app/environment"

export interface GameAuth {
    name: string,
    passcode: string
}

export const EMPTY_GAME_AUTH: GameAuth = {
    name: '',
    passcode: ''
}

export const gameAuthStore = createJSONStore<GameAuth, Writable<GameAuth>>('GAME', EMPTY_GAME_AUTH);

export function createGameHash(auth: GameAuth): string {
    // @ts-ignore
    return new Hashes.SHA256()
        .hex(auth.name + auth.passcode)
}

export function generateQRCodeURL(url: string, gameAuth: GameAuth): string {
    return (dev ? url : PUBLIC_URL) + `?game=${gameAuth.name}&pass=${gameAuth.passcode}`
}

export enum GameStatus {
    HOSTING,
    CONNECTED,
    DISCONNECTED
}

export let gameStatusStore = derived([gameAuthStore, isGameMaster], ([auth, gm]) => {
    if(auth.name === '' || auth.passcode == '') return GameStatus.DISCONNECTED
    if(gm) return GameStatus.HOSTING
    else return GameStatus.CONNECTED
})

// game derived stores
export let isInGame = derived(gameStatusStore, (gameStatus) => gameStatus !== GameStatus.DISCONNECTED)
export let isHostingGame = derived(gameStatusStore, (gameStatus) => gameStatus === GameStatus.HOSTING)
export let isConnectedToGame = derived(gameStatusStore, (gameStatus) => gameStatus === GameStatus.CONNECTED)

export let gameHash = derived([isHostingGame, isConnectedToGame, gameAuthStore], ([hosting, connected, game]) => {
    if(!hosting && !connected) return ''
    return createGameHash(game)
})
