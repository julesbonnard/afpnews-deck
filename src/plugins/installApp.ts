import store from '../store'
import { event } from 'vue-analytics'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>
  prompt (): Promise<void>
}

let installPrompt: BeforeInstallPromptEvent

// Setup a listener to track Add to Homescreen events.
window.addEventListener('beforeinstallprompt', (evt): void => {
  installPrompt = evt as BeforeInstallPromptEvent
  store.commit('displayInstallApp', true)
  installPrompt.userChoice.then(({ outcome }) => {
    if (outcome === 'accepted') {
      store.commit('displayInstallApp', false)
    }
    event('pwa', 'installation', outcome)
  })
})

window.addEventListener('appinstalled', (_) => {
  event('pwa', 'installation', 'installed')
})

export default () => {
  installPrompt.prompt()
}
