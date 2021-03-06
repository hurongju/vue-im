<template>
  <!-- 聊天输入框组件 chat-input -->
  <div class="chat-input__container">
    <!-- 输入框、按钮区域 -->
    <section class="chat-input__input-wrapper">
      <div class="chat-input__textarea-wrapper">
        <textarea class="chat-input__textarea"
          @touchstart="touchstartHandler"
          @touchend="touchendHandler"
          @click="clickTextarea"
          :style="{height: inputHeight + 'rem', maxHeight: maxHeight + 'rem'}"
          rows="1"
          v-model="message"
          :readonly="isReadOnly"
          ref="textarea"
        >
        </textarea>
      </div>
      <div class="chat-input__btns">
        <i class="iconfont icon-jianpan" v-show="showText" @click="changeSelect('text')"></i>
        <i class="iconfont icon-xiaolian" v-show="showEmoji" @click="changeSelect('emoji')"></i>
        <van-button v-show="canSend" class="chat-input__send-btn" @click="send">发送</van-button>
        <i class="iconfont icon-jia" v-show="!canSend" @click="changeSelect('image')"></i>
      </div>
      <div v-show="isShowSelectArea" class="chat-input__bottom-line"></div>
    </section>
    <!-- 表情和相片选择区域 -->
    <section class="chat-input__select-wrapper" :style="{ height: areaHeight + 'rem' }">
      <chat-photo-select v-show="isShowSelectArea && selectType === 'image'" key="chat-photo-select"/>
      <chat-emoji-select
        key="chat-emoji-select"
        v-show="isShowSelectArea && selectType === 'emoji'"
        :backspace-color="backspaceColor"
        @input="selectEmoji"
        @backspace="backspace"
      />
    </section>
  </div>
</template>

<script>

