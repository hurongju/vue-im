<template>
  <!-- 聊天页面组件 chat-im -->
  <div class="chat-im__container">
    <im-scroll
      @touchstart.native="hideSelectArea"
      class="chat-im__scroller"
      ref="scroller"
      :has-more="hasMore"
      :load-status="loadStatus"
      :is-loading="isLoading"
      @loadmore="getMsgList"
    >
      <template #content>
        <ul class="chat-im__list-layout" ref="listLayout">
          <li class="chat-im__list-view" v-for="item in listAdapter" :key="item.id" :data-id="item.id">
            <chat-message-item
              :message="item"
              @imgload="imgLoadHandler"
              @preview="previewImage"
            />
          </li>
        </ul>
      </template>
    </im-scroll>
    <chat-input
      :input-height.sync="inputHeight"
      @send="sendHandler"
      @focus="focusHandler"
      :is-show-select-area="isShowSelectArea"
      @show-select-area="showSelectArea"
      :input-icon.sync="inputIcon"
      :area-height="selectAreaHeight"
    />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import MessageItem from './chat-message-item'
import Scroller from '@/components/im-scroll'
import Input from './chat-input'
import messageHandler from '@/assets/js/message-handle'
import md5 from 'md5'
import cons from '@/constants'

export default {
  name: 'ChatIm',
  components: {
    [Input.name]: Input,
    [MessageItem.name]: MessageItem,
    [Scroller.name]: Scroller
  },
  data () {
    return {
      listLayout: null,
      msgList: [],
      pageSize: 20,
      loadStatus: '',
      lastItemTimeStamp: 0, // 最后一条消息的时间戳
      hasMore: true, // 是否有下一页
      lastMsgSendTime: null, // 最后一条消息的发送时间
      beforePageHeight: 0, // 滚动前一页页面的高度
      isShowSelectArea: false, // select区域显示状态
      inputIcon: cons.input.icon.EMOJI, // 输入框旁的icon类型
      inputHeight: cons.input.HEIGHT, // 输入框高度
      selectAreaHeight: 0 // select区域高度
    }
  },
  computed: {
    ...mapGetters(['username', 'socket', 'roomList', 'activeRoomId', 'title', 'isIOS']),
    listAdapter () {
      return this.showTimeStampHandler(this.msgList)
    },
    isLoading () {
      return !!(this.loadStatus === 'loading' && this.hasMore === true && this.lastMsgSendTime)
    }
  },
  watch: {
    inputHeight (newV, oldV) {
      if (newV > cons.input.MAX_HEIGHT || newV === cons.input.HEIGHT) return
      this.$nextTick(() => {
        this.$refs.scroller.$el.scrollTop = this.listLayout.clientHeight
      })
    }
  },
  mounted () {
    this.listLayout = this.$refs.listLayout
    this.$store.dispatch('room/updateUnReadMsg', { num: 0, roomId: this.activeRoomId }) // 消息已读
    this.$bus.$on('accept-socket-message', this.acceptSocketMessage)
    this.$bus.$on('accept-local-message', this.acceptLocalMessage)
    this.$bus.$on('send-image', this.sendImageHandler)
    this.$bus.$on('backup', this.backupHandler)
    this.getMsgList()
  },
  beforeDestroy () {
    this.$bus.$off('accept-socket-message', this.acceptSocketMessage)
    this.$bus.$off('accept-local-message', this.acceptLocalMessage)
    this.$bus.$off('send-image', this.sendImageHandler)
    this.$bus.$off('backup', this.backupHandler)
  },
  methods: {
    backupHandler (cb) {
      if (this.isShowSelectArea) {
        this.hideSelectArea()
        cb(null, false)
      } else {
        cb(null, true)
      }
    },
    previewImage (url) { // 图片预览
      if (window.plus) {
        const absoluteUrl = /^file:/.test(url) ? url : plus.io.convertLocalFileSystemURL('_downloads/image/' + md5(url) + '.jpg') // 平台绝对路径
        let imgItemList = this.listAdapter.filter(val => val.type === 2).map(val => val.content)
        imgItemList = imgItemList.map(val => {
          if (/^file:/.test(val)) {
            return val
          } else {
            return plus.io.convertLocalFileSystemURL('_downloads/image/' + md5(val) + '.jpg')
          }
        })
        plus.nativeUI.previewImage(imgItemList, {
          indicator: 'none',
          current: imgItemList.indexOf(absoluteUrl)
        })
      }
    },
    sendImageHandler (formData, isPlus) {
      if (!this.activeRoomId) {
        return
      }
      this.hideSelectArea()
      if (isPlus) {
        this.sendImageMessage(formData)
      } else {
        this.$api.uploadImg(formData).then(res => {
          if (res.data.success) {
            this.sendImageMessage(res.data.data)
          }
        })
      }
    },
    sendImageMessage (data) {
      if (data instanceof Array) {
        data.forEach(val => {
          this.sendHandler(val, cons.messageType.IMAGE)
        })
      }
    },
    imgLoadHandler (id) {
      const imgItemList = this.listAdapter.filter(val => val.type === 2)
      if (id === imgItemList.reverse()[0].id) {
        this.$nextTick(() => {
          this.$refs.scroller.$el.scrollTop = this.listLayout.clientHeight
        })
      }
    },
    focusHandler (focusType) {
      if (focusType !== cons.input.focusType.EMOJI) {
        this.hideSelectArea()
        setTimeout(() => { // android等待软键盘弹出后再滚动到底
          this.$refs.scroller.$el.scrollTop = this.listLayout.clientHeight
        }, 400)
        this.isIOS && this.isDelayShowKeybord(focusType)
      }
    },
    /* 是否延时显示软键盘(解决IOS select区域显示时切换文本输入，输入框被软键盘遮挡) */
    isDelayShowKeybord (focusType) {
      if (this.isShowSelectArea && focusType !== cons.input.focusType.KEYBORD) {
        document.activeElement.blur()
        setTimeout(() => {
          this.$bus.$emit('show-keybord', cons.input.focusType.KEYBORD)
        }, 300)
      }
    },
    sendHandler (content, type = cons.messageType.TEXT) {
      const roomId = this.activeRoomId
      if (isNaN(roomId)) {
        return
      }
      this.$api.send({
        toName: this.title,
        content: content,
        roomId: roomId,
        type: type,
        sendSocketId: this.socket.id
      }).then(res => {
        if (res.data.success) {
          // 发送回执
        }
      }).catch(rej => {})
    },
    getMsgList () {
      if (!this.hasMore) {
        return
      }
      this.loadStatus = 'loading'
      this.lastMsgSendTime = (this.listAdapter[0] && this.listAdapter[0].sendTime) || null
      setTimeout(() => {
        this.$api.getMsgList({ // 接口获取聊天记录
          pageSize: this.pageSize,
          roomId: this.activeRoomId,
          lastMsgSendTime: this.lastMsgSendTime
        }).then(res => {
          this.loadStatus = 'loaded'
          if (res.data.success) {
            const data = res.data.data
            this.escapeHTML(data) // 转义
            if (!this.lastMsgSendTime) { // 第一次请求
              this.msgList = data
              this.$nextTick(() => {
                this.$refs.scroller.$el.scrollTop = this.listLayout.clientHeight // 滚动到底
              })
            } else {
              this.msgList = data.concat(this.msgList)
              this.$nextTick(() => {
                this.$refs.scroller.$el.scrollTop = this.listLayout.clientHeight - this.beforePageHeight // 设置滚动到上次加载的位置
              })
            }
            if (data.length < this.pageSize) {
              this.hasMore = false
            }
            this.beforePageHeight = this.listLayout.clientHeight
          }
        }).catch(rej => {
          this.loadStatus = 'loaded'
        })
      }, 500)
    },
    acceptLocalMessage (data) {
      this.hideSelectArea()
      this.acceptSocketMessage(data)
    },
    acceptSocketMessage (data) {
      if (data.roomId !== this.activeRoomId) {
        return
      }
      const _data = _.cloneDeep(data)
      messageHandler(_data)
      this.msgList.push(_data)
      this.$nextTick(() => {
        this.$refs.scroller.$el.scrollTop = this.listLayout.clientHeight
      })
    },
    showTimeStampHandler (data) { // 根据配置的显示时间间隔显示时间块
      if (data.length === 0) {
        return data
      }
      this.lastItemTimeStamp = data[0].sendTime
      for (let i = 0; i < data.length; i++) {
        if (i > 0 && data[i].sendTime < this.lastItemTimeStamp + cons.SHOW_CHAT_TIME_INTERVAL) {
          data[i].showTimeStamp = false
        } else {
          this.lastItemTimeStamp = data[i].sendTime
          data[i].showTimeStamp = true
        }
      }
      return data
    },
    escapeHTML (data) {
      data.forEach(val => messageHandler(val))
    },
    hideSelectArea () { // 隐藏emoji、图片选择区域
      if (this.isShowSelectArea) {
        this.selectAreaHeight = 0
        this.inputIcon = cons.input.icon.EMOJI
        setTimeout(() => {
          this.isShowSelectArea = false
        }, 300)
      }
    },
    showSelectArea () { // 显示emoji、图片选择区域
      this.isShowSelectArea = true
      this.selectAreaHeight = cons.input.SELECT_AREA_HEIGHT
      setTimeout(() => {
        this.$refs.scroller.$el.scrollTop = this.listLayout.scrollHeight
      }, 300)
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/chat-im.less';
</style>
