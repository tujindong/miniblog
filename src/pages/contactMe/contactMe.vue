<template>
    <div class="page_contactMe">
        <div class="inner_wrap">
            <div class="list_container">
                <div class="list_item intro">
                    <div class="title">
                        关于我
                    </div>
                    <div class="content">
                        <p>工具人涂小图，野生程序猿</p>
                        <p>与食巨近，贱多食广，给啥吃啥，从来不挑</p>
                        <p>闯过非洲，挖过土坑，现已晒黑，无法洗白</p>
                        <p>可损可萌，忽正忽邪，静若瘫痪，动若癫痫</p> 
                        <p>摄影剪辑，都会一点，节操已碎，文艺不死</p>
                        <p>大世界里的小个体</p>
                        <p>有寄托，有期待，有正在努力实现的梦想</p>
                        <p>包括遇见你..</p> 
                        <p>欢迎投喂...</p>
                    </div>
                </div>

                <div class="list_item social">
                    <div class="title">
                        联系我
                    </div>
                    <div class="content">
                        <ul>
                            <li
                                hover-class="hover_li"
                                hover-stay-time="30"
                                @click="handlePopupShow('weixin')"
                            >
                                <img src="../../../static/images/icon_weixin.png" alt="">
                            </li>
                            <li
                                hover-class="hover_li"
                                hover-stay-time="30"
                                @click="handleWeiboTap"
                            >
                                <img src="../../../static/images/icon_weibo.png" alt="">
                            </li>
                            <li
                                hover-class="hover_li"
                                hover-stay-time="30"
                                @click="handlePopupShow('zhihu')"
                            >
                                <img src="../../../static/images/icon_zhihu.png" alt="">
                            </li>
                            <li
                                hover-class="hover_li"
                                hover-stay-time="30"
                                @click="handleGithubTap"
                            >
                                <img src="../../../static/images/icon_github.png" alt="">
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="popup_container">
                <!-- 微信 -->
                <van-overlay 
                    :show="isOverlayShow_weixin" 
                    @click="handlePopulHide('weixin')"
                >
                    <van-transition 
                        name="fade"
                        custom-class="block"
                        duration='300'
                    >
                        <div class="inner_popup weixin">
                            <div class="header">
                                <div class="name">涂小图</div>
                                <div class="sub_name">tu_jindong</div>
                            </div>
                            <div class="body">
                                <img :src="info_weixin.qrCodeUrl" alt="">
                                <div class="text">扫一扫上面二维码，加我微信</div>
                            </div>
                        </div>
                    </van-transition>    
                </van-overlay>

                <!-- 知乎 -->
                <van-overlay 
                    :show="isOverlayShow_zhihu" 
                    @click="handlePopulHide('zhihu')"
                >
                    <van-transition 
                        name="fade"
                        custom-class="block"
                        duration='300'
                    >
                        <div class="inner_popup zhihu">
                            <div class="header">
                                <div class="avatar">
                                    <img :src="info_zhihu.avatarUrl" alt="">
                                </div>
                                <div class="info">
                                    <div class="name">涂小图</div>
                                    <div class="desc">野生程序猿</div>
                                </div>
                            </div>
                            <div class="body">
                                <div class="data">
                                    <ul>
                                        <li>
                                            <div class="num">{{info_zhihu.achieve.article}}</div>
                                            <div class="name">创作</div>
                                        </li>
                                        <li>
                                            <div class="num">{{info_zhihu.achieve.agree}}</div>
                                            <div class="name">赞同</div>
                                        </li>
                                        <li>
                                            <div class="num">{{info_zhihu.achieve.collect}}</div>
                                            <div class="name">收藏</div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="code">
                                    <img :src="info_zhihu.qrCodeUrl" alt="">
                                    <div class="text">扫码来知乎找我</div>
                                </div>
                            </div>
                        </div>
                    </van-transition>    
                </van-overlay>
            </div>
        </div>

        <van-toast id="van-toast" />
    </div>
</template>

<script>
import api from '@/utils/api.js';
import Toast from '../../../static/vant-weapp/toast/toast';
export default {

    data () {
        return {
            info_zhihu: {
                achieve: {
                    agree: '0',
                    article: '0',
                    collect: '0'
                }
            },
            info_weixin: {},
            isOverlayShow_zhihu: false,
            isOverlayShow_weixin: false
        }
    },

    onLoad(){
        Object.assign(this.$data, this.$options.data())
    },

    mounted () {
    },

    methods: {
        getContact (type) {
            let params = {
                name: type
            };
            api.api_contactGet(params, res => {
                if(type == 'zhihu'){
                    this.info_zhihu = res.data[0]
                    this.isOverlayShow_zhihu = true
                }else if(type == 'weixin'){
                    this.info_weixin = res.data[0]
                    this.isOverlayShow_weixin = true
                }
            })
        },

        handlePopupShow (type) {
            this.getContact(type)
        },

        handlePopulHide (type) {
            if(type == 'zhihu'){
                this.isOverlayShow_zhihu = false
            }else if(type == 'weixin'){
                this.isOverlayShow_weixin = false
            }
        },

        handleWeiboTap () {
            wx.setClipboardData({
                data: 'https://weibo.com/u/2394837023/home?wvr=5',
                success: function () {}
            })
        },

        handleGithubTap () {
             wx.setClipboardData({
                data: 'https://github.com/tujindong',
                success: function () {}
            })
        }
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