import { Button } from 'vant'
import PhotoSelelct from './chat-photo-select'
import EmojiSelelct from './chat-emoji-select'
import { indexOfEmoji } from '@/assets/js/emoji'
import cons from '@/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'ChatInput',
  components: {
    [Button.name]: Button,
    [PhotoSelelct.name]: PhotoSelelct,
    [EmojiSelelct.name]: EmojiSelelct
  },
  props: {
    isShowSelectArea: {
      type: Boolean,
      default: false
    },
    inputIcon: {
      type: Number,
      default: cons.input.icon.EMOJI
    },
    inputHeight: {
      type: Number,
      default: cons.input.HEIGHT
    },
    areaHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      message: '',
      textarea: null,
      canSend: false,
      selectType: 'text',
      isReadOnly: false,
      backspaceColor: '#aaa',
      focusType: cons.input.focusType.TEXT,
      maxHeight: cons.input.MAX_HEIGHT
    }
  },
  computed: {
    ...mapGetters(['isIOS', 'isAndroid', 'isExpired']),
    showText () {
      return this.inputIcon === cons.input.icon.TEXT
    },
    showEmoji () {
      return this.inputIcon === cons.input.icon.EMOJI
    }
  },
  watch: {
    message: {
      handler (newV) {
        if (newV !== '') {
          this.backspaceColor = '#000'
        } else {
          this.backspaceColor = '#aaa'
        }
        this.$emit('update:inputHeight', cons.input.HEIGHT)
        this.$nextTick(() => {
          const padding = parseFloat(getComputedStyle(this.textarea).paddingTop) + parseFloat(getComputedStyle(this.textarea).paddingBottom)
          const fontSize = parseFloat(document.documentElement.style.fontSize)
          let updateHeight = Math.floor((this.textarea.scrollHeight - padding) / fontSize * 100) / 100
          Math.abs(updateHeight - cons.input.HEIGHT) <= 0.1 && (updateHeight = cons.input.HEIGHT)
          this.$emit('update:inputHeight', updateHeight)
        })
        if (newV.trim()) {
          this.canSend = true
        } else {
          this.$emit('update:inputHeight', cons.input.HEIGHT)
          this.canSend = false
        }
      }
    }
  },
  mounted () {
    this.textarea = this.$refs.textarea
    document.addEventListener('pause', this.pauseHandler, false) // 监听App切换到后台事件
    this.$bus.$on('delay-show-keyboard', this.dispatchFocus) // IOS系统延迟显示软键盘
    this.$bus.$on('touch-scrollview', this.setFocusType) // 点击非输入框区域隐藏软键盘
  },
  beforeDestroy () {
    document.removeEventListener('pause', this.pauseHandler, false)
    this.$bus.$off('delay-show-keyboard', this.dispatchFocus)
    this.$bus.$off('touch-scrollview', this.setFocusType)
  },
  methods: {
    touchendHandler () { // 解决表情select下，长按文本内容会弹出软键盘bug
      this.showText && (this.isReadOnly = false)
    },
    touchstartHandler () { // 解决表情select下，长按文本内容会弹出软键盘bug
      if (this.isIOS) {
        this.showText && document.activeElement.blur()
        this.showText && window.plus && plus.key.hideSoftKeybord()
      } else {
        this.showText && (this.isReadOnly = true)
      }
    },
    backspace () { // 退格删除消息、表情
      if (this.isAndroid || (this.isIOS && typeof window.plus === 'undefined')) {
        this.textarea.focus()
      }
      const rangeStart = this.textarea.selectionStart
      const rangeEnd = this.textarea.selectionEnd
      if (rangeStart === 0 && rangeEnd === 0) {
        this.preventKeyboard()
        return
      }
      const delValue = this.textarea.value.substring(rangeStart - 1, rangeStart)
      const leftSelectValue = this.textarea.value.substring(0, rangeStart - 1)
      const rightSelectValue = this.textarea.value.substring(rangeEnd)
      let length = 1
      let textValue = leftSelectValue + rightSelectValue
      if (delValue === ']' && ~leftSelectValue.indexOf('[')) {
        const res = leftSelectValue.match(/(\[[\u4E00-\u9FA5a-zA-Z]*?)$/g) + ']'
        length = res.length
        if (~indexOfEmoji(res)) {
          textValue = leftSelectValue.substring(0, leftSelectValue.lastIndexOf('[')) + rightSelectValue
        }
      }
      this.message = textValue
      this.$nextTick(() => {
        const cursor = rangeStart - length > 0 ? rangeStart - length : 0
        this.textarea.setSelectionRange(cursor, cursor)
        this.preventKeyboard()
      })
    },
    pauseHandler () {
      document.activeElement.blur() // 切换App从前台切换到后台解除聚焦状态
    },
    preventKeyboard () { // 阻止软键盘弹起
      if (this.isIOS) {
        document.activeElement.blur()
        window.plus && plus.key.hideSoftKeybord()
      } else {
        this.isReadOnly = true // 防止软键盘弹起
        setTimeout(() => {
          this.isReadOnly = false
        }, 100)
      }
    },
    selectEmoji (str) { // 选择表情
      if (this.isAndroid || (this.isIOS && typeof window.plus === 'undefined')) {
        this.textarea.focus()
      }
      const rangeStart = this.textarea.selectionStart
      const rangeEnd = this.textarea.selectionEnd
      this.message = this.message.substring(0, rangeStart) + str + this.message.substring(rangeEnd)
      this.$nextTick(() => {
        this.textarea.setSelectionRange(rangeStart + str.length, rangeStart + str.length)
        this.preventKeyboard()
        this.textarea.scrollTop = this.textarea.scrollHeight
      })
    },
    send () {
      if (this.isExpired) { // 会话不存在，禁止发送
        this.$toast({ message: '非好友不能发送消息', icon: 'warning' })
        return
      }
      this.changeSelect(this.selectType, true)
      this.selectType === 'text' && this.textarea.focus()
      if (this.message.trim()) {
        this.$emit('send', this.message)
        this.message = ''
      }
    },
    changeSelect (type, sendFlag = false) {
      this.selectType = type
      if (!this.isShowSelectArea && !sendFlag) {
        this.$emit('show-select-area')
      }
      switch (type) {
        case 'emoji': {
          this.focusType = cons.input.focusType.EMOJI
          this.$emit('update:input-icon', cons.input.icon.TEXT)
          this.$emit('focus', this.focusType)
          break
        }
        case 'text': {
          this.focusType = cons.input.focusType.TEXT
          this.$emit('update:input-icon', cons.input.icon.EMOJI)
          this.$emit('focus', this.focusType)
          if (!this.isIOS) {
            this.textarea.focus()
          }
          break
        }
        case 'image': {
          this.$emit('update:input-icon', cons.input.icon.EMOJI)
          break
        }
      }
    },
    clickTextarea () {
      if (this.selectType === 'emoji' || this.selectType === 'image') {
        this.changeSelect('text')
      } else {
        this.$emit('focus', this.focusType)
      }
    },
    dispatchFocus (type) {
      this.focusType = type
      this.textarea.focus()
    },
    setFocusType (type) {
      this.focusType = type
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/chat-input.less';
</style>
