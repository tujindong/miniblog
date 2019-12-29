<template>
    <div class="loadMore_container">
        <div class="loadMore"></div>
    </div>
</template>

<style lang="less" scoped>
    @import "../utils/theme.less";
    .loadMore_container{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50px;
        .loadMore{
            width: 15px;
            height: 15px;
            background: @purple_sub;
            border-radius: 50%;
            -webkit-animation: fading_circle 1s ease-out infinite alternate;
            animation: fading_circle 1s ease-out infinite alternate;
        }
        @-webkit-keyframes fading_circle {
            0% {
                transform: scale(1.5);
                opacity: 0.2;
            }
            100% {
                transform: scale(0.1);
                opacity: 1;
            }
        }
        @keyframes fading_circle {
            0% {
                transform: scale(1.5);
                opacity: 0.2;
            }
            100% {
                transform: scale(0.1);
                opacity: 1;
            }
        }
    }
    
</style>