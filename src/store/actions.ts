import Vue from 'vue'
import afpNews from '@/plugins/api'
import { loadLanguageAsync } from '@/plugins/i18n'
import { changeDayJsLocale } from '@/plugins/dayjs'
import { ActionContext, ActionTree } from 'vuex'
import { Locale, Document } from '@/types'
import State from '@/store/state'
import DocumentParser from '@/plugins/DocumentParser'
import { Params, Lang } from 'afpnews-api/dist/types'
import config from '@/config/topics.json'

const actions: ActionTree<State, State> = {
  async changeLocale ({ commit }: ActionContext<State, State>, locale: Locale): Promise<void> {
    await loadLanguageAsync(locale)
    changeDayJsLocale(locale)
    commit('setLocale', locale)
  },
  logout ({ commit }: ActionContext<State, State>): void {
    commit('unsetToken')
  },
  async authenticate (
    {
      commit,
      dispatch
    }: ActionContext<State, State>,
    {
      username,
      password
    }: {
      username?: string,
      password?: string
    } = {}): Promise<void> {
    try {
      await afpNews.authenticate({ username, password })
      commit('clearDocuments')
      dispatch('refreshAllColumns', { mode: 'reset' })
    } catch (error) {
      Vue.toasted.global.apiError(error)
      return Promise.reject(error)
    }
  },
  async searchDocuments ({ commit, dispatch }: ActionContext<State, State>, params: Params): Promise<Document[]> {
    try {
      dispatch('wait/start', `documents.search`, { root: true })

      const { documents } = await afpNews.search(params)

      if (!documents) return []

      commit('addDocuments', documents)

      return documents.map(doc => new DocumentParser(doc).toObject())
    } finally {
      dispatch('wait/end', `documents.search`, { root: true })
    }
  },
  async refreshColumn (
    {
      state,
      commit,
      dispatch,
      getters,
      rootGetters
    }: ActionContext<State, State>,
    {
      indexCol,
      mode,
      catchError = false
    }: {
      indexCol: number,
      mode: 'before' | 'after' | 'reset',
      catchError: boolean
    }): Promise<boolean | undefined> {
    if (catchError) {
      try {
        return dispatch('refreshColumn', { indexCol, mode, catchError: false })
      } catch (error) {
        Vue.toasted.global.apiError(error)
      }
    }
    if (rootGetters['wait/is'](`column.refreshing.${state.columns[indexCol].id}`)) {
      return
    }
    if (!state.columns[indexCol].displayed) {
      return
    }
    try {
      if (mode === 'reset') {
        commit('resetColumn', { indexCol })
      } else if (getters.getDocumentsIdsByColumnId(indexCol, false).length === 0) {
        mode = 'reset'
      }

      const params = getters.getRefreshParamsByMode(indexCol, mode)

      dispatch('wait/start', `column.refreshing.${state.columns[indexCol].id}`, { root: true })

      const { documents, count } = await afpNews.search(params)

      if (!documents || documents.length === 0) return false

      commit('addDocuments', documents)

      const documentsIds = documents.map(doc => doc.uno)

      switch (mode) {
        case 'reset':
        // falls through
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

      return true
    } finally {
      commit('updateColumnLastUpdated', { indexCol })
      dispatch('wait/end', `column.refreshing.${state.columns[indexCol].id}`, { root: true })
    }
  },
  async refreshAllColumns (
    {
      state,
      dispatch,
      rootGetters
    }: ActionContext<State, State>,
    {
      mode = 'after'
    } = {}): Promise<void> {
    if (rootGetters['wait/is'](`column.refreshing.all`)) {
      return
    }

    try {
      dispatch('wait/start', `column.refreshing.all`, { root: true })
      await Promise.all(
        state.columns.map((_, indexCol) => dispatch('refreshColumn', { indexCol, mode, catchError: false }))
      )
    } catch (error) {
      Vue.toasted.global.apiError(error)
    } finally {
      dispatch('wait/end', `column.refreshing.all`, { root: true })
    }
  },
  async getDocument ({ commit }: ActionContext<State, State>, docId: string): Promise<void> {
    try {
      const document = await afpNews.get(docId)
      commit('addDocuments', [document])
    } catch (error) {
      Vue.toasted.global.apiError(error)
      return Promise.reject(error)
    }
  },
  async changeAllContentLanguage ({ commit }: ActionContext<State, State>, lang: Lang): Promise<void> {
    commit('changeDefaultLang', lang)
    commit('resetAllTopicsColumns')
    commit('resetEmptySearchColumns')

    const topics: Array<{ type: string, params: { topics: string[], langs: Lang[] } }> = config[lang]
      .filter(d => d.value.length > 0)
      .filter((_, i) => i < 3)
      .map(topic => ({
        type: 'topic',
        params: {
          topics: topic.value,
          langs: [lang]
        }
      }))

    commit('insertColumns', { columns: [...topics, {
        type: 'search',
        params: {
          langs: [lang]
        }
      }]
    })
    
    commit('changeDefaultLang', lang)
  },
  resetDefaultLanguage ({ commit }: ActionContext<State, State>): void {
    commit('resetAllColumns')
    commit('changeDefaultLang', null)
  }
}

export default actions
