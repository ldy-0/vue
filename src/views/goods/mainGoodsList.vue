<template>
  <div class="page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">

      <van-list class="list_wrap" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
        <div class="goods_list_wrap between">
          <goods :config="item" v-for="(item, index) in list" :key="index"></goods>
        </div>
      </van-list>
        
    </van-pull-refresh>

    <goTop></goTop>
  </div>
</template>
<script>
import { Field, } from 'vant';
import * as math from 'mathjs';
import * as api from '@/api/common';
import * as apiUser from '@/api/user';
import * as apiGoods from '@/api/goods';
import * as Type from '@/utils/type';
import * as gd from '@/utils/global';
import banner from '@/components/banner.vue';
import goods from '@/components/goods/goods.vue';
import goTop from '@/components/goTop.vue';

export default {
  components: {
    [Field.name]: Field,
    goTop,
    banner,
    goods,
  },

  data() {
    return {
      bannerConfig: {
        bgImg: null,
      },

      type: '',
      status: -1,
      refreshing: false,
      loading: false,
      finished: false,
      isFixed: false,

      page: 1,
      limit: 10,
      total: 0,
      list: [],
    };
  },

  computed: {
    title() { return '商品列表'; },

    isBack() { return this.$route.meta.isBack; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;

      this.clear(true);
      this.getList();
    },

    goDetail(item) {
      let id = item.goods_commonid;

      this.$router.push({ name: 'goodsDetail', query: { id, } });
    },

    onRefresh(e) {
      this.clear(true);

      this.loading = true;

      this.getList();
    },

    onLoad(e) {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      this.getList();
    },

    format(v){
      let arr = String(v.goods_price).split('.');

      v.priceInteger = arr[0];
      v.priceDecimal = arr[1];

      return v;
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, is_vip: 0, type: 'sort', store_id: gd.MAIN_STORE, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.getGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取VIP商品信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.list.lenght;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    clear(deep) {
      this.list = [];
      this.page = 1;
      this.finished = false;

      if(deep){
        scrollTo(0, 0);
      }
    },

    goBack() {
      this.$router.back();
    },

  },

  created() {
    this.init();
  },

  activated() {
    if(this.isBack) return ;

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
  min-height: 100vh;
}

.goods_list_wrap{
  flex-wrap: wrap;
  padding: 0 20px; 
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #494949; }
.s_fc_15{ color: #3f3f3f; }
.s_fc_16{ color: #FF0032; }
.s_fc_17{ color: #151212; }

.s_bg_11{ background: #FC6B76; }
.s_bg_12{ background: #FF0032; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
.van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}

.van-tabs__wrap--scrollable .van-tab{
  flex: 0 0 20% !important;
}
.van-tabs__line{
  background: #FF557A;
}

.van-sticky--fixed{
  top: 88px;
}
</style>