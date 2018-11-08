workbox.core.setCacheNameDetails({prefix: 'afpnews-deck'})

workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  ignoreUrlParametersMatching: [/.*/],
  cleanUrls: false
})

workbox.routing.registerRoute(
  /^https:\/\/api.afp.com\/objects\/api\/medias\?id=.*\.jpg$/,
  workbox.strategies.cacheFirst({
    cacheName: 'afpnews-assets',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60,
        purgeOnQuotaError: true
      }),
      new workbox.backgroundSync.Plugin('afpnews-assets-queue', {
        maxRetentionTime: 5 // Retry for max of 5 minutes
      })
    ]
  }), 'GET'
)

workbox.googleAnalytics.initialize()

const { storageKeys, userStore, documentsStore } = require('@/plugins/database')
const DocumentParser = require('@/plugins/DocumentParser').default

self.addEventListener('message', event => {
  if (!event.data){
    return
  }

  switch (event.data) {
    case 'skipWaiting':
      self.skipWaiting()
      break
    default:
      // NOOP
      break
  }
})

self.addEventListener('activate', event => {
  console.log('activate', event)
})

function searchDocuments (event) {
  event.respondWith(
    fetch(event.request)
      .then(result => result.json())
      .then(result => {
        if (!result.response.docs) return []
        return result.response.docs.map(doc => new DocumentParser(doc).toObject())
      })
      .then(documents => {
        Promise.all(documents.map(doc => documentsStore.setItem(doc.uno, doc)))
        return documents
      })
      .then(documents => ({
        response: {
          docs: documents,
          numFound: documents.length
        }
      }))
      .then(body => new Response(JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
      .catch(error => {
        console.error(event.request.url, error)
        return new Response(JSON.stringify({
          response: {
            docs: [],
            numFound: 0
          }
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      })
  )
}

function getDocument (event) {
  const urlParts = event.request.url.split('/')
  const uno = urlParts.pop()
  event.respondWith(
    documentsStore.getItem(uno)
      .then(doc => {
        if (!doc) return Promise.reject('No document in local database')
        return doc
      })
      .then(doc => ({
        response: {
          docs: [doc],
          numFound: 1
        }
      }))
      .then(body => new Response(JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
      .catch(error => {
        return searchDocuments(event)
      })
  )
}

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith('https://api.afp.com/v1/api/search')) {
    searchDocuments(event)
  } else if (event.request.url.startsWith('https://api.afp.com/v1/api/get')) {
    getDocument(event)
  }
})
