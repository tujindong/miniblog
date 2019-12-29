<template>
    <div class="dialog_container">
         <van-dialog
            use-slot
            :show="isDialogBoxShow"
            show-cancel-button
            confirm-button-open-type="getUserInfo"
            @close="handleDialogClose"
            @getuserinfo="getUserInfo"
        >
            <div class="inner_dialog">
                <div class="title">微信授权</div>
                <div class="content">
                    <div class="avatar">
                        <img src="../../static/images/tuxiaotu.jpg" alt="">
                    </div>
                    <div class="text">
                        涂小图申请获取以下权限：
                    </div>
                </div>
                <div class="sub_content">
                    <van-icon name="music" size="14px" color="#b5b7c4"/>
                    <span>获得您的公开信息(头像、昵称等)</span>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script>
export default {
    props: {
        isDialogBoxShow: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            isDialogBoxShow: this.isDialogBoxShow
        };
    },

     methods: {
        handleDialogClose () {
            this.$emit("handleDialogClose")
        }
    }
};
</script>

<style lang="less" scoped>
    @import "../utils/theme.less";
    .dialog_container{
        .inner_dialog{
            padding: 20px;
            .title{
                font-size: @text_size_title;
                color: @text_color_dark;
                margin-bottom: 20px;
            }
            .content{
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                .avatar{
                    width: 45px;
                    height: 45px;
                    img{
                        display: block;
                        width: 45px;
                        height: 45px;
                        border-radius: 50%;
                    }
                }
                .text{
                    margin-left: 20px;
                    font-size: @text_size_subTitle;
                    color: @text_color_normal;
                }
            }
            .sub_content{
                display: flex;
                padding-top: 20px;
                border-top: 1px solid #f0f0f0;
                span{
                    margin-left: 5px;
                    font-size: @text_size_content;
                    color: @text_color_light;
                }
            }
        }
    }
</style>