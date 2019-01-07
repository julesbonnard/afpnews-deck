const path = require('path')

module.exports = {
  baseUrl: '',
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
    manifestPath: 'manifest.json?version=3',
    workboxOptions: {
      swSrc: path.resolve(__dirname, 'src/service-worker.js'),
      importWorkboxFrom: 'local',
      exclude: ['robots.txt', /google.*\.html$/, 'CNAME']
    },
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    assetsVersion: 1
  },

  pluginOptions: {
    i18n: {
      localeDir: 'locales'
    }
  }
}
