<template>
  <!-- 公共卡片组件 im-card -->
  <div class="im-card__container">
    <div class="im-card__left">
      <img class="im-card__avatar" :src="avatar || defaultAvatar" alt="头像">
      <span class="im-card__tips--unread-num" v-if="unread > 0">{{ unReadNumStr}}</span>
    </div>
    <div class="im-card__right">
      <p class="im-card__right-top">
        <span class="im-card__name">{{ name }}</span>
        <span class="im-card__date-time">{{ dateTime|format(dateFormatType) }}</span>
      </p>
      <p class="im-card__right-bottom">
        <span class="im-card__message">{{message}}</span>
        <span
        :class="[desc === '同意' ? 'can-click' : '', 'im-card__add-status']"
        @click="agree"
        >{{desc}}</span>
      </p>
    </div>
  </div>
</template>

<script>

import cons from '@/constants'
import { mapState } from 'vuex'

export default {
  name: 'ImCard',
  props: {
    dateFormatType: {
      type: Number,
      default: cons.dateFormatType.NORMAL
    },
    item: Object,
    avatar: {
      type: String
    },
    unread: Number, // 未读消息数
    name: {
      type: String,
      required: true
    },
    dateTime: {
      type: Number,
      required: true
    },
    message: String,
    desc: String
  },
  computed: {
    ...mapState(['defaultAvatar']),
    unReadNumStr () {
      return this.unread > cons.MAX_UNREAD_MESSAGE_NUMBER ? '···' : this.unread
    }
  },
  methods: {
    agree () {
      this.$emit('agree', this.item)
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/im-card.less';
</style>
