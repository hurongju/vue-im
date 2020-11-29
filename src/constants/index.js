import url from './url'
import input from './input'

export default {
  url, // api接口URL
  input,
  ROOM_LIST_KEY: '__room_list__', // 获取本地群列表key
  TOKEN_KEY: '__json_web_token_key__', // 获取token的key
  dateFormatType: { // 日期格式类型
    NORMAL: 0, // 例: '周二 10:30'
    SIMPLE: 1 // 例: '周二’
  },
  MAX_UNREAD_MESSAGE_NUMBER: 99, // 最大未读消息数，超出显示'...'
  messageType: {
    SYSTEM: 0, // 系统消息
    TEXT: 1, // 文本消息
    IMAGE: 2 // 图片消息
  },
  updateUnreadMessageNumberStyle: { // 更新未读消息数类型
    COVER: 0, // 覆盖
    ADD: 1, // 增加
    REDUCE: -1 // 减少
  },
  SHOW_CHAT_TIME_INTERVAL: 5 * 60 * 1000 // 显示聊天时间间隔(毫秒)
}