const input = {
  icon: { // 输入框icon显示
    TEXT: 0,
    EMOJI: 1
  },
  focusType: { //  文本框聚焦事件被触发的类型（ 2 点击表情按钮 3 点击文本按钮）
    TEXT: 1, // 点击选择文本按钮
    EMOJI: 2, // 点击表情select区域
    KEYBOARD: 3 // 弹出软键盘
  },
  HEIGHT: Math.floor(20 / 37.5 * 100) / 100, // 文本框初始高度(rem)
  MAX_HEIGHT: Math.floor(80 / 37.5 * 100) / 100, // 文本框最大高度(rem)
  SELECT_AREA_HEIGHT: Math.floor(200 / 37.5 * 100) / 100 // emoji、图片选择区域高度(rem)
}

export default input
