<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <!-- <div class="type_nav_wrap flex s_bg_f">
      <div class="type_nav_item" :class="item.id === type ? ['s_fc_f', 's_bg_13'] : ['s_fc_13', 's_bg_f']" v-for="(item, index) in typeList" :key="index" @click="changeType(item)">{{item.name}}</div>
    </div> -->

    <!-- 状态栏 -->
    <van-tabs class="status_bar_wrap" v-model="status" line-width="75px" title-active-color="#4fb84a" @change="changeStatus">
      <van-tab :title="item.title" :name="item.id" v-for="(item, index) in statusList" :key="index"></van-tab>
    </van-tabs>

    <van-pull-refresh class="list_wrap" v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">

        <order :config="item" v-for="(item, index) in list" :key="index"></order>

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
import order from '@/components/order/bargainOrder';

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
        { id: gd.BARGAINING, title: '砍价中', },
        { id: gd.BARGAINED, title: '已完成', },
        { id: gd.NO_BARGAIN, title: '已失效', },
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

      user: null,
    };
  },

  computed: {
    title() { return '我的砍价'; },
    isNormal(){ return this.type === gd.NORMAL_ORDER; },

    stateStr(){ return this.statusList.filter(v => v.id === this.status)[0].title; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query,
          user = localStorage.getItem('user');

      this.type = query.type;
      if(query.hasOwnProperty('status')) this.status = query.status;

      if(user) this.user = JSON.parse(user);

      this.getList();
    },

    changeType(item) {
      this.clear();

      this.getList();
    },

    changeStatus(item) {
      this.clear();

      this.getList();
    },

    onRefresh(e) {
      this.clear();

      this.loading = true;
      this.getList();
    },

    onLoad(e) {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      this.getList();
    },

    format(v){
      v.isBargain = true;
      v.stateStr = this.stateStr;

      // v.couponPrice = math.subtract(math.add(v.goods_total_prices, v.shipping_fee), v.order_amount);

      this.formatSpec(v);

      v.time = new Date(v.cutprice_activity_endtime * 1000).getTime() - Date.now();

      return v;
    },

    formatSpec(item){
      let specStr = '',
          specObj = item.goods.goods_spec;

      for(let key in specObj){ specStr += `${specObj[key]}; `; }

      item.specStr = specStr ? specStr.replace(/;\s$/g, '') : '统一规格';
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, cutprice_activity_states: this.status, };

      if(!this.user) return console.error('no user info');
      param.member_id = this.user.member_id;

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.getBargainList(param);
      if(!res || typeof res === 'string' || res.error !== 'ok') return this.$toast.fail(res ? res.error || res : '获取明细信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    clear() {
      this.list = [];
      this.page = 1;
      this.finished = false;

      scrollTo(0, 0);
    },

    goBack() {
      this.$router.back();
    },
  },

  created() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  height: 100vh;
  padding: 203px 0 0;
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

.list_wrap{
  margin: 20px 0 0;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #494949; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
.login_page_wrap .van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}

.van-tabs__wrap--scrollable .van-tab{
  flex: 0 0 20% !important;
}
.van-tabs__line{
  background: #4FB84A;
}
</style>