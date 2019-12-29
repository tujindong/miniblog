<template>
    <div class="page_version">
        <div class="inner_wrap" v-if="!isLoading">
            <van-steps
                v-if="versions.length"
                :steps="versions"
                :active="0"
                direction="vertical"
                active-color="#8893c9"
                custom-class="tu_steps"
            />
            <NoData 
                v-else 
                :top="0"
                text="作者太懒了，没有更新版本信息~~"
            />
        </div>
        <!-- 加载中-骨架屏 -->
        <div class="inner_loading" v-else>
            <van-skeleton animate row="5"/>
        </div>
    </div>
</template>

<script>
import api from '@/utils/api.js';
import DateFormat from '@/utils/date.js';
import NoData from '@/components/noData';
export default {

    components:{ NoData },

    data () {
        return {
            versions: [],
            isLoading: true
        }
    },

    onLoad(){
        Object.assign(this.$data, this.$options.data())
    },

    mounted () {
        this.getVersionLists();
    },

    methods: {
        // 获取历史版本信息
        getVersionLists () {
            let params = {};
            api.api_versionGet(params, res => {
                this.isLoading = false;
                let data = res.data;
                let versions = data.map(item => {
                    let date = DateFormat.getStamptime(item.date);
                    let desc = item.desc.split(/[ |；|;]/)
                    return {
                        text: `${item.version} | ${date}`,
                        desc
                    }
                })
                this.versions = versions;
            })
        }
    }
}
</script>

<style lang="less" scoped>
    @import "./style";
</style>
