<template>
    <div class="page_index">
        <div class="inner_wrap">
            <div class="cell_container">
                <div class="title">
                    系统管理
                </div>
                <van-cell-group>
                    <van-cell 
                        title="用户管理" 
                        icon="user-circle-o" 
                        size="large"
                        is-link="true"
                        link-type="navigateTo"
                        url="../userManage/main"
                    />
                    <van-cell 
                        title="版本发布" 
                        icon="orders-o" 
                        size="large"
                        is-link="true"
                        link-type="navigateTo"
                        url="../versionManage/main"
                    />
                </van-cell-group>
            </div>

            <div class="whiteSpace"></div>

            <div class="cell_container">
                <div class="title">
                    文章管理
                </div>
                <van-cell-group>
                    <van-cell 
                        title="文章管理" 
                        icon="records" 
                        size="large"
                        is-link="true"
                        link-type="navigateTo"
                        url="../postsManage/main"
                    />
                    <van-cell 
                        title="评论管理" 
                        icon="comment-o" 
                        size="large"
                        is-link="true"
                        link-type="navigateTo"
                        url="../commentManage/main"
                    />
                    <van-cell 
                        title="分类管理" 
                        icon="label-o" 
                        size="large"
                        is-link="true"
                        link-type="navigateTo"
                        url="../classifyManage/main"
                    />
                </van-cell-group>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    data () {
        return {}
    },

    onLoad(){
        Object.assign(this.$data, this.$options.data())
    },

    mounted () {
    },

    methods: {
        
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
