
import io from 'socket.io-client'
import cons from '@/constants'
import Bus from '@/assets/js/bus'

const state = () => ({
  socket: null
})

const mutations = {
  SET_SOCKET (state, socket) {
    state.socket = socket
  }
}

const actions = {
  createSocket ({ dispatch, commit, state }, data) {
    const socketio = io(cons.url.PREFIX, {
      transports: ['websocket'],
      query: {
        token: localStorage.getItem(cons.TOKEN_KEY),
        isRegister: (data && data.isRegister) || false // 是否第一次注册,服务端连接成功后发送一条注册成功消息
      },
      reconnection: true,
      reconnectionAttempts: 2
    })
    socketio.on('connect', () => {
      console.log('socket连接状态success ')
      if (socketio.io.opts.query.isRegister) { // 连接成功清除注册标识
        socketio.io.opts.query.isRegister = false
      }
    })
    socketio.on('message', (data) => {
      console.log('收到socket消息', data)
      socketio.emit('ack', { uuid: data.uuid })
      switch (data.type) {
        case 0: {
          if (data.cmd === 1) { // 欢迎语
            const item = {
              roomId: data.roomId,
              lastMsgTime: data.sendTime,
              lastMsg: data.content,
              name: data.from,
              nickname: data.nickname,
              isTop: 0,
              unReadNum: 1
            }
            dispatch('room/addRoom', { item: item }, { root: true })
          } else if (data.cmd === 2) { // 加人成功消息
            const { roomId, lastMsgTime, lastMsg, name } = data
            const item = {
              roomId,
              lastMsgTime,
              lastMsg,
              name,
              nickname: null,
              isTop: 0,
              unReadNum: 1
            }
            dispatch('room/addRoom', { item: item }, { root: true })
          }
          break
        }
        case 1:
          Bus.$emit('accept-socket-message', data); break // 文本消息
        case 2:
          if (state.socket.id !== data.sendSocketId) { // 自己发送的图片不处理
            Bus.$emit('accept-socket-message', data); break // 图片消息
          }
      }
    })
    socketio.on('connect_error', () => {
      console.log('socket连接状态connect_error :>> ')
    })
    socketio.on('disconnect', (data) => {
      console.log('socket连接状态disconnect :>> ')
    })
    socketio.on('connect_timeout', () => {
      console.log('socket连接状态connect_timeout :>> ')
    })
    socketio.on('reconnect', () => {
      console.log('socket连接状态reconnect :>> ')
    })
    socketio.on('reconnect_attempt', () => {
      console.log('socket连接状态reconnect_attempt :>> ')
    })
    socketio.on('reconnecting', () => {
      console.log('socket连接状态reconnecting :>> ')
    })
    socketio.on('reconnect_error', () => {
      console.log('socket连接状态reconnect_error :>> ')
    })
    socketio.on('reconnect_failed', () => {
      console.log('socket连接状态reconnect_failed :>> ')
    })
    commit('SET_SOCKET', socketio)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
