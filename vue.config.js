const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


const __STG__ = process.env.ENV === 'stg'
const __DEV__ = process.env.ENV === 'dev'
const __PRD__ = process.env.ENV === 'prd'

console.log('__STG__ :>> ', __STG__);
console.log('__DEV__ :>> ', __DEV__);
console.log('__PRD__ :>> ', __PRD__);

module.exports = {
  publicPath: './',
  devServer: {
    contentBase: path.join(__dirname, '/'),
    compress: true,
    open: true,
    port: 9000,
    proxy: {
      '/static': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      }
    },
    watchOptions: { // 监听配置：
      ignored: [/node_modules/], // 忽略哪些文件
    }
  },
  chainWebpack: config => {
    config.plugin('html') // 打包基础html文件
      .tap(args => {
        args[0].template = path.join(__dirname, 'index.html')
        return args
      })
    config.module // 全局引入less变量
      .rule('less')
      .oneOf('vue')
      .use('style-resource')
      .loader('style-resources-loader')
      .options({
        patterns: [ path.resolve(__dirname, './src/assets/style/base.less') ]
      })
  },
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin({analyzerMode: 'disabled'}), // 包体积分析
      new CopyWebpackPlugin({ // 生产去除vconsole文件
        patterns: [
        { from: 'src/lib/fastclick.js', to: 'lib'},
        { from: 'src/lib/vconsole.min.js', to: 'lib'}
      ].filter(val => {
          if (__STG__ || __DEV__) {
            return val
          } else if (__PRD__ && /fastclick/.test(val.from)){
            return val
          }
        })
      }),
      new webpack.ProvidePlugin({ // 全局lodash
        _: 'lodash'
      }),
      new webpack.DefinePlugin({ // 定义全局常量
        __DEV__: JSON.stringify(__DEV__),
        __STG__: JSON.stringify(__STG__),
        __PRD__: JSON.stringify(__PRD__)
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/) // 去除moment国际化代码
    ]
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*']
          })
        ]
      }
    }
  }
}
