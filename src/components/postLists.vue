<template>
     <div class="posts_container">
        <ul>
            <li 
                hover-class="hover_li"
                hover-stay-time="30"
                v-for="(item, _index) in posts" 
                :key="_index"
                @click="onTap(item._id, _index)"
            >
                <div class="desc">
                    <div class="tags">
                        <div class="tag_img">
                            <img :src="item.classifyUrl" alt="">
                        </div>
                        <div class="tag_text">{{item.classifyName}}</div>
                    </div>
                    <div class="date">{{item.createTime}}</div>
                </div>
                <div class="title">{{item.title}}</div>
                <div class="content">{{item.digest}}</div>
                <div class="actions">
                    <div class="actions_item manager">
                        <van-icon name="manager" size="14px" color="#9aa4d6"/>
                        <span>{{item.author? item.author: '涂小图'}}</span>
                    </div>
                    <div class="actions_item view">
                        <van-icon name="browsing-history" size="14px" color="#9aa4d6"/>
                        <span>{{item.totalVisits}}</span>
                    </div>
                    <div class="actions_item comment">
                        <van-icon name="comment-circle" size="14px" color="#9aa4d6"/>
                        <span>{{item.totalComments}}</span>
                    </div>
                    <div class="actions_item like">
                        <van-icon name="like" size="14px" color="#9aa4d6"/>
                        <span>{{item.totalZans}}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

    props: {
        posts: {
            type: Array,
            default: []
        },
    },

    data () {
        return {
           posts: this.posts,
        }
    },

    mounted () {
       
    },

    methods: {
        onTap (postId, _index) {
            this.$emit("onTap", postId, _index)
        }
    }
}
</script>

<style lang="less" scoped>
    @import "../utils/theme.less";
    .posts_container{
        padding: 20px 10px 0;
        ul{
            li{
                position: relative;
                padding: 20px 0px;
                border-bottom: 0.5px solid #f0f0f0;
                &.hover_li{
                    &::after{
                        position: absolute;
                        top: 0;
                        left: 0;
                        display: block;
                        content: '';
                        width: 100%;
                        height: 100%;
                        background: rgba(255, 255, 255, 0.25);
                    }
                }
                .desc{
                    display: flex;
                    height: 25px;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    .tags{
                        display: flex;
                        align-items: center;
                        .tag_img{
                            width: 25px;
                            height: 25px;
                            img{
                                display: block;
                                width: 25px;
                                height: 25px;
                            }
                        }
                        .tag_text{
                            margin-left: 5px;
                            font-size: 14px;
                            color: @text_color_light;
                        }
                    }
                    .date{
                        color: @text_color_light;
                        font-size: 14px;
                    }
                }
                .title{
                    font-size: @text_size_subTitle;
                    color: @text_color_dark;
                    font-weight: bold;
                }
                .content{
                    margin-top: 10px;
                    font-size: @text_size_content;
                    color: @text_color_normal;
                }
                .actions{
                    display: flex;
                    align-items: center;
                    height: 25px;
                    margin-top: 10px;
                    .actions_item{
                        width: 40px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        &.manager{
                            width: 60px;
                        }
                        &.view{
                            margin-left: auto;
                        }
                        &.comment{
                            margin-left: 15px;
                        }
                        &.like{
                            margin-left: 15px;
                        }
                        span{
                            margin-top: -2px;
                            font-size: 13px;
                            margin-left: 5px;
                            color: @text_color_light;
                        }
                    }
                }
            }
        }
    }
</style>