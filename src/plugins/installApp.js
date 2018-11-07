import { event } from 'vue-analytics'
import store from '@/store'

let installPrompt

// Setup a listener to track Add to Homescreen events.
window.addEventListener('beforeinstallprompt', e => {
  installPrompt = e
  store.commit('displayInstallApp', true)
  e.userChoice.then(choiceResult => {
    if (choiceResult.outcome === 'accepted') {
      store.commit('displayInstallApp', false)
    }
    event('pwa', 'installprompt', choiceResult.outcome)
  })
})

export default () => {
  installPrompt.prompt()
}
