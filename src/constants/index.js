import url from './url'
import input from './input'
import contextmenu from './contextmenu'

export default {
  url, // api接口URL
  input, // 聊天界面文本框配置
  contextmenu, // 自定义contextmenu配置
  ROOM_LIST_KEY: '__room_list__', // 获取本地群列表key
  EXPIRED_ROOM_ID_LIST_KEY: '__expired_room_id_list__', // 获取本地过期群ID列表key
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
  SHOW_CHAT_TIME_INTERVAL: 5 * 60 * 1000, // 显示聊天时间间隔(毫秒)
  /* 新消息进线滚动到底的最大滚动高度(如当前页面滚动高度10px，新消息进线页面自动滚动到底。超过MAX_SCROLL_INTO_VIEW_HEIGHT值不滚动) */
  MAX_SCROLL_INTO_VIEW_HEIGHT: 20
}
