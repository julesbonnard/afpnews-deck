import { Column, Document } from '@/types'
import { Params } from 'afpnews-api/dist/types'
import State from '@/store/state'

export default {
  getDocumentById: (state: State) => (id: string): Document | undefined => {
    return state.documents.get(id)
  },
  getColumnByIndex: (state: State) => (index: number): Column => {
    return state.columns[index]
  },
  getDocumentsIdsByColumnId: (_: State, getters: any) => (indexCol: number, separators = true): string[] => {
    return getters.getColumnByIndex(indexCol).documentsIds.filter((d: string) => separators || !d.includes('documents-gap'))
  },
  getDocumentsByColumnId: (_: State, getters: any) => (indexCol: number, separators = true): Document[] => {
    return getters.getDocumentsIdsByColumnId(indexCol, separators)
      .map((docId: string) => getters.getDocumentById(docId))
  },
  isAnonymous (state: State): boolean {
    return state.authType === 'anonymous'
  },
  isAuthenticated (state: State): boolean {
    return state.authType === 'credentials'
  },
  getPreviousDocumentIdInColById: (_: State, getters: any) => (indexCol: number, docId: string): string | false => {
    const currentDocumentsinColumn = getters.getDocumentsByColumnId(indexCol, false)
    const currentDocIndexInColumn = currentDocumentsinColumn.findIndex((doc: Document) => doc.uno === docId)
    const previousDocument = currentDocumentsinColumn[currentDocIndexInColumn + 1]
    return (previousDocument && previousDocument.uno) || false
  },
  getNextDocumentIdInColById: (_: State, getters: any) => (indexCol: number, docId: string): string | false => {
    const currentDocumentsinColumn = getters.getDocumentsByColumnId(indexCol, false)
    const currentDocIndexInColumn = currentDocumentsinColumn.findIndex((doc: Document) => doc.uno === docId)
    const nextDocument = currentDocumentsinColumn[currentDocIndexInColumn - 1]
    return (nextDocument && nextDocument.uno) || false
  },
  getFirstDocumentInCol: (_: State, getters: any) => (indexCol: number): Document | false => {
    const firstDocumentId = getters.getDocumentsIdsByColumnId(indexCol, false)[0]
    return getters.getDocumentById(firstDocumentId)
  },
  getLastDocumentInCol: (_: State, getters: any) => (indexCol: number): Document | false => {
    const lastDocumentId = getters.getDocumentsIdsByColumnId(indexCol, false).pop()
    return getters.getDocumentById(lastDocumentId)
  },
  getRefreshParamsByMode: (
    _: State,
    getters: any
  ) => (
    indexCol: number,
    mode: 'after' | 'before' | 'reset'
  ): Params => {
    switch (mode) {
      case 'reset':
        return getters.getColumnByIndex(indexCol).params
      case 'before':
        const lastDocument = getters.getLastDocumentInCol(indexCol)
        const lastDate = new Date(lastDocument.published)
        lastDate.setSeconds(lastDate.getSeconds() - 1)
        return {
          ...getters.getColumnByIndex(indexCol).params,
          dateTo: lastDate.toISOString()
        }
      case 'after':
        const firstDocument = getters.getFirstDocumentInCol(indexCol)
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
