import { storageKeys, userStore, documentsStore } from '@/plugins/database'
import { Store } from 'vuex'
import { Document, Column } from '@/types'
import State from '@/store/state'

export const initState = async (store: Store<State>) => {
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

  const documents: Array<Document> = []
  await documentsStore.iterate((value: Document, key: string, iterationNumber: number) => {
    documents.push(value)
  })
  if (documents.length > 0) store.commit('addDocuments', documents)
}

export const persistState = (store: Store<State>) => {
  store.subscribe(async ({ type, payload }: { type: string, payload: any}, state: State) => {
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
        const displayedIds: string[] = []
        displayedIds.concat.apply([], state.columns.map((column: Column) => column.documentsIds))
        const storedKeys = await documentsStore.keys()
        storedKeys
          .filter(key => !displayedIds.includes(key))
          .forEach(key => documentsStore.removeItem(key))
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
        Promise.all(payload.map((doc: Document) => documentsStore.setItem(doc.uno, doc)))
        break
      default:
    }
  })
}
