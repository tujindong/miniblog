/* eslint-disable camelcase */
/* eslint-disable indent */
/*
* 将时间戳转化为 “几周前” 的形式
*/
function getDateDiff (stamptime) {
    var current_time = Date.parse(new Date()) / 1000
    var diff = current_time - stamptime / 1000

    var agoAt = '刚刚'
    var timePoints = [
        { value: 60 * 60 * 24 * 365, suffix: '年前', max: 2 },
        { value: 60 * 60 * 24 * 30, suffix: '月前', max: 11 },
        { value: 60 * 60 * 24 * 7, suffix: '周前', max: 4 },
        { value: 60 * 60 * 24, suffix: '天前', max: 6 },
        { value: 60 * 60, suffix: '小时前', max: 23 },
        { value: 60 * 10, suffix: '0分钟前', max: 5 }
    ]

    for (var i = 0; i < timePoints.length; i++) {
        var point = timePoints[i]
        var mode = Math.floor(diff / point.value)
        if (mode > 1) {
            agoAt = Math.min(mode, point.max) + point.suffix
            break
        }
    }
    return agoAt
}

/*
*标准GPS时间转换为年月日
*/
function getDateFormat (time) {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}

function formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/*
*时间戳转换为年月日
*/
function getStamptime (stamptime) {
    let date = new Date(stamptime * 1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}

export default {
    getDateDiff,
    getDateFormat,
    getStamptime
}
