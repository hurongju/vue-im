import request from '@/assets/js/request'
import cons from '@/constants'

export default {
  uploadImg (data) { // 上传图片接口
    return request.post(cons.url.UPLOAD_IMG, data)
  },
  send (data) { // 发消息接口
    return request.post(cons.url.SEND, data)
  },
  getMsgList (data) { // 获取聊天记录
    return request.post(cons.url.GET_MSG_LIST, data)
  }
}
