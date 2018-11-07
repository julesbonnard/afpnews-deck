import Vue from 'vue'
import '@/plugins/meta'
import router from '@/router'
import '@/plugins/analytics'
import store from '@/store'
import i18n from '@/plugins/i18n'
// import modernizr from '@/plugins/modernizr'
import '@/plugins/modernizr'
import '@/plugins/touchGestures'
import '@/plugins/installApp'
import '@/plugins/dayjs'
import wait from '@/plugins/wait'
import '@/registerServiceWorker'
import App from '@/views'

Vue.config.productionTip = false

let shouldLoadPreferences = true

router.beforeEach(async (to, from, next) => {
  if (shouldLoadPreferences) {
    shouldLoadPreferences = false
    await store.dispatch('initCredentials')
    await store.dispatch('initToken')
    await store.dispatch('resurrectDocuments')
    await store.dispatch('resurrectColumns')
    await store.dispatch('initPreferences')
  }
  if (to.name === 'document') {
    if (!store.getters.getDocumentById(to.params.docId)) {
      try {
        await store.dispatch('getDocument', to.params.docId)
      } catch (error) {
        return next({ name: 'login', query: { redirect: `doc/${to.params.docId}` } })
      }
    }
    next()
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

new Vue({
  router,
  store,
  i18n,
  wait,
  render: h => h(App)
}).$mount('#app')
