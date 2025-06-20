const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/,
        threshold: 10240,
        deleteOriginalAssets: false
      })
    ]
  },
  devServer:{
    port:8015,
    proxy: {
      '/api': {
        target: 'http://localhost:9001',
        ws: true,
        changeOrigin: true,
        pathRewrite:{
          '^/api':''
        }
      },
    },
  },
  publicPath:'./'
}
