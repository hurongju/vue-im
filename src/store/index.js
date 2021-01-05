import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import chat from './modules/chat'
import socket from './modules/socket'
import room from './modules/room'
import env from './modules/env'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const u = navigator.userAgent
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端

const store = new Vuex.Store({
  state: {
    title: '',
    defaultAvatar: require('@/assets/img/avatar.png') // 默认头像
  },
  modules: {
    user,
    chat,
    room,
    socket,
    env
  },
  getters: {
    isAndroid: state => state.env.isAndroid,
    isIOS: state => state.env.isIOS,
    username: state => state.user.username,
    avatarUrl: state => state.user.avatarUrl,
    messageList: state => state.chat.messageList,
    socket: state => state.socket.socket,
    roomList: state => state.room.roomList,
    expiredRoomIdList: state => state.room.expiredRoomIdList,
    activeRoomId: state => state.room.activeRoomId,
    title: state => state.title,
    totalUnReadNum: state => { // 总消息未读数
      let num = 0
      state.room.roomList.forEach(val => {
        num += val.unReadNum
      })
      return num
    },
    isExpired: state => { // 会话是否被删除(被好友删除的本地会话)
      return state.room.expiredRoomIdList.indexOf(state.room.activeRoomId) > -1
    }
  },
  mutations: {
    SET_TITLE (state, data) {
      state.title = data
    }
  },
  plugins: [createPersistedState({
    paths: ['room.roomList', 'user.username', 'user.avatarUrl', 'room.activeRoomId', 'title', 'totalUnReadNum', 'room.expiredRoomIdList']
  })]
})

store.commit('env/SET_DEVICE', { isAndroid, isIOS })

export default store
