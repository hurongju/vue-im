<template>
  <!-- 联系人页面组件 contact-im  -->
  <div class="contact-im__container">
    <van-cell class="contact-im__add-friend" icon="friends-o" title="新的朋友" to="add-friend">
      <template #right-icon>
        <van-icon name="plus" />
      </template>
    </van-cell>
    <van-index-bar :sticky="true" :index-list="indexList">
      <div v-for="item in contactList" :key="item.id">
        <van-index-anchor :index="item.id" />
        <van-cell
          class="contact-im__cell-item"
          :icon="item_child.avatarUrl || defaultAvatar"
          :title="item_child.name"
          v-for="item_child in item.list" :key="item_child.uid"
          @click="goToChat(item_child)"
          v-menu="menuOptions()"
          :data-id="item_child.uid"
          :data-rid="item_child.roomId"
        />
      </div>
    </van-index-bar>
  </div>
</template>

<script>
import { IndexBar, IndexAnchor, Cell, Icon, Dialog } from 'vant'
import { handleFriendList } from '@/assets/js/handler'
import { mapState } from 'vuex'

export default {
  name: 'ContactIm',
  components: {
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
    [Cell.name]: Cell,
    [Icon.name]: Icon
  },
  data () {
    return {
      list: []
    }
  },
  computed: {
    indexList () {
      const list = []
      this.contactList.forEach(val => {
        list.push(val.id)
      })
      return list
    },
    contactList () {
      return handleFriendList(this.list)
    },
    ...mapState(['defaultAvatar'])
  },
  mounted () {
    this.getFriendList()
  },
  methods: {
    getFriendList () {
      this.$api.getFriendList().then(res => {
        if (res.data.success) {
          this.list = res.data.data
        }
      }).catch(rej => {})
    },
    goToChat (data) {
      this.$router.push({ path: 'chat-im/' + data.roomId }).catch(rej => {})
      this.$store.commit('room/SET_ACTIVE_ROOM_ID', data.roomId)
      this.$store.commit('SET_TITLE', data.name)
    },
    menuOptions () {
      return {
        data: [
          { id: 1, name: '删除' }
        ],
        handler: (id, el) => {
          const uid = parseInt(el.dataset.id)
          const roomId = parseInt(el.dataset.rid)
          this.delete(uid, roomId)
        }
      }
    },
    delete (uid, roomId) {
      Dialog.confirm({
        title: '确定要删除该好友吗',
        message: '',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            this.list = this.list.filter(val => val.uid !== uid)
            this.$api.deleteFriend({ id: uid, roomId }).then(res => {
              if (res.data.success) {
                this.$store.dispatch('room/removeRoom', { roomId: roomId }, { root: true })
              }
            }).catch(rej => {})
          }
          done(action)
        }
      }).catch(rej => {})
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/contact-im.less';
</style>
