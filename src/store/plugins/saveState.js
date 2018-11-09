import { storageKeys, userStore, documentsStore } from '@/plugins/database'

export const initState = async store => {
  await Promise.all(
    [storageKeys.wantTour, storageKeys.locale, storageKeys.viewed].map(key => userStore.getItem(key))
  ).then(([wantTour, locale, viewed]) => {
    if (wantTour) store.commit('setWantTour', wantTour)
    if (locale) store.dispatch('changeLocale', locale)
    if (viewed) store.commit('setViewed', viewed)
  })
}

export const persistState = async store => {
  const documents = []
  await documentsStore.iterate((value, key, iterationNumber) => {
    documents.push(value)
  })
  if (documents.length > 0) store.commit('addDocuments', documents)

  const columns = await userStore.getItem(storageKeys.columns)
  if (columns) {
    columns.forEach(column => store.commit('addColumn', column))
  } else {
    store.commit('addColumn')
  }

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
        userStore.setItem(storageKeys.wantTour, payload)
        break
      case 'setDocumentViewed':
        userStore.setItem(storageKeys.viewed, [...new Set(state.viewed)])
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
