workbox.core.setCacheNameDetails({prefix: 'afpnews-deck'})

workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  ignoreUrlParametersMatching: [/.*/],
  cleanUrls: false
})

workbox.routing.registerRoute(
  /^https:\/\/api\.afp\.com\/objects\/api\/medias\?id=.*\.jpg$/,
  workbox.strategies.cacheFirst({
    cacheName: 'afpnews-assets',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 150,
        maxAgeSeconds: 24 * 60 * 60,
        purgeOnQuotaError: true
      }),
      new workbox.backgroundSync.Plugin('afpnews-assets-queue', {
        maxRetentionTime: 5 // Retry for max of 5 minutes
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  }), 'GET'
)

workbox.googleAnalytics.initialize()

// const { storageKeys, userStore, documentsStore } = require('@/plugins/database')
// const DocumentParser = require('@/plugins/DocumentParser').default

self.addEventListener('message', event => {
  if (!event.data){
    return
  }

  const { command, value } = event.data

  switch (command) {
    case 'log':
      console.log(command, value)
      break
    case 'skipWaiting':
      self.skipWaiting()
      break
    default:
      // NOOP
      break
  }
})

// workbox.routing.registerRoute('https://api.afp.com/v1/api/search', searchDocuments, 'POST')
// workbox.routing.registerRoute(/^https:\/\/api\.afp\.com\/v1\/api\/get\/.*/, getDocument)

// async function searchDocuments ({ url, event, params }) {
//   try {
//     const response = await fetch(event.request)
//     const data = await response.json()
//     const { docs, count } = data.response

//     const parsedDocs = docs.map(doc => new DocumentParser(doc).toObject())

//     Promise.all(parsedDocs.map(doc => documentsStore.setItem(doc.uno, doc)))

//     return generateJson({
//       response: {
//         docs: parsedDocs,
//         count
//       }
//     })
//   } catch (e) {
//     console.error(e)
//     return generateJson({
//       response: {
//         docs: [],
//         count: 0
//       }
//     })
//   }
// }

// async function getDocument ({ url, event, params }) {
//   const urlParts = url.href.split('/')
//   const uno = urlParts.pop()

//   const doc = await documentsStore.getItem(uno)

//   if (!doc) return searchDocuments({ event })

//   return generateJson({
//     response: {
//       docs: [doc],
//       count: 1
//     }
//   })
// }

// function generateJson (body) {
//   return new Response(JSON.stringify(body), {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
// }

// async function broadcastMessage (command, value) {
//   const clients = await self.clients.matchAll()
//   clients.forEach(client => {
//     client.postMessage({
//       command,
//       value
//     })
//   })
// }