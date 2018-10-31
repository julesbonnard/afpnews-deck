import afpNews from '@/plugins/api'
import uuidv4 from 'uuid/v4'
import getDefaultState from './state'

export default {
  addColumn (state, payload) {
    const defaultColumn = {
      id: uuidv4(),
      params: Object.assign({}, afpNews.defaultSearchParams, { size: 20 }),
      documentsIds: [],
      processing: false,
      error: false,
      lastTimeLoading: 0
    }

    if (payload && payload.params) {
      payload.params = Object.assign(defaultColumn.params, payload.params)
    }
    const newColumn = Object.assign({}, defaultColumn, payload)

    if (state.columns.find(column => column.id === newColumn.id)) return
    state.columns.push(newColumn)
  },
  moveColumn (state, { indexCol, dir }) {
    const to = dir === 'left' ? indexCol - 1 : indexCol + 1
    const element = state.columns[indexCol]
    state.columns.splice(indexCol, 1)
    state.columns.splice(to, 0, element)
  },
  closeColumn (state, { indexCol }) {
    state.columns.splice(indexCol, 1)
  },
  resetColumn (state, { indexCol }) {
    state.columns[indexCol].documentsIds = []
  },
  updateColumnParams (state, { indexCol, params }) {
    state.columns[indexCol].params = params
  },
  updateClient (state, value) {
    state.credentials.client = value
    afpNews.apiKey = state.credentials
  },
  updateClientId (state, value) {
    state.credentials.clientId = value
    afpNews.apiKey = state.credentials
  },
  updateClientSecret (state, value) {
    state.credentials.clientSecret = value
    afpNews.apiKey = state.credentials
  },
  setClientCredentials (state, { client, clientId, clientSecret }) {
    state.credentials.client = client
    state.credentials.clientId = clientId
    state.credentials.clientSecret = clientSecret
    afpNews.apiKey = state.credentials
  },
  resetClientCredentials (state) {
    state.credentials.client = null
    state.credentials.clientId = null
    state.credentials.clientSecret = null
    afpNews.apiKey = state.credentials
  },
  initClients (state) {
    state.clients = afpNews.clients
  },
  setAuthType (state, value) {
    state.authType = value
  },
  setProcessing (state, { indexCol, value }) {
    if (!state.columns[indexCol]) return false
    state.columns[indexCol].processing = value
    if (value === false) {
      state.columns[indexCol].lastTimeLoading = Date.now()
    }
  },
  setError (state, { indexCol, value }) {
    if (!state.columns[indexCol]) return false
    state.columns[indexCol].error = value
  },
  addDocuments (state, documents) {
    const documentsKeyedById = documents.reduce((acc, cur) => {
      acc[cur.uno] = cur
      return acc
    }, {})
    state.documents = Object.assign({}, documentsKeyedById, state.documents)
  },
  cleanDocuments (state) {
    const displayedIds = [...new Set([].concat.apply([], state.columns.map(column => column.documentsIds)))]
    for (const docId in state.documents) {
      if (displayedIds.indexOf(docId) === -1) {
        delete state.documents[docId]
      }
    }
  },
  clearDocuments (state) {
    state.columns = state.columns.map(column => ({
      ...column,
      documentsIds: []
    }))
    state.documents = {}
  },
  clearColumnDocumentsIds (state, { indexCol }) {
    state.columns[indexCol].documentsIds = []
  },
  prependDocumentsIdsToCol (state, { indexCol, documentsIds }) {
    if (!state.columns[indexCol]) return false
    const existingDocumentsIds = state.columns[indexCol].documentsIds
    state.columns[indexCol].documentsIds = [...new Set(documentsIds.concat(existingDocumentsIds))]
  },
  appendDocumentsIdsToCol (state, { indexCol, documentsIds }) {
    if (!state.columns[indexCol]) return false
    const existingDocumentsIds = state.columns[indexCol].documentsIds
    state.columns[indexCol].documentsIds = [...new Set(existingDocumentsIds.concat(documentsIds))]
  },
  setDocumentViewed (state, docId) {
    if (!state.documents[docId]) return false
    state.documents[docId].viewed = true
  },
  setConnectivityStatus (state, { isConnected }) {
    state.connectivity.isConnected = isConnected
  },
  setWantTour (state, value) {
    state.wantTour = value
  },
  setLocale (state, value) {
    state.locale = value
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}
