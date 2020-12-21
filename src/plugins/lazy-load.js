import md5 from 'md5'
import cons from '@/constants'
import Store from '@/store'

/**
 * 自定义图片本地缓存插件
 * @param {Element} el 待缓存元素
 * @param {String} imageUrl 待显示图片url
 * @param {String} placeholder 占位图片url
 * @param {Boolean} debug 开启调试log
 */
function lazyload ({ el, imageUrl, placeholder, debug = false }) {
  if (!window.plus) { // 非5+环境直接返回
    el.setAttribute('src', `${/^data:/.test(imageUrl) ? '' : (cons.url.PREFIX + '/')}${imageUrl}`)
    return
  } else {
    placeholder && el.setAttribute('src', placeholder)
  }
  if (el.getAttribute('data-loaded')) {
    return
  }
  debug && console.log('传入图片URL', imageUrl)
  const localImageUrl = '_downloads/image/' + md5(imageUrl) + '.jpg' // 缓存本地图片url
  const absoluteImagePath = /^file:/.test(imageUrl) ? imageUrl : 'file://' + plus.io.convertLocalFileSystemURL(localImageUrl) // 平台绝对路径
  debug && console.log('absoluteImagePath为' + absoluteImagePath)
  plus.io.getFileInfo({
    filePath: absoluteImagePath,
    success: () => {
      if (Store.getters.isAndroid) { // android直接设置本地路径
        el.setAttribute('src', absoluteImagePath)
        el.setAttribute('data-loaded', true)
      } else { // ios直接设置本地路径无法显示图片，需要转成base64
        plus.io.resolveLocalFileSystemURL(absoluteImagePath, (entry) => {
          entry.file((file) => {
            var fileReader = new plus.io.FileReader()
            fileReader.readAsDataURL(file, 'utf-8')
            fileReader.onloadend = (evt) => {
              el.setAttribute('src', evt.target.result)
              el.setAttribute('data-loaded', true)
            }
            debug && console.log(file.size + '--' + file.name)
          })
        }, (e) => {
          debug && console.log('Resolve file URL failed: ' + e.message)
        })
      }
    },
    fail: () => {
      debug && console.log('不存在本地缓存图片文件')
      // 下载图片缓存到本地
      debug && console.log('开始下载图片' + `${cons.url.PREFIX}/${imageUrl}` + ' 缓存到本地: ' + localImageUrl);
      (function downloadImg () {
        const downloadTask = plus.downloader.createDownload(`${cons.url.PREFIX}/${imageUrl}`, {
          filename: localImageUrl // filename:下载任务在本地保存的文件路径
        }, (download, status) => {
          if (status !== 200) {
            // 下载失败,删除本地临时文件
            debug && console.log('下载失败,status' + status)
            if (localImageUrl != null) {
              plus.io.resolveLocalFileSystemURL(localImageUrl, function (entry) {
                entry.remove(function (entry) {
                  debug && console.log('临时文件删除成功' + localImageUrl)
                  // 重新下载图片
                  downloadImg()
                }, function (e) {
                  debug && console.log('临时文件删除失败' + localImageUrl)
                })
              })
            }
          } else {
            if (Store.getters.isAndroid) { // android直接设置本地路径
              el.setAttribute('src', absoluteImagePath)
              el.setAttribute('data-loaded', true)
            } else { // ios直接设置本地路径无法显示图片，需要转成base64
              plus.io.resolveLocalFileSystemURL(absoluteImagePath, (entry) => {
                entry.file((file) => {
                  var fileReader = new plus.io.FileReader()
                  fileReader.readAsDataURL(file, 'utf-8')
                  fileReader.onloadend = (evt) => {
                    el.setAttribute('src', evt.target.result)
                    el.setAttribute('data-loaded', true)
                  }
                  debug && console.log(file.size + '--' + file.name)
                })
              }, (e) => {
                debug && console.log('Resolve file URL failed: ' + e.message)
              })
            }
          }
        })
        downloadTask.addEventListener('statechanged', function (download, status) {
          if (download.state === 4 && status === 200) {
            // 下载完成
            debug && console.log('Download success: ' + download.getFileName())
          } else {
            if (status === 404) { // 图片404终止任务
              downloadTask.abort()
            }
          }
        }, false)
        downloadTask.start()
      })()
    }
  })
}

export default {
  install (Vue, options = {}) {
    Vue.directive('lazy', {
      bind (el, binding) {
        const imageUrl = binding.value
        lazyload({ el, imageUrl, ...options })
      }
    })
  }
}
