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

      commit('addDocuments', documents)

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
  async refreshColumn ({ state, commit, dispatch, getters, rootGetters }, { indexCol, more }) {
    if (rootGetters['wait/is'](`column.refreshing.${state.columns[indexCol].id}`)) {
      return
    }
    try {
      dispatch('wait/start', `column.refreshing.${state.columns[indexCol].id}`, { root: true })

      let params = {
        ...getters.getColumnByIndex(indexCol).params
      }

      try {
        if (getters.getColumnByIndex(indexCol).documentsIds.length > 0) {
          switch (more) {
            case 'before':
              const lastDocumentId = getters.getDocumentsIdsByColumnId(indexCol).filter(d => typeof d === 'string').slice(-1).pop()
              const lastDocument = getters.getDocumentById(lastDocumentId)
              const lastDate = new Date(lastDocument.published)
              lastDate.setSeconds(lastDate.getSeconds() - 1)
              params = Object.assign(params, { dateTo: lastDate.toISOString() })
              break
            case 'after':
              const firstDocumentId = getters.getDocumentsIdsByColumnId(indexCol).filter(d => typeof d === 'string')[0]
              const firstDocument = getters.getDocumentById(firstDocumentId)
              const firstDate = new Date(firstDocument.published)
              firstDate.setSeconds(firstDate.getSeconds() + 1)
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

      const { documents, count } = await afpNews.search(params)

      commit('addDocuments', documents)

      switch (more) {
        case 'before':
          commit('appendDocumentsIdsToCol', { indexCol, documentsIds: documents.map(doc => doc.uno) })
          break
        case 'after':
          const documentsIds = documents.map(doc => doc.uno)
          if (count > documents.length) {
            documentsIds.push({
              type: 'documents-gap',
              count: count - documents.length
            })
          }
          commit('prependDocumentsIdsToCol', { indexCol, documentsIds })
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
