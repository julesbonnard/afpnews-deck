const { pathToFileURL } = require("url")

const path = require('path')

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'dist/service-worker.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'sw.min.js'
  },
  target: 'webworker',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  }
}
