// pages/category/category.js
//数组去重
let util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command;
let removeDuplicatedItem = function(arr){
  for(let i = 0; i < arr.length-1; i++){
    for(let j = i+1; j < arr.length; j++){
      if(arr[i] == arr[j]){
        arr.splice(j,1);
        j--;
      }
    }
  }
  return arr;
}
//格式化列表数据
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
    })
  }
  return lists;
};
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    yearCategory:[],
    active:0,
    yearInit:2018,
    page:0,
    chooseTitle:0,
    loadingStatus:true
  },
  onLoad: function (options) {
    this.getYear();
    this.getData();
  },
  //年份分类
  getYear:function(){
    let yearCategory = this.data.yearCategory;
    let yearInit = this.data.yearInit;
    let years = [];
    db.collection('T-blogList').get().then(res => {
      for (let i = 0; i < res.data.length; i++) {
        let year = res.data[i].year;
        years.push(year);
      }
      yearCategory = removeDuplicatedItem(years).reverse();
      this.setData({
        yearCategory: yearCategory
      })
    })
  },
  //获取列表数据
  getData: function (){
    let lists = this.data.lists;
    let yearInit = this.data.yearInit;
    db.collection('T-blogList').where({
      year: yearInit
    }).get().then(res => {
      let lists = formatList(res);
      this.setData({
        blogList:lists,
        lists:lists,
        loadingStatus:false
      })
    });
  },
  //选择年份
  onChange(event) {
    let id = parseInt(event.detail.title);
    let lists = this.data.lists;
    db.collection('T-blogList').where({
      year: id
    }).get().then(res => {
      let lists = formatList(res);
      this.setData({
        blogList: lists,
        chooseTitle:id
      })
    })
  },
  //触底加载更多
  onReachBottom:function(event){
    let chooseTitle = this.data.chooseTitle;
    let page = this.data.page + 20;
    db.collection('T-blogList').where({
      year: chooseTitle
    }).skip(page).get().then(res => {
      let new_data = formatList(res);
      let old_data = this.data.blogList;
      this.setData({
        blogList:old_data.concat(new_data),
        page:page,
        loadingStatus:false
      })
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  navToDetail:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../blogDetail/blogDetail?blogId=' + id
    });
    //增加访问量
    db.collection('T-blogList').doc(id).update({
      data: {
        view: _.inc(1)
      }
    });
  },
  vote:function(event){
    console.log('vote')
  },
  tagSearch:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../search/search?tagId=' + id,
    })
  },
});