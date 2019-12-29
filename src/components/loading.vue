<template>
    <div 
        class="loading_container" 
        :style='{top: top + "px"}'
    >
         <div class="loading font1">
            <span>L</span>
            <span class="span2">O</span>
            <span class="span3">A</span>
            <span class="span4">D</span>
            <span class="span5">I</span>
            <span class="span6">N</span>
            <span class="span7">G</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        top: {
            type: String,
            default: '0'
        }
    },

    data() {
        return {
            top: this.top
        };
    },
};
</script>

<style lang="less" scoped>
    @import "../utils/theme.less";
    @-webkit-keyframes loading {
        0%, 100% {
            -webkit-transform: scale(1) rotateZ(0deg);
            transform: scale(1) rotateZ(0deg);
            opacity: 1;
        }

        26% {
            -webkit-transform: scale(1.1) rotateZ(12deg);
            transform: scale(1.1) rotateZ(12deg);
            opacity: .2;
        }

        76% {
            -webkit-transform: scale(0.8) rotateZ(-8deg);
            transform: scale(0.8) rotateZ(-8deg);
            opacity: .6;
        }
    }
    @keyframes loading {
        0%, 100% {
            -ms-transform: scale(1) rotateZ(0deg);
            -webkit-transform: scale(1) rotateZ(0deg);
            transform: scale(1) rotateZ(0deg);
            opacity: 1;
        }

        26% {
            -ms-transform: scale(1.1) rotateZ(12deg);
            -webkit-transform: scale(1.1) rotateZ(12deg);
            transform: scale(1.1) rotateZ(12deg);
            opacity: .2;
        }

        76% {
            -ms-transform: scale(0.8) rotateZ(-8deg);
            -webkit-transform: scale(0.8) rotateZ(-8deg);
            transform: scale(0.8) rotateZ(-8deg);
            opacity: .6;
        }
    }
    .loading_container{
        display: flex;
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        transition: 0.3 all;
        .loading {
            margin-top: -150px;
            width: 215px;
            height: 50px;
            overflow: hidden;
            font-size: 45px;
            &.font1 {
                font-family: "Helvetica", Arial, sans-serif;
            }
            &.font2 {
                font-family: Impact;
            }
            &.font3 {
                font-family: "Comic Sans MS", sans-serif;
                font-weight: bold;
            }
            span {
                -moz-animation: loading 1s linear infinite -0.8s;
                -webkit-animation: loading 1s linear infinite -0.8s;
                animation: loading 1s linear infinite -0.8s;
                float: left;
                color: @purple_main;
            }
            .span2 {
                -moz-animation: loading 1s linear infinite -0.2s;
                -webkit-animation: loading 1s linear infinite -0.2s;
                animation: loading 1s linear infinite -0.2s;
            }
            .span3 {
                -moz-animation: loading 1s linear infinite -0.5s;
                -webkit-animation: loading 1s linear infinite -0.5s;
                animation: loading 1s linear infinite -0.5s;
            }
            .span4 {
                -moz-animation: loading 1s linear infinite -1.1s;
                -webkit-animation: loading 1s linear infinite -1.1s;
                animation: loading 1s linear infinite -1.1s;
            }
            .span5 {
                -moz-animation: loading 1s linear infinite -0.36s;
                -webkit-animation: loading 1s linear infinite -0.36s;
                animation: loading 1s linear infinite -0.36s;
            }
            .span6 {
                -moz-animation: loading 1s linear infinite -0.65s;
                -webkit-animation: loading 1s linear infinite -0.65s;
                animation: loading 1s linear infinite -0.65s;
            }
            .span7 {
                -moz-animation: loading 1s linear infinite -0.93s;
                -webkit-animation: loading 1s linear infinite -0.93s;
                animation: loading 1s linear infinite -0.93s;
            }
        }
    }

</style>