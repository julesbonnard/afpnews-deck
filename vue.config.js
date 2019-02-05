const path = require('path')
// const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')

module.exports = {
  baseUrl: '',
  chainWebpack: config => {
    config.entry('app')
      .clear()
      .add('./src/main.js')

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

  configureWebpack: {
    plugins: [
      // new CspHtmlWebpackPlugin({
      //   'base-uri': '\'self\'',
      //   'script-src': ['\'self\'', '\'unsafe-eval\'', 'https://www.google-analytics.com'],
      //   'img-src': ['\'self\'', 'data:', 'https://api.afp.com', 'www.google-analytics.com'],
      //   'media-src': 'https://api.afp.com',
      //   'style-src': ['\'self\'', '\'unsafe-inline\''],
      //   'connect-src': ['\'self\'', 'https://api.afp.com', 'https://3o3qoiah2e.execute-api.eu-central-1.amazonaws.com'],
      //   'object-src': '\'none\'',
      //   'child-src': '\'none\'',
      //   'worker-src': '\'self\''
      // })
    ]
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
