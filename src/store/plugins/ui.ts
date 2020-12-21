import Vue from 'vue'
import { Store } from 'vuex'
import State from '@/store/state'

export const ui = (store: Store<State>): void => {
  store.subscribe(async ({ type }: { type: string }) => {
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
      default:
    }
  })
}
