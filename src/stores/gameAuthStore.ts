import { createJSONStore } from "$lib/createStore"
import { derived, type Writable } from "svelte/store"
import crypto from "node:crypto"
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

export function createGameHash(gameAuth: GameAuth): string {
    return crypto.createHash('sha256')
        .update(gameAuth.name)
        .update(gameAuth.passcode)
        .digest('hex')
}

export function generateQRData(url: string, gameAuth: GameAuth): string {
    return (dev ? url : PUBLIC_URL) + `?game=${gameAuth.name}:::${gameAuth.passcode}`
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
export let isHostingGame = derived(gameStatusStore, (gameStatus) => gameStatus === GameStatus.HOSTING)
export let isConnectedToGame = derived(gameStatusStore, (gameStatus) => gameStatus === GameStatus.CONNECTED)

export let gameHash = derived([isHostingGame, isConnectedToGame, gameAuthStore], ([hosting, connected, game]) => {
    if(!hosting || !connected) return ''
    return createGameHash(game)
})
