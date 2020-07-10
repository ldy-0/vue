<template>
  <div class="page_wrap aftersale_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <!-- <div class="type_nav_wrap flex s_bg_f">
      <div class="type_nav_item" :class="item.id === type ? ['s_fc_f', 's_bg_13'] : ['s_fc_13', 's_bg_f']" v-for="(item, index) in typeList" :key="index" @click="changeType(item)">{{item.name}}</div>
    </div> -->

    <!-- 状态栏 -->
    <van-tabs class="status_bar_wrap" v-model="status" line-width="75px" title-active-color="#4fb84a" @change="changeStatus">
      <van-tab :title="item.title" :name="item.id" v-for="(item, index) in statusList" :key="index"></van-tab>
    </van-tabs>

    <van-pull-refresh class="list_container" v-model="refreshing" @refresh="onRefresh">
      <van-list class="list_wrap" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">

        <order :config="item" v-for="(item, index) in list" :key="index" @update="update"></order>

      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { Field, } from 'vant';
import * as math from 'mathjs';
import * as apiUser from '@/api/user';
import * as apiOrder from '@/api/order';
import * as Type from '@/utils/type';
import * as gd from '@/utils/global';
import order from '@/components/order/order';

export default {
  components: {
    [Field.name]: Field,
    order,
  },

  data() {
    return {
      typeList: [
        { name: "常规商品", id: gd.NORMAL_ORDER, type: 'normal', },
        { name: "VIP商品", id: gd.VIP_ORDER, type: 'vip', },
      ],

      statusList: [
        { id: gd.REFUND, title: '全部', },
        { id: gd.REFUNDING, title: '待退款', },
        { id: gd.REFUNDED, title: '已完成', },
      ],

      type: '',
      status: 0,
      refreshing: false,
      loading: false,
      finished: false,

      page: 1,
      limit: 10,
      total: 0,
      list: [],
    };
  },

  computed: {
    title() { return '售后管理'; },
    isNormal(){ return this.type === gd.NORMAL_ORDER; },
    isVip(){ return this.type === gd.VIP_ORDER; },
    isBack() { return this.$route.meta.isBack; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      if(!query.hasOwnProperty('type')) return console.error('售后列表页面未设置类型!');

      this.type = query.type;
      this.status = query.status || gd.REFUND;

      this.getList(this.clear());
    },

    changeType(item) {
      this.type = item.id;

      this.clear();

      this.getList();
    },

    changeStatus() {
      this.clear();

      this.getList();
    },

    update() {
      this.clear();

      this.getList();
    },

    onRefresh(e) {
      this.clear();

      this.loading = true;
      this.getList();
    },

    onLoad(e) {
      console.log('load');
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      this.getList();
    },

    format(v){
      v.couponPrice = math.subtract(math.add(v.goods_total_prices, v.shipping_fee), v.order_amount);
      v.refund_points = Number(v.refund_points);
      v.refund_pd_amount = Number(v.refund_pd_amount);

      v.order_goods.forEach(goods => this.formatSpec(goods));

      return v;
    },

    formatSpec(item){
      let specStr = '',
          specObj = item.goods_spec;

      for(let key in specObj){ specStr += `${specObj[key]}; `; }

      item.specStr = specStr ? specStr.replace(/;\s$/g, '') : '统一规格';
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, refund_state: this.status, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.getRefundList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取明细信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.list.lenght;
      }

      this.loading = this.finished = this.refreshing = false;
      this.$toast.clear();
    },

    clear() {
      this.finished = true;
      this.loading = true;
      this.list = [];
      this.page = 1;

      scrollTo(0, 0);
    },

    goBack() {
      this.$router.back();
    },
  },

  activated() {
    if(this.isBack){
      this.clear();
      return this.getList();
    }

    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  height: 100vh;
  padding: 203px 0 0;
}

.aftersale_page_wrap{
  min-height: 100vh;
}

.type_nav_wrap{
  position: fixed;
  top: 128px;
  box-sizing: border-box;
  width: 100%;
  height: 98px;
  padding: 18px 30px;
  font-size: 28px;
  text-align: center;
  z-index: 1;
}
.type_nav_item{
  flex-grow: 1;
  line-height:60px;
  border: 2px solid #4fb84a;
}

.status_bar_wrap{
  position: fixed;
  top: 128px;
  width: 100%;
  z-index: 1;
}

.list_container{
  margin: 20px 0 0;
}
.list_wrap{
  min-height: 100vh;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #494949; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
.aftersale_page_wrap .van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}

.aftersale_page_wrap .van-tabs__wrap--scrollable .van-tab{
  flex: 0 0 20% !important;
}
.aftersale_page_wrap .van-tabs__line{
  background: #4FB84A;
}
</style>