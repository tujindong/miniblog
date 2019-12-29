<template>
    <div class="page_classifyManage">
        <div class="inner_wrap">
            <div class="list_container">
                <ul>
                    <li
                        class="list"
                        v-for="(item, index) in classifyLists"
                        :key="index"
                    >
                        <div class="close">
                            <van-icon name="close" size="18px" color="#ff5252"/>
                        </div>
                        <div class="img_wrap">
                            <img :src="item.classifyUrl" alt="">
                        </div>
                        <div class="name">{{item.classifyName}}</div>
                    </li>
                    <li>
                        <div 
                            class="add"
                            hover-class="hover_add"
                            hover-stay-time="30"
                            @click="handleClassifyAdd"
                        >
                        </div>
                    </li>
                </ul>
            </div>
            <div class="popup_container">
                <van-popup 
                    :show="isPopupShow" 
                    @close="handlePopupHide"
                    closeable
                    position="bottom"
                    custom-style="height: 40%"
                >
                    <div class="inner_popup">
                        <div class="left_area">
                           <van-uploader 
                                file-list="fileList" 
                                @afterread="handleAfterRead" 
                            />
                        </div>
                        <div class="right_area">
                            右边
                        </div>
                    </div>
                </van-popup>
            </div>
        </div>

        <!-- 确认弹框 -->
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import api from '@/utils/api.js';
import Toast from '../../../../static/vant-weapp/toast/toast';
export default {

    data () {
        return {
            classifyLists: [],
            fileList: [],
            isPopupShow: false
        }
    },

    onLoad(){
        Object.assign(this.$data, this.$options.data())
    },

    mounted () {
        this.getClassifyLists();
    },

    methods: {
        // 获取分类列表
        getClassifyLists () {
            let params = {};
            api.api_classifyListsGet(params, res => {
                this.classifyLists = res.data;
                console.log('分类列表', res.data)
            })
        },

        // 弹窗隐藏
        handlePopupHide () {
            this.isPopupShow = false
        },

        // 分类新增 弹窗显示
        handleClassifyAdd () {
            Toast.fail({message:'还在开发中', duration: '1000'});
            return;
            this.isPopupShow = true
        },

        // 文件上传完毕后会触发after-read回调函数，获取到对应的文件的临时地址
        handleAfterRead (e) {
            console.log('afterread', e.mp.detail.file)
        },
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
