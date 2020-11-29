
import moment from 'moment'
import cons from '@/constants'

/**
 * format 格式化日期时间
 * @param {Number} time 时间戳
 * @param {Number} type 0 全显 1 简单显示
 * @returns {String}
 */
export default function format (time, type = cons.dateFormatType.NORMAL) {
  const weekFirstDay = moment().weekday(0).format('YYYY-MM-DD')
  const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  if (moment(time).isAfter(weekFirstDay)) {
    const isToday = moment(time).date() === moment().date()
    const isYesterday = moment(time).date() === moment().date() - 1
    if (isToday) {
      return getTimeZhDesc(time) + moment(time).format('HH:mm')
    } else if (isYesterday) {
      return `昨天 ${type === cons.dateFormatType.NORMAL ? getTimeZhDesc(time) + moment(time).format('HH:mm') : ''}`
    } else {
      return weekList[moment(time).weekday()] + (type === cons.dateFormatType.NORMAL ? ' ' + getTimeZhDesc(time) + moment(time).format('HH:mm') : '')
    }
  } else if (moment().year() === moment(time).year()) {
    return moment(time).month() + 1 + '月' + moment(time).date() + '日 ' + (type === cons.dateFormatType.NORMAL ? getTimeZhDesc(time) + moment(time).format('HH:mm') : '')
  } else {
    return moment(time).year() + '年' + (moment(time).month() + 1) + '月' + moment(time).date() + '日 ' + (type === cons.dateFormatType.NORMAL ? getTimeZhDesc(time) + moment(time).format('HH:mm') : '')
  }
}

/**
 * getTimeZhDesc 获取时间中文描述(中午、上午、晚上、早上)
 * @param {Number} time 时间戳
 * @returns {String}
 */
function getTimeZhDesc (time) {
  if (isNight(time)) {
    return '晚上'
  } else if (isAfternoon(time)) {
    return '下午'
  } else if (isNoon(time)) {
    return '中午'
  } else if (isMorning(time)) {
    return '上午'
  }
}

function isNight (time) {
  const timeDis = moment(time).startOf('day').valueOf() + 18 * 60 * 60 * 1000 - moment(time).valueOf()
  return timeDis < 0
}

function isAfternoon (time) {
  const timeDis = moment(time).startOf('day').valueOf() + 18 * 60 * 60 * 1000 - moment(time).valueOf()
  if (5 * 60 * 60 * 1000 > timeDis > 0) {
    return true
  }
  return false
}

function isNoon (time) {
  const timeDis = moment(time).startOf('day').valueOf() + 13 * 60 * 60 * 1000 - moment(time).valueOf()
  if (60 * 60 * 1000 > timeDis > 0) {
    return true
  }
  return false
}

function isMorning (time) {
  const timeDis = moment(time).startOf('day').valueOf() + 12 * 60 * 60 * 1000 - moment(time).valueOf()
  return timeDis > 0
}
