const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const workboxPlugin = require('workbox-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const moduleConfig = env => ({
  rules: [
    {
      enforce: 'pre',
      test: /\.(js|vue)$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    },
    {
      test: /\.vue$/,
      exclude: /node_modules/,
      loader: 'vue-loader'
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [
        env.NODE_ENV !== 'production' ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    },
    {
      test: /\.css$/,
      use: [
        env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader'
      ]
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: path.join('static', 'fonts/[name].[hash:7].[ext]')
      }
    },
    {
      test: /\.(jpg|png)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 25000,
          name: path.join('static', 'img/[name].[hash:7].[ext]')
        }
      }
    }
  ]
})

const resolveConfig = env => ({
  extensions: ['*', '.js', '.vue', '.json'],
  alias: {
    '@': path.resolve(__dirname, 'src'),
    vue: 'vue/dist/vue.js'
  }
})

const electronConfig = env => ({
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
  module: moduleConfig(env),
  resolve: resolveConfig(env),
  plugins: [
    new MiniCssExtractPlugin({
      filename: env.NODE_ENV !== 'production' ? '[name].css' : '[name].[hash].css',
      chunkFilename: env.NODE_ENV !== 'production' ? '[id].css' : '[id].[hash].css',
    })
  ]
})

const webConfig = env => ({
  target: 'web',
  entry: {
    web: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'afpnews-deck.[name].js',
    library: 'afpNewsDeck',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  module: moduleConfig(env),
  resolve: resolveConfig(env),
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './index.html',
      excludeChunks: ['electron']
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: env.NODE_ENV !== 'production' ? '[name].css' : '[name].[hash].css',
      chunkFilename: env.NODE_ENV !== 'production' ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new CopyWebpackPlugin(['static']),
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
})

module.exports = env => ([webConfig(env), electronConfig(env)])
