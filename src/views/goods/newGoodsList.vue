<template>
  <div class="page_wrap s_bg_f3">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <van-pull-refresh class="refresh_wrap" v-model="refreshing" @refresh="onRefresh">
      <!-- 背景图 -->
      <div class="bg_wrap">
        <img class="i_newPeople" :src="newPeople && newPeople.bg ? newPeople.bg.url : ''" alt="">
      </div>

      <van-list class="list_wrap s_bg_f" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad" v-if="list.length">

        <div class="newPeople_goods_wrap flex" v-for="(item, index) in list" :key="index" @click="goGoodsDetail(item)">
          <img class="i_newPeople_goods" :src="item.goods_image" alt="" />

          <div class="newPeople_info_wrap s_fc_3">
            <div class="newPeople_name">{{item.goods_name}}</div>

            <div class="newPeople_price_wrap flex">
              <div class="newPeople_price">
                <span>￥</span>
                <span class="fs36">{{item.priceInteger}}</span>
                <span>.{{item.priceDecimal}}</span>
              </div>

              <div class="newPeople_desc s_fc_f s_bg_11">新人价</div>
            </div>

            <div class="newPeople_marketprice_wrap s_fc_9">
              <span>购购价￥</span>
              <span class="newPeople_marketprice">{{item.goods_marketprice}}</span>
            </div>
          </div>
        </div>
        
      </van-list>

      <!-- 规则 -->
      <div class="rule_wrap">
        <div class="rule_title fs36">领取规则</div>

        <div class="rule_desc_wrap s_fc_6">
          <div class="" v-for="(item, index) in descList" :key="index">{{item}}</div>
        </div>
      </div>
    </van-pull-refresh>

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

export default {
  components: {
    [Field.name]: Field,
  },

  data() {
    return {
      newPeople: null,

      refreshing: false,
      loading: false,
      finished: false,

      page: 1,
      limit: 10,
      total: 0,

      type: null,
      list: [],

      descList: [
        '1.新人专享活动,为了回馈老用户,平台所有用户都可以参加',
        '2.此板块试运行阶段,所有新老用户目前是只能参加一次,请挑选喜欢的产品购买',
        '3.新人专享板块的产品是低于成本价回馈,没有任何分销奖励',
        '4.新人专享板块产品只能通过现金购买,而且没有售后服务。',
      ],
    };
  },

  computed: {
    title() { return '购购专享'; },

    isBack() { return this.$route.meta.isBack; },

  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;

      this.clear();
      this.getConfig();
      this.getList();
    },

    goGoodsDetail(item) {
      this.$router.push({ name: 'goodsDetail', query: { id: item.goods_commonid }, });
    },

    onRefresh(e) {
      this.init();
    },

    onLoad(e) {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      this.getList();
    },

    format(v) {
      let priceArr = String(v.newcomer_price).split('.');

      v.priceInteger = priceArr[0];
      v.priceDecimal = priceArr[1];
    },

    async getConfig() {
      let param = {};

      let res = await api.getConfig(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取背景配置信息失败!')

      if(res && res.data){
        this.configInfo = res.data;
        this.newPeople = res.data.img.newPeople;
      }
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, newcomer: 1, type: 'sort', };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.getGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取评论列表信息失败!')

      if(res && res.data){
        res.data.forEach(this.format);
        this.list = this.list.concat(res.data);
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    clear() {
      scrollTo(0, 0);

      this.list = [];
      this.page = 1;
      this.finished = false;
      this.loading = true;
    },

    goBack() {
      this.$router.back();
    },

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
  font-size: 28px;
}

.refresh_wrap{
  min-height: 100vh;
}

.i_newPeople{
  width: 100%;
  height: 260px;
}

.list_wrap{
  padding: 40px 60px 0;
  border-radius: 20px 20px 0 0;
}

.newPeople_goods_wrap{
  padding: 0 0 40px 0;
}
.i_newPeople_goods{
  flex-shrink: 0;
  width: 230px;
  height: 230px;
}
.newPeople_info_wrap{
  flex-grow: 1;
  margin: 0 0 0 30px;
}
.newPeople_name{
  width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.newPeople_desc{
  height: 36px;
  margin: 0 0 0 20px;
  font-size: 24px;
  padding: 0 8px;
  border-radius: 20px 20px 20px 0;
}
.newPeople_price_wrap{
  align-items: center;
  margin: 90px 0 0;
}
.newPeople_price{
  font-weight: bold;
}
.newPeople_marketprice_wrap{
  margin: 20px 0 0;
}
.newPeople_marketprice{
  text-decoration: line-through;
}

.rule_wrap{
  padding: 0 50px 0 40px;
}
.rule_title{
  padding: 50px 0 40px;
  font-weight: bold;
  text-align: center;
}
.rule_desc_wrap{
  font-size: 24px;
  line-height: 36px;
}

.fs36{ font-size: 36px; }

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #EC4E53; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #494949; }
.s_fc_15{ color: #3f3f3f; }

.s_bg_11{ background: #EC4E53; }
.s_bg_13{ background: #4FB84A; }
.s_bg_f3{ background: #f3f3f3; }
</style>
<style>
</style>