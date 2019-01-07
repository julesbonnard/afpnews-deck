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
