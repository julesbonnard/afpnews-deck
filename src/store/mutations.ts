import afpNews from '@/plugins/api'
import { v4 as uuidv4 } from 'uuid'
import DocumentParser from '@/plugins/DocumentParser'
import { Locale, Column, Document } from '@/types'
import State from '@/store/state'
import { AfpDocument, Params, Token } from 'afpnews-api/dist/types'
import { Lang } from 'afpnews-api/dist/types'

function generateDefaultColumn () {
  return {
    id: uuidv4(),
    type: 'search',
    displayed: false,
    params: Object.assign({}, afpNews.defaultSearchParams, { size: 10 }),
    documentsIds: []
  }
}

export default {
  addColumn (state: State, payload: Column): void {
    const defaultColumn = generateDefaultColumn()
    if (payload && payload.params) {
      payload.params = Object.assign(defaultColumn.params, payload.params)
    }
    const newColumn = Object.assign(defaultColumn, payload)
    if (state.columns.find(column => column.id === newColumn.id)) return

    state.columns.push(newColumn)
  },
  insertColumns (state: State, { columns, start = 0 }: { columns: Column[], start: number }): void {
    const newColumns: Array<false | Column> = columns
      .map(column => {
        const defaultColumn = generateDefaultColumn()
        if (column && column.params) {
          column.params = Object.assign(defaultColumn.params, column.params)
        }
        const newColumn = Object.assign(defaultColumn, column)
        if (state.columns.find(c => c.id === newColumn.id)) return false
        return newColumn
      })
    state.columns.splice(start, 0, ...(newColumns.filter(d => d !== false) as Column[]))
  },
  moveColumn (state: State, { indexCol, dir }: { indexCol: number, dir: 'left' | 'right' }): void {
    const sortingArray = state.columns.map(d => d.id)
    const to = dir === 'left' ? indexCol - 1 : indexCol + 1
    const colId = sortingArray[indexCol]
    sortingArray.splice(indexCol, 1)
    sortingArray.splice(to, 0, colId)

    state.columns.sort((a, b) => sortingArray.indexOf(a.id) - sortingArray.indexOf(b.id))
  },
  closeColumn (state: State, { indexCol }: { indexCol: number }): void {
    state.columns = state.columns.filter((_, i) => i !== indexCol)
  },
  resetColumn (state: State, { indexCol }: { indexCol: number }): void {
    state.columns[indexCol].documentsIds = []
  },
  updateColumnParams (state: State, { indexCol, params }: { indexCol: number, params: Params }): void {
    state.columns[indexCol].params = params
  },
  updateColumnDisplayed (state: State, { indexCol, displayed }: { indexCol: number, displayed: boolean }): void {
    state.columns[indexCol].displayed = displayed
  },
  setToken (state: State, token: Token): void {
    state.authType = token.authType
  },
  unsetToken (state: State): void {
    state.authType = 'unknown'
  },
  addDocuments (state: State, documents: AfpDocument[]): void {
    documents
      .map((document: AfpDocument) => new DocumentParser(document).toObject())
      .forEach((document: Document) => state.documents.set(document.uno, document))
  },
  clearDocuments (state: State): void {
    state.columns.forEach(column => { column.documentsIds = [] })
    state.documents.clear()
  },
  prependDocumentsIdsToCol (state: State, { indexCol, documentsIds }: { indexCol: number, documentsIds: string[] }): void {
    const existingDocumentsIds = state.columns[indexCol].documentsIds
    const firstExistingDocIndex = existingDocumentsIds.findIndex((d: string) => !d.includes('documents-gap'))
    if (firstExistingDocIndex > 0) {
      existingDocumentsIds.splice(0, firstExistingDocIndex)
    }
    state.columns[indexCol].documentsIds = [...new Set(documentsIds.concat(existingDocumentsIds))]
  },
  appendDocumentsIdsToCol (state: State, { indexCol, documentsIds }: { indexCol: number, documentsIds: string[] }): void {
    const existingDocumentsIds = state.columns[indexCol].documentsIds
    state.columns[indexCol].documentsIds = [...new Set(existingDocumentsIds.concat(documentsIds))]
  },
  setConnectivityStatus (state: State, isOnline: boolean): void {
    state.isOnline = isOnline
  },
  setLocale (state: State, value: Locale): void {
    state.locale = value
  },
  resetState (state: State): void {
    Object.assign(state, new State())
  },
  resetAllColumns (state: State): void {
    state.columns = []
  },
  resetAllTopicsColumns (state: State): void {
    state.columns = state.columns.filter(d => d.type !== 'topic')
  },
  changeDefaultLang (state: State, value: Lang | null): void {
    state.defaultLang = value
  }
}
