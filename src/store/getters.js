export default {
  getDocumentById: state => id => {
    return state.documents[id]
  },
  getColumnByIndex: state => id => {
    return state.columns[id]
  },
  getDocumentsByColumnId: (state, getters) => indexCol => {
    return getters.getColumnByIndex(indexCol).documentsIds.map(docId => getters.getDocumentById(docId))
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
    const currentDocumentsinColumn = getters.getDocumentsByColumnId(indexCol)
    const currentDocIndexInColumn = currentDocumentsinColumn.findIndex(doc => doc.uno === docId)
    const previousDocument = currentDocumentsinColumn[currentDocIndexInColumn + 1]
    return (previousDocument && previousDocument.uno) || false
  },
  getNextDocumentIdInColById: (state, getters) => (indexCol, docId) => {
    if (indexCol === null || docId === undefined) {
      return false
    }
    const currentDocumentsinColumn = getters.getDocumentsByColumnId(indexCol)
    const currentDocIndexInColumn = currentDocumentsinColumn.findIndex(doc => doc.uno === docId)
    const nextDocument = currentDocumentsinColumn[currentDocIndexInColumn - 1]
    return (nextDocument && nextDocument.uno) || false
  }
}
