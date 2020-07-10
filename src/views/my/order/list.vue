<template>
  <div class="page_wrap order_list_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="type_nav_wrap flex s_bg_f">
      <div class="type_nav_item" :class="item.id == type ? ['s_fc_f', 's_bg_13'] : ['s_fc_13', 's_bg_f']" v-for="(item, index) in typeList" :key="index" @click="changeType(item)">{{item.name}}</div>
    </div>

    <!-- 状态栏 -->
    <van-tabs class="status_bar_wrap" v-model="status" line-width="75px" title-active-color="#4fb84a" @change="changeStatus">
      <van-tab :title="item.title" :name="item.id" v-for="(item, index) in statusList" :key="index"></van-tab>
    </van-tabs>

    <van-pull-refresh class="list_wrap" v-model="refreshing" @refresh="onRefresh">
      <van-list class="list" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">

        <order :config="item" v-for="(item, index) in list" :key="index" @update="updateOrder"></order>

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
        { id: -1, title: '全部', },
        { id: gd.ORDER_UN_PAY, title: '待付款', },
        { id: gd.ORDER_PAYED , title: '待发货', },
        { id: gd.ORDER_SEND, title: '待收货', },
        { id: gd.ORDER_UN_COMMENT, title: '待评价', },
      ],

      typeMap: {
        distribution: '奖金提现(¥)',
      },

      type: 1,
      status: -1,
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
    title() { return '订单列表'; },
    isNormal(){ return this.type === gd.NORMAL_ORDER; },
    isVip(){ return this.type === gd.VIP_ORDER; },
    isBack() { return this.$route.meta.isBack; },

    isAll(){ return this.status === -1; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      if(!query.hasOwnProperty('type')) return console.error('订单列表页面未设置类型!');

      this.type = query.type;
      this.status = query.status || global.ORDER_CANCEL;

      this.getList();
    },

    changeType(item) {
      this.type = item.id;

      this.clear();

      this.getList();
    },

    changeStatus() {
      if(this.loading) return ;
      this.clear();

      this.getList();
    },

    onRefresh(e) {
      this.clear();

      this.getList();
    },

    onLoad(e) {
      if(this.total <= this.page++ * this.limit){
        return this.finished = true, this.loading = false;
      }

      this.getList();
    },

    updateOrder(item, type) {
      this.clear();
      // console.log(this.type, this.status);

      this.getList();
    },

    format(order){
      order.couponPrice = math.subtract(math.add(order.goods_total_prices, order.shipping_fee), order.order_amount);
      order.pointPrice = math.divide(order.order_points, 10);
      order.isVip = this.isVip;

      order.order_goods.forEach(v => {
        let spec = v.goods_spec,
            specStr = '';

        if(spec){
          for(let key in spec){ specStr += `${spec[key]}; `; }
          v.specStr = specStr.replace(/;\s$/g, '');
        }

      });

      return order;
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, order_type: this.type, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      if(!this.isAll) param.order_state = this.status;

      let res = await apiOrder.getOrderList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取明细信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
      }
      this.total = res.pagination ? res.pagination.total : this.list.lenght;

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    clear() {
      this.list = [];
      this.page = 1;
      this.finished = false;
      this.loading = true;

      scrollTo(0, 0);
    },

    goBack() {
      this.$router.back();
    },
  },

  activated() {
    let isBack = localStorage.getItem('isBack');

    if(this.isBack) return ;

    this.clear();

    // 退款页返回
    if(isBack){
      localStorage.removeItem('isBack');
      return this.getList();
    }

    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  height: 100vh;
  padding: 314px 0 0;
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
  top: 226px;
  width: 100%;
  z-index: 1;
}

.list_wrap{
  margin: 20px 0 0;
}
.list{
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
.order_list_page_wrap .van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}

.van-tabs__wrap--scrollable .van-tab{
  flex: 0 0 20% !important;
}
.order_list_page_wrap .van-tabs__line{
  background: #4FB84A;
}
</style>