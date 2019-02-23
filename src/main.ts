import Vue from 'vue'
import '@/plugins/meta'
import '@/plugins/toasted'
import router from '@/router'
import '@/plugins/analytics'
import store, { initStore } from '@/store'
import i18n from '@/plugins/i18n'
// import modernizr from '@/plugins/modernizr'
import '@/plugins/modernizr'
import '@/plugins/touchGestures'
import '@/plugins/installApp'
import '@/plugins/dayjs'
import wait from '@/plugins/wait'
import '@/registerServiceWorker'
import App from '@/views/index.vue'

Vue.config.productionTip = false

Vue.config.errorHandler = (err: Error) => {
  Vue.toasted.global.error(err)
}

Vue.config.warnHandler = (message: string) => {
  Vue.toasted.global.warn(message)
}

router.beforeEach(async (to, _, next) => {
  if (to.name === 'document') {
    if (!store.getters.getDocumentById(to.params.docId)) {
      try {
        await store.dispatch('getDocument', to.params.docId)
      } catch (error) {
        if (store.state.authType !== 'credentials') {
          return next({ name: 'login', query: { redirect: `doc/${to.params.docId}` } })
        }
        return next({ name: 'deck' })
      }
    }
  }
  next()
})

router.beforeResolve((to, from, next) => {
  // if (to.name !== 'browser-warning' && !modernizr.supportAllFeatures && !from.name) {
  //   return next({ name: 'browser-warning' })
  // }
  if ((!from.name || !['login', 'tour', 'document', 'about'].includes(from.name)) && to.name === 'deck' && !store.getters.isAuthenticated) {
    return next({ name: 'login' })
  }
  if ((!from.name || !['tour', 'document', 'about'].includes(from.name)) && to.name === 'deck' && store.state.wantTour) {
    return next({ name: 'tour' })
  }
  next()
})

store.dispatch('changeLocale', i18n.locale)

function init () {
  new Vue({
    router,
    store,
    i18n,
    wait,
    render: h => h(App)
  }).$mount('#app')
}

initStore().then(init)
