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
  HEIGHT: 20 / 37.5, // 文本框初始高度(rem)
  MAX_HEIGHT: 80 / 37.5, // 文本框最大高度(rem)
  SELECT_AREA_HEIGHT: 200 / 37.5 // emoji、图片选择区域高度(rem)
}

export default input
