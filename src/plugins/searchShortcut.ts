import router from '@/router'
import store from '@/store'
import { RawLocation } from 'vue-router'

router.beforeEach((to, from, next) => {
  if (to.query.q) {
    store.commit('addColumn', {
      params: {
        query: to.query.q
      }
    })
    return next({
      ...to,
      query: {
        ...to.query,
        q: undefined
      },
      replace: true
    } as RawLocation)
  }
  next()
})
