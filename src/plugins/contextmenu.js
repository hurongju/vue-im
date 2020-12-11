/**
 * 设置contextmenu
 * @param {Element} el 触发事件元素
 * @param {Array} menuOptions 菜单options
 * @param {Number} bottom - 底部屏蔽区域高度
 */
function setMenu ({ el, menuOptions, bottom }) {
  if (!(el instanceof HTMLElement)) {
    return
  }
  let timeout = null
  el.touchstartHandler = (e) => {
    e.stopPropagation()
    timeout = setTimeout(() => {
      el.style.background = '#ebedf0'
      // 获取根元素的fontSize将长按的位置px转为rem
      const fontSize = parseFloat(document.documentElement.style.fontSize)
      addMenu([e.targetTouches[0].pageX / fontSize, e.targetTouches[0].pageY / fontSize], menuOptions, bottom, el)
    }, 700)
  }
  el.touchendHandler = () => {
    clearTimeout(timeout)
  }
  el.contextmenuHandler = (e) => {
    e.preventDefault()
  }
  el.addEventListener('touchstart', el.touchstartHandler)
  el.addEventListener('touchend', el.touchendHandler)
  el.addEventListener('contextmenu', el.contextmenuHandler)
}

/**
 * 计算menu位置和tansform参数
 * @param {Array[Number x, Number y]} - 事件触发的X, Y(单位rem)
 * @param {Number} width - 菜单列表宽度(rem)
 * @param {Number} height - 菜单列表长度(rem)
 * @param {Number} bottom - 底部屏蔽区域高度(rem)
 * @return {Array[Number a, Number b, String c, String d]} - 菜单定位位置 left: a; top: b -- transform-origin: c d
 */
function computedPosition ([x, y], width, height, bottom) {
  // 获取根元素的fontSize将长按的位置px转为rem
  const fontSize = parseFloat(document.documentElement.style.fontSize)
  const widowWidth = window.innerWidth / fontSize
  const widowHeight = window.innerHeight / fontSize
  // 计算x是否超出page宽度的一半
  const isLeft = x > widowWidth / 2 ? -1 : 0
  let isTop = y > (widowHeight - bottom) / 2 ? -1 : 0
  if (widowHeight - bottom - y < height) {
    isTop = -1
  }
  x = x + isLeft * width
  y = y + isTop * height
  return [x, y, isLeft ? 'right' : 'left', isTop ? 'bottom' : 'top']
}

/**
 * 计算menu位置
 * @param {Array[Number x, Number y]} pos - 事件触发的X, Y
 * @param {Array} menuOptions 菜单options
 * @param {Number} bottom - 底部屏蔽区域高度
 * @param {Element} el 触发事件元素
 */
function addMenu (pos, menuOptions, bottom, el) {
  const width = 120 / 37.5 // 菜单宽度(rem)
  const height = 60 / 37.5 // 菜单item高度(rem)
  const paddingLeft = 20 / 37.5 // 菜单作左内边距(rem)
  const fontSize = 16 / 37.5 // 菜单文字大小(rem)
  let menu = document.createElement('div')
  const menuDialogClass = 'vue-contextmenu__dialog'
  const [left, top, originX, originY] = computedPosition(pos, width, height * menuOptions.data.length, bottom)
  menu.style.cssText = 'width: 100%;height: 100vh;position: fixed;z-index: 9999;user-select: none;'
  menu.setAttribute('class', menuDialogClass)
  let str = `<div class="vue-contextmenu__content" style="font-size: ${fontSize}rem;transform-origin: ${originX} ${originY};position: absolute;left: ${left}rem;top: ${top}rem;box-shadow: 1px 1px 10px #aaa;background: #fff;transform: scale(0);transition: all .2s;">`
  menuOptions.data.forEach(val => {
    str += `<div class="vue-contextmenu__content-item" data-id="${val.id}" style="width: ${width}rem;height: ${height}rem;color: #000;box-sizing: border-box;padding-left: ${paddingLeft}rem;line-height: ${height}rem;">${val.name}</div>`
  })
  str += '</div>'
  menu.innerHTML = str
  menu.clickHandler = (e) => {
    menuOptions.handler.call(undefined, e.target.getAttribute('data-id'), el)
    el.style.background = null
    menu.removeEventListener('touchstart', menu.touchstartHandler)
    menu.removeEventListener('click', menu.clickHandler)
    menu.removeEventListener('contextmenu', menu.contextmenuHandler)
    menu.getElementsByClassName('vue-contextmenu__content')[0].style.transform = 'scale(0)'
    setTimeout(() => {
      menu.parentElement.removeChild(menu)
      menu = null
    }, 200)
  }
  menu.contextmenuHandler = (e) => {
    e.preventDefault()
  }
  menu.touchstartHandler = (e) => {
    if (e.target.className === menuDialogClass) {
      e.preventDefault()
      el.style.background = null
      menu.removeEventListener('touchstart', menu.touchstartHandler)
      menu.removeEventListener('click', menu.clickHandler)
      menu.removeEventListener('contextmenu', menu.contextmenuHandler)
      menu.getElementsByClassName('vue-contextmenu__content')[0].style.transform = 'scale(0)'
      setTimeout(() => {
        menu.parentElement.removeChild(menu)
        menu = null
      }, 200)
    }
  }
  menu.addEventListener('click', menu.clickHandler)
  menu.addEventListener('touchstart', menu.touchstartHandler)
  menu.addEventListener('contextmenu', menu.contextmenuHandler)
  addBackColorEvent(menu)
  document.body.appendChild(menu)
  setTimeout(() => {
    menu.getElementsByClassName('vue-contextmenu__content')[0].style.transform = 'scale(1)'
  }, 25)
}

/**
 * 为菜单元素添加背景色监听
 * @param {Element} menu 菜单元素
 */
function addBackColorEvent (menu) {
  const menuItems = menu.getElementsByClassName('vue-contextmenu__content-item')
  menuItems.forEach((item, index) => {
    menu[`itemTouchstartHandler${index}`] = () => {
      item.style.background = '#ccc'
    }
    menu[`itemTouchendHandler${index}`] = () => {
      item.removeEventListener('touchstart', menu[`itemTouchstartHandler${index}`])
      item.removeEventListener('touchend', menu[`itemTouchendHandler${index}`])
      item.style.background = null
    }
    item.addEventListener('touchstart', menu[`itemTouchstartHandler${index}`])
    item.addEventListener('touchend', menu[`itemTouchendHandler${index}`])
  })
}

export default {
  install (Vue, options = {}) {
    Vue.directive('menu', {
      bind (el, binding) {
        const menuOptions = binding.value
        if (typeof menuOptions === 'undefined') {
          return
        }
        setMenu({ el, menuOptions, ...options })
      },
      componentUpdated (el, binding) {
        el.removeEventListener('touchstart', el.touchstartHandler)
        el.removeEventListener('touchend', el.touchendHandler)
        el.removeEventListener('contextmenu', el.contextmenuHandler)
        const menuOptions = binding.value
        if (typeof menuOptions === 'undefined') {
          return
        }
        setMenu({ el, menuOptions, ...options })
      },
      unbind (el) {
        el.removeEventListener('contextmenu', el.contextmenuHandler)
      }
    })
  }
}
