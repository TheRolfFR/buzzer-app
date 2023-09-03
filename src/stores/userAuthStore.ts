import { createJSONStore } from "$lib/createStore"
import { derived } from "svelte/store"
import crypto from "node:crypto"

export interface UserIdentity {
    name: string,
}

export interface UserAuth extends UserIdentity {
    password: string,
}

export interface UserAuthConnect extends UserIdentity {
    userHash: string
}

export function createUserHash(userAuth: UserAuth): string {
    return crypto.createHash('sha256')
        .update(userAuth.name)
        .update(userAuth.password)
        .digest('hex')
}
export interface Auth extends UserAuth {
    gameMaster: boolean,
}

export const EMPTY_USER_AUTH: Auth = {
    name: '',
    password: '',
    gameMaster: false
}

export let authStore = createJSONStore('AUTH', EMPTY_USER_AUTH, v => {
    return {
        ...v,
        logout: function() {
            v.set(EMPTY_USER_AUTH)
        }
    }
})

// data derived stores
export let userHash = derived(authStore, a => createUserHash(a))

// auth derived stores
export let isloggedIn = derived(authStore, a => a.name !== '' && a.password !== '')
export let isGameMaster = derived(authStore, a => a.gameMaster)

