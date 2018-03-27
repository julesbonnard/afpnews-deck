import Vue from 'vue'
import Vuex from 'vuex'
import AfpNews from 'afpnews-api'
import localForage from 'localforage'

Vue.use(Vuex)

const storageKeys = {
  columns: 'afpnews-deck-columns',
  documents: 'afpnews-deck-documents',
  token: 'afpnews-deck-token',
  clientId: 'afpnews-deck-client-id',
  clientSecret: 'afpnews-deck-client-secret'
}

const afpNews = new AfpNews({ baseUrl: 'https://api.afpforum.com' })

function formatDocument (doc) {
  const media = !doc.bagItem || doc.bagItem.length === 0 || !doc.bagItem[0].medias ? false : doc.bagItem[0].medias
  return {
    uno: doc.uno,
    headline: Array.isArray(doc.title) ? doc.title.join(' - ') : doc.title,
    published: doc.published,
    lang: doc.lang,
    product: doc.product,
    urgency: doc.urgency,
    news: doc.news,
    imageSd: Array.isArray(media) ? media.find(d => d.role === 'Preview') : undefined,
    imageHd: Array.isArray(media) ? media.find(d => d.role === 'HighDef') : undefined,
    video: Array.isArray(media) ? media.find(d => d.role === 'Video') : undefined,
    viewed: false
  }
}

