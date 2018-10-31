const path = require('path')

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' && !process.env.IS_ELECTRON ? '' : '/', // Allow app to be run in relative path

  chainWebpack: config => {
    // Fix "babel class constructor cannot be invoked without new" problem
    config.module
      .rule('js-transform-class')
      .include
        .add(/\/node_modules\/afpnews-api/)
        .end()
      .use('babel-loader')
        .loader('babel-loader')

    config.module
      .rule('modernizr')
      .test(/\.modernizrrc(\.json)?$/)
      .use('modernizr-loader')
        .loader('modernizr-loader')
        .end()
      .use('json-loader')
        .loader('json-loader')

    config.resolve.alias
      .set('modernizr$', path.resolve(__dirname, '.modernizrrc'))

    return config
  },

  css: {
    sourceMap: true
  },

  lintOnSave: true,

  pwa: {
    name: 'AFP Deck',
    themeColor: '#243447',
    msTileColor: '#243447',
    workboxPluginMode: 'InjectManifest',
    manifestPath: 'manifest.json?version=1',
    workboxOptions: {
      swSrc: path.resolve(__dirname, 'src/service-worker.js'),
      importWorkboxFrom: 'local'
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
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}