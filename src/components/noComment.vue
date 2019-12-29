<template>
    <div class="noData_container">
        <div class="noData">
            <img src="../../static/images/noComment.png" alt="">
            <div class="text">还没有评论呢，吐槽一下吧~~</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @import "../utils/theme.less";
    .noData_container{
        padding-top: 40px;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 180px;
        .noData{
            width: 180px;
            text-align: center;
            img{
                display: inline-block;
                width: 140px;
                height: 70px;
            }
            .text{
                margin-top: 15px;
                width: 100%;
                font-size: @text_size_attach;
                color: @text_color_lighter;
                text-align: center;
            }
        }
    }
    
</style>