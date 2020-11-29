import { addRoom, getRoomList, updateUnReadMsg, updateLastMsg, removeRoom } from '@/assets/js/room'

const state = () => ({
  roomList: [], // 会话列表
  activeRoomId: null // 当前聊天页房间ID
})

const mutations = {
  SET_ROOM_LIST (state, data) {
    state.roomList = data
  },
  SET_ACTIVE_ROOM_ID (state, data) {
    state.activeRoomId = data
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
  setRoomList ({ commit, rootGetters }) { // 设置房间列表
    commit('SET_ROOM_LIST', getRoomList(rootGetters.username))
  },
  updateUnReadMsg ({ commit, rootGetters }, { num, roomId, type }) { // 房间消息已读
    updateUnReadMsg(rootGetters.username, num || 0, roomId, type || 0)
    commit('SET_ROOM_LIST', getRoomList(rootGetters.username))
  },
  updateLastMsg ({ commit, rootGetters }, data) { // 房间最后一条消息更新
    console.log('updateLastMsg :>> ', data)
    updateLastMsg(rootGetters.username, data)
    commit('SET_ROOM_LIST', getRoomList(rootGetters.username))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
