import Vue from 'vue'
import { Store } from 'vuex'
import State from '@/store/state'

export const ui = (store: Store<State>): void => {
  store.subscribe(async ({ type, payload }: { type: string, payload: any }) => {
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
      case 'updateColumnDisplayed':
        await Vue.nextTick()
        if (payload.displayed === true && Date.now() - store.getters.getColumnByIndex(payload.indexCol).lastUpdated > 10000) {
          store.dispatch('refreshColumn', { indexCol: payload.indexCol, mode: 'after', catchError: true })
        }
        break
      default:
    }
  })
}
