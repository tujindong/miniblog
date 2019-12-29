<template>
    <div class="page_commentManage">
        <div class="inner_wrap">
            <div class="tabs_container">
                <van-tabs
                    type="line"
                    border=false 
                    active="0"
                    color="#8893c9" 
                    swipeable
                    @change="handleTabChange"
                >
                    <van-tab 
                        v-for="(item, index) in tabs" 
                        :key="index"
                        :title="item.label"
                    >
                        <div class="inner_tab" v-if="!isLoading">
                            <ul class="main_ul" v-if="commentLists.length">
                                <li 
                                    class="main_li" 
                                    v-for="(item, _index) in commentLists" 
                                    :key="_index"
                                >
                                    <div class="header">
                                        <span>评论：</span>
                                        <span>{{item.title}}</span>
                                    </div>
                                    <div class="body">
                                        <div class="tag">
                                            <div v-if="item.isShow == '0'">
                                                <img src="../../../../static/images/tag_notPass.png" alt="">
                                            </div>
                                            <div v-else-if="item.isShow == '1' && item.replyComment">
                                                <img src="../../../../static/images/tag_replied.png" alt="">
                                            </div>
                                            <div v-else>
                                                <img src="../../../../static/images/tag_passed.png" alt="">
                                            </div>
                                        </div>
                                        <div class="avatar">
                                            <img :src="item.avatarUrl" alt="用户头像">
                                        </div>
                                        <div class="info">
                                            <div class="inner_info">
                                                <div class="title">
                                                    <div class="name">{{item.nickName}}</div>
                                                </div>
                                                <div class="comment">{{item.commentText}}</div>
                                                <div class="action">
                                                    <div class="time">{{item.dateAgo}}</div>
                                                </div>
                                            </div>
                                            <div class="sub_comment">
                                                <ul class="sub_ul">
                                                    <li 
                                                        class="sub_li"
                                                        v-for="(sub_item, __index) in item.replyComment"
                                                        :key="__index"
                                                    >
                                                        <div class="avatar">
                                                            <img :src="sub_item.avatarUrl" alt="">
                                                        </div>
                                                        <div class="info">
                                                            <div class="inner_info">
                                                                <div class="name">{{sub_item.nickName}}</div>
                                                                <div class="comment">{{sub_item.replyText}}</div>
                                                                <div class="action">
                                                                    <div class="time">{{sub_item.dateAgo}}</div>
                                                                </div>
                                                            </div>
                                                        </div>    
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="operate">
                                                <div 
                                                    class="btn stroke"
                                                    @click="handleCommentRemove(item._id, item.postId, _index)"
                                                >
                                                    删除
                                                </div>
                                                <div 
                                                    v-if="item.isShow == 0"
                                                    class="btn fill"
                                                    @click="handleCommentPass(item._id, item.postId, _index)"
                                                >
                                                    通过
                                                </div>
                                                <div 
                                                    v-if="item.isShow == 1"
                                                    class="btn fill"
                                                    @click="handleCommentReplyBoxShow(item._id, item.postId, _index)"
                                                >
                                                    回复
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <div 
                                    v-if="isFinish && commentLists.length >= size" 
                                    class="noMore"
                                >
                                    -- Ooo~~没有更多啦 --
                                </div>
                                <LoadMore v-else-if="commentLists.length >= size"/>
                            </ul>
                            <NoData 
                                v-else 
                                :top="0"
                                text="暂无数据~~"
                            />
                        </div>

                        <!--加载中 骨架屏 -->
                        <div class="inner_loading" v-else>
                            <van-skeleton avatar avatarSize="40px" animate row="3"/>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>

            <!-- 回复内容弹出框 -->
            <div class="popup_container">
                 <van-overlay :show="isOverlayShow">
                    <van-transition 
                        name="fade"
                        custom-class="block"
                        duration='300'
                    >
                        <div class="inner_popup">
                            <div class="close" @click="handlePopupHide">
                                <van-icon name="close" size="18px" color="#5d646e"/>
                            </div>
                            <div class="header">
                                新添回复
                            </div>
                            <div class="body">
                                <van-field
                                    :value="replayText"
                                    size="large"
                                    type="text"
                                    placeholder="请输入回复"
                                    border=false
                                    center
                                    clearable
                                    @input="handleInputChange"
                                />
                            </div>
                            <div class="footer">
                                <div 
                                    class="btn stroke"
                                    @click="handlePopupHide"
                                >
                                    取消
                                </div>
                                <div 
                                    class="btn fill"
                                    @click="sureToReply"
                                >
                                    回复
                                </div>
                            </div>
                        </div>
                    </van-transition>    
                </van-overlay>
            </div>
        </div>

        <!-- 确认弹框 -->
        <van-dialog id="van-dialog" />
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import api from '@/utils/api.js'
import Date from '@/utils/date.js'
import LoadMore from '@/components/loadMore'
import Dialog from '../../../../static/vant-weapp/dialog/dialog'
import Toast from '../../../../static/vant-weapp/toast/toast'
import NoData from '@/components/noData'
export default {

    components:{ LoadMore, NoData },

    data () {
        return {
            tabs: [
                {value: '0', label: '全部评论'},
                {value: '1', label: '审核通过'},
                {value: '2', label: '未审核'}
            ],
            commentLists: [],
            isLoading: true,
            isFinish: false,
            isShow: '',
            isOverlayShow: false,
            replayText: '',
            start: 1,
            size: 10,
        }
    },

    onLoad(){
        Object.assign(this.$data, this.$options.data())
    },

    mounted () {
        this.getCommentLists();
    },

    onReachBottom () {
        // 评论分页
        if(!this.isFinish){
            this.getCommentLists();
        } 
    },

    methods: {
        // 获取文章评论
        getCommentLists () {
            let { start, size, commentLists, isShow } = this;
            let params = {
                start,
                size,
                postId: '',
                isShow
            };
            api.api_commentLists( params, res => {
                let lists = res.data.map(item => {
                    item.dateAgo = Date.getDateDiff(item.timestamp)
                    if(item.replyComment){
                        item.replyComment.forEach(sub_item => {
                            sub_item.dateAgo =  Date.getDateDiff(sub_item.timestamp)
                        })
                    }
                    return item
                });
                this.commentLists = [...commentLists, ...lists];
                this.isFinish = true;
                this.isLoading = false;
                if(lists.length < size){
                    this.isFinish = true
                }else{
                    this.isFinish = false
                    this.start = start + size
                }
            })
        },

        // 本地列表局部刷新 -- 删除
        getSpliceCommentListsRemove (index) {
            let { commentLists } = this;
            commentLists.splice(index, 1)
        },

        // 本地列表局部刷新 -- 审批通过
        getSpliceCommentListsPass () {
            let { commentLists, isShow, _index } = this;
            let params = {
                start: _index + 1,
                size: 1,
                postId: '',
                isShow
            };
            api.api_commentLists( params, res => {
                let curCommentLists = res.data[0];
                curCommentLists.dateAgo = Date.getDateDiff(curCommentLists.timestamp);
                if(curCommentLists.replyComment){
                    curCommentLists.replyComment.forEach(sub_item => {
                        sub_item.dateAgo =  Date.getDateDiff(sub_item.timestamp)
                    })
                }
                commentLists.splice(_index, 1, curCommentLists)
            })
        },

        // 列表切换
        handleTabChange (e) { // isShow： '' 查询全部， 1 已展示， 0 未展示 
            let tabIndex = e.mp.detail.index
            if(tabIndex == '0'){
                this.isShow = ''
            } else if(tabIndex == '1'){
                this.isShow = 1
            } else if(tabIndex == '2'){
                this.isShow = 0
            }
            this.commentLists = []
            this.start = 1
            this.isLoading = true
            this.getCommentLists()
        },

        // 评论删除
        handleCommentRemove (commentId, postId, index) {
            let _this = this;
            Dialog.confirm({
                message: '确定删除该评论？'
            }).then(() => {
                let params = { 
                    postId,
                    commentId 
                    }
                api.api_commentRemove(params, res => {
                    _this.getSpliceCommentListsRemove(index);
                    Toast.success({message:'评论删除成功', duration: '1000'});
                })
            }).catch(() => {})
        },

        // 评论审核通过
        handleCommentPass (commentId, postId, index) {
            this._index = index
            let params = {
                commentId,
                postId,
                isShow: 1
            };
            api.api_commentStatusUpdate(params, res => {
                this.getSpliceCommentListsPass()
                Toast.success({message:'评论审核通过', duration: '1000'})
            })
        },

        // 回复输入
        handleInputChange (e) {
            this.replayText = e.mp.detail
        },

        // 评论回复弹窗显示
        handleCommentReplyBoxShow (commentId, postId, index) {
            this.isOverlayShow = true
            this.commentId = commentId
            this.postId = postId
            this._index = index
        },

        // 确定回复
        sureToReply () {
            let { commentId, replayText, postId } = this;
            let params = {
                postId,
                commentId,
                replys: [{
                    avatarUrl: this.globalData.author.avatarUrl,
                    nickName: this.globalData.author.nickName,
                    openId: this.globalData.author.openId,
                    replyText: replayText
                }]
            }
            api.api_replyCommentAdd(params, res => {
                Toast.success({message:'回复成功', duration: '1000'})
                this.isOverlayShow = false
                this.getSpliceCommentListsPass()
            })
        },

        // 弹出框隐藏
        handlePopupHide () {
            this.replayText = ''
            this.isOverlayShow = false
        },

    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
