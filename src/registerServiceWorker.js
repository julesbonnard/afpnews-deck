/* eslint-disable no-console */

import { register } from 'register-service-worker'
import store from '@/store'
import { event } from 'vue-analytics'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log('Service worker is active.')
    },
    registered (registration) {
      console.log('Service worker has been registered.')
    },
    cached (registration) {
      console.log('Content has been cached for offline use.')
    },
    updatefound (registration) {
      console.log('New content is downloading.')
    },
    updated (registration) {
      console.log('New content is available; Ask for refresh.')
      if (window.confirm('New version available! OK to refresh?')) {
        registration.waiting.postMessage('skipWaiting')
      }
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}

if ('serviceWorker' in navigator) {
  // reload once when the new Service Worker starts activating
  var refreshing
  navigator.serviceWorker.addEventListener('controllerchange',
    async () => {
      if (refreshing) return
      refreshing = true
      await store.dispatch('clearDocuments')
      window.location.reload()
    }
  )
}

// Setup a listener to track Add to Homescreen events.
window.addEventListener('beforeinstallprompt', e => {
  e.userChoice.then(choiceResult => {
    event('PWA', 'Installation', choiceResult.outcome)
  })
})
