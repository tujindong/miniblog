/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
/**
 * 博客文章的接口
 * @Author tujindong
 * @date 2019/11/29
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.Env })
// eslint-disable-next-line no-unused-vars
const dateUtils = require('date-utils')
const db = cloud.database()
// eslint-disable-next-line no-unused-vars
const _ = db.command
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.action) {
        case 'api_classifyLists':
            return classifyLists(event.params)
        case 'api_postsLists':
            return postsLists(event.params)
        case 'api_postsDetail':
            return postsDetail(event.params)
        case 'api_commentAdd':
            return commentAdd(event.params)
        case 'api_userAdd':
            return userAdd(event.params)     
        case 'api_commentLists':
            return commentLists(event.params) 
        case 'api_userGet':
            return userGet(event.params)  
        case 'api_userUpdate':
            return userUpdate(event.params)    
        case 'api_versionGet':
            return versionGet(event.params) 
        case 'api_versionAdd':
            return versionAdd(event.params)    
        case 'api_versionRemove':
            return versionRemove(event.params)    
        case 'api_contactGet':
            return contactGet(event.params)  
        case 'api_postStatusUpdate':
            return postStatusUpdate(event.params)   
        case 'api_commentRemove':
            return commentRemove(event.params)  
        case 'api_commentStatusUpdate':
            return commentStatusUpdate(event.params) 
        case 'api_replyCommentAdd':
            return replyCommentAdd(event.params)  
        case 'api_likeAdd':
            return likeAdd(event.params)    
        case 'api_classifyListsGet':
            return classifyListsGet(event.params) 
        case 'api_participationListsGet':
            return participationListsGet(event.params)       
        case 'api_participationListsNumGet':
            return participationListsNumGet(event.params)
        case 'api_postRemove':
            return postRemove(event.params)                             
    }
}

// 分类列表
async function classifyLists (params) {
    try {
        return db.collection('mini_classify').get()
    } catch (err) {
        return err
    }
}

// 文章列表
async function postsLists (params) {
    try {
        let { searchText, classifyName, start, size, isShow } = params
        let where = {}

        if (searchText !== '') {
            where.title = db.RegExp({
                regexp: searchText,
                options: 'i'
            })
            delete where.classifyName
        }

        if (classifyName !== '') {
            where.classifyName = classifyName
        }

        if (isShow !== '') {
            where.isShow = isShow
        }

        return db.collection('mini_posts')
        .where(where)
        .orderBy('createTime', 'desc')
        .skip(start - 1)
        .limit(size)
        .field({
            _id: true,
            author: true,
            createTime: true,
            defaultImageUrl: true,
            title: true,
            totalComments: true,
            totalVisits: true,
            totalZans: true,
            isShow: true,
            classify: true,
            label: true,
            digest: true,
            classifyId: true,
            classifyName: true,
            classifyUrl: true
        })
        .get()
    } catch (err) {
        return err
    }
}

// 文章详情
async function postsDetail (params) {
    try {
        let { postId = '', isRealView = '' } = params
        // 浏览量 +1
        if (isRealView !== '') {
            await db.collection('mini_posts').doc(postId).update({
                data: {
                    totalVisits: _.inc(1)
                }
            })
        }
        return await db.collection('mini_posts').doc(postId).get()
    } catch (err) {
        return err
    }
}

// 添加评论
async function commentAdd (params) {
    try {
        let data = {
            ...params, 
            ...{timestamp: new Date().getTime()},
            ...{isShow: 0}
        }
         // 评论列表添加评论数据
        await db.collection('mini_comments').add({
            data: data
        })
        // 我参与关联表添加数据
        let participationList = await db.collection('mini_posts_participation').where({
            openId: data.openId,
            postId: data.postId,
            type: data.type
        }).get()
        if (participationList.data.length === 0) {
            await db.collection('mini_posts_participation').add({
                data: data
            })
        }
    } catch (err) {
        return err
    }
}

// 根据id删除评论
async function commentRemove (params) {
    try {
        // eslint-disable-next-line no-unused-vars
        let { commentId, postId = '' } = params
        await db.collection('mini_comments').doc(commentId).remove()
        
        // todo 删除评论数量总数是否归还
    } catch (err) {
        return err
    }
}

// 更新评论状态 
async function commentStatusUpdate (params) {
    try {
        let { commentId, isShow, postId = '' } = params
        await db.collection('mini_comments')
        .doc(commentId)
        .update({
            data: {isShow}
        })

        // 评论审核通过评论数+1
        await db.collection('mini_posts').doc(postId).update({
            data: {
                totalComments: _.inc(1)
            }
        })
    } catch (err) {
        return err
    }
}

// 添加子评论
async function replyCommentAdd (params) {
    try {
        let { commentId, replys } = params
        let replyComment = replys.map(item => {
            item.timestamp = new Date().getTime()
            return item
        })
        await db.collection('mini_comments').doc(commentId).update({
            data: {
              replyComment: _.push(replyComment)
            }
        })
    } catch (err) {
        return err
    }
}

// 添加赞
async function likeAdd (params) {
    try {
        let data = {
            ...params, 
            ...{timestamp: new Date().getTime()}
        }
        // 我参与关联表添加数据
        let participationList = await db.collection('mini_posts_participation').where({
            openId: data.openId,
            postId: data.postId,
            type: data.type
        }).get()
        if (participationList.data.length === 0) {
            await db.collection('mini_posts_participation').add({
                data: data
            })
        }
        // 文章赞数+1
        await db.collection('mini_posts').doc(data.postId).update({
            data: {
                totalZans: _.inc(1)
            }
        })
    } catch (err) {
        return err
    }
}

// 添加用户
async function userAdd (params) {
    try {
        let openId = params.openId
        let data = {...params, ...{admin: '0'}}
        let existUser = await db.collection('mini_user').where({
            openId: openId
        }).get()
        if (!openId) {
            return 'openId未获取'
        } else if (existUser && existUser.data.length) {
            return '用户已存在'
        } else {
            await db.collection('mini_user').add({
                data: data
            })
        }
    } catch (err) {
        return err
    }
}

// 获取评论列表
async function commentLists (params) {
    try {
        let { start, size, postId, isShow } = params
        let where = {}
        if (postId && postId !== '') {
            where.postId = postId
        }
        if (isShow !== '') {
            where.isShow = isShow
        }
        return await db.collection('mini_comments')
        .where(where)
        .orderBy('timestamp', 'desc')
        .skip(start - 1)
        .limit(size)
        .get()
    } catch (err) {
        return err
    }
}

// 获取用户信息
async function userGet (params) {
    try {
        let { openId = '', start = 1, size = 10, admin = '', searchText = '' } = params
        let where = {}
        if (openId !== '') {
            where.openId = openId
        }
        if (admin !== '') {
            where.admin = admin
        }
        if (searchText !== '') {
            where.nickName = db.RegExp({
                regexp: searchText,
                options: 'i'
            })
        }
        return await db.collection('mini_user')
        .where(where)
        .skip(start - 1)
        .limit(size)
        .get()
    } catch (err) {
        return err
    }
}

// 用户授权
async function userUpdate (params) {
    try {
        let { userId = '', admin = '' } = params
        await db.collection('mini_user')
        .doc(userId)
        .update({
            data: {admin}
        })
    } catch (err) {
        return err
    }
}

// 获取版本信息
async function versionGet (params) {
    try {
        return await db.collection('mini_version')
        .orderBy('date', 'desc')
        .get()
    } catch (err) {
        return err
    }
}

// 新增历史版本信息
async function versionAdd (params) {
    try {
        await db.collection('mini_version')
        .add({
            data: params
        })
    } catch (err) {
        return err
    }
}

// 删除历史版本信息
async function versionRemove (params) {
    try {
        let { versionId } = params
        await db.collection('mini_version')
        .doc(versionId)
        .remove()
    } catch (err) {
        return err
    }
}

// 获取联系我方式
async function contactGet (params) {
    try {
        let { name } = params
        return await db.collection('mini_social')
            .where({name})
            .get()
    } catch (err) {
        return err
    }
}

// 更新文章状态
async function postStatusUpdate (params) {
    try {
        let { postId = '', isShow = '', classifyName = '', classifyUrl = '' } = params

        await db.collection('mini_posts')
        .doc(postId)
        .update({
            data: {
                isShow,
                classifyName,
                classifyUrl
            }
        })
    } catch (err) {
        return err
    }
}

// 获取分类列表
async function classifyListsGet (params) {
    try {
        return await db.collection('mini_classify').get()
    } catch (err) {
        return err
    }
}

// 获取我参与的列表
async function participationListsGet (params) {
    try {
        let { openId = '', postId = '', type = '', start = 1, size = 5 } = params
        let where = {}
        if (openId !== '') {
            where.openId = openId
        }
        if (postId !== '') {
            where.postId = postId
        }
        if (type !== '') {
            where.type = type
        }
        return await db.collection('mini_posts_participation')
        .where(where)
        .skip(start - 1)
        .limit(size)
        .get()
    } catch (err) {
        return err
    }
}

// 获取我参与的相关数量
async function participationListsNumGet (params) {
    try {
        let { openId = '' } = params
        let commentNum = await db.collection('mini_posts_participation')
        .where({ 
            openId,
            type: 'comment' 
        })
        .count()
        let likeNum = await db.collection('mini_posts_participation')
        .where({
            openId, 
            type: 'like' 
        })
        .count()
        return {commentNum, likeNum}
    } catch (err) {
        return err
    }
}

// 文章删除
// todo 关联的文章是否也要删除
async function postRemove (params) {
    try {
        let { postId = '' } = params
        await db.collection('mini_posts').doc(postId).remove()
    } catch (err) {
        return err
    }
}
