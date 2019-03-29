import Vue from 'vue'
import afpNews from '@/plugins/api'
import uuidv4 from 'uuid/v4'
import DocumentParser from '@/plugins/DocumentParser'
import { Locale, Column } from '@/types'
import State from '@/store/state'
import { AfpDocument, Params, Token } from 'afpnews-api/dist/types'

export default {
  addColumn (state: State, payload: Column) {
    const defaultColumn = {
      id: uuidv4(),
      params: Object.assign({}, afpNews.defaultSearchParams, { products: [], size: 10 }),
      documentsIds: [],
      error: false
    }
    if (payload && payload.params) {
      payload.params = Object.assign(defaultColumn.params, payload.params)
    }
    const newColumn = Object.assign({}, defaultColumn, payload)
    if (state.columns.find(column => column.id === newColumn.id)) return
    state.columns.push(newColumn)
  },
  moveColumn (state: State, { indexCol, dir }: { indexCol: number, dir: 'left' | 'right' }) {
    const sortingArray = state.columns.map(d => d.id)
    const to = dir === 'left' ? indexCol - 1 : indexCol + 1
    const colId = sortingArray[indexCol]
    sortingArray.splice(indexCol, 1)
    sortingArray.splice(to, 0, colId)

    state.columns.sort((a, b) => sortingArray.indexOf(a.id) - sortingArray.indexOf(b.id))
  },
  closeColumn (state: State, { indexCol }: { indexCol: number }) {
    state.columns = state.columns.filter((_, i) => i !== indexCol)
  },
  resetColumn (state: State, { indexCol }: { indexCol: number }) {
    state.columns[indexCol].documentsIds = []
  },
  updateColumnParams (state: State, { indexCol, params }: { indexCol: number, params: Params }) {
    state.columns[indexCol].params = params
  },
  setToken (state: State, token: Token) {
    state.authType = token.authType
  },
  unsetToken (state: State) {
    state.authType = 'unknown'
  },
  setError (state: State, { indexCol, value }: { indexCol: number, value: boolean }) {
    if (!state.columns[indexCol]) return false
    state.columns[indexCol].error = value
  },
  addDocuments (state: State, documents: Array<AfpDocument>) {
    documents.forEach((cur: AfpDocument) => {
      try {
        const doc = new DocumentParser(cur).toObject()
        state.documents.set(doc.uno, Object.freeze(doc))
      } catch (error) {
        Vue.toasted.global.error(error)
      }
    })
  },
  clearDocuments (state: State) {
    state.columns.forEach(column => { column.documentsIds = [] })
    state.documents.clear()
  },
  prependDocumentsIdsToCol (state: State, { indexCol, documentsIds }: { indexCol: number, documentsIds: string[] }) {
    if (!state.columns[indexCol]) return false
    const existingDocumentsIds = state.columns[indexCol].documentsIds
    state.columns[indexCol].documentsIds = [...new Set(documentsIds.concat(existingDocumentsIds))]
  },
  appendDocumentsIdsToCol (state: State, { indexCol, documentsIds }: { indexCol: number, documentsIds: string[] }) {
    if (!state.columns[indexCol]) return false
    const existingDocumentsIds = state.columns[indexCol].documentsIds
    state.columns[indexCol].documentsIds = [...new Set(existingDocumentsIds.concat(documentsIds))]
  },
  setViewed (state: State, viewed: string[]) {
    state.viewed = viewed
  },
  setDocumentViewed (state: State, docId: string) {
    state.viewed.push(docId)
  },
  setConnectivityStatus (state: State, isOnline: boolean) {
    state.isOnline = isOnline
  },
  setWantTour (state: State, value: boolean) {
    state.wantTour = value
  },
  setLocale (state: State, value: Locale) {
    state.locale = value
  },
  resetState (state: State) {
    Object.assign(state, new State())
  },
  displayInstallApp (state: State, value: boolean) {
    state.displayInstallApp = value
  }
}
