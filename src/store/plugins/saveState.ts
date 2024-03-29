import { storageKeys, userStore, documentsStore } from '@/plugins/database'
import { Store } from 'vuex'
import { Document, Column } from '@/types'
import State from '@/store/state'

export const initState = async (store: Store<State>): Promise<void> => {
  const [locale, defaultLang, columns] = await Promise.all(
    [storageKeys.locale, storageKeys.defaultLang, storageKeys.columns].map(key => userStore.getItem(key))
  )

  if (locale !== null && store.state.locale !== locale) await store.dispatch('changeLocale', locale)
  if (defaultLang !== null && store.state.defaultLang !== defaultLang) store.commit('changeDefaultLang', defaultLang)

  const documents = await documentsStore.getItems()
  if (documents) {
    store.commit('addDocuments', Object.values(documents))
  }

  if (Array.isArray(columns) && columns.length > 0) {
    store.commit('insertColumns', {
      columns: columns.map(column => ({
        ...column,
        documentsIds: column.documentsIds.filter((d: string) => d.includes('documents-gap') || documents[d])
        })
      ),
      deleteCount: columns.length
    })
  }
}

export const persistState = (store: Store<State>): void => {
  store.subscribe(async ({ type, payload }: { type: string, payload: unknown}, state: State) => {
    switch (type) {
      case 'setLocale':
        userStore.setItem(storageKeys.locale, payload)
        break
      case 'addColumn':
        // falls through
      case 'insertColumns':
        // falls through
      case 'moveColumn':
        // falls through
      case 'updateColumnParams':
        // falls through
      case 'appendDocumentsIdsToCol':
        // falls through
      case 'prependDocumentsIdsToCol':
        // falls through
        userStore.setItem(storageKeys.columns, state.columns)
        break
      case 'closeColumn':
        // falls through
      case 'resetAllColumns':
        // falls through
      case 'resetAllTopicsColumns':
        // falls through
      case 'resetColumn':
        // eslint-disable-next-line no-case-declarations
        const displayedIds: string[] = []
        displayedIds.concat.apply([], state.columns.map((column: Column) => column.documentsIds))
        // eslint-disable-next-line no-case-declarations
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
        documentsStore.setItems((payload as Document[]).map((doc: Document) => ({
          key: doc.uno,
          value: doc
        })))
        break
      case 'changeDefaultLang':
        userStore.setItem(storageKeys.defaultLang, state.defaultLang)
        break
      default:
    }
  })
}
