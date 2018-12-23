// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let feild = event.feild;
  let blogid = event.blogid;
  return await db.collection('T-blogList').doc(blogid).update({
    data:{
      comment: feild
    }
  })
}