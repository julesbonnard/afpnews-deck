import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import '@/plugins/touch-gestures'
import '@/plugins/register-sw'
import App from '@/pages'

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV !== 'production'
Vue.config.debug = process.env.NODE_ENV !== 'production'
Vue.config.silent = process.env.NODE_ENV !== 'production'

new Vue({ // eslint-disable-line no-new
  store,
  router,
  render: h => h(App)
}).$mount('#app')
