import localForage from 'localforage'

export const storageKeys = {
  columns: 'afpnews-deck-columns',
  token: 'afpnews-deck-token',
  client: 'afpnews-deck-client',
  clientId: 'afpnews-deck-client-id',
  clientSecret: 'afpnews-deck-client-secret'
}

export const userStore = localForage.createInstance({
  name: 'userStore'
})

export const documentsStore = localForage.createInstance({
  name: 'documentsStore'
})
