import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import i18n from '@/plugins/i18n'
// import modernizr from '@/plugins/modernizr'
import '@/plugins/modernizr'
import '@/plugins/touch-gestures'
import '@/plugins/dayjs'
import '@/plugins/vue-analytics'
import '@/registerServiceWorker'
import App from '@/views'

Vue.config.productionTip = false

router.beforeResolve((to, from, next) => {
  // if (to.name !== 'browser-warning' && !modernizr.supportAllFeatures && !from.name) {
  //   return next({ name: 'browser-warning' })
  // }
  if ((!from.name || !['login', 'document', 'about'].includes(from.name)) && to.name === 'deck' && !store.getters.isAuthenticated) {
    return next({ name: 'login' })
  }
  next()
})

store.dispatch('changeLocale', i18n.locale)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
