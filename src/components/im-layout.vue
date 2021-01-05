<template>
  <!-- layout组件 im-layout -->
  <transition :name="transitionName">
    <div class="im-layout__container" :key="$route.path">
      <im-navbar v-if="!isTabPage"/>
      <router-view></router-view>
      <im-tabbar v-if="isTabPage"/>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import TabBar from './im-tabbar'
import NavBar from './im-navbar'
import cons from '@/constants'

export default {
  name: 'ImLayout',
  components: {
    [TabBar.name]: TabBar,
    [NavBar.name]: NavBar
  },
  data () {
    return {
      socketio: null,
      transitionName: ''
    }
  },
  computed: {
    ...mapGetters(['username', 'avatarUrl', 'socket', 'isExpired']),
    isTabPage () {
      return this.$route.meta && this.$route.meta.tp
    }
  },
  watch: {
    '$route' (to, from) {
      this.transitionName = ''
      if (to.meta.index > from.meta.index) {
        this.transitionName = 'fade-left'
      }
      if (to.meta.index < from.meta.index) {
        this.transitionName = 'fade-right'
      }
    }
  },
  mounted () {
    this.$bus.$on('accept-socket-message', this.msgHandler) // 接受socket消息
    this.$bus.$on('accept-local-message', this.msgHandler) // 接受本地消息广播，主要是本地图片
    if (!this.socket) {
      this.$store.dispatch('socket/createSocket')
    }
  },
  beforeDestroy () {
    this.$bus.$off('accept-socket-message', this.msgHandler)
    this.$bus.$off('accept-local-message', this.msgHandler)
  },
  methods: {
    msgHandler (data) {
      if (this.isExpired) {
        return
      }
      let content = data.content
      if (data.type === cons.messageType.IMAGE) {
        content = '[图片]'
      }
      // 更新roomList中的lastMsg
      this.$store.dispatch('room/updateLastMsg', {
        roomId: data.roomId,
        lastMsg: content,
        lastMsgTime: data.sendTime,
        name: data.from === this.username ? data.to : data.from
      })
      // 不在当前聊天页收到消息更新未读消息数
      if (this.$route.path !== '/im-layout/chat-im/' + data.roomId) {
        this.$store.dispatch('room/updateUnReadMsg', {
          num: 1,
          roomId: data.roomId,
          type: cons.updateUnreadMessageNumberStyle.ADD
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/im-layout.less';
</style>
