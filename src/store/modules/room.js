import {
  addRoom,
  getRoomList,
  setRoomList,
  updateUnReadMsg,
  updateLastMsg,
  removeRoom,
  getExpiredRoomIdList,
  addExpiredRoomIdList,
  removeExpiredRoomIdList
} from '@/assets/js/room'

const state = () => ({
  roomList: [], // 会话列表
  activeRoomId: null, // 当前聊天页房间ID
  expiredRoomIdList: [] // 过期会话ID列表(被删除好友的会话)
})

const mutations = {
  SET_ROOM_LIST (state, data) {
    state.roomList = data
  },
  SET_ACTIVE_ROOM_ID (state, data) {
    state.activeRoomId = data
  },
  SET_EXPIRED_ROOM_ID_LIST (state, data) {
    state.expiredRoomIdList = data
  }
}

const actions = {
  addRoom ({ commit, rootGetters }, { item }) { // 创建房间(会话)
    addRoom(rootGetters.username, item)
    commit('SET_ROOM_LIST', getRoomList(rootGetters.username))
  },
  removeRoom ({ commit, rootGetters }, { roomId }) { // 删除房间(会话)
    removeRoom(rootGetters.username, roomId)
    commit('SET_ROOM_LIST', getRoomList(rootGetters.username))
  },
  getRoomList ({ commit, rootGetters }) { // 获取房间列表
    commit('SET_ROOM_LIST', getRoomList(rootGetters.username))
    commit('SET_EXPIRED_ROOM_ID_LIST', getExpiredRoomIdList(rootGetters.username))
  },
  setRoomList ({ commit, rootGetters }, data) { // 设置房间列表
    setRoomList(rootGetters.username, data)
    commit('SET_ROOM_LIST', getRoomList(rootGetters.username))
  },
  updateUnReadMsg ({ commit, rootGetters }, { num, roomId, type }) { // 房间消息已读
    updateUnReadMsg(rootGetters.username, num || 0, roomId, type || 0)
    commit('SET_ROOM_LIST', getRoomList(rootGetters.username))
  },
  updateLastMsg ({ commit, rootGetters }, data) { // 房间最后一条消息更新
    updateLastMsg(rootGetters.username, data)
    commit('SET_ROOM_LIST', getRoomList(rootGetters.username))
  },
  addExpiredRoomIdList ({ commit, rootGetters }, data) { // 添加过期房间ID
    addExpiredRoomIdList(rootGetters.username, data)
    commit('SET_EXPIRED_ROOM_ID_LIST', getExpiredRoomIdList(rootGetters.username))
  },
  removeExpiredRoomIdList ({ commit, rootGetters }, data) { // 移除过期房间ID
    removeExpiredRoomIdList(rootGetters.username, data)
    commit('SET_EXPIRED_ROOM_ID_LIST', getExpiredRoomIdList(rootGetters.username))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
