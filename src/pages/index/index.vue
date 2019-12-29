<template>
    <div class="page_index">
        <!-- 自定义导航栏 -->
        <section class="sec-nav">
            <NavigationBar
                :title="'涂小图'"
                :navBackgroundColor="white"
                :titleColor="black"
                :back-visible="true"
                @handleHomeClick="handleHomeClick"
            >
            </NavigationBar>
        </section>

        <!-- 文章列表 -->
        <div class="inner_main">
            <div class="search_container">
                <van-search
                    :value="searchText" 
                    placeholder="请输入关键词"
                    @search="handleSearch"
                    @clear="handleClear"
                />
            </div>
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
                        :title="item.classifyName"
                    >
                        <div class="inner_tab">
                            <div class="list_container" v-if="!isLoading">
                                <PostLists
                                    v-if="posts.length"
                                    :posts="posts"
                                    @onTap="handleToGoPostsDetail"
                                />
                                <NoData 
                                    v-else 
                                    :top="0"
                                    text="找不到呢，换个词试试呗~~"
                                />
                                <div 
                                    v-if="isFinish && posts.length >= size" 
                                    class="noMore"
                                >
                                    -- Ooo~~没有更多啦 --
                                </div>
                                <LoadMore v-else-if="posts.length >= size"/>
                            </div>
                            <Loading v-else :top="98"/>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>

        <!-- 授权弹出框 -->
        <AuthorDialog 
            :isDialogBoxShow="isDialogBoxShow"
            @handleDialogClose="handleDialogClose"
        />
    </div>
</template>

<script>
import api from '@/utils/api.js'
import login from '@/utils/login.js'
import PostLists from '@/components/postLists'
import LoadMore from '@/components/loadMore'
import Loading from '@/components/loading'
import NoData from '@/components/noData'
import NavigationBar from '@/components/navigationBar'
import AuthorDialog from '@/components/authorDialog'
export default {

    components:{ 
        PostLists, 
        LoadMore, 
        Loading, 
        NoData, 
        NavigationBar, 
        AuthorDialog 
    },

    data () {
        return {
            searchText: '',
            tabs: [
                {classifyId: '0', classifyName: '全部'},
            ],
            posts: [],
            curClassifyName: '全部',
            start: 1,
            size: 5,
            isFinish: false,
            isLoading: true,
            isDialogBoxShow: false,
            memoryIndex: ''
        }
    },

    onLoad () {
        Object.assign(this.$data, this.$options.data())
    },

    onShow () {
        if (this.memoryIndex !== '') {
            this.getSplicePostsLists(this.memoryIndex)
        }
    },

    mounted () {
        this.getClassifyLists()
        this.getPostsLists()
    },

    onReachBottom () {
        // 列表分页
        if(!this.isFinish){
            this.getPostsLists()
        } 
    },

    methods: {
        // 获取分类列表
        getClassifyLists () {
            let { tabs } = this
            let params = {}
            api.api_classifyLists(params, res => {
                let data = res.data.map(item => {
                    return {
                        classifyId: item.classifyId,
                        classifyName: item.classifyName
                    }
                })
                this.tabs = [...tabs, ...data]
            })
        },

        // 获取文章列表
        getPostsLists () {
            let { posts, searchText, curClassifyName, start, size } = this
            let classifyName = curClassifyName == '全部' ? '' : curClassifyName
            let params = {
                searchText,
                classifyName,
                start,
                size,
                isShow: 1
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

        // 列表局部刷新 当返回列表时点击项刷新
        getSplicePostsLists (_index) {
            let { posts, searchText, curClassifyName, start, size } = this
            let classifyName = curClassifyName == '全部' ? '' : curClassifyName
            let params = {
                searchText,
                classifyName,
                start: _index + 1,
                size: 1,
                isShow: 1
            };
            api.api_postsLists(params, res => {
                let curPosts = res.data[0]
                posts.splice(_index, 1, curPosts)
            })
        },

        // 导航切换
        handleTabChange (e) {
            this.curClassifyName = e.target.title
            this.posts = []
            this.start = 1
            this.isLoading = true
            this.getPostsLists()
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
        handleToGoPostsDetail (postId, _index) {
            this.getWxUserInfo(() => {
                wx.navigateTo({
                    url: `../postsDetail/main?id=${postId}`
                })
                this.memoryIndex = _index
            })
        },

        // 跳转到我的页面
        handleHomeClick () {
            this.getWxUserInfo(() => {
                wx.navigateTo({
                    url: '../mine/main'
                });
            })
        },

        // 授权弹窗关闭
        handleDialogClose () {
            this.isDialogBoxShow = false
            return
        },

        // 获取用户openId，这是微信用户唯一标识
        getWxOpenId () {
            api.api_openId(res => {
                this.openId = res.openid
            })
        },

        // 用户进入我的页面前，需要获取用户信息，主要是头像，昵称
        getWxUserInfo (agree) {
            this.getWxOpenId();
            login.getUserInfo((res) => {
                this.handleUserAdd(res, agree)
            }, (res) => {
                this.isDialogBoxShow = true
            })
        },

        // 用户信息添加到本地数据库
        handleUserAdd (res, agree) {
            let { openId } = this;
            this.user = {...res, ...{openId}}
            let params = this.user;
            this.globalData.user = params
            api.api_userAdd(params, res => {
                agree && agree()
                console.log('UserAdd success is', res)
            })
        },
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
