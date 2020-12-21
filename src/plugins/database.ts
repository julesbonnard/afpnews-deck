import localForage from 'localforage'
import 'localforage-getitems'
import 'localforage-setitems'

export const storageKeys = {
  columns: 'afpnews-deck-columns',
  token: 'afpnews-deck-token',
  client: 'afpnews-deck-client',
  clientId: 'afpnews-deck-client-id',
  clientSecret: 'afpnews-deck-client-secret',
  locale: 'afpnews-deck-locale',
  defaultLang: 'afpnews-deck-default-lang'
}

export const userStore = localForage.createInstance({
  name: 'userStore'
})

export const documentsStore = localForage.createInstance({
  name: 'documentsStore'
})
