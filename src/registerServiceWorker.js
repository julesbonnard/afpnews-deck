/* eslint-disable no-console */

import { Workbox } from 'workbox-window'
import { event } from 'vue-analytics'
import store from '@/store'
import Vue from 'vue'

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  const wb = new Workbox(`${process.env.BASE_URL}sw.min.js`)

  wb.addEventListener('activated', (event) => {
    if (!event.isUpdate) {
      Vue.toasted.show('The app is now available offline !')
      event('service-worker', 'new-activation')
    } else {
      Vue.toasted.show('The app has been updated')
      store.commit('clearDocuments')
      event('service-worker', 'update')
    }
  })

  wb.addEventListener('waiting', () => {
    console.log('New version is available; Ask for refresh.')
    Vue.toasted.show('New version available !', {
      action: [
        {
          text: 'Update',
          onClick: () => {
            wb.addEventListener('controlling', () => {
              window.location.reload()
            })
            wb.messageSkipWaiting()
          }
        }
      ],
      position: 'bottom-right'
    })
  })

  wb.register()
}

function getServiceWorkerSupport () {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.controller ? 'controlled' : 'supported'
  } else {
    return 'unsupported'
  }
}

event('service-worker', 'support', getServiceWorkerSupport())
