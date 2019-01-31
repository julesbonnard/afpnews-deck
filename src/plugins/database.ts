import localForage from 'localforage'

export const storageKeys = {
  columns: 'afpnews-deck-columns',
  token: 'afpnews-deck-token',
  client: 'afpnews-deck-client',
  clientId: 'afpnews-deck-client-id',
  clientSecret: 'afpnews-deck-client-secret',
  autoRefresh: 'afpnews-deck-auto-refresh',
  wantTour: 'afpnews-deck-want-tour',
  locale: 'afpnews-deck-locale',
  viewed: 'afpnews-deck-viewed'
}

export const userStore = localForage.createInstance({
  name: 'userStore'
})

export const documentsStore = localForage.createInstance({
  name: 'documentsStore'
})
