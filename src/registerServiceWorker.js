/* eslint-disable no-console */

import { register } from 'register-service-worker'
import store from '@/store'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}sw.min.js`, {
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
        registration.waiting.postMessage({ command: 'skipWaiting' })
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
      store.commit('clearDocuments')
      window.location.reload()
    }
  )

  // set up broadcast from service worker

  // navigator.serviceWorker.onmessage = event => {
  //   if (!event.data) return

  //   const { command, value } = event.data

  //   switch (command) {
  //     case 'log':
  //       console.log(command, value)
  //       break
  //     default:
  //   }
  // }
}
