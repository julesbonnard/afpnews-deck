/* eslint-disable no-console */
import { event } from 'vue-analytics'
import store, { initStore } from '@/store'
import Vue from 'vue'

async function init () {
  const { Workbox } = await import('workbox-window')
  const wb = new Workbox(`${process.env.BASE_URL}sw.min.js`)

  wb.addEventListener('activated', ({ isUpdate }) => {
    if (!isUpdate) {
      Vue.toasted.show('The app is now available offline !', {
        position: 'bottom-center',
        duration: 1500,
        type: 'info'
      })
      event('service-worker', 'new-activation')
    } else {
      Vue.toasted.show('The app has been updated', {
        position: 'bottom-center',
        duration: 1500,
        type: 'info'
      })
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
      position: 'bottom-center'
    })
  })

  wb.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SYNC_DONE') {
      console.log('SYNC_DONE')
      initStore()
    }
  })

  wb.register()
}

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  init()
}
