import cons from '@/constants'

/**
 * getRoomList 获取群列表
 */
export function getRoomList (prefix) {
  let data = []
  try {
    data = JSON.parse(localStorage.getItem(`${prefix}${cons.ROOM_LIST_KEY}`) || '[]')
  } catch {}
  return data
}

/**
 * setRoomList 设置群列表
 */
export function setRoomList (prefix, data) {
  if (data instanceof Array) {
    localStorage.setItem(`${prefix}${cons.ROOM_LIST_KEY}`, JSON.stringify(data))
  }
}

/**
 * addRoom 添加群
 */
export function addRoom (prefix, room) {
  const data = getRoomList(prefix)
  data.unshift(room)
  localStorage.setItem(`${prefix}${cons.ROOM_LIST_KEY}`, JSON.stringify(data))
}

/**
 * removeRoom 删除群
 */
export function removeRoom (prefix, roomId) {
  const data = getRoomList(prefix)
  let activeIndex = 0
  data.filter((val, index) => {
    if (val.roomId === roomId) {
      activeIndex = index
    }
    return val.roomId === roomId
  })
  data.splice(activeIndex, 1)
  localStorage.setItem(`${prefix}${cons.ROOM_LIST_KEY}`, JSON.stringify(data))
}

/**
 * updateUnReadMsg 更新未读消息数
 * @params {number} type
 */
export function updateUnReadMsg (prefix, num, roomId, type = cons.updateUnreadMessageNumberStyle.COVER) {
  if (!roomId) {
    return
  }
  let data = getRoomList(prefix)
  data = data.map(val => {
    if (val.roomId === roomId) {
      switch (type) {
        case cons.updateUnreadMessageNumberStyle.COVER: val.unReadNum = num; break
        case cons.updateUnreadMessageNumberStyle.ADD: val.unReadNum += num; break
        case cons.updateUnreadMessageNumberStyle.REDUCE: val.unReadNum -= num; break
      }
      if (val.unReadNum < 0) {
        val.unReadNum = 0
      }
    }
    return val
  })
  localStorage.setItem(`${prefix}${cons.ROOM_LIST_KEY}`, JSON.stringify(data))
}

/**
 * updateLastMsg 更新最后一条消息内容
 */
export function updateLastMsg (prefix, { lastMsg, roomId, lastMsgTime, name, unReadNum = 0 }) {
  if (!roomId) {
    return
  }
  const data = getRoomList(prefix)
  if (data.filter(val => val.roomId === roomId).length === 0) { // 如果本地不存在该会话，创建一条
    addRoom(prefix, {
      roomId: roomId,
      lastMsgTime: lastMsgTime,
      lastMsg: lastMsg,
      name: name,
      nickname: null,
      isTop: 0,
      unReadNum: 1
    })
    return
  } else {
    let activeIndex = 0
    let activeVal = {}
    data.forEach((val, index) => {
      if (val.roomId === roomId) {
        val.lastMsg = lastMsg
        val.lastMsgTime = lastMsgTime
        val.unReadNum += unReadNum
        activeIndex = index
        activeVal = JSON.parse(JSON.stringify(val))
      }
    })
    data.splice(activeIndex, 1)
    data.unshift(activeVal)
  }
  localStorage.setItem(`${prefix}${cons.ROOM_LIST_KEY}`, JSON.stringify(data))
}

/**
 * getExpiredRoomIdList 获取过期会话ID列表
 */
export function getExpiredRoomIdList (prefix) {
  let data = []
  try {
    data = JSON.parse(localStorage.getItem(`${prefix}${cons.EXPIRED_ROOM_ID_LIST_KEY}`) || '[]')
  } catch {}
  return data
}

/**
 * addExpiredRoomIdList 添加过期会话ID列表
 */
export function addExpiredRoomIdList (prefix, data) {
  const list = getExpiredRoomIdList(prefix)
  if (list.indexOf(data) > -1) {
    return false
  } else {
    list.push(data)
    localStorage.setItem(`${prefix}${cons.EXPIRED_ROOM_ID_LIST_KEY}`, JSON.stringify(list))
    return true
  }
}

/**
 * removeExpiredRoomIdList 移除过期会话ID列表
 */
export function removeExpiredRoomIdList (prefix, data) {
  let list = getExpiredRoomIdList(prefix)
  if (list.indexOf(data) > -1) {
    list = list.filter(val => val !== data)
    localStorage.setItem(`${prefix}${cons.EXPIRED_ROOM_ID_LIST_KEY}`, JSON.stringify(list))
    return true
  } else {
    return false
  }
}
