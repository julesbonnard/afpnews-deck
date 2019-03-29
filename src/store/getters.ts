import { Column, Document } from '@/types'
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
    return getters.getDocumentsIdsByColumnId(indexCol, separators).map((docId: string) => getters.getDocumentById(docId))
  },
  isDocumentViewed: (state: State) => (id: string) => {
    return state.viewed.includes(id)
  },
  isAnonymous (state: State): boolean {
    return state.authType === 'anonymous'
  },
  isAuthenticated (state: State): boolean {
    return state.authType === 'credentials'
  },
  getPreviousDocumentIdInColById: (_: State, getters: any) => (indexCol: number, docId: string): string | false => {
    if (indexCol === null || docId === undefined) {
      return false
    }
    const currentDocumentsinColumn = getters.getDocumentsByColumnId(indexCol, false)
    const currentDocIndexInColumn = currentDocumentsinColumn.findIndex((doc: Document) => doc.uno === docId)
    const previousDocument = currentDocumentsinColumn[currentDocIndexInColumn + 1]
    return (previousDocument && previousDocument.uno) || false
  },
  getNextDocumentIdInColById: (_: State, getters: any) => (indexCol: number, docId: string): string | false => {
    if (indexCol === null || docId === undefined) {
      return false
    }
    const currentDocumentsinColumn = getters.getDocumentsByColumnId(indexCol, false)
    const currentDocIndexInColumn = currentDocumentsinColumn.findIndex((doc: Document) => doc.uno === docId)
    const nextDocument = currentDocumentsinColumn[currentDocIndexInColumn - 1]
    return (nextDocument && nextDocument.uno) || false
  }
}
