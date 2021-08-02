import { precacheAndRoute } from 'workbox-precaching'
import { setCacheNameDetails } from 'workbox-core'
import * as googleAnalytics from 'workbox-google-analytics'
import { storageKeys, userStore, documentsStore } from '@/plugins/database'
import AfpNews from 'afpnews-api'

setCacheNameDetails({ prefix: 'afpnews-deck' })

precacheAndRoute(self.__WB_MANIFEST, {
  ignoreUrlParametersMatching: [/.*/],
  cleanUrls: false
})

googleAnalytics.initialize()

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting())
  }
})

if ('periodicSync' in self.registration) {
  const afpNews = new AfpNews({
    baseUrl: 'https://afp-apicore-prod.afp.com',
    customAuthUrl: 'https://3o3qoiah2e.execute-api.eu-central-1.amazonaws.com/apicore',
    saveToken: async token => {
      if (token.authType === 'credentials') {
        await userStore.setItem(storageKeys.token, token)
      } else {
        await userStore.removeItem(storageKeys.token)
      }
    }
  })

  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'COLUMN_SYNC') {
      event.waitUntil((async () => {
        const token = await userStore.getItem(storageKeys.token)
        if (token) afpNews.token = token
        const columns = await userStore.getItem(storageKeys.columns) || []
        const results = await Promise.all(columns.map(column => refreshColumn(column)))
        const newDocumentsCount = results.reduce((acc, cur) => { return acc + cur.count }, 0)
        console.log(`${newDocumentsCount} synced in the background`)
        const refreshedColumns = results.map(result => result.column)
        await userStore.setItem(storageKeys.columns, refreshedColumns)
        sendMessage('SYNC_DONE', newDocumentsCount)
      })())
    }
  })

  async function refreshColumn (column) {
    const lastUpdated = new Date(column.lastUpdated)
    lastUpdated.setSeconds(lastUpdated.getSeconds() + 1)
    const params = {
      ...column.params,
      dateFrom: lastUpdated.toISOString()
    }
    const { documents, count } = await afpNews.search(params)
    if (!documents || documents.length === 0) return { column, count: 0 }
    await documentsStore.setItems(documents.map(doc => ({
      key: doc.uno,
      value: doc
    })))
    const documentsIds = documents.map(doc => doc.uno)
    if (count > documents.length) {
      documentsIds.push(`documents-gap|${+new Date()}|${count - documents.length}`)
    }
    const existingDocumentsIds = column.documentsIds
    const firstExistingDocIndex = existingDocumentsIds.findIndex(d => !d.includes('documents-gap'))
    if (firstExistingDocIndex > 0) {
      existingDocumentsIds.splice(0, firstExistingDocIndex)
    }
    column.documentsIds = [...new Set(documentsIds.concat(existingDocumentsIds))]
    column.lastUpdated = Date.now()
    return { column, count }
  }

  async function registerPeriodicSync (tag) {
    const status = await self.navigator.permissions.query({
      name: 'periodic-background-sync',
    })
  
    if (status.state === 'granted') {
      const tags = await self.registration.periodicSync.getTags()
      if (tags.includes(tag)) {
        console.log(`Already registered for periodic background sync with tag`, tag)
      } else {
        try {
          await self.registration.periodicSync.register(tag, {
            minInterval: 6 * 60 * 60 * 1000,
          })
          console.log(`Registered for periodic background sync with tag`, tag)
        } catch (error) {
          console.error(`Periodic background sync permission is 'granted but something went wrong:`, error)
        }
      }
    } else {
      console.info(`Periodic background sync permission is not 'granted', so skipping registration.`)
    }
  }

  registerPeriodicSync('COLUMN_SYNC')
} else {
  console.log(`Periodic background sync is not available in this browser.`)
}

function sendMessage (type, payload) {
  self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clients) => {
    if (clients && clients.length) {
      clients[0].postMessage({
        type,
        payload
      });
    }
  })
}