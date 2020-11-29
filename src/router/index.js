import Vue from 'vue'
import VueRouter from 'vue-router'
import cons from '@/constants'
import Store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/login-im',
    name: 'ImLogin',
    meta: {
      backflag: true, // 判断安卓返回键跳转路由还是退出APP
      tp: false // 是否是带有tabBar的页面
    },
    component: () => import('../views/login-im')
  },
  {
    path: '/im-layout',
    name: 'ImLayout',
    component: () => import('../components/im-layout'),
    children: [
      {
        path: '/im-layout/room-im',
        name: 'ImRoom',
        meta: {
          index: 1,
          backflag: true,
          tp: true
        },
        component: () => import('../views/room-im')
      },
      {
        path: '/im-layout/contact-im',
        name: 'ImContact',
        meta: {
          index: 1,
          backflag: false,
          tp: true
        },
        component: () => import('../views/contact-im')
      },
      {
        path: '/im-layout/mine-im',
        name: 'ImMine',
        meta: {
          index: 1,
          backflag: false,
          tp: true
        },
        component: () => import('../views/mine-im')
      },
      {
        path: '/im-layout/chat-im/:id',
        name: 'ImChat',
        meta: {
          index: 2,
          backflag: false,
          tp: false
        },
        component: () => import('../views/chat-im')
      },
      {
        path: '/im-layout/add-friend',
        name: 'AddFriend',
        meta: {
          index: 2,
          backflag: false,
          tp: false,
          title: '新的朋友'
        },
        component: () => import('../views/add-friend')
      }
    ]
  },
  {
    path: '/',
    redirect: '/im-layout/room-im'
  },
  {
    path: '*',
    redirect: '/im-layout/room-im'
  }]
})

const whiteList = ['/login-im']

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem(cons.TOKEN_KEY)
  if (token) { // 本地存在token
    if (to.path === '/login-im') {
      next('/im-layout/room-im')
    } else {
      next()
    }
  } else {
    if (~whiteList.indexOf(to.path)) {
      next()
    } else {
      if (Store.state.socket.socket) {
        Store.state.socket.socket.close() // 异常跳转登录，断开socket连接
      }
      next(`/login-im?redirect=${to.fullPath}`)
    }
  }
})

export default router
