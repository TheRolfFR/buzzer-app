import type { GameAuth } from '../stores/gameAuthStore'
import { PUBLIC_URL } from '$env/static/public'
import { dev } from '$app/environment'

export function extractParams(url: string|URL) {
  url = new URL(url)

  let result = undefined

  if(url.searchParams.get('game') !== null && url.searchParams.get('pass') !== null) {
    result = {
      name: url.searchParams.get('game') || '',
      passcode: url.searchParams.get('pass') || ''
    } as GameAuth
  }
  return result
}

export function createUrl(url: string|URL, gameAuth: GameAuth) {
  let newUrl = new URL(dev ? url : PUBLIC_URL)
  newUrl.searchParams.set('game', gameAuth.name)
  newUrl.searchParams.set('pass', gameAuth.passcode)

  return newUrl
}

export function cleanUrl(url: string|URL) {
  let newUrl = new URL(url)
  newUrl.searchParams.delete('game')
  newUrl.searchParams.delete('pass')
  return newUrl
}
