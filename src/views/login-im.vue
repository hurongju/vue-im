<template>
  <!-- 登录页面组件 login-im -->
  <div class="login-im__container">
    <van-form class="login-im__form" @submit="login">
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div class="login-im__button">
        <van-button round block type="info" color="#07c160" native-type="submit">注册 / 登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>

import { Form, Field, Button, Toast } from 'vant'

export default {
  name: 'LoginIm',
  components: {
    [Button.name]: Button,
    [Form.name]: Form,
    [Field.name]: Field
  },
  data () {
    return {
      username: '',
      password: '',
      errMsg: '',
      redirect: null,
      flag: true
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      }
    }
  },
  methods: {
    login () {
      if (this.flag === false) {
        Toast('请勿频繁操作！')
      } else {
        if (this.verify()) {
          this.flag = false
          this.$store.dispatch('user/login', {
            username: this.username.trim(),
            password: this.password
          }).then(res => {
            this.$router.push(this.redirect || '/im-layout/room-im')
          }).catch(rej => {
            setTimeout(() => {
              this.flag = true
            }, 3000)
            Toast(rej.message)
          })
        } else {
          Toast(this.errMsg)
        }
      }
    },
    verify () {
      const name = this.username.trim()
      if (name.length > 50) {
        this.errMsg = '用户名不能多于50位字符！'
        return false
      }
      if (name.slice(0, 1).toUpperCase().charCodeAt() < 65 ||
        name.slice(0, 1).toUpperCase().charCodeAt() > 90
      ) {
        this.errMsg = '用户名只能以字母开头！'
        return false
      }
      if (this.password.length < 6) {
        this.errMsg = '密码不能低于6位字符！'
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>
  @import '@/assets/style/login-im.less';
</style>
