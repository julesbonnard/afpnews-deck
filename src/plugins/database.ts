import localForage from 'localforage'
import 'localforage-getitems'
import 'localforage-setitems'

export const storageKeys = {
  columns: 'afpnews-deck-columns',
  token: 'afpnews-deck-token',
  client: 'afpnews-deck-client',
  clientId: 'afpnews-deck-client-id',
  clientSecret: 'afpnews-deck-client-secret',
  autoRefresh: 'afpnews-deck-auto-refresh',
  locale: 'afpnews-deck-locale'
}

export const userStore = localForage.createInstance({
  name: 'userStore'
})

export const documentsStore = localForage.createInstance({
  name: 'documentsStore'
})
