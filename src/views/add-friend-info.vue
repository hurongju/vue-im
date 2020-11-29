<template>
  <!-- 好友申请列表组件 add-friend-info -->
  <van-list
    v-model="_loading"
    :finished="finished"
    class="add-friend__scroll-list"
    @load="getAddList"
    :offset="20"
  >
    <template>
      <im-card
        v-for="item in list"
        :key="item.id"
        :item="item"
        :avatar="item.avatarUrl"
        :name="item.fromName"
        :date-time="item.updateTime"
        :desc="statusDesc[item.addStatus - 1]"
        :dateFormatType="dateFormatType"
        @agree="agree(item)"
      />
    </template>
  </van-list>
</template>

<script>
import { List } from 'vant'
import Card from '@/components/im-card'
import cons from '@/constants'

export default {
  name: 'AddFriendInfo',
  components: {
    [List.name]: List,
    [Card.name]: Card
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
      statusDesc: ['同意', '已同意'],
      dateFormatType: cons.dateFormatType.SIMPLE
    }
  },
  computed: {
    _loading: {
      get () {
        console.log('this.loading :>> ', this.loading)
        return this.loading
      },
      set (data) {
        this.$emit('update:loading', data)
      }
    }
  },
  methods: {
    agree (item) {
      this.$emit('agree', item)
    },
    getAddList () {
      this.$emit('load')
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/add-friend-info.less';
</style>
