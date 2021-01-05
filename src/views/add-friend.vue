<template>
  <!-- 添加好友页面组件 add-friend -->
  <div class="add-friend__container">
    <van-search
    v-model.trim="searchValue"
    input-align="center"
    shape="round"
    background="#f7f8fa"
    placeholder="搜索用户名"
    @focus="focusHandler"
    @blur="blurHandler"
    @input="inputHandler('search')" />
    <add-friend-info
      v-if="isShowAddInfo"
      :list="list"
      :loading.sync="loading"
      :finished="finished"
      @load="getAddList"
      @agree="agree"
      @delete="deleteAddInfo"
      key="add-friend-info"
    />
    <add-friend-search
      v-else
      :list="_searchList"
      :loading.sync="sLoading"
      :finished="sFinished"
      @search="inputHandler"
      @add="addFriend"
      key="add-friend-search"
    />
  </div>
</template>

<script>
import { Search, Dialog, Toast } from 'vant'
import { mapGetters } from 'vuex'
import AddInfo from './add-friend-info'
import SearchInfo from './add-friend-search'

export default {
  name: 'AddFriend',
  components: {
    [Search.name]: Search,
    [AddInfo.name]: AddInfo,
    [SearchInfo.name]: SearchInfo
  },
  data () {
    return {
      searchValue: '',
      list: [],
      loading: false,
      sLoading: false, // 搜索时load状态
      finished: false,
      sFinished: false, // 搜索时是否完成状态
      isShowAddInfo: true, // 显示加人信息
      searchList: [], // 搜索列表
      statusDesc: ['同意', '已同意'],
      pageSize: 10,
      sPageSize: 13 // 搜索接口分页大小
    }
  },
  computed: {
    ...mapGetters(['username']),
    _searchList () {
      return this.handlerSearchList(this.searchList)
    }
  },
  methods: {
    addFriend (item) {
      const message = '确定要添加' + item.username + '到通讯录吗？'
      Dialog.confirm({
        title: '添加好友',
        message: message,
        beforeClose (action, done) {
          if (action === 'confirm') {
            this.$api.addFriend({ toId: item.id, toName: item.username }).then(res => {
              if (res.data.success) {
                this.$toast('发送成功')
              }
            }).catch(rej => {})
          }
          done(action)
        }
      }).catch(rej => {})
    },
    getAddList () {
      const lastTime = this.list.length > 0 ? this.list[this.list.length - 1].updateTime : null
      this.$api.getAddList({
        pageSize: this.pageSize,
        lastTime: lastTime
      }).then(res => {
        this.loading = false
        if (res.data.success) {
          if (!lastTime) {
            this.list = res.data.data
          } else {
            this.list = this.list.concat(res.data.data)
          }
          if (res.data.data.length < this.pageSize) {
            this.finished = true
          }
        }
      }).catch(rej => {
        this.loading = false
        this.finished = true
      })
    },
    focusHandler () {
      this.isShowAddInfo = false
    },
    blurHandler () {
      if (!this.searchValue) {
        setTimeout(() => {
          this.isShowAddInfo = true
        }, 300)
      }
    },
    inputHandler: _.debounce(function (type) {
      if (!this.searchValue) {
        this.searchList = []
        return
      }
      if (type === 'search') {
        this.searchList = []
      }
      const lastTime = this.searchList.length > 0 ? this.searchList[this.searchList.length - 1].createTime : null
      this.$api.searchUser({
        keyword: this.searchValue,
        pageSize: this.sPageSize,
        lastTime: lastTime
      }).then(res => {
        this.sLoading = false
        if (res.data.success) {
          if (!lastTime) {
            this.searchList = res.data.data
          } else {
            this.searchList = this.searchList.concat(res.data.data)
          }
          if (res.data.data.length < this.sPageSize) {
            this.sFinished = true
          }
        }
      }).catch(rej => {
        this.sLoading = false
        this.sFinished = true
      })
    }, 300),
    handlerSearchList (data) {
      return data.filter(value => value.username !== this.username)
    },
    agree (item) {
      if (!item) {
        return
      }
      if (item.addStatus === 1) {
        Dialog.confirm({
          title: '接受请求',
          message: '确定接受添加好友请求？',
          beforeClose: (action, done) => {
            if (action === 'confirm') {
              // 同意
              this.$api.agreeAdd({ id: item.id, fromName: item.fromName, fromId: item.fromId }).then(res => {
                if (res.data.success) {
                  item.addStatus = 2
                }
              }).catch(rej => {})
            }
            done(action)
          }
        }).catch(rej => {})
      }
    },
    deleteAddInfo (id) {
      console.log('id :>> ', id)
      if (!id) {
        return
      }
      this.$api.deleteAddInfo({ id: id }).then(res => {
        if (res.data.success) {
          Toast('删除成功')
          this.list = this.list.filter(val => val.id !== id)
        }
      }).catch(rej => {
        Toast('删除失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/add-friend.less';
</style>
