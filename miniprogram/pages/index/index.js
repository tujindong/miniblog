const db = wx.cloud.database();
const _ = db.command;
const blogList = db.collection('T-blogList');
let util = require('../../utils/util.js');
let formatList = function(res){
  let lists = [];
  for (let data of res.data) {
    let blogId = data._id;
    let numId = data.id;
    let _openId = data._openid;
    let title = data.title;
    let formatDate = util.formatTimeYMD(data.date);
    let intro = data.intro;
    let author = data.author;
    let view = data.view;
    let comment = data.comment;
    let like = data.like;
    let imgUrl = data.imgUrl;
    lists.push({
      blogId: blogId,
      numId: numId,
      _openId: _openId,
      title: title,
      date: formatDate,
      intro: intro,
      author: author,
      view: view,
      comment: comment,
      like: like,
      imgUrl: imgUrl
    })
  };
  return lists;
}
Page({
  data: {
    counter:1,
    page:0,
    posts:[],
    loadingStatus:true
      },
  //页面加载
  onLoad: function (options) {
    this.getData();
  },
  //获取博客数据
  getData: function () {
    //文章数据
    db.collection('T-blogList').orderBy('id','asc').get().then(res => {
      let lists = formatList(res);
      this.setData({                                                                       
        blogList:lists,
        loadingStatus:false
      })
    })
  },
  //下拉刷新
  onPullDownRefresh:function(){
    db.collection('T-blogList').orderBy('id', 'asc').get().then(res => {
      let lists = formatList(res);
      this.setData({
        blogList: lists,
        page:0
      })
    })
    wx.stopPullDownRefresh();
  },
  //页面触底加载更多
  onReachBottom:function(){
    let page = this.data.page + 20;
    db.collection('T-blogList').skip(page).get().then(res => {
      let new_data = formatList(res);
      let old_data = this.data.blogList;
      this.setData({
       blogList: old_data.concat(new_data),
       page:page,
       loadingStatus:false
      })
    })
  },
  //跳转到博客详情页
  navToDetail:function(event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../blogDetail/blogDetail?blogId=' + id,
    });
    //增加访问量
    db.collection('T-blogList').doc(id).update({
      data:{
        view: _.inc(1)
      }
    });
  }
})