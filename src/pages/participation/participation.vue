<template>
    <div class="page_participation">
         <div class="tabs_container">
            <van-tabs
                type="line"
                border=false 
                :active="tabActive"
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
                        <ul v-if="participations.length">
                            <li
                                hover-class="hover_li"
                                hover-stay-time="30"
                                v-for="(item, _index) in participations"
                                :key="_index"
                                @click="handleToGoDetail(item.postId)"
                            >
                                <div class="header">{{item.title}}</div>
                                <div class="body">{{item.digest}}</div>
                                <div  
                                    v-if="participations.length -1 != _index" 
                                    class="whiteSpace"
                                >
                                </div>
                            </li>
                            <div 
                                v-if="isFinish && participations.length >= size" 
                                class="noMore"
                            >
                                -- Ooo~~没有更多啦 --
                            </div>
                            <LoadMore v-else-if="participations.length >= size"/>
                        </ul>
                        <NoData 
                            v-else 
                            :top="0"
                            text="暂无数据~~"
                        />
                    </div>
                    <div class="inner_loading" v-else>
                        <van-skeleton animate title row="2"/>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import api from '@/utils/api.js'
import Toast from '../../../static/vant-weapp/toast/toast'
import LoadMore from '@/components/loadMore'
import NoData from '@/components/noData'
export default {

    components:{ LoadMore, NoData },

    data () {
        return {
            tabs: [
                {value: 'comment', label: '我评论的', index: '0'},
                {value: 'like', label: '我点赞的', index: '1'}
            ],
            participations: [],
            tabActive: '0',
            start: 1,
            size: 5,
            isFinish: false,
            isLoading: true
        }
    },

    onLoad(){
        Object.assign(this.$data, this.$options.data())
        let type = this.$root.$mp.query.type
        this.tabActive = this.tabs.find(item => item.value == type).index
    },

    mounted () {
        this.getParticipationList()
    },

    onReachBottom () {
        // 列表分页
        if(!this.isFinish){
            this.getParticipationList()
        } 
    },

    methods: {
        // 获取参与列表
        getParticipationList () {
            let { participations, start, size, type = 'like' } = this
            let params = {
                openId: this.globalData.user.openId,
                start,
                size,
                type
            }
            api.api_participationListsGet(params, res => {
                this.participations = [...participations, ...res.data]
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

        // tab切换
        handleTabChange (e) {
            let { tabs } = this
            let value = tabs.find(item => item.label == e.mp.detail.title).value
            this.type = value
            this.participations = []
            this.isLoading = true
            this.start = 1
            this.getParticipationList()
        },

        // 跳往详情
        handleToGoDetail (postId) {
            wx.navigateTo({
                url: `../postsDetail/main?id=${postId}`
            })
        }
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
