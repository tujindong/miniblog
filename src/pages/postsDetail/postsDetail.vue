<template>
    <div class="page_detail">
        <div class="inner_wrap" v-if="!isLoading">
            <div class="body">
                <div class="detail_content">
                    <div class="main">
                        <div class="title_container">
                            {{postDetail.title}}
                        </div>
                        <div class="author_container">
                            <div class="author">
                                <span>作者：</span>
                                <span>{{postDetail.author}}</span>
                            </div>
                            <div class="createTime">
                                {{postDetail.createTime}}
                            </div>
                        </div>
                        <div class="content_container">
                            <parser :html="postDetail.content"></parser>
                        </div>
                    </div>
                </div>
                <div class="whiteSpace"></div>
                <div class="detail_comment">
                    <div class="title">{{postDetail.totalComments}}条评论</div>
                    <ul class="main_ul" v-if="!!commentLists.length">
                        <li 
                            class="main_li" 
                            v-for="(item, index) in commentLists" 
                            :key="index"
                        >
                            <div class="avatar">
                                <img :src="item.avatarUrl" alt="用户头像">
                            </div>
                            <div class="info">
                                <div class="inner_info">
                                    <div class="name">{{item.nickName}}</div>
                                    <div class="comment">{{item.commentText}}</div>
                                    <div class="action">
                                        <div class="time">{{item.dateAgo}}</div>
                                        <div class="other">
                                            <div class="icon icon_comment">
                                                <van-icon name="comment-circle" size="18px" color="#cfd6f6"/>
                                            </div>
                                            <div class="num">
                                                {{item.replyComment ? item.replyComment.length: '0'}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="sub_comment">
                                    <ul class="sub_ul">
                                        <li 
                                            class="sub_li"
                                            v-for="(sub_item, _index) in item.replyComment"
                                            :key="_index"
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
                    <NoComment v-else/>
                </div>
            </div>

            <!-- 气泡-评论 -->
            <div 
                v-if="!isCommentBoxShow"
                class="bubble bubble_comment"
                hover-class="hover_comment"
                hover-stay-time="30"
                @click="handleCommentBoxShow"
            >
                <div class="icon">
                    <van-icon name="chat-o" size="28px" color="#555555"/>
                </div>
            </div>

            <!-- 气泡-点赞 -->
            <div 
                v-if="!isCommentBoxShow"
                class="bubble bubble_like"
                hover-class="hover_like"
                hover-stay-time="100"
                @click="handleLike"
            >
                <img 
                    class="animation"
                    :animation="animationLike" 
                    src="../../../static/images/icon_like.png"
                >
                <img
                    v-if="likeList.length" 
                    src="../../../static/images/icon_like.png" 
                    alt=""
                >
                <img 
                    v-else
                    src="../../../static/images/icon_like_o.png" 
                    alt=""
                >
            </div>

            <!-- 气泡-分享 -->
            <div 
                v-if="!isCommentBoxShow"
                class="bubble bubble_share"
                hover-class="hover_share"
                hover-stay-time="30"
            >
                <button class="icon" open-type="share">
                    <van-icon name="share" size="28px" color="#555555"/>
                </button>
            </div>

            <!-- 点赞特效 -->
            <!-- <div class="like_animation">
                <div class="heart">
                    <img :animation="animationLike" src="../../../static/images/icon_like.png" alt="">
                </div>
            </div> -->

            <!-- 底部评论框 -->
            <div class="footer">
                <van-field
                    v-if="isCommentBoxShow"
                    :value="commentText"
                    center
                    clearable
                    placeholder="吐槽一下吧~~"
                    border="false"
                    use-button-slot
                    adjust-position
                    :focus="isCommentBoxShow"
                    @blur="handleInputBlur"
                    @input="handleInputChange"
                >
                    <van-button 
                        slot="button" 
                        size="small"
                        @click="handleCommentAdd"
                    >
                        发送
                    </van-button>
                </van-field>
            </div>
        </div>

        <!-- 加载中-骨架屏 -->
        <div class="inner_loading" v-else>
            <van-skeleton animate title row="6"/>
        </div>

        <!-- 授权弹出框 -->
        <AuthorDialog 
            :isDialogBoxShow="isDialogBoxShow"
            @handleDialogClose="handleDialogClose"
        />
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import api from '@/utils/api.js'
import login from '@/utils/login.js'
import Validator from '@/utils/validator.js'
import Date from '@/utils/date.js'
import Dialog from '../../../static/vant-weapp/dialog/dialog'
import Toast from '../../../static/vant-weapp/toast/toast'
import NoComment from '@/components/noComment'
import AuthorDialog from '@/components/authorDialog'
import LoadMore from '@/components/loadMore'
export default {

    components:{ NoComment, AuthorDialog, LoadMore },

    data () {
        return {
            postDetail: {},
            likeList:  [],
            isLoading: true,
            isCommentBoxShow: false,
            isDialogBoxShow: false,
            commentText: '',
            commentLists: [],
            start: 1,
            size: 5,
            isFinish: false,
            animationLike: {},
        }
    },

    onLoad () {
        Object.assign(this.$data, this.$options.data())
    },

    onShow () {
        this.initAnimation()
    },

    onReady () {
    },

    mounted () {
        this.postId = this.$root.$mp.query.id
        this.user = this.globalData.user
        this.getPostsDetail()
        this.getCommentLists()
        this.getLikeLists()
    },

    onReachBottom () {
        // 评论分页
        if(!this.isFinish){
            this.getCommentLists()
        } 
    },

    methods: {
        // 获取文章详情
        getPostsDetail () {
            let { postId } = this
            let params = {
                postId,
                isRealView: '1'
            };
            api.api_postsDetail( params, res => {
                this.postDetail = res.data
                this.isLoading = false
                console.log('postDetiail', this.postDetail)
            })
        },

        // 获取文章评论
        getCommentLists () {
            let { start, size, postId, commentLists } = this
            let params = {
                start,
                size,
                isShow: 1,
                postId
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
                })
                this.commentLists = [...commentLists, ...lists]
                this.isFinish = true
                if(lists.length < size){
                    this.isFinish = true
                }else{
                    this.isFinish = false
                    this.start = start + size
                }
            })
        },

        // 获取点赞列表
        getLikeLists () {
            let { postId } = this
            let params = {
                postId,
                openId: this.globalData.user.openId,
                type: 'like'
            }
            api.api_participationListsGet(params, res => {
                this.likeList = res.data
            })
        },

        // 评论输入框显示
        handleCommentBoxShow () {
            this.isCommentBoxShow = true;
        },

        // 评论输入失焦
        handleInputBlur () {
            setTimeout(() => {
                this.isCommentBoxShow = false
            }, 10)
        },

        // 评论输入
        handleInputChange (e) {
            this.commentText = e.mp.detail
        },

        // 评论提交前验证
        vaildateFunc () {
            let validator = new Validator()
            validator.add(this.commentText, [{
                strategy: 'isNonEmpty',
                errorMsg: '评论不可以为空哟~~'
            }])
            let errorMsg = validator.start()
            return errorMsg;
        },

        // 提交评论
        handleCommentAdd () {
            let errorMsg = this.vaildateFunc()
            if(errorMsg){
                Toast.fail({message:`${errorMsg}`, duration: '1000'})
                return false
            }else{
                let { postId, commentText, user, postDetail } = this
                let data = {
                    postId,
                    commentText,
                    title: postDetail.title,
                    digest: postDetail.digest,
                    type: 'comment',
                }
                let params = {
                    ...data,
                    ...user
                };
                api.api_commentAdd(params, (res) => {
                    Toast.success({message:'评论成功，等待管理员审核', duration: '2000'});
                    this.commentText = '';
                })
            }      
        },

        // 授权弹窗关闭
        handleDialogClose () {
            this.isDialogBoxShow = false
            return
        },

        // 点赞
        handleLike () {
            let { postId, commentText, user, postDetail, likeList } = this
            if (likeList.length) {
                Toast({message:'您已经点过赞了', duration: '1000'})
                return
            }
            let data = {
                postId,
                commentText,
                title: postDetail.title,
                digest: postDetail.digest,
                type: 'like',
            }
            let params = {
                ...data,
                ...user
            };
            this.processAnimation()
            api.api_likeAdd(params, res => {
                this.getLikeLists()
            })
        },

        initAnimation () {
            let animationLike = wx.createAnimation({
		      duration: 0,
              timingFunction: 'ease'
            })
            animationLike.opacity(0).scale(0).step();
            this.animationLike = animationLike.export();
        },

        processAnimation () {
            let animationLike = wx.createAnimation({
		      duration: 300,
		      delay: 10,
              transformOrigin: '50% 50%',
              timingFunction: 'ease-out'
            })
            animationLike.opacity(1).scale(1.5).step();
            animationLike.opacity(1).scale(1).step();
            this.animationLike = animationLike.export();
        }
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
