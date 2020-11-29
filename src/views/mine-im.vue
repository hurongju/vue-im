<template>
  <!-- 我的页面组件 mine-im -->
  <div class="mine-im__container">
    <div class="mine-im__user">
      <img class="mine-im__image" :src="avatarUrl || defaultAvatar" alt="">
      <span class="mine-im__name">{{username}}</span>
    </div>
    <a href="javascript:" class="mine-im__center" @click="logout">退出账号</a>
  </div>
</template>

<script>
import { Button, Toast, Dialog } from 'vant'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'MineIm',
  components: {
    [Button.name]: Button
  },
  computed: {
    ...mapGetters(['username', 'avatarUrl']),
    ...mapState(['defaultAvatar'])
  },
  methods: {
    logout () {
      Dialog.confirm({
        title: '退出账号',
        message: '确定退出账号？',
        beforeClose: (action, done) => {
          if (action === 'confirm') {
            // 同意
            this.$store.dispatch('user/logout')
            Toast('退出成功')
            this.$router.push('/login-im')
          }
          done(action)
        }
      }).catch(rej => {})
    }
  }
}
</script>
<style lang="less" scoped>
  @import '@/assets/style/mine-im.less';
</style>
