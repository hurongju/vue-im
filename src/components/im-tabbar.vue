<template>
  <!-- 标签栏组件 im-tabbar -->
  <van-tabbar v-model="active" active-color="#07c160" inactive-color="#000" @change="onChange">
    <van-tabbar-item name="ImRoom" icon="chat-o" :badge="badge">消息</van-tabbar-item>
    <van-tabbar-item name="ImContact" icon="contact">联系人</van-tabbar-item>
    <van-tabbar-item name="ImMine" icon="setting-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>

import { Tabbar, TabbarItem } from 'vant'
import { mapGetters } from 'vuex'
import cons from '@/constants'
export default {
  name: 'ImTabbar',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  data () {
    return {
      active: 'ImRoom'
    }
  },
  computed: {
    ...mapGetters(['totalUnReadNum']),
    badge () {
      return this.totalUnReadNum > cons.MAX_UNREAD_MESSAGE_NUMBER ? '···' : this.totalUnReadNum || ''
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function (route) {
        this.active = route.name
      }
    }
  },
  methods: {
    onChange (data) {
      let path = '/im-layout/room-im'
      switch (data) {
        case 'ImRoom': break
        case 'ImContact': path = '/im-layout/contact-im'; break
        case 'ImMine': path = '/im-layout/mine-im'; break
      }
      this.$router.push(path).catch(rej => {})
    }
  }
}
</script>
