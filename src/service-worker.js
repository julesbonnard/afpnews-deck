import { registerRoute } from 'workbox-routing'
import { cacheFirst } from 'workbox-strategies'
import { precacheAndRoute } from 'workbox-precaching'
import { setCacheNameDetails } from 'workbox-core'
import * as googleAnalytics from 'workbox-google-analytics'
import { ExpirationPlugin } from 'workbox-expiration'
import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

setCacheNameDetails({ prefix: 'afpnews-deck' })

precacheAndRoute(self.__WB_MANIFEST, {
  ignoreUrlParametersMatching: [/.*/],
  cleanUrls: false
})

registerRoute(
  /^https:\/\/(api|afp-apicore-prod)\.afp\.com\/objects\/api\/medias\?id=.*\.jpg$/,
  cacheFirst({
    cacheName: 'afpnews-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 150,
        maxAgeSeconds: 24 * 60 * 60,
        purgeOnQuotaError: true
      }),
      new BackgroundSyncPlugin('afpnews-images-queue', {
        maxRetentionTime: 5 // Retry for max of 5 minutes
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  }), 'GET'
)

googleAnalytics.initialize()

self.addEventListener('message', event => {
  if (!event.data) {
    return
  }

  const { command, value } = event.data

  switch (command) {
    case 'log':
      console.log(command, value)
      break
    case 'skipWaiting':
      event.waitUntil(self.skipWaiting())
      break
    default:
      // NOOP
      break
  }
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})
