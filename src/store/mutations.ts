import afpNews from '@/plugins/api'
import uuidv4 from 'uuid/v4'
import getDefaultState from './state'
import DocumentParser from '@/plugins/DocumentParser'
import { State, Documents, Document, Token, ColumnParams, Column } from '@/types'

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
  moveColumn (state: State, { indexCol, dir }: { indexCol: number, dir: string }) {
    const to = dir === 'left' ? indexCol - 1 : indexCol + 1
    const element = state.columns[indexCol]
    state.columns.splice(indexCol, 1)
    state.columns.splice(to, 0, element)
  },
  closeColumn (state: State, { indexCol }: { indexCol: number }) {
    state.columns.splice(indexCol, 1)
  },
  resetColumn (state: State, { indexCol }: { indexCol: number }) {
    state.columns[indexCol].documentsIds = []
  },
  updateColumnParams (state: State, { indexCol, params }: { indexCol: number, params: ColumnParams }) {
    state.columns[indexCol].params = params
  },
  setClient (state: State, value: string) {
    state.credentials.client = value
  },
  setClientId (state: State, value: string) {
    state.credentials.clientId = value
  },
  setClientSecret (state: State, value: string) {
    state.credentials.clientSecret = value
  },
  resetClientCredentials (state: State) {
    state.credentials.client = ''
    state.credentials.clientId = ''
    state.credentials.clientSecret = ''
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
  addDocuments (state: State, documents: Array<Document>) {
    const documentsKeyedById = documents.reduce((acc: Documents, cur: Document) => {
      acc[cur.uno] = cur.parsed ? cur : new DocumentParser(cur).toObject()
      return acc
    }, {})

    state.documents = Object.freeze(Object.assign({}, documentsKeyedById, state.documents))
  },
  clearDocuments (state: State) {
    state.columns = state.columns.map(column => ({
      ...column,
      documentsIds: []
    }))
    state.documents = {}
  },
  prependDocumentsIdsToCol (state: State, { indexCol, documentsIds }: { indexCol: number, documentsIds: Array<string> }) {
    if (!state.columns[indexCol]) return false
    const existingDocumentsIds = state.columns[indexCol].documentsIds
    state.columns[indexCol].documentsIds = [...new Set(documentsIds.concat(existingDocumentsIds))]
  },
  appendDocumentsIdsToCol (state: State, { indexCol, documentsIds }: { indexCol: number, documentsIds: Array<string> }) {
    if (!state.columns[indexCol]) return false
    const existingDocumentsIds = state.columns[indexCol].documentsIds
    state.columns[indexCol].documentsIds = [...new Set(existingDocumentsIds.concat(documentsIds))]
  },
  setViewed (state: State, viewed: Array<string>) {
    state.viewed = viewed
  },
  setDocumentViewed (state: State, docId: string) {
    state.viewed.push(docId)
  },
  setConnectivityStatus (state: State, { isConnected }: { isConnected: boolean }) {
    state.connectivity.isConnected = isConnected
  },
  setWantTour (state: State, value: boolean) {
    state.wantTour = value
  },
  setLocale (state: State, value: string) {
    state.locale = value
  },
  resetState (state: State) {
    Object.assign(state, getDefaultState())
  },
  displayInstallApp (state: State, value: boolean) {
    state.displayInstallApp = value
  }
}
