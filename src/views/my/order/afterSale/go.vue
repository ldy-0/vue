<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <!-- goods -->
    <div class="goods_list_wrap s_fc_8 s_bg_f">
      <div class="flex" v-for="(item, index) in detail.order_goods" :key="index">
        <img class="i_goods" :src="item.goods_image" />

        <div class="goods_info_wrap">
          <div class="goods_name s_fc_3">{{item.goods_name}}</div>

          <div class="goods_price_wrap s_fc_15">
            <span>¥</span>
            <span class="goods_price_integer">{{item.goods_price}}</span>
          </div>

          <div class="goods_sku_wrap between s_fc_8">
            <div class="goods_standard">规格：{{item.specStr}}</div>
            <div class="goods_number">×{{item.goods_num}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- info -->
    <div class="bar_wrap">
      <div class="nav_item between s_fc_0 s_bg_f" v-for="(item, index) in list" :key="index" @click="goRefund(item)">
        <div>
          <div class="nav_title">{{item.title}}</div>
          <div class='nav_desc s_fc_17'>{{item.desc}}</div>
        </div>

        <van-icon name="arrow" size="12" color="#888888"></van-icon>
      </div>
    </div>

  </div>
</template>
<script>
import moment from 'moment';
import * as math from 'mathjs';
import * as apiOrder from '@/api/order';
import * as gd from '@/utils/global';

export default {
  components: {
  },

  data() {
    return {
      statusObj: {
        10: '待付款',
        20: '待发货',
        30: '待收货',
        40: '已收货',
        80: '已完成',
        100: '已关闭',
      },

      list: [
        { title: "仅退款", type: gd.RETURN_MONEY, desc: "未收到货（包含未签收)" },
        { title: "退货退款", type: gd.RETURN_GOODS, desc: "已收到货,需要退还已收到的货物" }
      ],

      type: null,

      detail: {},
    };
  },

  computed: {
    title() { return '退款'; },
    isBack() { return this.$route.meta.isBack; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;
      this.id = query.id;
      this.getInfo();
    },

    goBack() {
      this.$router.back();
    },

    goRefund(item) {
      let name = 'refund',
          id = this.id;

      this.$router.push({ name, query: { id, type: item.type, }, });
    },

    format(order){
      order.order_goods.forEach(goods => this.formatSpec(goods));

      return order;
    },

    formatSpec(item) {
      let specStr = '',
          specObj = item.goods_spec;

      for(let key in specObj){ specStr += `${specObj[key]}; `; }

      item.specStr = specStr ? specStr.replace(/;\s$/g, '') : '统一规格';
    },

    async getInfo() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.getOrder(this.id);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取订单信息失败!')

      if(res && res.data){
        this.detail = this.format(res.data[0]);
      }

      this.$toast.clear();
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
  padding: 128px 0 110px;
  font-size: 28px;
}

.goods_list_wrap{
  padding: 30px;
}
.goods_info_wrap{
  width: 500px;
  padding: 10px 0px 10px 20px;
  font-size: 28px;
  word-break: break-all;
}
.goods_name{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.goods_price_wrap{
  margin: 50px 0 0;
  font-size: 26px;
}
.goods_price_integer{
  font-size: 37px;
}
.goods_sku_wrap{
  margin: 5px 0 0;
}
.goods_standard {
  width: 400px;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar_wrap{
  margin: 20px 0 0;
}
.nav_item{
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #f4f4f4;
  font-size: 28px;
  box-sizing: border-box;
}
.nav_desc{
  margin: 10px 0 0;
  font-size: 20px;
}

.i_goods{
  width: 180px;
  height: 180px;
  border-radius: 10px;
}

.ml10{ margin: 0 0 0 10; }

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #202020; }
.s_fc_15{ color: #dd3d27; }
.s_fc_16{ color: #af0000; }
.s_fc_17{ color: #636363; }
.s_fc_18{ color: #282425; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #4FB84A; }
.s_bg_f5{ background: #f5f5f5; }
</style>
<style>
.login_page_wrap .van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}
</style>