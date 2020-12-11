<template>
  <!-- 导航组件 im-navbar -->
  <van-nav-bar :title="title" left-text="" left-arrow @click-left="onClickLeft">
    <template #left>
      <van-icon name="arrow-left" color="#000" />
    </template>
  </van-nav-bar>
</template>

<script>

import { NavBar, Icon } from 'vant'
import { mapGetters } from 'vuex'
export default {
  name: 'ImNavbar',
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon
  },
  computed: {
    ...mapGetters({
      activeTitle: 'title'
    }),
    title () {
      return this.$route.meta.title || this.activeTitle
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .van-nav-bar__title {
    font-size: 16px;
    font-weight: 400;
  }
  /deep/ .van-icon-arrow-left {
    font-size: 20px;
  }
</style>
