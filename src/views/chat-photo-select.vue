<template>
  <!-- 聊天发送图片选择组件 chat-photo-select -->
  <div class="chat-photo-select__container">
    <section class="chat-photo-select__item" v-for="item in selectInfo" :key="item.id">
      <div>
        <div class="chat-photo-select__icon" @click="plusFileHandler(item.id)">
          <van-icon :name="item.icon" size="28"/>
        </div>
        <input class="chat-photo-select__file" v-if="!isPlus" type="file" accept="image/*" :capture="item.type" :multiple="item.multiple" @change="fileHandler"/>
      </div>
      <p class="chat-photo-select__title">
        {{item.title}}
      </p>
    </section>
  </div>
</template>

<script>
import { Icon, Toast } from 'vant'
import { mapGetters } from 'vuex'
import cons from '@/constants'
import md5 from 'md5'

export default {
  name: 'ChatPhotoSelect',
  components: {
    [Icon.name]: Icon
  },
  data () {
    return {
      selectInfo: [{
        id: 1,
        icon: 'photo',
        type: false,
        title: '相册',
        multiple: true
      }, {
        id: 2,
        icon: 'photograph',
        type: 'camera',
        title: '拍照',
        multiple: false
      }],
      isPlus: window.plus || false
    }
  },
  computed: {
    ...mapGetters(['username', 'activeRoomId', 'title'])
  },
  methods: {
    plusFileHandler (id) {
      if (!window.plus) {
        return
      }
      if (id === 1) { // 选择相册
        this.galleryImg()
      } else if (id === 2) { // 选择相机
        this.captureImage()
      }
    },
    captureImage () {
      const cmr = plus.camera.getCamera()
      var fmt = cmr.supportedImageFormats[0]
      cmr.captureImage((path) => {
        this.uploadImg([plus.io.convertLocalFileSystemURL(path)])
      }, () => {}, { format: fmt })
    },
    downloadImg (imageUrl, debug = false) {
      const localImageUrl = '_downloads/image/' + md5(imageUrl) + '.jpg' // 缓存本地图片url
      const downloadTask = plus.downloader.createDownload(`${cons.url.PREFIX}/${imageUrl}`, {
        filename: localImageUrl // filename:下载任务在本地保存的文件路径
      }, (download, status) => {
        if (status !== 200) {
          // 下载失败,删除本地临时文件
          debug && console.log('下载失败,status' + status)
          if (localImageUrl != null) {
            plus.io.resolveLocalFileSystemURL(localImageUrl, (entry) => {
              entry.remove((entry) => {
                debug && console.log('临时文件删除成功' + localImageUrl)
                // 重新下载图片
                this.downloadImg(imageUrl)
              }, (e) => {
                debug && console.log('临时文件删除失败' + localImageUrl)
              })
            })
          }
        } else {
          debug && console.log('下载图片成功' + localImageUrl)
          debug && console.log('下载图片平台绝对路径' + plus.io.convertLocalFileSystemURL(localImageUrl))
        }
      })
      downloadTask.start()
    },
    uploadImg (files) {
      const task = plus.uploader.createUpload(cons.url.UPLOAD_IMG, { method: 'POST', priority: 100 },
        (t, status) => {
          // 上传完成
          if (status === 200) {
            let responseObj = null
            try {
              responseObj = JSON.parse(t.responseText)
            } catch (e) {}
            if (responseObj.success) {
              this.$bus.$emit('send-image', responseObj.data, true)
              // 下载图片到本地缓存
              responseObj.data.forEach(val => {
                this.downloadImg(val)
              })
            }
          } else {
            return Toast('上传图片失败')
          }
        }
      )
      const token = localStorage.getItem(cons.TOKEN_KEY)
      task.setRequestHeader('Authorization', `Bearer ${token}`)
      for (var i in files) {
        files[i] = /^file:/.test(files[i]) ? files[i] : 'file://' + files[i]
        task.addFile(files[i], { key: 'file' + i })
        // 发送本地消息
        this.$bus.$emit('accept-local-message', {
          from: this.username,
          to: this.title,
          id: Number(Math.random().toString().substr(3, 6) + Date.now()).toString(36),
          roomId: this.activeRoomId,
          type: 2,
          content: files[i],
          sendTime: Date.now()
        })
      }
      task.start()
    },
    galleryImg () { // 从相册中选择图片
      plus.gallery.pick((gallery) => {
        this.uploadImg(gallery.files)
      }, (e) => {
      }, { filter: 'image', maximum: 3, multiple: true, filename: '_downloads/image/', permissionAlert: true })
    },
    fileHandler (e) {
      const files = e.target.files
      // 默认图片类型
      const typeList = ['png', 'jpeg', 'jpg', 'gif']
      if (files.length > 3) {
        return Toast('最多支持选择3张图片')
      }
      // 上传文件
      const formData = new FormData()
      files.forEach(file => {
        if (!typeList.includes(file.type.replace('image/', ''))) {
          return Toast('图片格式不支持')
        }
        if (file.size / 1024 / 1024 > 10) {
          return Toast('图片发送只支持10M以内')
        }
        // 发送本地消息
        if (typeof FileReader === 'undefined') {
          return Toast('抱歉，你的浏览器不支持FileReader')
        } else {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = (e) => {
            this.$bus.$emit('accept-local-message', {
              from: this.username,
              to: this.title,
              id: Number(Math.random().toString().substr(3, 6) + Date.now()).toString(36),
              roomId: this.activeRoomId,
              type: 2,
              content: e.target.result,
              sendTime: Date.now()
            })
          }
          reader = null
        }
        formData.append('file', file)
      })
      this.$bus.$emit('send-image', formData)
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/style/chat-photo-select';
</style>
