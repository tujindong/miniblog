<template>
    <div class="page_mine">
        <div class="inner_wrap" v-if="!isLoading">
            <div class="header">
                <div class="avatar">
                    <img :src="user.avatarUrl" alt="">
                </div>
                <div class="info">
                    <div class="name">
                        <span class="user_name">{{user.nickName}}</span>
                        <span class="user_gender">
                            <img v-if="user.gender == '1'" src="../../../static/images/icon_male.png" alt="">
                            <img v-if="user.gender == '2'" src="../../../static/images/icon_female.png" alt="">
                        </span>
                    </div>
                    <div class="location">
                        <span>{{user.province}}</span>
                        <span>|</span>
                        <span>{{user.city}}</span>
                    </div>
                </div>
            </div>

            <div class="neck">
                <ul>
                    <li @click="handleToGoParticipation('comment')">
                        <div class="num">{{commentNum}}</div>
                        <div class="name">评论</div>
                    </li>
                    <li @click="handleToGoParticipation('like')">
                        <div class="num">{{likeNum}}</div>
                        <div class="name">点赞</div>
                    </li>
                </ul>
            </div>
            
            <div class="body">
                <div class="cell_container">
                    <van-cell-group>
                        <van-cell 
                            title="我参与的" 
                            icon="flag-o" 
                            size="large"
                            is-link="true"
                            link-type="navigateTo"
                            url="../participation/main"
                        />
                        <van-cell 
                            title="小算包" 
                            icon="smile-o" 
                            size="large"
                            is-link="true"
                            @click="handleToGoMiniCalculator"
                        />
                    </van-cell-group>
                </div>

                <div class="whiteSpace"></div>

                <div class="cell_container">
                    <van-cell-group>
                        <div 
                            class="van_cell" 
                            hover-class="hover_van_cell" 
                            hover-stay-time="30"
                        >
                            <div class="icon">
                                <van-icon name="edit" />
                            </div>
                            <button class='btn_feedback' open-type='feedback'>意见反馈</button>
                            <div class="arrow">
                                <van-icon name="arrow" color="#999999"/>
                            </div>
                        </div>
                        <van-cell 
                            title="联系作者" 
                            icon="contact" 
                            size="large"
                            is-link="true"
                            link-type="navigateTo"
                            url="../contactMe/main"
                        />
                        <van-cell 
                            title="历史版本" 
                            icon="description" 
                            size="large"
                            is-link="true"
                            link-type="navigateTo"
                            url="../version/main"
                        />
                        <van-cell
                            title="后台管理" 
                            icon="setting-o"
                            size="large"
                            is-link="true"
                            @click="handleToGoAdmin"
                        />
                    </van-cell-group>
                </div>
            </div>
        </div>

        <!-- 加载中 骨架屏 -->
        <div class="inner_loading" v-else>
            <van-skeleton title avatar avatarSize="60px" row="3"/>
        </div>

        <van-toast id="van-toast" />
    </div>
</template>

<script>
import api from '@/utils/api.js';
import Toast from '../../../static/vant-weapp/toast/toast';
export default {

    components:{  },

    data () {
        return {
            user: {
                avatarUrl: '',
                nickName: '匿名的小伙伴',
                province: '布吉岛',
                city: 'noName'
            },
            commentNum: 0,
            likeNum: 0,
            isLoading: true
        }
    },

    onLoad(){
        Object.assign(this.$data, this.$options.data())
    },

    mounted () {
        this.user = this.globalData.user
        this.getWxOpenId()
    },

    methods: {
        getWxOpenId () {
            api.api_openId(res => {
                this.openId = res.openid
                this.getUser()
                this.getParticipationListsNum()
            })
        },

        getUser () {
            let { openId } = this
            let params = { openId }
            api.api_userGet(params, res => {
                this.user = res.data[0]
            })
        },

        // 获取我参与的数量
        getParticipationListsNum () {
            let { openId } = this
            let params = {
                openId: openId || this.globalData.user.openId
            }
            api.api_participationListsNumGet(params, res => {
                this.isLoading = false
                console.log('res', res)
                this.commentNum = res.commentNum.total
                this.likeNum = res.likeNum.total
            })
        },

        // 跳转到我参与的页面
        handleToGoParticipation (type) {
            wx.navigateTo({
                url: `../participation/main?type=${type}`
            })
        },

        // 跳转到我的另一个小程序，小算包
        handleToGoMiniCalculator () {
            wx.navigateToMiniProgram({
                appId: 'wx080bf32a16b985b5',
                success(res) {}
            })
        },

        // 跳转到管理后台
        handleToGoAdmin () {
            let { user } = this
            if(user.admin == '1'){
                wx.navigateTo({
                    url: '../admin/index/main'
                })
            }else{
                Toast({message:'Opps~还没有权限哟，请联系管理员添加', duration: '1000'})
            }
        }
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
