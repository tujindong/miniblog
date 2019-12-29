<template>
    <div class="page_postsEditManage">
        <div class="inner_wrap" v-if="!isLoading">
            <div class="postDetail">
                <div class="desc_item">
                    <div class="header">标题</div>
                    <div class="body">
                        {{title}}
                    </div>
                </div>
                <div class="desc_item">
                    <div class="header">摘要</div>
                    <div class="body">
                        {{digest}}
                    </div>
                </div>
                <div class="desc_flex">
                    <div class="left">发布</div>
                    <div class="right">
                        <van-switch 
                            :checked="isShow" 
                            active-color="#9aa4d6"
                            size="25px"
                            @change="handlePostShowSwitch" 
                        />
                    </div>
                </div>
                <div class="desc_item classify">
                    <div class="header">分类</div>
                    <div class="body">
                        <div class="has_classify">
                            <div v-if="classifyUrl">
                                <img :src="classifyUrl" alt="">
                            </div>
                            <div>
                                {{classifyName || '暂无分类'}}
                            </div>
                        </div>
                        <div 
                            class="action"
                            @click="handleModalshow"
                        >
                            {{classifyName ? '编辑': '添加'}}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部按钮 -->
            <div class="btn_wrap">
                <div 
                    class="btn remove"
                    hover-class="hover_btn"
                    hover-stay-time="30"
                    @click="handleRemove"
                >
                    删除
                </div>
                <div 
                    class="btn save"
                    hover-class="hover_btn"
                    hover-stay-time="30"
                    @click="handleSave"
                >
                    保存
                </div>
            </div>
        </div>

        <!-- 加载中 骨架屏 -->
        <div class="inner_loading" v-else>
            <van-skeleton row="3"/>
        </div>

        <!-- 弹出框 -->
        <div class="inner_popup">
            <van-popup
                :show="isModalShow"
                position="bottom"
                :overlay="false"
                close-on-click-overlay="false"
                @close="handleModalHide"
            >
                <van-picker
                    show-toolbar
                    title="分类"
                    :columns="classifyLists"
                    @cancel="handleModalHide"
                    @confirm="handleClassifySelect"
                />
            </van-popup>
        </div>
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
    </div>
</template>

<script>
import api from '@/utils/api.js'
import Toast from '../../../../static/vant-weapp/toast/toast'
import Dialog from '../../../../static/vant-weapp/dialog/dialog'
export default {

    data () {
        return {
            postDetail: {},
            isModalShow: false,
            isLoading: true,
            classifyLists: [],
            title: '',
            digest: '',
            classifyName: '',
            classifyUrl: '',
            isShow: 0,
        }
    },

    onLoad(){
        Object.assign(this.$data, this.$options.data())
        this.postId = this.$root.$mp.query.postId
    },

    mounted () {
        this.getPostDetail()
        this.getClassifyLists()
    },

    methods: {
        // 获取文章详情
        getPostDetail () {
            let { postId } = this
            let params = {
                postId
            };
            api.api_postsDetail( params, res => {
                let data = res.data
                this.title = data.title
                this.digest = data.digest
                this.classifyName = data.classifyName
                this.classifyUrl = data.classifyUrl
                this.isShow = data.isShow
                this.isLoading = false
            })
        },

        // 获取分类列表
        getClassifyLists () {
            let params = {};
            api.api_classifyListsGet(params, res => {
                this.originClassifyLists = res.data
                this.classifyLists = this.originClassifyLists.map(item => item.classifyName)
            })
        },

        handleModalHide () {
            this.isModalShow = false
        },

        handleModalshow () {
            this.isModalShow = true
        },

        handleClassifySelect (e) {
            let { originClassifyLists } = this
            let classifyName = e.mp.detail.value
            this.classifyName = classifyName
            this.classifyUrl = originClassifyLists.find(item => item.classifyName == classifyName).classifyUrl
            this.isModalShow = false
        },

        handlePostShowSwitch (e) {
            let { isShow } = this
            this.isShow = !isShow
        },

        handleRemove () {
            let { postId } = this
            if (this.globalData.author.openId != this.globalData.user.openId) {
                Toast.fail({message:'sorry~~您无权限删除文章', duration: '1000'})
                return
            }
            Dialog.confirm({
                message: '确定删除该文章？'
            }).then(() => {
                let params = { postId }
                api.api_postRemove(params, res => {
                    Toast.success({message:'文章删除成功', duration: '1000'})
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1000)
                })
            }).catch(() => {})
        },

        handleSave () {
            let { postId, isShow, classifyName, classifyUrl } = this
            let params = {
                postId,
                isShow: !!isShow ? 1 : 0,
                classifyName,
                classifyUrl
            }
            api.api_postStatusUpdate(params, res => {
                Toast.success({message:'文章状态修改成功', duration: '1000'})
                setTimeout(() => {
                    wx.navigateBack()
                }, 1000)
            })
        },
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
