import Vue from 'vue'

export const ui = store => {
  store.subscribe(async ({ type, payload }, state) => {
    switch (type) {
      case 'addColumn':
        await Vue.nextTick()
        const lastColumn = document.querySelector('.column:last-of-type')
        if (lastColumn) {
          lastColumn.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
        break
      default:
    }
  })
}
