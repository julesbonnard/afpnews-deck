import { storageKeys, userStore, documentsStore } from '@/plugins/database'
import Doc from './Doc'
import afpNews from '@/plugins/api'
import { loadLanguageAsync } from '@/plugins/i18n'
import { changeDayJsLocale } from '@/plugins/dayjs'

export default {
  async changeLocale ({ commit, state }, locale) {
    await loadLanguageAsync(locale)
    changeDayJsLocale(locale)
    commit('setLocale', locale)
    await userStore.setItem(storageKeys.locale, state.locale)
  },
  async addColumn ({ commit, dispatch }, payload) {
    commit('addColumn', payload)
    await dispatch('saveColumns')
  },
  async closeColumn ({ commit, dispatch }, { indexCol }) {
    commit('closeColumn', { indexCol })
    await dispatch('saveColumns')
  },
  async moveColumn ({ commit, dispatch }, { indexCol, dir }) {
    commit('moveColumn', { indexCol, dir })
    await dispatch('saveColumns')
  },
  async resurrectColumns ({ commit }) {
    const savedColumns = await userStore.getItem(storageKeys.columns)
    if (Array.isArray(savedColumns) && savedColumns.length > 0) {
      savedColumns.forEach(column => commit('addColumn', column))
    } else {
      commit('addColumn')
    }
  },
  async resurrectDocuments ({ commit }) {
    const documents = []
    await documentsStore.iterate((value, key, iterationNumber) => {
      documents.push(value)
    })
    commit('addDocuments', documents)
  },
  async saveColumns ({ state }) {
    await userStore.setItem(storageKeys.columns, state.columns)
  },
  async saveDocuments ({ state, commit }) {
    await documentsStore.iterate((value, key, iterationNumber) => {
      if (state.documents[value.uno] === undefined) {
        documentsStore.removeItem(key)
      }
    })
    for (const docId in state.documents) {
      documentsStore.setItem(state.documents[docId].uno, state.documents[docId])
    }
  },
  async initPreferences ({ commit, dispatch }) {
    const wantTour = await userStore.getItem(storageKeys.wantTour)
    if (wantTour !== null) commit('setWantTour', wantTour)
    const locale = await userStore.getItem(storageKeys.locale)
    if (locale !== null) {
      dispatch('changeLocale', locale)
    }
  },
  async setWantTour ({ state, commit }, value) {
    commit('setWantTour', value)
    await userStore.setItem(storageKeys.wantTour, state.wantTour)
  },
  async initCredentials ({ commit }) {
    commit('initClients')
    const client = await userStore.getItem(storageKeys.client)
    const clientId = await userStore.getItem(storageKeys.clientId)
    const clientSecret = await userStore.getItem(storageKeys.clientSecret)

    commit('setClientCredentials', { client, clientId, clientSecret })
  },
  async saveCredentials ({ state }) {
    await userStore.setItem(storageKeys.client, state.credentials.client)
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
  async saveToken ({ state, commit }, token) {
    await userStore.setItem(storageKeys.token, token)
    commit('setAuthType', token.authType)
  },
  async logout ({ commit }) {
    afpNews.token = {}
    commit('setAuthType', 'unknown')
    commit('resetClientCredentials')
  },
  async clearDatabase ({ commit }) {
    await userStore.clear()
    await documentsStore.clear()
    commit('resetState')
    commit('addColumn')
  },
  async authenticate ({ state, commit, dispatch }, { username, password } = {}) {
    try {
      await afpNews.authenticate({ username, password })
      await dispatch('saveCredentials')
    } catch (error) {
      console.error(error && error.message)
      return Promise.reject(error)
    }
  },
  async refreshColumn ({ state, commit, dispatch, getters }, { indexCol, more }) {
    try {
      if (state.columns[indexCol] && (Date.now() - state.columns[indexCol].lastTimeLoading) < 10) {
        throw new Error('Refreshs are too frequent. Are you sure you\'re not in a infinite loop ?')
      }

      commit('setProcessing', { indexCol, value: true })

      let params = { ...getters.getColumnByIndex(indexCol).params }

      try {
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
      } catch (e) {
        console.error(e.message)
        commit('clearColumnDocumentsIds', { indexCol })
        return dispatch('refreshColumn', { indexCol, more })
      }

      const { documents } = await afpNews.search(params)

      if (documents.length === 0) {
        throw new Error('No more documents')
      }

      const docs = documents.map(doc => new Doc(doc).toObject())
      commit('addDocuments', docs)

      if (more === 'before') {
        commit('appendDocumentsIdsToCol', { indexCol, documentsIds: docs.map(doc => doc.uno) })
      } else {
        commit('prependDocumentsIdsToCol', { indexCol, documentsIds: docs.map(doc => doc.uno) })
      }

      dispatch('saveColumns')
      dispatch('saveDocuments')

      commit('setError', { indexCol, value: false })
      return true
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 401) {
          await dispatch('logout')
          console.error('Authentication error. Please type your credentials.')
        }
        console.error(error.response)
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.error(error.message)
      }
      return false
    } finally {
      commit('setProcessing', { indexCol, value: false })
    }
  },
  refreshAllColumns ({ state, dispatch }) {
    return Promise.all(
      state.columns
        .map((column, i) => dispatch('refreshColumn', { indexCol: i, more: 'after' })))
  },
  async getDocument ({ commit, dispatch }, docId) {
    const result = await afpNews.get(docId)

    if (!result.document) {
      throw new Error('No document found')
    }

    commit('addDocuments', [new Doc(result.document).toObject()])
  }
}
