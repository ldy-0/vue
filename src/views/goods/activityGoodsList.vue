<template>
  <div class="page_wrap s_bg_f">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <van-tabs class="tabs_wrap" v-model="typeIndex" sticky :border="false" line-height="2" @change="changeType"
      :color="'#4FB84A'" :title-inactive-color="'#999'" :title-active-color="'#4FB84A'" :background="'#fff'" v-if="isSeckill || isLive">
      <van-tab title="今日秒杀" name="seckill"></van-tab>
      <van-tab title="直播礼包" name="live"></van-tab>
    </van-tabs>
    
    <van-pull-refresh class="" v-model="refreshing" @refresh="onRefresh">
      <van-list class="list_wrap" :class="{ mt40: isSeckill || isLive }" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">

        <div class="">
          <div v-if="isSeckill || isGroup || isBargain">
            <activityGoods :config="item" v-for="(item, index) in list" :key="index"></activityGoods>
          </div>
          <div class="gift_list_wrap between s_bg_f" v-if="isLive">
            <div class="gift_goods_wrap" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
              <img class="i_gift_goods" :src="item.goods_image" alt="">

              <div class="">
                <div class="gift_goods_name s_fc_0">{{item.goods_name}}</div>

                <div class='goods_integral_wrap s_fc_16' v-if="item.goods_integral">
                  <span class="goods_integral_pre s_fc_f s_bg_12">返</span><span class="goods_integral">{{item.goods_integral}}积分</span>
                </div>

                <div class="goods_price_wrap">
                  <img v-if="item.tag_image" class="goods_tag" :src="item.tag_image" alt="">
                  <span class="price_wrap s_fc_17">￥<span class="price">{{item.priceArr[0]}}</span>.{{item.priceArr[1]}}</span>
                  <span class="sale_wrap s_fc_0">热销{{item.goods_salenum}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
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
import activityGoods from '@/components/goods/activityGoods.vue';
import * as Type from '@/utils/type';
import * as gd from '@/utils/global';

export default {
  components: {
    [Field.name]: Field,
    activityGoods,
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
      type: null,
      list: [],
      
      typeIndex: '',
      liveId: null,
    };
  },

  computed: {
    title() { return this.isSeckill || this.isLive ? '直播秒杀' : this.isGroup ? '团购商品' : this.isBargain ? '砍价商品' : ''; },

    isBack() { return this.$route.meta.isBack; },

    isSeckill(){ return this.typeIndex == 'seckill'; },
    isGroup(){ return this.type == gd.GROUP_GOODS; },
    isBargain(){ return this.type == gd.BARGAIN_GOODS; },
    isLive(){ return this.typeIndex == 'live'; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.id = query.id;
      this.type = query.type;
      this.typeIndex = '';
      if(this.type == gd.SECKILL_GOODS) this.typeIndex = 'seckill';
      if(this.type == gd.LIVE_GOODS) this.typeIndex = 'live';

      this.clear();
      this.loading = true;

      if(this.isSeckill || this.isLive){  
        return this.getClassList();
      }

      this.getList();
    },

    changeType(e) {
      this.clear();

      if(this.isSeckill) this.getList();
      if(this.isLive) this.getGiftList();
    },

    onRefresh(e) {
      this.clear();

      this.loading = true;

      this.getList();
    },

    onLoad(e) {
      
      if(this.total <= this.page * this.limit) return this.finished = true;
      this.page++;

      if(this.isLive) return this.getGiftList();
      this.getList();
    },

    goDetail(item) {
      let id = item.goods_commonid;

      this.$router.push({ name: 'goodsDetail', query: { id, }, });
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
      let param = { page: this.page, limit: this.limit, store_id: gd.MAIN_STORE, only_app: 1, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods[`get${this.isSeckill ? 'Seckill' : this.isGroup ? 'Group' : this.isBargain ? 'Bargain' : ''}List`](param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取商品列表信息失败!')

      if(res && res.data){
        this.list = this.list.concat(res.data);
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    formatGift(v) {
      v.priceArr = String(v.goods_price).split('.');

      return v;
    },

    async getGiftList() {
      let param = { page: this.page, limit: this.limit, gc_id: this.liveId, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.getGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取商品列表信息失败!')

      if(res && res.data){
        res.data.forEach(this.formatGift);
        this.list = this.list.concat(res.data);
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    async getClassList() {
      let param = {},
          item;

      let res = await apiGoods.getClassList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取分类信息失败!')

      if(res && res.data){
        this.classList = res.data;

        // 直播礼包
        item = res.data[0].children;
        if(item && item[1]) item = item[1].children;
        if(item && item[0]) this.liveId = item[0].storegc_id;

        if(this.liveId && this.isLive) return this.getGiftList();
        if(this.isSeckill) this.getList();
      }
    },

    clear() {
      this.list = [];
      this.page = 1;
      this.total = 0;
      this.finished = false;

      scrollTo(0, 0);
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
}

.list_wrap{
  padding: 0 20px;
  min-height: 100vh;
}

.tabs_wrap{
  position: fixed;
  top: 128px;
  left: 0;
  width: 100%;
  z-index: 1;
}

.gift_list_wrap{
  flex-wrap: wrap;
}
.gift_goods_wrap{
  flex-shrink: 0;
  box-sizing: border-box;
  width: 345px;
  margin: 20px 0 0;
  padding: 0 0 10px 10px;
  font-size: 28px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.gift_goods_name{
  width: 100%;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.goods_integral_wrap{
  margin: 8px 0 0;
  font-size: 22px;
}
.goods_integral_pre{
  padding: 2px 4px;
}
.goods_integral{
  padding: 0 4px;
  border: 1px solid #FF0032;
}
.goods_price_wrap{
  margin: 10px 0 0;
}
.goods_tag {
  width: 68px;
  height: 34px;
}
.price_wrap{
  margin: 0 10px 0 0;
  font-size: 24px;
}
.price{
  font-size: 30px;
}
.sale_wrap{
  margin: 2px 0 0;
  font-size: 24px;
}

.i_gift_goods{
  width: 100%;
  height: 345px;
}

.mt40{ margin: 100px 0 0; }

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #494949; }
.s_fc_15{ color: #3f3f3f; }
.s_fc_16{ color: #FF0032; }
.s_fc_17{ color: #C63E32; }

.s_bg_11{ background: #FC6B76; }
.s_bg_12{ background: #FF0032; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
</style>