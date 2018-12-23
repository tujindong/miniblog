// pages/mine/mine.js
const APP_ID = 'wx688d2296e069717a';//输入小程序appid  
const APP_SECRET = '662e07b234b50c46220d4eafd20a7330';//输入小程序app_secret  
let OPEN_ID = ''//储存获取到openid  
let SESSION_KEY = ''//储存获取到session_key  
Page({
  data: {
    snowNum: 39,
    snowArr:[],
    openId:''
  },
  onLoad:function(){
    this.snow();
  },
  //新增博客
  addBlog:function(){
    wx.login({
      success: res => {
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: res => {
            let openId = res.data.openid;
            if (openId == 'oRaiA4ouQx_oTN72QB_lsg-FFBNM'){
              wx.redirectTo({
                url: '../addBlog/addBlog'
              })
            }else{
              wx.showToast({
                title: 'Administrators Only',
                icon:'none',
                duration:1500
              })
            }
          }
        })
      }
    });
  },
  aboutMe:function(event){
    wx.redirectTo({
      url: '../cube/cube'
    })
  },
  //循环雪花容器
  snow:function(){
    let snowNum = this.data.snowNum;
    let snowArr = [];
    for(let i = 1; i <= snowNum; i++){
      snowArr.push(i)
    }
    this.setData({
      snowArr:snowArr
    })
  }
})