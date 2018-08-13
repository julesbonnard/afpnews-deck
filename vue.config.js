module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' && !process.env.IS_ELECTRON ? '' : '/', // Allow app to be run in relative path

  chainWebpack: config => {
    config.module.rule('js').include.add(/\/node_modules\/afpnews-api/) // Fix "babel class constructor cannot be invoked without new" problem
    return config
  },

  css: {
    sourceMap: true
  },

  lintOnSave: undefined,

  pwa: {
    name: 'AFP Deck',
    themeColor: '#243447',
    msTileColor: '#243447',
    workboxOptions: {
      importWorkboxFrom: 'local',
      runtimeCaching: [{
        urlPattern: new RegExp('https://api.afp.com/objects/'),
        handler: 'staleWhileRevalidate',
        options: {
          cacheName: 'afpnews-assets',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60
          }
        }
      }]
    }
  },

  pluginOptions: {
    electronBuilder: {
      chainWebpackRendererProcess: config => {
        config.plugin('define').tap(args => {
          args[0]['IS_ELECTRON'] = true // Set env variable for Electron
          return args
        })
        return config
      }
    },
    i18n: {
      locale: 'fr',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}