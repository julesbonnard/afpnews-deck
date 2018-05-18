import Vue from 'vue'
import Vuex from 'vuex'
import AfpNews from 'afpnews-api'
import localForage from 'localforage'

Vue.use(Vuex)

const storageKeys = {
  columns: 'afpnews-deck-columns',
  token: 'afpnews-deck-token',
  clientId: 'afpnews-deck-client-id',
  clientSecret: 'afpnews-deck-client-secret'
}

const userStore = localForage.createInstance({
  name: 'userStore'
})

const documentsStore = localForage.createInstance({
  name: 'documentsStore'
})

const afpNews = new AfpNews()

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
    slugs: doc.slug,
    imageSd: Array.isArray(media) ? media.find(d => d.role === 'Preview') : undefined,
    imageHd: Array.isArray(media) ? media.find(d => d.role === 'HighDef') : undefined,
    video: Array.isArray(media) ? media.find(d => d.role === 'Video' || d.type === 'Video') : undefined,
    viewed: false
  }
}

let newDocumentTimeout

export default new Vuex.Store({
  state: {
    columns: [],
    credentials: {
      clientId: null,
      clientSecret: null
    },
    currentDocumentId: null,
    currentColumnIndex: null,
    documents: {},
    authType: 'unknown'
  },
  getters: {
    getDocumentById: state => id => {
      return state.documents[id]
    },
    getColumnByIndex: state => id => {
      return state.columns[id]
    },
    getDocumentsByColumnId: (state, getters) => indexCol => {
      return getters.getColumnByIndex(indexCol).documentsIds.map(docId => getters.getDocumentById(docId))
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
        params: Object.assign({}, afpNews.defaultSearchParams, { size: 20 }),
        documentsIds: [],
        processing: false,
        error: false,
        paramsOpen: true,
        lastTimeLoading: 0
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
    },
    updateColumnParams (state, { indexCol, params }) {
      state.columns[indexCol].params = params
    },
    updateClientId (state, value) {
      state.credentials.clientId = value
      afpNews.apiKey = state.credentials
    },
    updateClientSecret (state, value) {
      state.credentials.clientSecret = value
      afpNews.apiKey = state.credentials
    },
    setClientCredentials (state, { clientId, clientSecret }) {
      state.credentials.clientId = clientId
      state.credentials.clientSecret = clientSecret
      afpNews.apiKey = state.credentials
    },
    resetClientCredentials (state) {
      state.credentials.clientId = null
      state.credentials.clientSecret = null
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
    setParamsOpen (state, { indexCol, value }) {
      state.columns[indexCol].paramsOpen = value
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
      state.documents = {}
    },
    prependDocumentsToCol (state, { indexCol, documents }) {
      if (!state.columns[indexCol]) return false
      const existingDocumentsIds = state.columns[indexCol].documentsIds
      state.columns[indexCol].documentsIds = [...new Set(documents.map(doc => doc.uno).concat(existingDocumentsIds))]
    },
    appendDocumentsToCol (state, { indexCol, documents }) {
      if (!state.columns[indexCol]) return false
      const existingDocumentsIds = state.columns[indexCol].documentsIds
      state.columns[indexCol].documentsIds = [...new Set(existingDocumentsIds.concat(documents.map(doc => doc.uno)))]
    },
    setCurrentColumnIndex (state, indexCol) {
      state.currentColumnIndex = indexCol
    },
    setCurrentDocumentId (state, docId) {
      state.currentDocumentId = docId
    },
    setDocumentViewed (state, docId) {
      state.documents[docId].viewed = true
    },
    resetCurrentDocument (state) {
      state.currentDocumentId = null
      if (newDocumentTimeout) {
        clearTimeout(newDocumentTimeout)
      }
    }
  },
  actions: {
    async resurrectColumns ({ commit }) {
      const savedColumns = await userStore.getItem(storageKeys.columns)
      if (Array.isArray(savedColumns) && savedColumns.length > 0) {
        savedColumns.forEach(column => {
          commit('addColumn', Object.assign(column, { paramsOpen: false }))
        })
      } else {
        commit('addColumn')
      }
    },
    async resurrectDocuments ({ commit }) {
      return documentsStore.iterate((value, key, iterationNumber) => {
        commit('addDocuments', [value])
      })
    },
    async saveColumns ({ state }) {
      const columns = JSON.parse(JSON.stringify(state.columns))
      await userStore.setItem(storageKeys.columns, columns.map(column => {
        column.documentsIds = []
        return column
      }))
    },
    async saveDocuments ({ state, commit }) {
      commit('cleanDocuments')
      await documentsStore.iterate((value, key, iterationNumber) => {
        if (state.documents[value.uno] === undefined) {
          documentsStore.removeItem(key)
        }
      })
      for (const docId in state.documents) {
        await documentsStore.setItem(state.documents[docId].uno, state.documents[docId])
      }
    },
    async initCredentials ({ commit }) {
      const clientId = await userStore.getItem(storageKeys.clientId)
      const clientSecret = await userStore.getItem(storageKeys.clientSecret)

      if (clientId && clientSecret) {
        commit('setClientCredentials', { clientId, clientSecret })
      }
    },
    async saveCredentials ({ state }) {
      await userStore.setItem(storageKeys.clientId, state.credentials.clientId)
      await userStore.setItem(storageKeys.clientSecret, state.credentials.clientSecret)
    },
    async initToken ({ commit }) {
      const token = await userStore.getItem(storageKeys.token)
      if (token) {
        afpNews.token = token
        commit('setAuthType', afpNews.token.authType)
      }
    },
    async saveToken ({ commit }, token) {
      await userStore.setItem(storageKeys.token, token)
      commit('setAuthType', token.authType)
    },
    async authenticate ({ state, commit, dispatch }, { username, password } = {}) {
      try {
        const token = await afpNews.authenticate({ username, password })
        await dispatch('saveToken', token)
        await dispatch('saveCredentials')
      } catch (e) {
        console.log(e)
      }
    },
    async refreshColumn ({ state, commit, dispatch, getters }, { indexCol, more }) {
      try {
        if (state.columns[indexCol] && (Date.now() - state.columns[indexCol].lastTimeLoading) < 10) {
          throw new Error('Refreshs are too frequent. Are you sure you\'re not in a infinite loop ?')
        }

        commit('setProcessing', { indexCol, value: true })

        let params = JSON.parse(JSON.stringify(getters.getColumnByIndex(indexCol).params))

        if (getters.getColumnByIndex(indexCol).documentsIds.length > 0) {
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
        }

        const { documents } = await afpNews.search(params)

        dispatch('saveToken', afpNews.token)

        if (documents.length === 0) {
          throw new Error('No more documents')
        }

        commit('addDocuments', documents.map(doc => formatDocument(doc)))

        if (more === 'before') {
          commit('appendDocumentsToCol', { indexCol, documents })
        } else {
          commit('prependDocumentsToCol', { indexCol, documents })
        }

        dispatch('saveColumns')

        commit('setError', { indexCol, value: false })

        return Promise.resolve()
      } catch (e) {
        // console.error(e.message)
        return Promise.reject(e)
      } finally {
        commit('setProcessing', { indexCol, value: false })
      }
    },
    refreshAllColumns ({ state, dispatch }) {
      return Promise.all(
        state.columns
          .filter(column => !column.paramsOpen)
          .map((column, i) => dispatch('refreshColumn', { indexCol: i, more: 'after' })))
    },
    setCurrentDocument ({ state, commit }, { docId, indexCol }) {
      commit('setCurrentDocumentId', docId)
      if (indexCol !== undefined) {
        commit('setCurrentColumnIndex', indexCol)
      }
      if (newDocumentTimeout) {
        clearTimeout(newDocumentTimeout)
      }
      newDocumentTimeout = setTimeout(() => {
        commit('setDocumentViewed', docId)
      }, 3000)
    },
    async previousDocument ({ state, getters, commit, dispatch }) {
      const currentDocumentsinColumn = getters.getDocumentsByColumnId(state.currentColumnIndex)
      const currentDocIndexInColumn = currentDocumentsinColumn.findIndex(doc => doc.uno === state.currentDocumentId)
      const previousDocument = currentDocumentsinColumn[currentDocIndexInColumn + 1]
      if (previousDocument) {
        dispatch('setCurrentDocument', { docId: previousDocument.uno })
      } else {
        try {
          await dispatch('refreshColumn', { indexCol: state.currentColumnIndex, more: 'before' })
          await dispatch('previousDocument')
        } catch (e) {
          commit('resetCurrentDocument')
        }
      }
    },
    async nextDocument ({ state, getters, commit, dispatch }) {
      const currentDocumentsinColumn = getters.getDocumentsByColumnId(state.currentColumnIndex)
      const currentDocIndexInColumn = currentDocumentsinColumn.findIndex(doc => doc.uno === state.currentDocumentId)
      const nextDocument = currentDocumentsinColumn[currentDocIndexInColumn - 1]
      if (nextDocument) {
        dispatch('setCurrentDocument', { docId: nextDocument.uno })
      } else {
        try {
          await dispatch('refreshColumn', { indexCol: state.currentColumnIndex, more: 'after' })
          await dispatch('nextDocument')
        } catch (e) {
          commit('resetCurrentDocument')
        }
      }
    }
  },
  modules: {},
  strict: process.env.NODE_ENV !== 'production'
})
