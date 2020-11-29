/**
 * 自定义事件对象
 */
import Vue from 'vue'

const store = new Vue()

Vue.prototype.$bus = store

export default store
