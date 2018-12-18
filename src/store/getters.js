export default {
  getDocumentById: state => id => {
    return state.documents[id]
  },
  getColumnByIndex: state => id => {
    return state.columns[id]
  },
  getDocumentsIdsByColumnId: (state, getters) => (indexCol, separators = true) => {
    return getters.getColumnByIndex(indexCol).documentsIds.filter(d => separators || typeof d === 'string')
  },
  getDocumentsByColumnId: (state, getters) => (indexCol, separators = true) => {
    return getters.getDocumentsIdsByColumnId(indexCol, separators).map(docId => getters.getDocumentById(docId))
  },
  isDocumentViewed: state => id => {
    return state.viewed.includes(id)
  },
  isAnonymous (state) {
    return state.authType === 'anonymous'
  },
  isAuthenticated (state) {
    return state.authType === 'credentials'
  },
  getPreviousDocumentIdInColById: (state, getters) => (indexCol, docId) => {
    if (indexCol === null || docId === undefined) {
      return false
    }
    const currentDocumentsinColumn = getters.getDocumentsByColumnId(indexCol, false)
    const currentDocIndexInColumn = currentDocumentsinColumn.findIndex(doc => doc.uno === docId)
    const previousDocument = currentDocumentsinColumn[currentDocIndexInColumn + 1]
    return (previousDocument && previousDocument.uno) || false
  },
  getNextDocumentIdInColById: (state, getters) => (indexCol, docId) => {
    if (indexCol === null || docId === undefined) {
      return false
    }
    const currentDocumentsinColumn = getters.getDocumentsByColumnId(indexCol, false)
    const currentDocIndexInColumn = currentDocumentsinColumn.findIndex(doc => doc.uno === docId)
    const nextDocument = currentDocumentsinColumn[currentDocIndexInColumn - 1]
    return (nextDocument && nextDocument.uno) || false
  }
}
