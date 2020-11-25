import { storageKeys, userStore, documentsStore } from '@/plugins/database'
import { Store } from 'vuex'
import { Document, Column } from '@/types'
import State from '@/store/state'

export const initState = async (store: Store<State>) => {
  const [locale, columns] = await Promise.all(
    [storageKeys.locale, storageKeys.columns].map(key => userStore.getItem(key))
  )

  if (locale !== null && store.state.locale !== locale) await store.dispatch('changeLocale', locale)

  const documents = await documentsStore.getItems()
  store.commit('addDocuments', Object.values(documents))

  if (Array.isArray(columns) && columns.length > 0) {
    columns.forEach(column => store.commit('addColumn', {
      ...column,
      documentsIds: column.documentsIds.filter((d: string) => d.includes('documents-gap') || documents[d])
    }))
  }
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
        documentsStore.setItems(payload.map((doc: Document) => ({
          key: doc.uno,
          value: doc
        })))
        break
      default:
    }
  })
}
