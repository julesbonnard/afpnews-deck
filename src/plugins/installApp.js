import { event } from 'vue-analytics'
import Vue from 'vue'

const InstallApp = {
  install: vm => {
    vm.prototype.$installApp = null

    // Setup a listener to track Add to Homescreen events.
    window.addEventListener('beforeinstallprompt', e => {
      vm.prototype.$installApp = e
      e.userChoice.then(choiceResult => {
        vm.prototype.$installApp = null
        event('pwa', 'installprompt', choiceResult.outcome)
      })
    })
  }
}

Vue.use(InstallApp)
