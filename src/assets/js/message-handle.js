import { indexOfEmoji } from './emoji'
import cons from '@/constants'

const escapeChars = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  '&': '&amp;'
}

/**
 * convertEmoji 转换emoji字符串
 * @param {String} message 待转消息
 */
function convertEmoji (message) {
  return message.replace(/\[[\u4E00-\u9FA5a-zA-Z]*?\]/g, function (val) {
    const idx = indexOfEmoji(val)
    if (~idx) {
      const el = document.createElement('div')
      const width = window.innerWidth / 375 * 20
      const height = window.innerWidth / 375 * 20
      const margin = window.innerWidth / 375 * 1
      el.setAttribute('style', `display: inline-block;width: ${width}px;height: ${height}px;vertical-align: bottom;margin-right: ${margin}px;
      background: url(${require('../../assets/img/emoji.png')});background-size: 1100% 1000%;user-select: none;
      background-repeat: no-repeat;background-position: ${computedPos(idx)}`)
      return elementToStr(el)
    } else {
      return val
    }
  })
}

/**
 * elementToStr Element转字符串
 * @param {Element} el 待转el
 */
function elementToStr (el) {
  const o = document.createElement('div')
  o.appendChild(el)
  return o.innerHTML
}

/**
 * computedPos 计算emoji背景图位置
 * @param {*} index
 */
function computedPos (index) {
  const pos = [0, 0]
  pos[0] = (index % 11) * 10
  pos[1] = (Math.floor(index / 11)) * 100 / 9
  let backgroundPosition = `${pos[0]}% ${pos[1]}%`
  if (index === 109) { // 最后一个图标安卓显示多出了一点
    backgroundPosition = `${pos[0]}% 100.5%`
  }
  return backgroundPosition
}

export default function messageHandler (message) {
  switch (message.type) {
    case cons.messageType.TEXT:
      message.content = message.content.replace(/[&<>"']/g, m => escapeChars[m]).replace(/\n|\r|\r\n/g, '<br>') // 转义
      message.content = convertEmoji(message.content)
      break
  }
}
