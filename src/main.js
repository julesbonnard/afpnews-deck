import Vue from 'vue'
import store from '@/store'
import App from '@/App'

Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  store,
  render: h => h(App)
}).$mount('#app')

const userAgent = navigator.userAgent.toLowerCase()
if (userAgent.indexOf(' electron/') === -1) {
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
