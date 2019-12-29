/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
/**
 * 登录授权相关
 * @Author tujindong
 * @date 2019/11/29
 */
function getUserInfo (suc, fail) {
    wx.getSetting({
        success (res) {
            if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                    lang: 'zh_CN',
                    success: function (res) {
                        suc && suc(res.userInfo)
                    }
                })
            } else {
                fail && fail(false)
            }
        }
    })
}

export default {
    getUserInfo
}
