import { storageKeys, userStore, documentsStore } from '@/plugins/database'

export const initState = async store => {
  await Promise.all(
    [storageKeys.wantTour, storageKeys.locale, storageKeys.columns, storageKeys.viewed].map(key => userStore.getItem(key))
  ).then(([wantTour, locale, columns, viewed]) => {
    if (wantTour !== null) store.commit('setWantTour', wantTour)
    if (locale !== null) store.dispatch('changeLocale', locale)
    if (viewed !== null) store.commit('setViewed', viewed)
    if (Array.isArray(columns) && columns.length > 0) {
      columns.forEach(column => store.commit('addColumn', column))
    } else {
      store.commit('addColumn')
    }
  })

  const documents = []
  await documentsStore.iterate((value, key, iterationNumber) => {
    documents.push(value)
  })
  if (documents.length > 0) store.commit('addDocuments', documents)
}

export const persistState = store => {
  store.subscribe(({ type, payload }, state) => {
    switch (type) {
      case 'setLocale':
        userStore.setItem(storageKeys.locale, payload)
        break
      case 'addColumn':
        // falls through
      case 'moveColumn':
        // falls through
      case 'updateColumnParams':
        // falls through
      case 'appendDocumentsIdsToCol':
        // falls through
      case 'prependDocumentsIdsToCol':
        userStore.setItem(storageKeys.columns, state.columns)
        break
      case 'closeColumn':
        // falls through
      case 'resetColumn':
        const displayedIds = [].concat.apply([], state.columns.map(column => column.documentsIds))
        documentsStore.iterate((value, key, iterationNumber) => {
          if (!displayedIds.includes(key)) {
            documentsStore.removeItem(key)
          }
        })
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
        userStore.setItem(storageKeys.columns, state.columns)
        break
      case 'addDocuments':
        // if ('serviceWorker' in navigator && navigator.serviceWorker.controller) return
        Promise.all(payload.map(doc => documentsStore.setItem(doc.uno, doc)))
        break
      default:
    }
  })
}
