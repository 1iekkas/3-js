const webpack = require('webpack');
const path = require('path')


function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = process.env.port || process.env.npm_config_port || 8080
const name = 'vue Element Admin' // page title
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  runtimeCompiler: false,
  productionSourceMap: true,
  configureWebpack: {
    devtool: 'source-map',
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    /* module: {
      rules: [{test:/\.(jpg|png|jpeg|gif)$/,loader:"url-loader"}]
    } */
    /* plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        },
        sourceMap: false,
        parallel: true
      }),
      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ] */
  },
  devServer: {
    overlay: {
      warning: false,
      errors: false
    },
    host: '0.0.0.0',
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '^/dev-api': {
        // target: 'http://local.platform.cn',//'http://192.168.11.92:82', //192.168.11.92:82'http://192.168.11.114/market/public/index.php', // market.d1-zhan.com
        target:'http://test.xhdj.customize.d1-zhan.com/', 
        pathRewrite: { '^/dev-api': '' },
        secure: false
      },
      '^/dev-host-resource': {
        target: 'http://test.resource.jinduo.com',
        pathRewrite: { '^/dev-host-resource': '' },
        secure: false
      },
      '^/dev-host-upload': {
        target: 'http://test.upload.jinduo.com',
        pathRewrite: { '^/dev-host-upload': '' },
        secure: false
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: [
        path.resolve(__dirname, './src/assets/styles/*.scss')      //你的.scss文件所在目录
      ]
    }
  }
}