import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import i18n from '@/plugins/i18n'
import '@/plugins/touch-gestures'
import '@/plugins/dayjs'
import '@/registerServiceWorker'
import App from '@/views'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
