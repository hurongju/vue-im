const state = () => ({
  isAndroid: false,
  isIOS: false
})

const mutations = {
  SET_DEVICE (state, data) {
    state.isAndroid = data.isAndroid || false
    state.isIOS = data.isIOS || false
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
