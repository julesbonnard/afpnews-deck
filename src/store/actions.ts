import Vue from 'vue'
import afpNews from '@/plugins/api'
import { loadLanguageAsync } from '@/plugins/i18n'
import { changeDayJsLocale } from '@/plugins/dayjs'
import { ActionContext, ActionTree, Store } from 'vuex'
import { Locale, Document } from '@/types'
import State from '@/store/state'
import DocumentParser from '@/plugins/DocumentParser'
import { Params } from 'afpnews-api/dist/types'

const actions: ActionTree<State, State> = {
  async changeLocale ({ commit }: ActionContext<State, State>, locale: Locale): Promise<void> {
    await loadLanguageAsync(locale)
    changeDayJsLocale(locale)
    commit('setLocale', locale)
  },
  logout ({ commit, dispatch }: ActionContext<State, State>): Promise<void> {
    commit('unsetToken')
    commit('clearDocuments')
    return dispatch('refreshAllColumns')
  },
  async authenticate ({ commit, dispatch }: ActionContext<State, State>, { username, password }: { username?: string, password?: string } = {}): Promise<void> {
    try {
      await afpNews.authenticate({ username, password })
      commit('clearDocuments')
      dispatch('refreshAllColumns', { more: 'before' })
    } catch (error) {
      Vue.toasted.global.error(error)
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
      if (error.code === 401) {
        dispatch('logout')
      } else {
        Vue.toasted.global.error(error)
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
      let params = {
        ...getters.getColumnByIndex(indexCol).params
      }

      try {
        if (getters.getColumnByIndex(indexCol).documentsIds.length > 0) {
          switch (more) {
            case 'before':
              const lastDocument = getters.getLastDocumentInCol(indexCol)
              if (lastDocument) {
                const lastDate = new Date(lastDocument.published)
                lastDate.setSeconds(lastDate.getSeconds() - 1)
                params = Object.assign(params, { dateTo: lastDate.toISOString() })
              } else {
                throw new Error(`No last document in col ${indexCol}`)
              }
              break
            case 'after':
              const firstDocument = getters.getFirstDocumentInCol(indexCol)
              if (firstDocument) {
                const firstDate = new Date(firstDocument.published)
                firstDate.setSeconds(firstDate.getSeconds() + 1)
                params = Object.assign(params, { dateFrom: firstDate.toISOString() })
              } else {
                throw new Error(`No first document in col ${indexCol}`)
              }
              break
            default:
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        commit('resetColumn', { indexCol })
        return dispatch('refreshColumn', { indexCol, more })
      }

      dispatch('wait/start', `column.refreshing.${state.columns[indexCol].id}`, { root: true })

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
      if (error.code === 401) {
        dispatch('logout')
      } else {
        Vue.toasted.global.error(error)
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
  async getDocument ({ commit, dispatch }: ActionContext<State, State>, docId: string): Promise<void> {
    try {
      const { document } = await afpNews.get(docId)
      commit('addDocuments', [document])
    } catch (error) {
      if (error.code === 401) {
        dispatch('logout')
      } else {
        Vue.toasted.global.error(error)
      }
      return Promise.reject(error)
    }
  }
}

export default actions
