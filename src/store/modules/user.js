import api from '@/api'
import cons from '@/constants'

const state = () => ({
  username: '',
  avatarUrl: ''
})

const mutations = {
  SET_USER_NAME (state, username) {
    state.username = username || ''
  },
  SET_AVATAR_URL (state, avatarUrl) {
    state.avatarUrl = avatarUrl || ''
  }
}

const actions = {
  login ({ dispatch, commit }, data) {
    return new Promise(function (resolve, reject) {
      api.login(data).then(res => {
        if (res.data.success) {
          const { username, avatarUrl, token, isRegister } = res.data.data
          commit('SET_USER_NAME', username)
          commit('SET_AVATAR_URL', avatarUrl)
          localStorage.setItem(cons.TOKEN_KEY, token)
          dispatch('socket/createSocket', { isRegister: isRegister }, { root: true })
          dispatch('room/setRoomList', null, { root: true })
          resolve(res)
        } else {
          reject(new Error(res.data.message))
        }
      }).catch(rej => {
        reject(new Error('系统异常'))
      })
    })
  },
  logout ({ commit, rootGetters }) {
    localStorage.removeItem(cons.TOKEN_KEY)
    localStorage.removeItem('vuex')
    rootGetters.socket.close()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
