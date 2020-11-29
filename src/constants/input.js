function getInputHeight () {
  return Math.round((window.innerWidth / 375 * 20) || 20)
}

function getMaxHeight () {
  return Math.round((window.innerWidth && window.innerWidth / 375 * 81) || 81)
}

function getSelectAreaHeight () {
  return Math.round((window.innerWidth && window.innerWidth / 375 * 200) || 200)
}

const input = {
  icon: { // 输入框icon显示
    TEXT: 0,
    EMOJI: 1
  },
  focusType: { //  文本框聚焦事件被触发的类型（ 2 点击表情按钮 3 点击文本按钮）
    DEFAULT: 1, // 点击input框
    EMOJI: 2, // 点击表情select区域
    TEXT: 3 // 点击选择文本按钮
  },
  HEIGHT: getInputHeight(), // 文本框初始高度
  MAX_HEIGHT: getMaxHeight(), // 文本框最大高度
  SELECT_AREA_HEIGHT: getSelectAreaHeight() // emoji、图片选择区域高度
}

window.onresize = function () {
  input.HEIGHT = getInputHeight()
  input.MAX_HEIGHT = getMaxHeight()
  input.SELECT_AREA_HEIGHT = getSelectAreaHeight()
}
export default input
