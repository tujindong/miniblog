<template>
    <div class="page_postsManage">
        <div class="inner_wrap">

             <!-- 搜索 -->
            <div class="search_container">
                <van-search
                    :value="searchText" 
                    placeholder="请输入关键词"
                    @search="handleSearch"
                    @clear="handleClear"
                />
            </div>

            <!-- 列表 -->
            <div class="post_container">
                <ul v-if="!isLoading">
                    <li
                        v-for="(item, index) in posts"
                        :key="index"
                        @click="handleToGoPostsDetail(item._id)"
                    >
                        <div class="header">
                            <div class="title">{{item.title}}</div>
                            <div :class="item.isShow ? 'status green' : 'status yellow'">
                                {{item.isShow == '1' ? '已发布' : '草稿'}}
                            </div>
                        </div>
                        <div class="body">
                            <div class="content">{{item.digest}}</div>
                            <div class="action">
                                <div class="classify">{{item.classifyName}}</div>
                                <div 
                                    class="btn"
                                    @click.stop="handleToGoEdit(item._id)"
                                >
                                    编辑
                                </div>
                            </div>
                        </div>
                        <div 
                            class="whiteSpace"
                            v-if="posts.length -1 != index"
                        ></div>
                    </li>
                    <div 
                        v-if="isFinish && posts.length >= size" 
                        class="noMore"
                    >
                        -- Ooo~~没有更多啦 --
                    </div>
                    <LoadMore v-else-if="posts.length >= size"/>
                </ul>
                <!-- 加载中-骨架屏 -->
                <div class="inner_loading" v-else>
                    <van-skeleton animate title row="6"/>
                </div>

                 <!-- 同步微信公众号文章 -->
                <div 
                    class="async_posts"
                    hover-class="hover_async_posts"
                    hover-stay-time="30"
                    @click="handleAsyncPosts"
                >
                    <div class="icon">
                        <van-icon name="exchange" size="28px" color="#ffffff"/>
                    </div>
                </div>    
            </div>

            <!-- 确认弹框 -->
            <van-toast id="van-toast" />
        </div>   
    </div>
</template>

<script>
import api from '@/utils/api.js'
import LoadMore from '@/components/loadMore'
import Dialog from '../../../../static/vant-weapp/dialog/dialog'
import Toast from '../../../../static/vant-weapp/toast/toast'
export default {

    components:{ LoadMore },

    data () {
        return {
            posts: [],
            isLoading: true,
            isFinish: false,
            start: 1,
            size: 10,
            searchText: ''
        }
    },

    onLoad () {
        Object.assign(this.$data, this.$options.data())
    },

    onShow () {
        // 自己的管理后台，不怎么考虑体验了，详情内容修改后列表页面硬刷新
        this.start = 1
        this.posts = []
        this.getPostsLists()
    },

    mounted () {
    },

    onReachBottom () {
        // 列表分页
        if(!this.isFinish){
            this.getPostsLists()
        } 
    },

    methods: {
        // 获取文章列表
        getPostsLists () {
            let { posts, searchText, start, size } = this
            let params = {
                searchText,
                classifyName: '',
                isShow: '',
                start,
                size,
            };
            api.api_postsLists( params, res => {
                this.posts = [...posts, ...res.data]
                this.isLoading = false
                this.isFinish = true
                if(res.data.length < size){
                    this.isFinish = true
                }else{
                    this.isFinish = false
                    this.start = start + size
                }
            })
        },

         // 搜索
        handleSearch (e) {
            this.searchText = e.mp.detail
            this.posts = []
            this.start = 1
            this.isLoading = true
            this.getPostsLists()
        },

         // 取消搜索
        handleClear () {
            this.searchText = ''
            this.posts = []
            this.start = 1
            this.isLoading = true
            this.getPostsLists()
        },

         // 跳转到详情页面
        handleToGoPostsDetail (postId) {
            wx.navigateTo({
                url: `../../postsDetail/main?id=${postId}`
            })
        },

        // 点击编辑弹跳往编辑页面
        handleToGoEdit (postId) {
            wx.navigateTo({
                url: `../../admin/postsEditManage/main?postId=${postId}`
            });
        },

        // 同步微信公众号文章
        handleAsyncPosts () {
            Toast.loading({
                mask: true,
                message: '同步中..'
            });
            api.api_asyncPosts({}, res => {
                this.start = 1
                this.posts = []
                this.getPostsLists()
                Toast.success({message:'文章同步成功', duration: '1000'})
                Toast.clear()
            })
        },
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
