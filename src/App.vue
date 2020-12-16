<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      firstBackTime: null
    }
  },
  mounted () {
    if (window.plus) {
      this.plusReady()
    } else {
      document.addEventListener('plusready', this.plusReady, false)
    }
  },
  beforeDestroy () {
    if (window.plus) {
      plus.key.removeEventListener('backbutton', this.backHandler, false)
    }
    document.removeEventListener('plusready', this.plusReady, false)
  },
  methods: {
    plusReady () {
      plus.key.addEventListener('backbutton', this.backHandler, false)
      if (__STG__) {
        plus.nativeUI.toast('首页加载时间：' + plus.runtime.launchLoadedTime + 'ms')
      }
    },
    backHandler () {
      if (this.$route.name === 'ImChat') {
        this.$bus.$emit('backup', (err, status) => {
          if (err) { return }
          if (status) {
            this.$router.go(-1)
          }
        })
        return
      }
      if (this.$route.meta.backflag) {
        this.quit()
      } else {
        this.$router.go(-1)
      }
    },
    quit () {
      if (!this.firstBackTime) {
        this.firstBackTime = Date.now()
        plus.nativeUI.toast('再按一次退出App')
        setTimeout(() => {
          this.firstBackTime = null
        }, 2000)
      } else {
        if ((Date.now() - this.firstBackTime) < 2000) {
          plus.runtime.quit()
        }
      }
    }
  }
}
</script>
