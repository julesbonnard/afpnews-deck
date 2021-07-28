import { precacheAndRoute } from 'workbox-precaching'
import { setCacheNameDetails } from 'workbox-core'
import * as googleAnalytics from 'workbox-google-analytics'

setCacheNameDetails({ prefix: 'afpnews-deck' })

precacheAndRoute(self.__WB_MANIFEST, {
  ignoreUrlParametersMatching: [/.*/],
  cleanUrls: false
})

googleAnalytics.initialize()

addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting())
  }
})

addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
