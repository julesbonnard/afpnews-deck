/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { event } from 'vue-analytics'
import store from '@/store'
import Vue from 'vue'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}sw.min.js`, {
    ready () {
      console.log('Service worker is active.')
    },
    registered (registration) {
      console.log('Service worker has been registered.')
    },
    cached (registration) {
      console.log('version has been cached for offline use.')
    },
    updatefound (registration) {
      console.log('New version is downloading.')
    },
    updated (registration) {
      console.log('New version is available; Ask for refresh.')
      Vue.toasted.show('New version available !', {
        action: [
          {
            text: 'Update',
            onClick: () => {
              registration.waiting.postMessage({ command: 'skipWaiting' })
            }
          },
          {
            text: 'Dismiss',
            onClick: (_, toastObject) => {
              toastObject.goAway(0)
            }
          }
        ],
        position: 'bottom-right'
      })
    },
    offline () {
      Vue.toasted.show('No internet connection found. App is running in offline mode.', {
        position: 'bottom-center',
        duration: 1500
      })
    },
    error (error) {
      Vue.toasted.global.error(error)
    }
  })
}

if ('serviceWorker' in navigator) {
  // reload once when the new Service Worker starts activating
  let refreshing
  navigator.serviceWorker.addEventListener('controllerchange',
    async () => {
      if (refreshing) return
      store.commit('clearDocuments')
      event('service-worker', 'controllerchange')
      window.location.reload()
      refreshing = true
    }
  )
}

function getServiceWorkerSupport () {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.controller ? 'controlled' : 'supported'
  } else {
    return 'unsupported'
  }
}

event('service-worker', 'support', getServiceWorkerSupport())
