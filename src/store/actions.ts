import afpNews from '@/plugins/api'
import { loadLanguageAsync } from '@/plugins/i18n'
import { changeDayJsLocale } from '@/plugins/dayjs'
import { Params } from 'afpnews-api/dist/typings/@types/index.d'
import { Store } from 'vuex'
import { Locale, State } from '@/types'

export default {
  async changeLocale ({ commit, state }: Store<State>, locale: Locale) {
    await loadLanguageAsync(locale)
    changeDayJsLocale(locale)
    commit('setLocale', locale)
  },
  logout ({ commit, dispatch }: Store<State>) {
    commit('unsetToken')
    commit('clearDocuments')
    dispatch('refreshAllColumns')
  },
  async authenticate ({ state, commit, dispatch }: Store<State>, { username, password }: { username?: string, password?: string } = {}) {
    try {
      await afpNews.authenticate({ username, password })
      commit('clearDocuments')
      dispatch('refreshAllColumns', { more: 'before' })
    } catch (error) {
      console.error(error && error.message)
      return Promise.reject(error)
    }
  },
  async searchDocuments ({ state, commit, dispatch, getters }: Store<State>, params: Params) {
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
  async refreshColumn ({ state, commit, dispatch, getters, rootGetters }: Store<State> & { rootGetters: any }, { indexCol, more }: { indexCol: number, more: 'before' | 'after' }) {
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

      if (!documents || documents.length === 0) return false

      commit('addDocuments', documents)

      const documentsIds = documents.map(doc => doc.uno)

      switch (more) {
        case 'before':
          commit('appendDocumentsIdsToCol', { indexCol, documentsIds })
          break
        case 'after':
          if (count > documents.length) {
            documentsIds.push(`documents-gap|${+new Date()}|${count - documents.length}`)
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
      return
    } finally {
      dispatch('wait/end', `column.refreshing.${state.columns[indexCol].id}`, { root: true })
    }
  },
  refreshAllColumns ({ state, dispatch }: Store<State>, { more = 'after' } = {}) {
    return Promise.all(
      state.columns
        .map((column, i) => dispatch('refreshColumn', { indexCol: i, more })))
  },
  async getDocument ({ commit, dispatch }: Store<State>, docId: string) {
    const result = await afpNews.get(docId)

    if (!result.document) {
      throw new Error('No document found')
    }

    commit('addDocuments', [result.document])
  }
}
