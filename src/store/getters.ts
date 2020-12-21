import { GetterTree } from 'vuex'
import { Column, Document } from '@/types'
import { Params } from 'afpnews-api/dist/types'
import State from '@/store/state'

const getters: GetterTree<State, State> = {
  getDocumentById: (state: State) => (id: string): Document | undefined => {
    return state.documents.get(id)
  },
  getColumnByIndex: (state: State) => (index: number): Column => {
    return state.columns[index]
  },
  getDocumentsIdsByColumnId: (_: State, getters) => (indexCol: number, separators = true): string[] => {
    return getters.getColumnByIndex(indexCol).documentsIds.filter((d: string) => separators || !d.includes('documents-gap'))
  },
  getDocumentsByColumnId: (_: State, getters) => (indexCol: number): Document[] => {
    return getters.getDocumentsIdsByColumnId(indexCol, false)
      .map((docId: string) => getters.getDocumentById(docId))
  },
  isAnonymous (state: State): boolean {
    return state.authType === 'anonymous'
  },
  isAuthenticated (state: State): boolean {
    return state.authType === 'credentials'
  },
  getPreviousDocumentIdInColById: (_: State, getters) => (indexCol: number, docId: string): string | false => {
    const currentDocumentsinColumn = getters.getDocumentsByColumnId(indexCol, false)
    const currentDocIndexInColumn = currentDocumentsinColumn.findIndex((doc: Document) => doc.uno === docId)
    const previousDocument = currentDocumentsinColumn[currentDocIndexInColumn + 1]
    return (previousDocument && previousDocument.uno) || false
  },
  getNextDocumentIdInColById: (_: State, getters) => (indexCol: number, docId: string): string | false => {
    const currentDocumentsinColumn = getters.getDocumentsByColumnId(indexCol, false)
    const currentDocIndexInColumn = currentDocumentsinColumn.findIndex((doc: Document) => doc.uno === docId)
    const nextDocument = currentDocumentsinColumn[currentDocIndexInColumn - 1]
    return (nextDocument && nextDocument.uno) || false
  },
  getFirstDocumentInCol: (_: State, getters) => (indexCol: number): Document | false => {
    const firstDocumentId = getters.getDocumentsIdsByColumnId(indexCol, false)[0]
    return getters.getDocumentById(firstDocumentId)
  },
  getLastDocumentInCol: (_: State, getters) => (indexCol: number): Document | false => {
    const lastDocumentId = getters.getDocumentsIdsByColumnId(indexCol, false).pop()
    return getters.getDocumentById(lastDocumentId)
  },
  getRefreshParamsByMode: (
    _: State,
    getters
  ) => (
    indexCol: number,
    mode: 'after' | 'before' | 'reset'
  ): Params => {
    switch (mode) {
      case 'reset':
        return getters.getColumnByIndex(indexCol).params
      case 'before':
        // eslint-disable-next-line no-case-declarations
        const lastDocument = getters.getLastDocumentInCol(indexCol)
        // eslint-disable-next-line no-case-declarations
        const lastDate = new Date(lastDocument.published)
        lastDate.setSeconds(lastDate.getSeconds() - 1)
        return {
          ...getters.getColumnByIndex(indexCol).params,
          dateTo: lastDate.toISOString()
        }
      case 'after':
        // eslint-disable-next-line no-case-declarations
        const firstDocument = getters.getFirstDocumentInCol(indexCol)
        // eslint-disable-next-line no-case-declarations
        const firstDate = new Date(firstDocument.published)
        firstDate.setSeconds(firstDate.getSeconds() + 1)
        return {
          ...getters.getColumnByIndex(indexCol).params,
          dateFrom: firstDate.toISOString()
        }
      default:
        throw new Error('Invalid mode')
    }
  }
}

export default getters
