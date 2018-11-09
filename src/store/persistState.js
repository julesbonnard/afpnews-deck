import { storageKeys, userStore, documentsStore } from '@/plugins/database'

export default async store => {
  const columns = await userStore.getItem(storageKeys.columns)
  if (columns) {
    columns.forEach(column => store.commit('addColumn', column))
  } else {
    store.commit('addColumn')
  }

  const documents = []
  await documentsStore.iterate((value, key, iterationNumber) => {
    documents.push(value)
  })
  store.commit('addDocuments', documents)

  const wantTour = await userStore.getItem(storageKeys.wantTour)
  if (wantTour !== null) store.commit('setWantTour', wantTour)

  const locale = await userStore.getItem(storageKeys.locale)
  if (locale !== null) store.dispatch('changeLocale', locale)

  const client = await userStore.getItem(storageKeys.client)
  const clientId = await userStore.getItem(storageKeys.clientId)
  const clientSecret = await userStore.getItem(storageKeys.clientSecret)
  store.commit('setClientCredentials', { client, clientId, clientSecret })

  const token = await userStore.getItem(storageKeys.token)
  if (token) store.commit('setToken', token)

  store.subscribe(({ type, payload }, state) => {
    switch (type) {
      case 'setLocale':
        userStore.setItem(storageKeys.locale, payload)
        break
      case 'addColumn':
        // falls through
      case 'closeColumn':
        // falls through
      case 'moveColumn':
        // falls through
      case 'updateColumnParams':
        // falls through
      case 'appendDocumentsIdsToCol':
        // falls through
      case 'prependDocumentsIdsToCol':
        // falls through
      case 'clearColumnDocumentsIds':
        userStore.setItem(storageKeys.columns, state.columns)
        break
      case 'setWantTour':
        userStore.setItem(storageKeys.wantTour, state.wantTour)
        break
      case 'setToken':
        userStore.setItem(storageKeys.token, payload)
        break
      case 'resetState':
        userStore.clear()
        documentsStore.clear()
        store.commit('addColumn')
        break
      case 'clearDocuments':
        documentsStore.clear()
        break
      case 'cleanDocuments':
        documentsStore.iterate((value, key, iterationNumber) => {
          if (state.documents[value.uno] === undefined) {
            documentsStore.removeItem(key)
          }
        })
        break
      case 'updateClient':
        userStore.setItem(storageKeys.client, payload)
        break
      case 'updateClientId':
        userStore.setItem(storageKeys.clientId, payload)
        break
      case 'updateClientSecret':
        userStore.setItem(storageKeys.clientSecret, payload)
        break
      case 'setClientCredentials':
        // falls through
      case 'resetClientCredentials':
        userStore.setItem(storageKeys.client, state.credentials.client)
        userStore.setItem(storageKeys.clientId, state.credentials.clientId)
        userStore.setItem(storageKeys.clientSecret, state.credentials.clientSecret)
        break
      default:
    }
  })
}
