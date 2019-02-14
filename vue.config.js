const path = require('path')
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')

module.exports = {
  publicPath: '',
  chainWebpack: config => {
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
      new CspHtmlWebpackPlugin({
        'base-uri': '\'self\'',
        'script-src': [
          '\'self\'',
          'https://www.google-analytics.com',
          '\'sha256-+axblPt665IRlhnPI8H7ohkO9V70Bvt3zvnyQ2BXIPg=\'' // Google analytics
        ],
        'img-src': [
          '\'self\'',
          'data:',
          'https://api.afp.com',
          'www.google-analytics.com'
        ],
        'media-src': 'https://api.afp.com',
        'style-src': [
          '\'self\'',
          '\'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=\'', // Vuejs Datepicker
          '\'sha256-tuimSlqijtjN47xs9BNV4mTzgQPywshj/e/EgSVEbqc=\'', // Vuejs Datepicker
          '\'sha256-LpfmXS+4ZtL2uPRZgkoR29Ghbxcfime/CsD/4w5VujE=\'', // Modernizr
          '\'sha256-bgdokNGyQY05oJz5+kIlIeee1kuIGY2mz5UxHRGP4KM=\'' // Modernizr
        ],
        'connect-src': [
          '\'self\'',
          'https://api.afp.com',
          'https://3o3qoiah2e.execute-api.eu-central-1.amazonaws.com'
        ],
        'object-src': '\'none\'',
        'child-src': '\'none\'',
        'worker-src': '\'self\''
      }, {
        enabled: process.env.NODE_ENV === 'production',
        hashingMethod: 'sha256',
        hashEnabled: {
          'script-src': true,
          'style-src': true
        },
        nonceEnabled: {
          'script-src': true,
          'style-src': true
        }
      })
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
