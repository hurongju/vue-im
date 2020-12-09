/**
 * handleFriendList 处理联系人列表
 * @param {Array} data 联系人列表
 */
export function handleFriendList (data) {
  if (!(data instanceof Array)) {
    return []
  }
  let prefixList = []
  const resultList = []
  if (data.length > 0) {
    data.forEach(val => {
      const prefix = val.name.substr(0, 1)
      prefixList.push(prefix)
    })
    prefixList = Array.from(new Set(prefixList))
    for (let i = 0, length = prefixList.length; i < length; i++) {
      const obj = {
        id: prefixList[i].toUpperCase()
      }
      obj.list = data.filter(val => {
        return val.name.substr(0, 1) === prefixList[i]
      })
      resultList.push(obj)
    }
  }
  resultList.sort((a, b) => {
    return a.id.charCodeAt() - b.id.charCodeAt()
  })
  return resultList
}
