<template>
    <div class="page_versionManage">
        <div class="inner_wrap">
            <!-- 列表 -->
            <div class="list_container">
                <ul v-if="!isLoading">
                    <li
                        hover-class="hover_li"
                        hover-stay-time="30"
                        v-for="(item, index) in versions"
                        :key="index"
                        @longpress="handleVersionRemove(item._id)"
                    >
                        <div class="header">
                            <div class="title">{{item.version}}</div>
                            <div class="time">{{item.date}}</div>
                        </div>
                        <div 
                            class="body"
                            v-for="(item, _index) in item.desc"
                            :key="_index"
                        >
                            <p>{{item}}</p>
                        </div>
                    </li>
                </ul>
                <div class="inner_loading" v-else>
                    <van-skeleton animate row="3"/>
                </div>
            </div>

            <!-- 新增按钮 -->
            <div class="btn_container">
                <div 
                    class="btn"
                    hover-class="hover_btn"
                    hover-stay-time="30"
                    @click="handleAddModalShow"
                >
                    新增
                </div>
            </div>

            <!-- 新增弹出框 -->
            <div class="addModal_container">
                 <van-overlay :show="isAddModalShow">
                    <van-transition 
                        name="fade"
                        custom-class="block"
                        duration='300'
                    >
                        <div class="inner_popup">
                            <div class="close" @click="handleAddModalHide">
                                <van-icon name="close" size="18px" color="#5d646e"/>
                            </div>
                            <div class="header">
                                新增历史版本
                            </div>
                            <div class="body">
                                <van-field
                                    :value="version"
                                    size="large"
                                    type="text"
                                    placeholder="请输入版本号"
                                    border=false
                                    center
                                    clearable
                                    title-width="20px"
                                    @input="handleVersionChange"
                                />
                                <van-field
                                    :value="desc"
                                    size="large"
                                    type="text"
                                    placeholder="请输入描述内容"
                                    border=false
                                    center
                                    clearable
                                    @input="handleDescChange"
                                />
                                <div 
                                    class="date_choose" 
                                    @click="handleDateModalShow"
                                    :class='{active: date}'
                                >
                                    {{date || '请选择时间'}}
                                </div>
                            </div>
                            <div class="footer">
                                <div 
                                    class="btn stroke"
                                    @click="handleAddModalHide"
                                >
                                    取消
                                </div>
                                <div 
                                    class="btn fill"
                                    @click="sureToAdd"
                                >
                                    新增
                                </div>
                            </div>
                        </div>
                    </van-transition>    
                </van-overlay>
            </div>

            <!-- 日期选择弹出框 -->
            <div class="dateModal_container">
                <van-popup
                    :show="isDateModalShow"
                    position="bottom"
                    :overlay="false"
                    close-on-click-overlay="false"
                >
                    <van-datetime-picker
                        type="date"
                        :value="timeStamp"
                        @input="onInput"
                        @cancel="handleDateCancel"
                        @confirm="handleDateConfirm"
                    />
                </van-popup>
            </div>

             <!-- 确认弹框 -->
            <van-toast id="van-toast" />
            <van-dialog id="van-dialog" />
        </div>
    </div>
</template>

<script>
import api from '@/utils/api.js'
import DateFormat from '@/utils/date.js'
import Validator from '@/utils/validator.js'
import Toast from '../../../../static/vant-weapp/toast/toast'
import Dialog from '../../../../static/vant-weapp/dialog/dialog'
export default {

    data () {
        return {
            versions: [],
            isLoading: true,
            isAddModalShow: false,
            version: '',
            desc: '',
            isDateModalShow: false,
            timeStamp: new Date().getTime(),
            date:''
        }
    },

    onLoad(){
        Object.assign(this.$data, this.$options.data())
    },

    mounted () {
        this.getVersionLists()
    },

    methods: {
        // 获取历史版本信息
        getVersionLists () {
            let params = {};
            api.api_versionGet(params, res => {
                this.isLoading = false
                let data = res.data;
                let versions = data.map(item => {
                    let date = DateFormat.getStamptime(item.date)
                    let desc = item.desc.split(/[ |；|;]/)
                    return {
                        _id: item._id,
                        version: item.version,
                        date: date,
                        desc
                    }
                })
                this.versions = versions
            })
        },

        // 新增弹出框显示
        handleAddModalShow () {
            this.isAddModalShow = true
        },

        // 新增弹出框隐藏
        handleAddModalHide () {
            this.isAddModalShow = false
            this.version = ''
            this.desc = ''
            this.date = ''
        },

        // 版本号输入
        handleVersionChange (e) {
            this.version = e.mp.detail
        },

        // 描述内容输入
        handleDescChange (e) {
            this.desc = e.mp.detail
        },

        // 时间选择弹窗显示
        handleDateModalShow () {
            this.isDateModalShow = true
        },

        handleDateCancel () {
            this.isDateModalShow = false
        },

        handleDateConfirm (e) {
            this.timeStamp = e.mp.detail
            this.date = DateFormat.getDateFormat( this.timeStamp)
            this.isDateModalShow = false
        },

        // 评论提交前验证
        vaildateFunc () {
            let validator = new Validator()
            validator.add(this.version, [{
                strategy: 'isNonEmpty',
                errorMsg: '版本号不能为空'
            }]);
            validator.add(this.desc, [{
                strategy: 'isNonEmpty',
                errorMsg: '版本描述不能为空'
            }]);
            validator.add(this.date, [{
                strategy: 'isNonEmpty',
                errorMsg: '版本时间不能为空'
            }]);
            let errorMsg = validator.start()
            return errorMsg;
        },

        // 确定新增版本
        sureToAdd () {
            let errorMsg = this.vaildateFunc()
             if(errorMsg){
                Toast.fail({message:`${errorMsg}`, duration: '1000'});
                return false
            }else{
                let { version, desc, date } = this
                let params = {
                    version,
                    desc,
                    date: new Date(date).getTime() / 1000
                }
                api.api_versionAdd(params, res => {
                    this.getVersionLists()
                    Toast.success({message:'版本说明新增成功', duration: '1500'})
                    this.isAddModalShow = false
                    this.version = ''
                    this.desc = ''
                    this.date = ''
                })
            }
        },

        // 长按删除框弹出
        handleVersionRemove (versionId) {
            let _this = this
            Dialog.confirm({
                message: '确定删除该条版本说明？'
            }).then(() => {
                let params = {versionId}
                api.api_versionRemove(params, res => {
                    _this.getVersionLists()
                    Toast.success({message:'版本说明删除成功', duration: '1500'})
                })
            }).catch(() => {})
        },
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
