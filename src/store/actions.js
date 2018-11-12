import afpNews from '@/plugins/api'
import { loadLanguageAsync } from '@/plugins/i18n'
import { changeDayJsLocale } from '@/plugins/dayjs'

export default {
  async changeLocale ({ commit, state }, locale) {
    await loadLanguageAsync(locale)
    changeDayJsLocale(locale)
    commit('setLocale', locale)
  },
  async logout ({ commit }) {
    commit('resetClientCredentials')
    commit('unsetToken')
    commit('clearDocuments')
  },
  async authenticate ({ state, commit, dispatch }, { username, password } = {}) {
    try {
      await afpNews.authenticate({ username, password })
    } catch (error) {
      console.error(error && error.message)
      return Promise.reject(error)
    }
  },
  async searchDocuments ({ state, commit, dispatch, getters }, params) {
    try {
      dispatch('wait/start', `documents.search`, { root: true })

      const { documents } = await afpNews.search(params)

      return documents
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
      dispatch('wait/end', `documents.search`, { root: true })
    }
  },
  async refreshColumn ({ state, commit, dispatch, getters }, { indexCol, more }) {
    try {
      dispatch('wait/start', `column.refreshing.${state.columns[indexCol].id}`, { root: true })

      let params = {
        ...getters.getColumnByIndex(indexCol).params
      }

      try {
        if (getters.getColumnByIndex(indexCol).documentsIds.length > 0) {
          switch (more) {
            case 'before':
              const lastDocumentId = getters.getDocumentsIdsByColumnId(indexCol).slice(-1).pop()
              const lastDocument = getters.getDocumentById(lastDocumentId)
              let lastDate = new Date(lastDocument.published)
              lastDate.setSeconds(lastDate.getSeconds() - 1)
              params = Object.assign(params, { dateTo: lastDate.toISOString() })
              break
            case 'after':
              const firstDocumentId = getters.getDocumentsIdsByColumnId(indexCol)[0]
              const firstDocument = getters.getDocumentById(firstDocumentId)
              let firstDate = new Date(firstDocument.published)
              firstDate.setSeconds(firstDate.getSeconds())
              params = Object.assign(params, { dateFrom: firstDate.toISOString() })
              break
            default:
          }
        }
      } catch (e) {
        console.error(e.message)
        commit('resetColumn', { indexCol })
        return dispatch('refreshColumn', { indexCol, more })
      }

      const { documents } = await afpNews.search(params)

      if (!documents || documents.length === 0) {
        // throw new Error('No more documents')
        return false
      }

      commit('addDocuments', documents)

      switch (more) {
        case 'before':
          commit('appendDocumentsIdsToCol', { indexCol, documentsIds: documents.map(doc => doc.uno) })
          break
        case 'after':
          commit('prependDocumentsIdsToCol', { indexCol, documentsIds: documents.map(doc => doc.uno) })
          break
        default:
      }

      if (state.columns[indexCol].error) commit('setError', { indexCol, value: false })
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
      dispatch('wait/end', `column.refreshing.${state.columns[indexCol].id}`, { root: true })
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

    commit('addDocuments', [result.document])
  }
}
