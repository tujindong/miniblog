// pages/test/test.js
Page({
  data: {
    x:-60,
    y:45,
    touchDotX:0,
    touchDotY:0
  },
  backToMine:function(e){
    wx.switchTab({
      url: '../mine/mine'
    })
  },
  touchStart:function(e){
    let x = this.data.x;
    let y = this.data.y;
    let touchDotX = 0;//X按下时坐标
    let touchDotY = 0;//y按下时坐标
    touchDotX = e.touches[0].pageX - x; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY - y;
    this.setData({
      touchDotX: touchDotX,
      touchDotY: touchDotY
    })
  },
  touchMove:function(e){
    let touchDotX = this.data.touchDotX;
    let touchDotY = this.data.touchDotY;
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    this.setData({
      x: tmX,
      y: -tmY
    })
  },
})