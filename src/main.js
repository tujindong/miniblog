import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

wx.cloud.init({
  env: 'tuxtu-3f99dd',
  traceUser: true
})

/*
    创建mpvue的全局变量
    @author 涂锦东
    @date 20191129
*/
getApp().globalData = {
  author: {
    openId: 'oRaiA4ouQx_oTN72QB_lsg-FFBNM',
    avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/9y1TcSAmicVSzoIkWic1gc3J1diaKAXTgtjibYuyWib3rF0Y4ewHBbib4MFD73BaibS79OxwKjvFFkIwpev3BO2GnEvUA/132',
    nickName: '涂小图'
  },
  user: {}
}
Vue.prototype.globalData = getApp().globalData
