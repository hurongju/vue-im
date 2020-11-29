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
      return list
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/room-im.less';
</style>
