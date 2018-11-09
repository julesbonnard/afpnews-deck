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
  if (documents.length > 0) store.commit('addDocuments', documents)

  const wantTour = await userStore.getItem(storageKeys.wantTour)
  if (wantTour !== null) store.commit('setWantTour', wantTour)

  const locale = await userStore.getItem(storageKeys.locale)
  if (locale !== null) store.dispatch('changeLocale', locale)

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
      default:
    }
  })
}
