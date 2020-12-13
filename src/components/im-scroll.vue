<template>
  <!-- 下拉滚动组件 im-scroll -->
  <div class="im-scroll__container" @scroll.passive="scrollHandler">
    <slot name="loading">
      <div class="load-more" v-if="hasMore">
        <van-loading size="20" v-show="isLoading" />
      </div>
    </slot>
    <slot name="content"></slot>
  </div>
</template>

<script>
import { Loading } from 'vant'

export default {
  name: 'ImScroll',
  components: {
    [Loading.name]: Loading
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: false
    },
    loadStatus: {
      type: String,
      default: ''
    }
  },
  methods: {
    scrollHandler (e) {
      if (e.target.scrollTop === 0 && this.loadStatus === 'loaded') {
        this.$emit('loadmore')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/style/im-scroll.less';
</style>
