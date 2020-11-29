import request from '@/assets/js/request'
import cons from '@/constants'

export default {
  login (data) { // 登录
    return request.post(cons.url.LOGIN, data)
  },
  searchUser (data) { // 搜索用户
    return request.post(cons.url.SEARCH_USER, data)
  },
  addFriend (data) { // 添加好友
    return request.post(cons.url.ADD_FRIEND, data)
  },
  getAddList (data) { // 获取申请列表
    return request.post(cons.url.GET_ADD_LIST, data)
  },
  deleteAddInfo (data) { // 删除申请信息
    return request.post(cons.url.DELETE_ADD_INFO, data)
  },
  agreeAdd (data) { // 同意申请
    return request.post(cons.url.AGREE_ADD, data)
  },
  getFriendList (data) { // 获取好友列表
    return request.post(cons.url.GET_FRIEND_LIST, data)
  }
}
