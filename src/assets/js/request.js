import axios from 'axios'
import cons from '@/constants'
import Router from '@/router'
import { Toast } from 'vant'

const instance = axios.create({
  baseURL: '',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem(cons.TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  return response
}, function (error) {
  switch (error.response.status) {
    case 401:
      localStorage.removeItem(cons.TOKEN_KEY)
      Toast('登录已过期')
      Router.push({ path: '/login-im' })
      break
    case 500:
      Toast('系统异常')
      break
  }
  return Promise.reject(error)
})

export default instance
