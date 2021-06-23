import Vue from 'vue'
import { Store } from 'vuex'
import State from '@/store/state'

export const ui = (store: Store<State>): void => {
  store.subscribe(async ({ type, payload }: { type: string, payload: unknown }) => {
    let lastColumn
    switch (type) {
      case 'addColumn':
        await Vue.nextTick()
        lastColumn = document.querySelector('.column:last-of-type')
        if (lastColumn) {
          lastColumn.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })
        }
        break
      case 'updateColumnDisplayed': {
        await Vue.nextTick()
        const params = payload as { displayed: boolean, indexCol: number }
        if (params.displayed === true && Date.now() - store.getters.getColumnByIndex(params.indexCol).lastUpdated > 10000) {
          store.dispatch('refreshColumn', { indexCol: params.indexCol, mode: 'after', catchError: true })
        }
        break
      }
      default:
    }
  })
}
