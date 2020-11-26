import Vue from 'vue'
import { Store } from 'vuex'
import State from '@/store/state'

export const ui = (store: Store<State>) => {
  store.subscribe(async ({ type }: { type: string }, state: State) => {
    // switch (type) {
    //   case 'addColumn':
    //     await Vue.nextTick()
    //     const lastColumn = document.querySelector('.column:last-of-type')
    //     if (lastColumn) {
    //       lastColumn.scrollIntoView({
    //         behavior: 'smooth',
    //         block: 'end'
    //       })
    //     }
    //     break
    //   default:
    // }
  })
}
