/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: process.env.Env})
const db = cloud.database()
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const lists = db.collection('test_user').get()
    return lists
}
