<template>
  <!-- 聊天发送表情选择组件 chat-emoji-select -->
  <div class="chat-emoji-select__container" @click="clickHandler">
    <div class="chat-emoji-select__wrapper">
      <p class="chat-emoji-select__icon"
        v-for="([strs, url], index) in emoji"
        :key="url"
        @click="emojiClick(strs)"
        :style="computedStyle(index)"
      >
      </p>
      <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i> <!-- 实现flex布局最后一行左对齐 -->
    </div>
    <div class="chat-emoji-select__backspace" @click="backspace">
      <i class="iconfont icon-backspace" :style="{color: backspaceColor}"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import emoji from '@/assets/js/emoji'
import cons from '@/constants'

export default {
  name: 'ChatEmojiSelect',
  props: {
    backspaceColor: String
  },
  data () {
    return {
      emoji: emoji
    }
  },
  computed: {
    ...mapGetters(['username', 'activeRoomId', 'title'])
  },
  methods: {
    emojiClick (item) {
      this.$emit('input', item[0])
    },
    backspace () {
      this.$emit('backspace')
    },
    clickHandler () {
      this.$emit('click', cons.input.focusType.EMOJI)
    },
    computedStyle (index) {
      const pos = [0, 0]
      pos[0] = (index % 11) * 10
      pos[1] = (Math.floor(index / 11)) * 100 / 9
      let backgroundPosition = `${pos[0]}% ${pos[1]}%`
      if (index === 109) { // 最后一个emoji图标安卓机显示多出了一点
        backgroundPosition = `${pos[0]}% 100.5%`
      }
      return {
        backgroundPosition: backgroundPosition
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/chat-emoji-select.less';
</style>
