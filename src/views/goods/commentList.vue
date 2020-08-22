<template>
  <div class="page_wrap s_bg_f">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list class="list_wrap" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">

        <comment class="comment_wrap" :config="item" v-for="(item, index) in list" :key="index"></comment>
        
      </van-list>

    </van-pull-refresh>
  </div>
</template>
<script>
import { Field, } from 'vant';
import * as math from 'mathjs';
import * as api from '@/api/common';
import * as apiUser from '@/api/user';
import * as apiGoods from '@/api/goods';
import comment from '@/components/my/comment.vue';
import * as Type from '@/utils/type';
import * as gd from '@/utils/global';

export default {
  components: {
    [Field.name]: Field,
    comment,
  },

  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,

      page: 1,
      limit: 10,
      total: 0,

      id: null,
      list: [],
    };
  },

  computed: {
    title() { return '商品评论'; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.id = query.id;
      this.type = query.type;

      if(!this.id) return console.error('commentList no id');

      this.clear();
      this.getList();
    },

    onRefresh(e) {
      this.clear();

      this.loading = true;

      this.getList();
    },

    onLoad(e) {
      if(this.total <= this.page * this.limit) return this.finished = true;
      this.page++;

      this.getList();
    },

    // async getConfig() {
    //   let param = {};

    //   let res = await api.getConfig(param);
    //   if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取背景配置信息失败!')

    //   if(res && res.data){
    //     this.configInfo = res.data;
    //     this.bgColor = res.data.color.bgColor;
    //     this.bannerConfig.bgImg = res.data.img.home.url;
    //   }
    // },

    async getList() {
      let param = { page: this.page, limit: this.limit, goods_id: this.id, goods_type: "real", };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.getCommentList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取评论列表信息失败!')

      if(res && res.data){
        this.list = this.list.concat(res.data);
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }

      this.loading = this.refreshing = this.finished = false;
      this.$toast.clear();
    },

    clear() {
      this.list = [];
      this.page = 1;
      this.total = 0;
      this.finished = true;

      scrollTo(0, 0);
    },

    goBack() {
      this.$router.back();
    },

  },

  activated() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  min-height: 100vh;
  padding: 128px 0 0;
}

.list_wrap{
  padding: 0 20px;
}
.comment_wrap{
  border-bottom: 1px solid #eee;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #494949; }
.s_fc_15{ color: #3f3f3f; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
</style>