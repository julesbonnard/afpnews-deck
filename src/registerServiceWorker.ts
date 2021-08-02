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
      if (event.data.payload > 0) {
        updateStoreWithSyncData(event.data.payload)
      }
    }
    if (event.data && event.data.type === 'SYNC_AVAILABLE') {
      askForNotificationPermission()
    }
  })

  wb.register()
}

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  init()
}

async function askForNotificationPermission () {
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          new Notification(`Thanks`, {
            icon: 'https://afpdeck.app/img/icons/64x64.png',
            body: `You'll be periodically notified when new content is synced in the background`
        })
      }
    }
  }
}

async function updateStoreWithSyncData (payload: number) {
  await initStore()
  if ('Notification' in window) {
    if (Notification.permission !== 'denied') {
      const note = new Notification(`${payload} new items`, {
        icon: '/img/icons/64x64.png',
        body: `Click to see what's new on AFP Deck`
      })
      note.onclick = function(e) {
          e.preventDefault()
          window.focus()
          note.close()
      }
    }
  }
}
