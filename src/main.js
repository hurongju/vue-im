import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'
import store from './store'
import 'amfe-flexible'
import './assets/js/bus'
import lazyload from './plugins/lazy-load'
import format from '@/filters/format'
import './assets/iconfont/iconfont.css'

Vue.use(lazyload, {
  placeholder: require('./assets/img/placeholder.png'), // 占位图，防止聊天页面加载图片页面高度明显抖动
  debug: true // 是否开启缓存图片打印log，生产关闭
})

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.filter('format', format)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
