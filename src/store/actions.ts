import afpNews from '@/plugins/api'
import { loadLanguageAsync } from '@/plugins/i18n'
import { changeDayJsLocale } from '@/plugins/dayjs'
import { ActionContext, ActionTree, Store } from 'vuex'
import { Locale, Document } from '@/types'
import State from '@/store/state'
import DocumentParser from '@/plugins/DocumentParser'
import { AfpDocument, Params } from 'afpnews-api/dist/typings/@types/index.d'

const actions: ActionTree<State, State> = {
  async changeLocale ({ commit }: ActionContext<State, State>, locale: Locale): Promise<void> {
    await loadLanguageAsync(locale)
    changeDayJsLocale(locale)
    commit('setLocale', locale)
  },
  logout ({ commit, dispatch }: ActionContext<State, State>): void {
    commit('unsetToken')
    commit('clearDocuments')
    dispatch('refreshAllColumns')
  },
  async authenticate ({ commit, dispatch }: ActionContext<State, State>, { username, password }: { username?: string, password?: string } = {}): Promise<void> {
    try {
      await afpNews.authenticate({ username, password })
      commit('clearDocuments')
      dispatch('refreshAllColumns', { more: 'before' })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message)
      return Promise.reject(error)
    }
  },
  async searchDocuments ({ commit, dispatch }: ActionContext<State, State>, params: Params): Promise<Array<Document>> {
    try {
      dispatch('wait/start', `documents.search`, { root: true })

      const { documents } = await afpNews.search(params)

      if (!documents) return []

      commit('addDocuments', documents)

      return documents.map(doc => new DocumentParser(doc).toObject())
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 401) {
          await dispatch('logout')
          // eslint-disable-next-line no-console
          console.error('Authentication error. Please type your credentials.')
        } else {
          // eslint-disable-next-line no-console
          console.error(error.response)
        }
      } else if (error.request) {
        // The request was made but no response was received
        // eslint-disable-next-line no-console
        console.error(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // eslint-disable-next-line no-console
        console.error(error.message)
      }
      return []
    } finally {
      dispatch('wait/end', `documents.search`, { root: true })
    }
  },
  async refreshColumn ({ state, commit, dispatch, getters, rootGetters }: ActionContext<State, State>, { indexCol, more }: { indexCol: number, more: 'before' | 'after' }): Promise<boolean | undefined> {
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
              const lastDocumentId = getters.getDocumentsIdsByColumnId(indexCol).slice(-1).pop()
              const lastDocument = getters.getDocumentById(lastDocumentId)
              const lastDate = new Date(lastDocument.published)
              lastDate.setSeconds(lastDate.getSeconds() - 1)
              params = Object.assign(params, { dateTo: lastDate.toISOString() })
              break
            case 'after':
              const firstDocumentId = getters.getDocumentsIdsByColumnId(indexCol)[0]
              const firstDocument = getters.getDocumentById(firstDocumentId)
              const firstDate = new Date(firstDocument.published)
              firstDate.setSeconds(firstDate.getSeconds() + 1)
              params = Object.assign(params, { dateFrom: firstDate.toISOString() })
              break
            default:
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
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
          // eslint-disable-next-line no-console
          console.error('Authentication error. Please type your credentials.')
          return
        }
        // eslint-disable-next-line no-console
        console.error(error.response)
      } else if (error.request) {
        // The request was made but no response was received
        // eslint-disable-next-line no-console
        console.error(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // eslint-disable-next-line no-console
        console.error(error.message)
      }
      return
    } finally {
      dispatch('wait/end', `column.refreshing.${state.columns[indexCol].id}`, { root: true })
    }
  },
  async refreshAllColumns ({ state, dispatch }: ActionContext<State, State>, { more = 'after' } = {}): Promise<void> {
    await Promise.all(
      state.columns
        .map((_, i) => dispatch('refreshColumn', { indexCol: i, more })))
  },
  async getDocument ({ commit }: ActionContext<State, State>, docId: string): Promise<void> {
    const result = await afpNews.get(docId)

    if (!result.document) {
      throw new Error('No document found')
    }

    commit('addDocuments', [result.document])
  }
}

export default actions
