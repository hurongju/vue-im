<template>
  <!-- 会话列表页面组件 room-im -->
  <div class="room-im__container">
    <im-card
      v-for="item in adapterList" :key="item.roomId"
      @click.native="redirectChat(item)"
      :avatar="item.avatarUrl"
      :unread="item.unReadNum"
      :name="item.nickname"
      :date-time="item.lastMsgTime"
      :date-format-type="formatType"
      :message="item.lastMsg"
      :menu-options="getMenuOptions(item)"
      :class="{isTop: item.isTop}"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from '@/components/im-card'
import cons from '@/constants'

export default {
  name: 'RoomIm',
  components: {
    [Card.name]: Card
  },
  data () {
    return {
      list: [],
      formatType: cons.dateFormatType.SIMPLE
    }
  },
  computed: {
    ...mapGetters(['username', 'roomList']),
    adapterList () {
      return this.handlerList(this.roomList)
    }
  },
  mounted () {
  },
  methods: {
    getMenuOptions (item) {
      return {
        width: Math.round((window.innerWidth / 375 * 120) || 120),
        height: Math.round((window.innerWidth / 375 * 60) || 60),
        data: [
          item.unReadNum > 0 ? { id: cons.contextmenu.MARK_AS_READ, name: '标为已读' } : { id: cons.contextmenu.MARK_AS_UNREAD, name: '标为未读' },
          item.isTop ? { id: cons.contextmenu.UNSTICK, name: '取消置顶' } : { id: cons.contextmenu.TOP, name: '置顶该聊天' },
          { id: cons.contextmenu.DELETE, name: '删除该聊天' }
        ],
        handler: (id, el) => {
          const index = Array.prototype.indexOf.call(el.parentNode.childNodes, el)
          switch (parseInt(id)) {
            case cons.contextmenu.TOP:
              this.roomList[index].isTop = 1
              this.roomList[index].setTopTime = Date.now()
              this.$store.dispatch('room/setRoomList', this.roomList, { root: true })
              break
            case cons.contextmenu.DELETE:
              this.$store.dispatch('room/removeRoom', { roomId: this.roomList[index].roomId }, { root: true })
              break
            case cons.contextmenu.UNSTICK:
              this.roomList[index].isTop = 0
              this.roomList[index].setTopTime = Date.now()
              this.$store.dispatch('room/setRoomList', this.roomList, { root: true })
              break
            case cons.contextmenu.MARK_AS_READ:
              this.$store.dispatch('room/updateUnReadMsg', { num: 0, roomId: this.roomList[index].roomId })
              break
            case cons.contextmenu.MARK_AS_UNREAD:
              this.$store.dispatch('room/updateUnReadMsg', { num: 1, roomId: this.roomList[index].roomId })
              break
          }
        }
      }
    },
    redirectChat (item) {
      if (isNaN(item.roomId)) {
        this.$store.dispatch('room/updateUnReadMsg', { num: 0, roomId: item.roomId })
        return
      }
      this.$router.push({ path: 'chat-im/' + item.roomId }).catch(rej => {})
      this.$store.commit('room/SET_ACTIVE_ROOM_ID', item.roomId)
      this.$store.commit('SET_TITLE', item.nickname)
    },
    handlerList (list) {
      _.forEach(list, value => {
        if (!value.nickname) {
          try {
            const arrayName = JSON.parse(value.name)
            const data = arrayName.filter(val => {
              return val !== this.username
            })
            value.nickname = data.join(',')
          } catch (e) {
            value.nickname = value.name
          }
        }
      })
      list.sort((a, b) => {
        if (a.isTop > b.isTop) {
          return b.isTop - a.isTop
        }
        if (a.isTop === b.isTop && a.isTop === 1) {
          return b.setTopTime - a.setTopTime
        }
        if (a.isTop === b.isTop && a.isTop === 0) {
          return b.lastMsgTime - a.lastMsgTime
        }
      })
      return list
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/room-im.less';
</style>
