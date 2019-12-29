/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
/**
 * 请求云函数的接口api
 * @Author tujindong
 * @date 2019/11/29
 */
const db = wx.cloud.database()
// eslint-disable-next-line no-unused-vars
const _ = db.command

/** 获取用户_openid
  * params{}
 */
async function api_openId (callback) {
    wx.cloud.callFunction({
        name: 'user'
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_oponId err, is', err)
    })
};

/** 获取分类列表
  * params{}
 */
async function api_classifyLists (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_classifyLists',
            params: params
        }
    }).then(res => {
        if (res.result) {
            callback && callback(res.result)
        }
    }).catch(err => {
        console.log('api_classifyLists err, is', err)
    })
};

 /** 获取文章列表
  * params{
  *     start: Number, 起始查询位置,
  *     size: Number, 查询条数
  * }
 */
async function api_postsLists (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_postsLists',
            params: params
        }
    }).then(res => {
        if (res.result) {
            callback && callback(res.result)
        }
    }).catch(err => {
        console.log('api_postsLists err, is', err)
    })
};

/** 获取文章详情
  * params{
  *     postId: String, 文章id
  * }
 */
async function api_postsDetail (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_postsDetail',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_postsDetail err, is', err)
    })
};

/** 新增评论
  * params{
  *     postId: String, 文章id
  *     openId: String, 用户id
  *     commentText: String, 评论内容
  * }
 */
async function api_commentAdd (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_commentAdd',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_commentAdd err, is', err)
    })
};

/** 新增赞
  * params{
  *     postId: String, 文章id
  *     openId: String, 用户id
  *     commentText: String, 评论内容
  * }
 */
async function api_likeAdd (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_likeAdd',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_likeAdd err, is', err)
    })
};

/** 新增用户信息
  * params{
  *     user: Object, // 用户信息
  * }
 */
async function api_userAdd (params, callback) {
    // console.log('api_userAdd_params', params)
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_userAdd',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_userAdd err, is', err)
    })
}

/** 管理员授权 解除授权
  * params{
  *     user: Object, // 用户信息
  * }
 */
async function api_userUpdate (params, callback) {
    // console.log('api_userAdd_params', params)
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_userUpdate',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_userUpdate err, is', err)
    })
}

 /** 获取评论列表
  * params{
  *     start: Number, 起始查询位置,
  *     size: Number, 查询条数
  *     postId: String, 文章id
  * }
 */
async function api_commentLists (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_commentLists',
            params: params
        }
    }).then(res => {
        if (res.result) {
            callback && callback(res.result)
        }
    }).catch(err => {
        console.log('api_commentLists err, is', err)
    })
};

/** 获取用户信息
  * params{
  *     openId: String // 用户openId 为空则查全部
  * }
 */
async function api_userGet (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_userGet',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_userGet err, is', err)
    })
};

/** 获取版本信息
  * params{}
 */
async function api_versionGet (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_versionGet',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_versionGet err, is', err)
    })
};

/** 新增历史版本
  * params{
  *     version: String 版本
  *     desc: String 描述
  *     date: Date 日期
  * }
 */
async function api_versionAdd (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_versionAdd',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_versionAdd err, is', err)
    })
}

/** 删除历史版本
  * params{
  *     versionId: String 版本说明id
  * }
 */
async function api_versionRemove (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_versionRemove',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_versionRemove err, is', err)
    })
}

/** 获取我的联系方式
  * params{}
 */
async function api_contactGet (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_contactGet',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_contactGet err, is', err)
    })
};

/** 更新文章显示状态
  * params{postId}
 */
async function api_postStatusUpdate (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_postStatusUpdate',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_postStatusUpdate err, is', err)
    })
}

/** 文章删除
  * params{postId}
 */
async function api_postRemove (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_postRemove',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_postRemove err, is', err)
    })
}

/** 根据id删除评论
  * params{postId}
 */
async function api_commentRemove (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_commentRemove',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_commentRemove err, is', err)
    })
}

/** 更新评论显示状态
  * params{commentId}
 */
async function api_commentStatusUpdate (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_commentStatusUpdate',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_commentStatusUpdate err, is', err)
    })
}

/** 添加评论回复
  * params{commentId, reply}
 */
async function api_replyCommentAdd (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_replyCommentAdd',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_replyCommentAdd err, is', err)
    })
}

/** 获取分类列表
  * params{}
 */
async function api_classifyListsGet (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_classifyListsGet',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_classifyListsGet err, is', err)
    })
}

/** 获取我参与的列表
  * params{}
 */
async function api_participationListsGet (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_participationListsGet',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_participationListsGet err, is', err)
    })
}

/** 获取我参与的数量
  * params{}
 */
async function api_participationListsNumGet (params, callback) {
    wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: 'api_participationListsNumGet',
            params: params
        }
    }).then(res => {
        callback && callback(res.result)
    }).catch(err => {
        console.log('api_participationListsNumGet err, is', err)
    })
}

/** 同步微信公众号文章
  * params{}
 */
async function api_asyncPosts (params, callback) {
    wx.cloud.callFunction({ name: 'syncService' }).then(res => {
        callback && callback(res.result)
    })
}

export default {
    api_openId,
    api_classifyLists,
    api_postsLists,
    api_postsDetail,
    api_commentAdd,
    api_likeAdd,
    api_userAdd,
    api_userUpdate,
    api_commentLists,
    api_userGet,
    api_versionGet,
    api_versionAdd,
    api_versionRemove,
    api_contactGet,
    api_postStatusUpdate,
    api_commentRemove,
    api_commentStatusUpdate,
    api_replyCommentAdd,
    api_classifyListsGet,
    api_participationListsGet,
    api_participationListsNumGet,
    api_asyncPosts,
    api_postRemove
}
