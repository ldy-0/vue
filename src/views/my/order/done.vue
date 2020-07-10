<template>
  <div class="page_wrap s_bg_f">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <!-- 状态 -->
    <div class="success_wrap s_fc_14">
      <img class='success_img' src="../../../assets/images/order/success.png" />
      <div class="success_title s_fc_2">订单支付成功！</div>
    </div>

    <div class="order_info_wrap s_fc_2">
      <div class="order_info">订单编号：{{detail.order_sn}}</div>
      <div class="order_info">订单金额：¥{{detail.totalPrice}}</div>
      <!-- <div class="order_info">支付方式：{{detail.order_sn}}</div> -->
      <div class="order_info">下单时间：{{detail.addTimeStr}}</div>
      <div class="order_info order_br">支付时间：{{detail.paymentTimeStr}}</div>
      <div class="order_info">优&nbsp;惠&nbsp;券：-¥{{detail.couponPrice}}</div>
      <div class="order_info">积分抵扣：-{{detail.order_points}}</div>
      <div class="order_info">
        <span>实付金额：</span>
        <span class="s_fc_13">￥{{detail.order_amount}}</span>
      </div>
      <!-- <div class="order_info">余额抵扣：-¥{{detail.pd_amount}}</div> -->
    </div>

    <div class="order_btn s_fc_f s_bg_13" @click="goOrderDetail">查看订单</div>
    <div class="order_btn s_fc_13 s_bg_f" @click="goHome">继续逛逛</div>

  </div>
</template>
<script>
import moment from 'moment';
import * as math from 'mathjs';
import * as apiOrder from '@/api/order';
import * as gd from '@/utils/global';
import address from '@/components/my/address';

export default {
  components: {
    [address.name]: address,
  },

  data() {
    return {
      addressConfig: {
        parent: gd.ORDER_DETAIL,
        data: null,
      },

      statusObj: {
        10: '待付款',
        20: '待发货',
        30: '待收货',
        40: '已收货',
        80: '已完成',
        100: '已关闭',
      },

      type: null,

      detail: {},
    };
  },

  computed: {
    title() { return '购买完成'; },

    isVip(){ return this.detail.order_type === gd.VIP_ORDER; },
    isSeckill(){ return this.type === gd.SECKILL_ORDER; },
    isGroup(){ return this.type === gd.GROUP_ORDER; },
    isBargain(){ return this.type === gd.BARGAIN_ORDER; },

    isUnPay(){ return this.detail.order_state_id === gd.ORDER_UN_PAY; },
    isSend(){ return this.detail.order_state_id === gd.ORDER_SEND; },
    canReturn(){ return !this.isVip && this.detail.order_state_id == gd.ORDER_RECEIVE; },
  },

  methods: {
    init() {
      let route = this.$route,
          orderId = localStorage.getItem('orderId'),
          query = route.query;

      this.type = query.type;
      this.id = query.id;

      if(orderId){
        localStorage.removeItem('orderId');
      }

      this.getInfo();
    },

    goBack() {
      this.$router.back();
    },

    goHome() {
      this.$router.replace({ name: 'home', });
    },

    goOrderDetail() {
      this.$router.push({ name: 'orderDetail', query: { id: this.id, type: this.detail.order_type, } });
    },

    format(order){
      order.order_id = this.id;
      order.addTimeStr = moment(order.add_time).format( "YYYY年MM月DD日 HH:mm");
      order.paymentTimeStr = moment(order.payment_time).format( "YYYY年MM月DD日 HH:mm");
      if(/^1970/.test(order.paymentTimeStr)) order.paymentTimeStr = '未支付';

      order.totalPrice = math.add(order.goods_total_prices, order.shipping_fee),
      order.pointPrice = math.divide(order.order_points, 10);
      order.couponPrice = math.subtract(order.totalPrice, order.order_amount);
      order.refundPrice = math.subtract(math.subtract( order.order_amount, order.pointPrice), order.pd_amount );
      
      return order;
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
    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  padding: 128px 0 110px;
  min-height: 100vh;
  font-size: 32px;
}

.success_wrap{
  width: 100%;
  text-align: center;
}
.success_img{
  width: 180px;
  height: 180px;
}
.success_title{
  width: 100%;
  font-size: 32px;
  margin-top: 20px;
  font-weight: 600;
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
  font-size: 32px;
}
.goods_sku_wrap{
  margin: 12px 0 0;
}
.goods_standard {
  width: 400px;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price_wrap{
  height: 100px;
  margin: 20px 0 0;
  padding: 0 30px;
  line-height: 100px;
  font-size: 32px;
}
.price_integer{
  font-size: 40px; 
}

.order_info_wrap{
  margin: 80px 0 0;
  padding: 10px 30px 20px;
  font-size: 30px;
}
.order_info{
  margin: 15px 0 0;
}
.order_br{
  border-bottom: 1px solid #e6e6e6;
}

.order_btn {
  width: 690px;
  height: 88px;
  line-height: 88px;
  margin: 60px auto;
  border: 1px solid #4fb84a;
  border-radius: 10px;
  text-align: center;
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

</style>