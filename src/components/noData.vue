<template>
    <div 
        class="noData_container"
        @touchmove="handleTouchMove"
        :style='{top: top + "px"}'
    >
        <div class="noData">
            <img src="../../static/images/noSearch.png" alt="">
            <div class="text">{{text}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        top: {
            type: String,
            default: '0'
        },
        text: {
            type: String,
            default: '还没有数据哟~~'
        }
    },

    data() {
        return {
            top: this.top,
            text: this.text
        };
    },

     methods: {
        handleTouchMove (e) {
            e.preventDefault()
        }
    }
};
</script>

<style lang="less" scoped>
    @import "../utils/theme.less";
    .noData_container{
        z-index: -1;
        display: flex;
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        transition: 0.3 all;
        .noData{
            width: 180px;
            text-align: center;
            img{
                display: inline-block;
                width: 123px;
                height: 100px;
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