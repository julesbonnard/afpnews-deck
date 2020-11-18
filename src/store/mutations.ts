import afpNews from '@/plugins/api'
import { v4 as uuidv4 } from 'uuid'
import DocumentParser from '@/plugins/DocumentParser'
import { Locale, Column, Document } from '@/types'
import State from '@/store/state'
import { AfpDocument, Params, Token } from 'afpnews-api/dist/types'

export default {
  addColumn (state: State, payload: Column) {
    const defaultColumn = {
      id: uuidv4(),
      params: Object.assign({}, afpNews.defaultSearchParams, { products: ['multimedia'], size: 10, sources: ['afp', 'AFPTV', 'AFP Vidéographie', 'AFP Videographics', 'AFP Vidéographic', 'AFPTV / AFP Videografik'] }),
      documentsIds: []
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
  addDocuments (state: State, documents: AfpDocument[]) {
    documents
      .map((document: AfpDocument) => new DocumentParser(document).toObject())
      .forEach((document: Document) => state.documents.set(document.uno, document))
  },
  clearDocuments (state: State) {
    state.columns.forEach(column => { column.documentsIds = [] })
    state.documents.clear()
  },
  prependDocumentsIdsToCol (state: State, { indexCol, documentsIds }: { indexCol: number, documentsIds: string[] }) {
    const existingDocumentsIds = state.columns[indexCol].documentsIds
    const firstExistingDocIndex = existingDocumentsIds.findIndex((d: string) => !d.includes('documents-gap'))
    if (firstExistingDocIndex > 0) {
      existingDocumentsIds.splice(0, firstExistingDocIndex)
    }
    state.columns[indexCol].documentsIds = [...new Set(documentsIds.concat(existingDocumentsIds))]
  },
  appendDocumentsIdsToCol (state: State, { indexCol, documentsIds }: { indexCol: number, documentsIds: string[] }) {
    const existingDocumentsIds = state.columns[indexCol].documentsIds
    state.columns[indexCol].documentsIds = [...new Set(existingDocumentsIds.concat(documentsIds))]
  },
  setConnectivityStatus (state: State, isOnline: boolean) {
    state.isOnline = isOnline
  },
  setLocale (state: State, value: Locale) {
    state.locale = value
  },
  resetState (state: State) {
    Object.assign(state, new State())
  },
  displayInstallApp (state: State, value: boolean) {
    state.displayInstallApp = value
  },
  resetAllColumns (state: State) {
    state.columns = []
  }
}
