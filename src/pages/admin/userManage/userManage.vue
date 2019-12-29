<template>
    <div class="page_userManage">
        <div class="inner_wrap">
            <!-- 搜索 -->
            <div class="search_container">
                <van-search
                    :value="searchText" 
                    placeholder="请输入姓名"
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
                        :title="item.label"
                    >
                        <!-- 列表 -->
                        <ul v-if="!isLoading">
                            <li
                                v-for="(item, _index) in users"
                                :key="_index"
                            >
                                <div class="avatar">
                                    <img :src="item.avatarUrl" alt="">
                                </div>
                                <div class="info">
                                    <div class="name">
                                        <span class="user_name">{{item.nickName}}</span>
                                        <span class="user_gender">
                                            <img v-if="item.gender == '1'" src="../../../../static/images/icon_male.png" alt="">
                                            <img v-if="item.gender == '2'" src="../../../../static/images/icon_female.png" alt="">
                                        </span>
                                    </div>
                                    <div class="location">
                                        <span>{{item.province}}</span>
                                        <span>|</span>
                                        <span>{{item.city}}</span>
                                    </div>
                                </div>
                                <div class="action">
                                    <div 
                                        v-if="item.admin == '1'" 
                                        class="icon red"
                                        @click="handleDeauthorize(item._id, item.openId, _index)"
                                    >
                                        解除
                                    </div>
                                    <div 
                                        v-else 
                                        class="icon green"
                                        @click="handelAuthorize(item._id, _index)"
                                    >
                                        授权
                                    </div>
                                </div>
                            </li>
                            <div 
                                v-if="isFinish && users.length >= size" 
                                class="noMore"
                            >
                                -- Ooo~~没有更多啦 --
                            </div>
                            <LoadMore v-else-if="users.length >= size"/>
                        </ul>

                        <!-- 加载中 -->
                        <div class="inner_loading" v-else>
                            <van-skeleton avatar avatarSize="40px" row="2"/>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>

        <!-- 确认弹框 -->
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import api from '@/utils/api.js'
import LoadMore from '@/components/loadMore'
import Toast from '../../../../static/vant-weapp/toast/toast'
export default {

     components:{ LoadMore },

    data () {
        return {
            tabs: [
                {value: '0', label: '全部'},
                {value: '1', label: '管理员'}
            ],
            users: [],
            start: 1,
            size: 10,
            isFinish: false,
            isLoading: true,
        }
    },

    onLoad(){
        Object.assign(this.$data, this.$options.data())
    },

    mounted () {
        this.getUserList()
    },

    onReachBottom () {
        // 列表分页
        if(!this.isFinish){
            this.getUserList()
        } 
    },

    methods: {
        // 获取用户列表
        getUserList () {
            let { start, size, admin = '', users, searchText = '' } = this
            let params = {
                start,
                size,
                admin,
                searchText
            };
            api.api_userGet(params, res => {
                this.users = [...users, ...res.data]
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

        // 局部列表刷新
        getSpliceUserList (_index) {
            let { start, size, admin = '', users, searchText = '' } = this
            let params = {
                start: _index + 1,
                size: 1,
                admin,
                searchText
            };
            api.api_userGet(params, res => {
                let curUser = res.data[0]
                users.splice(_index, 1, curUser)
            })
        },

        // tab切换
        handleTabChange (e) {
            let { tabs } = this
            let value = tabs.find(item => item.label == e.mp.detail.title).value
            this.admin = value == '1' ? value : ''
            this.users = []
            this.start = 1
            this.isLoading = true
            this.getUserList()
        },

         // 搜索
        handleSearch (e) {
            this.searchText = e.mp.detail
            this.users = []
            this.start = 1
            this.isLoading = true
            this.getUserList()
        },

        // 取消搜索
        handleClear () {
            this.searchText = ''
            this.users = []
            this.start = 1
            this.isLoading = true
            this.getUserList()
        },

        // 解除授权管理员
        handleDeauthorize (userId, openId, _index) {
            let { admin = '' } = this
            if (openId == this.globalData.author.openId) {
                Toast.fail({message:'sorry~~您无权限解除涂小图的管理员身份', duration: '1500'})
                return
            }
            let params = {
                userId,
                admin: '0'
            }
            api.api_userUpdate(params, res => {
                if (admin != '1') {
                    this.getSpliceUserList(_index)
                }else{
                    this.users = []
                    this.start = 1
                    this.getUserList()
                }
                Toast.success({message:'管理员解除授权成功', duration: '1500'})
            })
        },

        // 授权管理员
        handelAuthorize (userId, _index) {
            let params = {
                userId,
                admin: '1'
            }
            api.api_userUpdate(params, res => {
                this.getSpliceUserList(_index)
                Toast.success({message:'管理员授权成功', duration: '1500'})
            })
        },

    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
