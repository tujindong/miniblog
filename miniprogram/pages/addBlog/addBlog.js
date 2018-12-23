// pages/addBlog/addBlog.js
const db = wx.cloud.database();
const _ = db.command;
let util = require('../../utils/util.js');
Page({
  data: {
    value:'',
    imgName:'',
    value: '',
    title:'',
    addId:'',
    author:'',
    imgUrl:'',
    tags:'',
    intro:'',
    article:'',
    date:'',
    page:0,
    loadingStatus:true
  },
  onLoad:function(){
    this.getList();
  },
  //返回关于
  backToMine:function(event){
    wx.switchTab({
      url: '../mine/mine'
    })
  },
  //图片上传
  uploadImg: function () {
    let imgName = this.data.imgName;
    let value = this.data.value;
    let formatDate = util.formatTimeYMDcon(new Date());
    let fullName = formatDate + '_' + imgName;
    if(imgName && imgName.length !== 0){
      console.log(imgName)
      //选择图片
      wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success: res => {
          const filePath = res.tempFilePaths[0]
          //上传图片
          const cloudPath = fullName + filePath.match(/\.[^.]+?$/)[0];
          console.log(cloudPath);
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              wx.showToast({
                title: '图片上传成功！',
                icon:'none',
                duration:1500
              })
              this.setData({
                value:''
              })
            }
          })
        }
      });
    }else{
      wx.showToast({
        title: '图片名不能为空！',
        icon:'none',
        duration:1500
      })
    }
  },
  //加载文章列表
  getList:function(event){
    db.collection('T-blogList').get().then(res =>{
      this.setData({
        blogList:res.data,
        loadingStatus:false
      })
    })
  },
  //触底加载更多
  onReachBottom:function(event){
    let page = this.data.page + 20;
    db.collection('T-blogList').skip(page).get().then(res => {
      let new_data = res.data;
      let old_data = this.data.blogList;
      this.setData({
        blogList: old_data.concat(new_data),
        page: page,
        loadingStatus: false
      });
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    db.collection('T-blogList').get().then(res => {
      this.setData({
        blogList: res.data,
        page: 0
      })
    })
    wx.stopPullDownRefresh();
  },
  //跳转到文章详情
  navToDetail:function(event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../blogDetail/blogDetail?blogId=' + id
    });
  },
  //删除文章
  delBlog:function(event){
    let id = event.currentTarget.dataset.id;
    db.collection('T-blogList').doc(id).remove({
      success:res =>{
        wx.showToast({
          title: '删除成功',
          icon:'none',
          duration:1500
        });
      }
    });
    this.onPullDownRefresh();
  },
  /**输入框组 start**/
  inputImgName:function(event){
    let imgName = this.data.imgName;
    this.setData({
      imgName:event.detail.value
    })
  },
  inputTitle:function(event){
    let title = this.data.title;
    this.setData({
      title: event.detail.value
    })
  },
  inputId:function(event){
    let addId = this.data.addId;
    this.setData({
      addId: event.detail.value
    })
  },
  inputAuthor:function(event){
    let author = this.data.author;
    this.setData({
      author: event.detail.value
    })
  },
  inputImgUrl:function(event){
    let imgUrl = this.data.imgUrl;
    this.setData({
      imgUrl: event.detail.value
    })
  },
  inputTags:function(event){
    let tags = this.data.tags;
    this.setData({
      tags: event.detail.value
    })
  },
  inputIntro:function(event){
    let intro = this.data.intro;
    this.setData({
      intro: event.detail.value
    })
  },
  inputArticle:function(event){
    let article = this.data.article;
    this.setData({
      article: event.detail.value
    })
  },
  /**输入框组 end**/
  //添加博客
  addBlog:function(event){
    let title, addId, author, imgUrl, tags, arrTags = [], intro, article,date,formatDate,year;
    title = this.data.title;
    addId = this.data.addId;
    date = new Date();
    author = this.data.author;
    imgUrl = this.data.imgUrl;
    tags = this.data.tags;
    intro = this.data.intro;
    article = this.data.article;
    arrTags = tags.trim().split(/[ |,|，]/); //标签格式化
    formatDate = util.formatTimeYMD(date);
    year = parseInt(formatDate.split('.')[0]);
    db.collection('T-blogList').add({
      data:{
        title:title,
        id:addId,
        author:author,
        imgUrl:imgUrl,
        intro:intro,
        date:date,
        view:0,
        comment:0,
        like:0,
        tags:arrTags,
        article: article,
        year:year
      },
      success:res=>{
        wx.showToast({
          title: '添加文章成功',
          icon:'none',
          duration:1500
        })
      }
    });
  },
})