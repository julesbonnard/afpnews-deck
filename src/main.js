import Vue from 'vue'
import store from '@/store'
import App from '@/App'
import { VueHammer } from 'vue2-hammer'

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV !== 'production'
Vue.config.debug = process.env.NODE_ENV !== 'production'
Vue.config.silent = process.env.NODE_ENV !== 'production'

Vue.use(VueHammer)

new Vue({ // eslint-disable-line no-new
  store,
  render: h => h(App)
}).$mount('#app')

const userAgent = navigator.userAgent.toLowerCase()
if (userAgent.indexOf('electron') === -1 && process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration)
        // registration.pushManager.subscribe({userVisibleOnly: true})
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
    })
  }
}
