const path = require('path')

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

  css: {
    sourceMap: true
  },

  lintOnSave: true,

  pluginOptions: {
    i18n: {
      localeDir: 'locales'
    }
  }
}
