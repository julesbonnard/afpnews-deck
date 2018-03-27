const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const workboxPlugin = require('workbox-webpack-plugin')

const moduleConfig = {
  rules: [
    {
      enforce: 'pre',
      test: /\.(js|vue)$/,
      exclude: /(node_modules|afpnews-api)/,
      use: {
        loader: 'eslint-loader'
      }
    },
    {
      test: /\.vue$/,
      exclude: /node_modules/,
      use: {
        loader: 'vue-loader'
      }
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: path.join('static', 'fonts/[name].[hash:7].[ext]')
      }
    }
  ]
}

const resolveConfig = {
  extensions: ['*', '.js', '.vue', '.json'],
  alias: {
    '@': path.resolve(__dirname, 'src'),
    vue: 'vue/dist/vue.js'
  }
}

const electronConfig = {
  target: 'electron-main',
  node: {
    __dirname: false
  },
  entry: {
    electron: './src/electron-main/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'afpnews-deck.[name].js'
  },
  module: moduleConfig,
  resolve: resolveConfig
}

const webConfig = {
  target: 'web',
  entry: {
    module: './src/index.js',
    web: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'afpnews-deck.[name].js',
    library: 'afpNewsDeck',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  module: moduleConfig,
  resolve: resolveConfig,
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      chunks: ['web']
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new workboxPlugin.InjectManifest({
      swSrc: './src/service-worker.js',
      importWorkboxFrom: 'local',
      swDest: 'service-worker.js'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    // quiet: true,
    hot: true,
    clientLogLevel: 'warning',
    overlay: {
      warnings: true,
      errors: true
    }
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

module.exports = [webConfig, electronConfig]
