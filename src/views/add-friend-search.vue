<template>
  <!-- 好友搜索列表组件 add-friend-search -->
  <van-list
    v-model="loadStatus"
    :finished="finished"
    class="add-friend-search__scroll-list"
    :immediate-check="false"
    @load="search"
    :offset="20"
  >
    <template>
        <div class="add-friend-search__cell" v-for="item in list" :key="item.id">
          <div class="add-friend-search__cell-left">
            <img class="add-friend-search__img" :src="item.avatarUrl || defaultAvatar" alt="">
            <span class="add-friend-search__name">{{item.username}}</span>
          </div>
          <p class="add-friend-search__cell-right" @click="addFriend(item)">添加朋友</p>
        </div>
      </template>
  </van-list>
</template>

<script>
import { List } from 'vant'
import { mapState } from 'vuex'

export default {
  name: 'AddFriendSearch',
  components: {
    [List.name]: List
  },
  props: {
    list: {
      type: Array
    },
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      statusDesc: ['同意', '已同意']
    }
  },
  computed: {
    loadStatus: {
      get () {
        return this.loading
      },
      set (data) {
        this.$emit('update:loading', data)
      }
    },
    ...mapState(['defaultAvatar'])
  },
  methods: {
    addFriend (item) {
      this.$emit('add', item)
    },
    search () {
      this.$emit('search')
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/add-friend-search.less';
</style>
