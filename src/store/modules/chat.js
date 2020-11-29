
const state = () => ({
  messageList: []
})

const mutations = {
  setMessageList (state, data) {
    state.messageList = data
  }
}

const actions = {
  addMessage ({ commit, state }, data) {
    state.messageList.push(data)
    commit('setMessageList', state.messageList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
