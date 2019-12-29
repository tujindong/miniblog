<template>
    <div class="comp_navbar">
        <cover-view 
            class="placeholder_bar" 
            :style="{height: navBarHeight + 'px'}"
        > 
        </cover-view>
        <cover-view 
            class="navbar" 
            :style="{height: navBarHeight + 'px', backgroundColor: navBackgroundColor}"
        >
            <cover-view 
                class="nav_statusbar" 
                :style="{height: statusBarHeight + 'px'}"
            >
            </cover-view>
            <cover-view 
                class="nav_titlebar" 
                :style="{height: titleBarHeight + 'px' }"
            >
                <cover-view class="bar_options">
                    <cover-view 
                        class="opt_home" 
                        @click="handleHomeClick"
                    >
                        <cover-image 
                            class="home_image" 
                            src="../../static/images/icon_t.png"
                        >
                        </cover-image>
                    </cover-view>
                </cover-view>
                <cover-view 
                    class="bar_title" 
                    :style="[{color:titleColor}]"
                >
                    {{title}}
                </cover-view>
            </cover-view>
        </cover-view>
    </div>
</template>

<script>
export default {
    props: {
        navBackgroundColor: {
            default: "#ffffff"
        },
        titleColor: {
            default: "#000000"
        },
        title: {
            required: false,
            default: "涂小图"
        },
        backVisible: {
            required: false,
            default: false
        }
    },

    data() {
        return {
            statusBarHeight: "", // 状态栏高度
            titleBarHeight: "", // 标题栏高度
            navBarHeight: "", // 导航栏总高度
            platform: "",
            model: "",
            brand: "",
            system: ""
        };
    },

    beforeMount() {
        const self = this;
        wx.getSystemInfo({
            success(system) {
                self.statusBarHeight = system.statusBarHeight;
                self.platform = system.platform;
                self.model = system.model;
                self.brand = system.brand;
                self.system = system.system;
                let platformReg = /ios/i;
                if (platformReg.test(system.platform)) {
                    self.titleBarHeight = 44;
                } else {
                    self.titleBarHeight = 48;
                }
                self.navBarHeight = self.statusBarHeight + self.titleBarHeight;
            }
        });
    },

    methods: {
        handleHomeClick() {
            this.$emit("handleHomeClick")
        }
    }
};
</script>

<style lang="less" scoped>
@import "../utils/theme.less";
.comp_navbar {
    width: 100vw;
    .navbar {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        .nav_titlebar {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            .bar_options {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                position: absolute;
                left: 15px;
                display: flex;
                align-items: center;
                border-radius: 50%;
                border: 1px solid #f0f0f0;
            .opt_home {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                background: @text_color_dark;
                border-radius: 50%;
                .home_image {
                    width: 10px;
                    height: 10px;
                }
            }
            }
            .bar_title {
                width: 45%;
                font-size: 17px;
                color: #000000;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
            }
        }
    }
    .placeholder_bar{
        background-color: transparent;
        width: 100%;
    }
}
</style>
