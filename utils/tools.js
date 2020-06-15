// export const forEach = (arr, fn) => {
//   if (!arr.length || !fn) return
//   let i = -1
//   let len = arr.length
//   while (++i < len) {
//     let item = arr[i]
//     fn(item, i, arr)
//   }
// }

// /**
//  * @param {Array} arr1
//  * @param {Array} arr2
//  * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
//  */
// export const getIntersection = (arr1, arr2) => {
//   let len = Math.min(arr1.length, arr2.length)
//   let i = -1
//   let res = []
//   while (++i < len) {
//     const item = arr2[i]
//     if (arr1.indexOf(item) > -1) res.push(item)
//   }
//   return res
// }

// /**
//  * @param {Array} arr1
//  * @param {Array} arr2
//  * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
//  */
// export const getUnion = (arr1, arr2) => {
//   return Array.from(new Set([...arr1, ...arr2]))
// }

// /**
//  * @param {Array} target 目标数组
//  * @param {Array} arr 需要查询的数组
//  * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
//  */
// export const hasOneOf = (targetarr, arr) => {
//   return targetarr.some(_ => arr.indexOf(_) > -1)
// }

// /**
//  * @param {Number} num 数值
//  * @returns {String} 处理后的字符串
//  * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
//  */
// const getHandledValue = num => {
//   return num < 10 ? '0' + num : num
// }

// 转化为yyyy-mm-dd HH:MM:ss
export function jsTime(val) {
  if (val === '') {
    return '----'
  } else if (val === '0001-01-01T00:00:00Z') {
    return '----'
  } else if (val === '5000-01-01T23:59:59+08:00') {
    return '永久'
  } else {
    val = val.toString().replace('T', ' ')
    return val.substring(0, 19)
  }
}

export function formatDateTime(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

export function jsWeekTime() {
  let startStop = []; //起止日期数组
  let currentDate = new Date(); //获取当前时间
  let week = currentDate.getDay(); //返回date是一周中的某一天
  let millisecond = 1000 * 60 * 60 * 24; //一天的毫秒数
  let minusDay = week != 0 ? week - 1 : 6; //减去的天数    if(weeks == 'current'){  /*本周*/    　　　        
  let monday = new Date(new Date(currentDate.getTime() - (minusDay * millisecond)).setHours(0, 0, 0, 0)); //本周 周一 0:00     　　　
  let sunday = new Date(new Date(monday.getTime() + 6 * millisecond).setHours(23, 59, 59, 0)); //本周 周日 23:59 

  startStop.push(formatDateTime(monday), formatDateTime(sunday));
  return startStop
}

// /**
//  * @returns {String} 当前浏览器名称
//  */
// export const getExplorer = () => {
//   const ua = window.navigator.userAgent
//   const isExplorer = (exp) => {
//     return ua.indexOf(exp) > -1
//   }
//   if (isExplorer('MSIE')) return 'IE'
//   else if (isExplorer('Firefox')) return 'Firefox'
//   else if (isExplorer('Chrome')) return 'Chrome'
//   else if (isExplorer('Opera')) return 'Opera'
//   else if (isExplorer('Safari')) return 'Safari'
// }
