const prefixUrl = ''

if (__STG__ || __PRD__) {
  // prefixUrl = 'http://your.hostname.com'
}

export default {
  PREFIX: prefixUrl, // url前缀
  UPLOAD_IMG: prefixUrl + '/api/upload', // 上传图片url
  LOGIN: prefixUrl + '/api/login/index', // 登录接口url
  SEND: prefixUrl + '/api/chat/send', // 发消息接口url
  GET_MSG_LIST: prefixUrl + '/api/chat/getMsgList', // 获取聊天记录url
  SEARCH_USER: prefixUrl + '/api/user/search', // 搜索用户url
  ADD_FRIEND: prefixUrl + '/api/user/addFriend', // 添加好友
  DELETE_FRIEND: prefixUrl + '/api/user/deleteFriend', // 删除好友
  GET_ADD_LIST: prefixUrl + '/api/user/addList', // 获取申请好友列表
  AGREE_ADD: prefixUrl + '/api/user/agreeAdd', // 同意申请
  DELETE_ADD_INFO: prefixUrl + '/api/user/deleteAddInfo', // 删除申请信息
  GET_FRIEND_LIST: prefixUrl + '/api/user/getFriendList' // 获取好友列表
}
