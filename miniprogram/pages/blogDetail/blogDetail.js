const APP_ID ='wx688d2296e069717a';//输入小程序appid  
const APP_SECRET ='662e07b234b50c46220d4eafd20a7330';//输入小程序app_secret  
let OPEN_ID=''//储存获取到openid  
let SESSION_KEY=''//储存获取到session_key  
const db = wx.cloud.database();
const _ = db.command;
let util = require('../../utils/util.js');
let Wxparse = require('../../wxParse/wxParse.js');
//格式化数据
let formatList = function(res){
  let lists = [];
  for(let data of res.data){
    let cNickName = data.cNickName;
    let cAvatarUrl = data.cAvatarUrl;
    let formatDate = util.formatTimeYMD(data.createDate);
    let comment = data.comment;
    lists.push({
      cNickName:cNickName,
      cAvatarUrl: cAvatarUrl,
      date:formatDate,
      comment:comment
    })
  }
  return lists;
};
Page({
  data: {
    detailFlag:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickName:'',
    avatarUrl:'',
    openId:'',
    date:'',
    article:'',
    commentContent:'',
    commentValue:'',
    commentNum:0,
    blogId:'',
    voteNum:0
  },
  onLoad: function (options) {
    let blogId = options.blogId;
    this.setData({
      blogId:blogId
    })
    this.getData(blogId);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    let blogId = this.data.blogId;
    let commentNum = this.data.commentNum;
    //点赞刷新
    db.collection('T-blogList').doc(blogId).get().then(res => {
      this.setData({
        blogListDetail: res.data,
      });
    });
    //评论内容刷新
    db.collection('T-comment').where({
      blogId: blogId
    }).get().then(res => {
      let lists = formatList(res);
      this.setData({
        commentListDetail: lists
      })
      wx.stopPullDownRefresh();
    }); 
    //评论数量刷新
    db.collection('T-comment').where({
      blogId: blogId
    }).count().then(res => {
      this.setData({
        commentNum: res.total
      })
    });
    wx.stopPullDownRefresh();
  },
  //加载列表数据
  getData: function (blogId){
    //文章数据
    db.collection('T-blogList').doc(blogId).get().then(res => {
      let _this = this;
      let lists = [];
      let formateDate = util.formatTime(res.data.date);
      this.setData({
        blogListDetail: res.data,
        blogId: res.data._id,
        date: formateDate,
        article: res.data.article
      });
      let article = this.data.article;
      Wxparse.wxParse('article', 'html', article, _this, 5);
    });
    //评论数据
    db.collection('T-comment').where({
      blogId: blogId
    }).get().then(res => {
      let lists = formatList(res);
      this.setData({
        commentListDetail: lists
      })
    });
    //评论数量
    db.collection('T-comment').where({
      blogId:blogId
    }).count().then(res => {
      this.setData({
        commentNum:res.total
      })
    });
  },
  //弹出授权button页面
  getUserInfoPopup: function () {
    let detailFlag = this.data.detailFlag;
    this.setData({
      detailFlag: false
    })
  },
  //关闭授权弹窗
  hideDetail:function(){
    let detailFlag = this.data.detailFlag;
    this.setData({
      detailFlag:true
    })
  },
  //获取用户openId
  getUserId: function (event){
    wx.login({
      success:res =>{
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data:{
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'  
          },
          method:'GET',
          success:res => {
            let openId = res.data.openid;
            this.setData({
              openId:openId
            })
          }
        })
      }
    });
    this.getSetting();
  },
  //微信授权，获取用户昵称头像
  getSetting:function(){
    let nickName = this.data.nickName;
    let avatarUrl = this.data.avatarUrl;
    wx.getSetting({
      success:res =>{
        if (res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:res =>{
              this.setData({
                nickName:res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl
              })
            }
          })
        }else{
          this.getUserInfoPopup();//若用户未授权弹出授权窗口
        }
      }
    })
  },
  //判断用户存在，不存在则添加用户到数据库
  getUserInfoHandler:function(event){
    let openId = this.data.openId;
    let nickName = this.data.nickName;
    let avatarUrl = this.data.avatarUrl;
    //添加用户到数据库
    db.collection('T-user').where({
      _openid:openId
    }).get({
      success:res=>{
        let userInfos = res.data;
        if(userInfos && userInfos.length > 0){
          return false;
        }else{
          setTimeout(() => {
            db.collection('T-user').add({
              data:{
                nickName: nickName,
                avatarUrl: avatarUrl
              },
              success:res=>{
                console.log('添加用户成功')
              }
            })
          })
        }
      }
    });
  },
  //输入评论
  commentInput:function(event){
    this.setData({
      commentContent: event.detail.value
    })
  },
  //上传评论
  commentConfirm:function(event){
    let commentValue = this.data.commentValue;
    let commentContent = this.data.commentContent;
    let blogId = this.data.blogId;
    let nickName = this.data.nickName;
    let avatarUrl = this.data.avatarUrl;
    let openId = this.data.openId;
    let createDate = new Date();
    let commentNum = this.data.commentNum;
    if (!commentContent.length == 0 && !commentContent.trim().length == 0){
      //添加评论
      db.collection('T-comment').add({
        data: {
          blogId: blogId,
          cNickName: nickName,
          cAvatarUrl: avatarUrl,
          comment: commentContent,
          createDate: createDate
        },
        success: res => {
          wx.showToast({
            title: '评论成功',
            icon: 'none',
            duration: 1500
          })
          this.onPullDownRefresh();
        }
      });
      //更新首页评论计数
      wx.cloud.callFunction({
        name: 'commentUpdate',
        data:{
          blogid: blogId,
          feild: commentNum + 1
        },success:res=>{
          console.log(res)
        }
      })
      // db.collection('T-blogList').doc(blogId).update({
      //   data: {
      //     comment: commentNum + 1
      //   }
      // }).then(res => {
      //   console.log('更新评论数量成功', commentNum)
      // })
      this.setData({
        commentValue: ''
      });
      this.getUserInfoHandler(); //添加用户到数据库
    }else{
      wx.showToast({
        title: '评论不可以为空哦!',
        icon:'none',
        duration:1500
      })
    }
  },
  //点赞
  vote:function(event){
    this.getUserId(); //获取用户openid
    let openId = this.data.openId;
    let blogId = this.data.blogId;
    let voteNum = this.data.voteNum;
    db.collection('T-vote').where({
      blogId: blogId
    }).count().then(res => {
      let voteNum = res.total;
      this.setData({
        voteNum: voteNum
      })
    })
    db.collection('T-vote').where({ 
      _openid: openId
    }).get({
      success: res => {
        let userInfos = res.data;
        if (userInfos && userInfos.length > 0) { //判断同一用户不可以重复点赞
          return false;
        } else {
          setTimeout(() => {
            db.collection('T-vote').add({
              data: {
                blogId: blogId,
                like:true
              },
              success: res => {
                console.log('添加点赞成功');
              }
            })
          })
        }
      }
    });
    db.collection('T-vote').where({
      blogId:blogId
    }).get({
      success:res=>{
        let dataInfo = res.data;
        if(dataInfo && dataInfo.length > 0){  //不同文章可以添加点赞
          return false;
        }else{
          setTimeout(() => {
            db.collection('T-vote').add({
              data: {
                blogId: blogId,
                like: true
              },
              success: res => {
                console.log('添加点赞成功')
              }
            })
          })
        }
      }
    });
    db.collection('T-blogList').doc(blogId).update({
      data:{
        like:voteNum
      }
    }).then(res =>{
      console.log('点赞成功')
    });
    this.onPullDownRefresh();
  },
  //评论tab返回主页
  backToHomepage:function(event){
    wx.switchTab({
      url: '../index/index'
    })
  },
  //标签搜索
  tagSearch:function(event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../search/search?tagId=' + id,
    })
  },
})