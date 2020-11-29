<template>
  <!-- 聊天内容展示组件 chat-message-item -->
  <section class="chat-message-item__container">
    <p class="chat-message-item__date-wrapper" v-if="message.showTimeStamp">
      <span class="chat-message-item__date-time">{{message.sendTime | format}}</span>
    </p>
    <div class="chat-message-item__all-content" :class="{self: message.from === username, other: message.from !== username}">
      <p class="chat-message-item__text-wrapper" v-if="message.type === 1">
        <span class="chat-message-item__text" v-html="message.content"></span>
        <span class="chat-message-item__angle"></span>
      </p>
      <div class="chat-message-item__image-wrapper" v-if="message.type === 2">
        <img class="chat-message-item__image" v-lazy="message.content" @load="$emit('imgload', message.id)" @click="$emit('preview', message.content)"/>
      </div>
      <div class="chat-message-item__avatar-wrapper">
        <img class="chat-message-item__avatar" :src="message.avatarUrl || defaultAvatar" alt="">
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'ChatMessageItem',
  props: {
    message: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(['username', 'avatarUrl']),
    ...mapState(['defaultAvatar'])
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/chat-message-item.less';
</style>
