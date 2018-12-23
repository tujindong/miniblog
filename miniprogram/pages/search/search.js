const db = wx.cloud.database();
const _ = db.command;
let util = require('../../utils/util.js');
Page({
  data: {
    tagId:'',
    count:0
  },
  onLoad: function (options) {
    let tagId = options.tagId;  //标签ID
    this.getData(tagId);
  },
  //加载列表数据
  getData:function(tagId){
    let count = this.data.count;
    db.collection('T-blogList').where({
      tags: tagId
    }).get().then(res => {
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
          like: like
        })
      this.setData({
        tagSearch: lists,
        tagId: tagId
       })
      }
    });
    db.collection('T-blogList').where({
      tags: tagId
    }).count().then(res => {
      this.setData({
        count: res.total
      })
    })
  },
  //文章详情
  navToDetail:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../blogDetail/blogDetail?blogId=' + id,
    });
    //增加访问量
    db.collection('T-blogList').doc(id).update({
      data: {
        view: _.inc(1)
      }
    });
  }
})