export default new Vuex.Store({
  state: {
    columns: [],
    credentials: {
      clientId: null,
      clientSecret: null
    },
    currentDocumentId: null,
    documents: {},
    authType: 'unknown'
  },
  getters: {
    getDocumentById: state => id => {
      return state.documents[id]
    },
    getDocumentsByColumnId: (state, getters) => indexCol => {
      return getters.getColumnByIndex(indexCol).documentsIds.map(docId => getters.getDocumentById(docId))
    },
    getColumnByIndex: state => id => {
      return state.columns[id]
    },
    currentDocument: (state, getters) => {
      return getters.getDocumentById(state.currentDocumentId)
    },
    isAnonymous (state) {
      return state.authType === 'anonymous'
    },
    isAuthenticated (state) {
      return state.authType === 'credentials'
    }
  },
  mutations: {
    addColumn (state, payload) {
      const defaultColumn = {
        params: afpNews.defaultSearchParams,
        documentsIds: [],
        documentsCount: 0,
        processing: false,
        error: false,
        paramsOpen: true
      }

      const newColumn = Object.assign({}, defaultColumn, payload)

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
      state.columns[indexCol].count = 0
    },
    updateColumnParams (state, { indexCol, params }) {
      state.columns[indexCol].params = params
    },
    updateClientId (state, value) {
      state.credentials.clientId = value
    },
    updateClientSecret (state, value) {
      state.credentials.clientSecret = value
    },
    setClientCredentials (state, { clientId, clientSecret }) {
      state.credentials.clientId = clientId
      state.credentials.clientSecret = clientSecret
    },
    resetClientCredentials (state) {
      state.credentials.clientId = null
      state.credentials.clientSecret = null
    },
    setAuthType (state, value) {
      state.authType = value
    },
    setProcessing (state, { indexCol, value }) {
      state.columns[indexCol].processing = value
    },
    setError (state, { indexCol, value }) {
      state.columns[indexCol].error = value
    },
    setParamsOpen (state, { indexCol, value }) {
      state.columns[indexCol].paramsOpen = value
    },
    addDocuments (state, documents) {
      const documentsKeyedById = documents.reduce((acc, cur) => {
        acc[cur.uno] = formatDocument(cur)
        return acc
      }, {})
      state.documents = Object.assign({}, documentsKeyedById, state.documents)
    },
    cleanDocuments (state) {
      const displayedIds = [...new Set([].concat.apply([], state.columns.map(column => column.documentsIds)))]
      const cleanedDocuments = displayedIds.reduce((acc, cur) => {
        acc[cur] = state.documents[cur]
        return acc
      }, {})
      state.documents = cleanedDocuments
    },
    clearDocuments (state) {
      state.documents = {}
    },
    resurrectDocuments (state, documents) {
      state.documents = documents
    },
    addDocumentsToCol (state, { indexCol, documents }) {
      const existingDocumentsIds = state.columns[indexCol].documentsIds
      state.columns[indexCol].documentsIds = [...new Set(documents.map(doc => doc.uno).concat(existingDocumentsIds))]
        .sort((a, b) => {
          if (a > b) return -1
          if (a < b) return 1
          return 0
        })
    },
    setCurrentDocumentId (state, docId) {
      state.currentDocumentId = docId
      state.documents[docId].viewed = true
    },
    resetCurrentDocument (state) {
      state.currentDocumentId = null
    }
  },
  actions: {
    async initColumns ({ commit }) {
      const savedDocuments = await localForage.getItem(storageKeys.documents)
      if (savedDocuments) {
        commit('resurrectDocuments', savedDocuments)
      }

      const savedColumns = await localForage.getItem(storageKeys.columns)
      if (Array.isArray(savedColumns) && savedColumns.length > 0) {
        savedColumns.forEach(column => {
          commit('addColumn', Object.assign(column, { paramsOpen: false }))
        })
      } else {
        commit('addColumn')
      }
    },
    async saveColumns ({ state, commit }) {
      commit('cleanDocuments')
      await localForage.setItem(storageKeys.columns, state.columns)
      await localForage.setItem(storageKeys.documents, state.documents)
    },
    async initCredentials ({ commit }) {
      const clientId = await localForage.getItem(storageKeys.clientId)
      const clientSecret = await localForage.getItem(storageKeys.clientSecret)

      if (clientId && clientSecret) {
        commit('setClientCredentials', { clientId, clientSecret })
      }
    },
    async saveCredentials ({ state }) {
      await localForage.setItem(storageKeys.clientId, state.credentials.clientId)
      await localForage.setItem(storageKeys.clientSecret, state.credentials.clientSecret)
    },
    async initToken ({ commit }) {
      const token = await localForage.getItem(storageKeys.token)
      if (token) {
        afpNews.token = token
        commit('setAuthType', afpNews.token.authType)
      }
    },
    async saveToken ({ commit }, token) {
      await localForage.setItem(storageKeys.token, token)
    },
    async authenticate ({ state, commit, dispatch }, { username, password } = {}) {
      try {
        if (!state.credentials.clientId || !state.credentials.clientSecret) {
          await dispatch('initCredentials')
        } else {
          await dispatch('saveCredentials')
        }

        afpNews.apiKey = state.credentials

        await dispatch('initToken')

        if (username && password) {
          const token = await afpNews.authenticate({ username, password })
          commit('setAuthType', token.authType)
          await dispatch('saveToken', token)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async refreshColumn ({ state, commit, dispatch, getters }, { indexCol, more }) {
      let params = JSON.parse(JSON.stringify(getters.getColumnByIndex(indexCol).params))

      if (more === 'before') {
        const lastDocumentId = getters.getColumnByIndex(indexCol).documentsIds.slice(-1).pop()
        const lastDocument = getters.getDocumentById(lastDocumentId)
        let lastDate = new Date(lastDocument.published)
        lastDate.setSeconds(lastDate.getSeconds() - 1)
        params = Object.assign(params, { dateTo: lastDate.toISOString() })
      } else if (more === 'after') {
        const firstDocumentId = getters.getColumnByIndex(indexCol).documentsIds[0]
        const firstDocument = getters.getDocumentById(firstDocumentId)
        let firstDate = new Date(firstDocument.published)
        firstDate.setSeconds(firstDate.getSeconds() + 1)
        params = Object.assign(params, { dateFrom: firstDate.toISOString() })
      }

      commit('setProcessing', { indexCol, value: true })

      try {
        const { documents } = await afpNews.search(params)

        commit('setAuthType', afpNews.token.authType)

        await dispatch('saveToken', afpNews.token)

        commit('addDocuments', documents)

        commit('addDocumentsToCol', { indexCol, documents })

        await dispatch('saveColumns')

        commit('setError', { indexCol, value: false })
      } catch (e) {
        console.error(e.message)

        commit('setError', { indexCol, value: true })
      } finally {
        commit('setProcessing', { indexCol, value: false })
      }
    },
    refreshAllColumns ({ state, dispatch }, { more }) {
      return Promise.all(
        state.columns
          .filter(column => !column.paramsOpen)
          .map((column, i) => dispatch('refreshColumn', { indexCol: i, more })))
    }
  },
  modules: {},
  strict: process.env.NODE_ENV !== 'production'
})
