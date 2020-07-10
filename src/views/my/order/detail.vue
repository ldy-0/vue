<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <c-address class="s_bg_f" ref="address" :config="addressConfig"></c-address>

    <!-- 状态 -->
    <div class="status_wrap s_fc_14 s_bg_f">{{statusObj[detail.order_state_id]}}</div>

    <!-- goods -->
    <div class="goods_list_wrap s_fc_8 s_bg_f" @click="goGoodsDetail">
      <div class="flex" v-for="(item, index) in detail.order_goods" :key="index">
        <img class="i_goods" :src="item.goods_image" />

        <div class="goods_info_wrap">
          <div class="goods_name s_fc_3">{{item.goods_name}}</div>

          <div class="goods_price_wrap s_fc_15">
            <span>¥</span>
            <span class="goods_price_integer">{{item.goods_price}}</span>
          </div>

          <div class="goods_sku_wrap between s_fc_8">
            <div class="goods_standard">规格：{{item.goods_spec || "统一规格"}}</div>
            <div class="goods_number">×{{item.goods_num}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- price -->
    <div class="price_wrap between s_bg_f">
      <div>实付款:</div>

      <div class="s_fc_16">
        <span>¥</span>
        <span class="price_integer">{{detail.order_amount}}</span>
      </div>
    </div>

    <div class="order_info_wrap s_fc_17 s_bg_f">
      <div class="order_info">订单编号：{{detail.order_sn}}</div>
      <div class="order_info">下单时间：{{detail.addTimeStr}}</div>
      <div class="order_info">付款时间：{{detail.paymentTimeStr}}</div>
      <div class="order_info">优惠券抵扣：-¥{{detail.couponPrice}}</div>
      <div class="order_info">积分抵扣：-{{detail.order_points}}</div>
      <div class="order_info">余额抵扣：-¥{{detail.pd_amount}}</div>
      <div class="order_info" v-if="detail.shipping_code && detail.shipping_code[0]">快递公司：{{detail.shipping_code[0]}}</div>
      <div class="order_info" v-if="detail.shipping_code && detail.shipping_code[1]">快递单号：{{detail.shipping_code[2]}}</div>
    </div>

    <div class="bottom_bar_wrap flex s_fc_18 s_bg_f" v-if="isUnPay || isSend || canReturn">
      <!-- <div class="order_btn order_green_btn s_fc_13" v-if="isUnPay" @click="goPay">支付</div> -->

      <div class="order_btn order_green_btn s_fc_13" v-if="isSend" @click="confirm">确认收货</div>
      <div class="order_btn order_green_btn s_fc_13" v-if="isSend" @click="goLogistic">查看物流</div>

      <div class="order_btn order_green_btn s_fc_13" v-if="canReturn" @click="goAfterSale">申请售后</div>
    </div>

  </div>
</template>
<script>
import moment from 'moment';
import * as math from 'mathjs';
import * as apiOrder from '@/api/order';
import * as apiGoods from '@/api/goods';
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
      id: null,
      goodsId: null,
    };
  },

  computed: {
    title() { return '订单详情'; },

    isVip(){ return this.type === gd.VIP_ORDER; },
    isSeckill(){ return this.type === gd.SECKILL_ORDER; },
    isGroup(){ return this.type === gd.GROUP_ORDER; },
    isBargain(){ return this.type === gd.BARGAIN_ORDER; },
    isNormal(){ return !(this.isVip || this.isSeckill || this.isGroup || this.isBargain); },

    isBack() { return this.$route.meta.isBack; },

    isUnPay(){ return this.detail.order_state_id === gd.ORDER_UN_PAY; },
    isSend(){ return this.detail.order_state_id === gd.ORDER_SEND; },
    canReturn(){ return this.isNormal && [gd.ORDER_PAYED, gd.ORDER_SEND, gd.ORDER_RECEIVE].indexOf(this.detail.order_state_id) != -1; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;
      this.id = query.id;

      this.goodsId = null;
      this.getInfo();
    },

    goBack() {
      this.$router.back();
    },

    goGoodsDetail() {
      if(this.isSeckill || this.isGroup || this.isBargain) return ;

      if(!this.goodsId) return this.$toast.fail(`获取商品Id失败!`);
      
      this.$router.push({ name: 'goodsDetail', query: { id: this.goodsId, } });
    },

    goLogistic() {
      let id = this.detail.order_id;

      this.$router.push({ name: 'orderLogistic', query: { id, } });
    },

    goAfterSale() {
      let id = this.detail.order_id;

      this.$router.push({ name: 'goRefund', query: { id, }, });
    },

    goPay() {

    },

    async confirm() {
      let o = this.detail,
          param = { order_id: o.order_id, state_type: 'order_receive' };

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.change(o.order_id, param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '确认收货失败!');

      if(res.status == 0){
        this.$toast.success(`确认收货成功!`);
        this.getInfo();
      }
      this.$toast.clear();
    },

    format(order){
      order.order_id = this.id;
      order.addTimeStr = moment(order.add_time).format( "YYYY年MM月DD日 HH:mm");
      order.paymentTimeStr = moment(order.payment_time).format( "YYYY年MM月DD日 HH:mm");
      if(/^1970/.test(order.paymentTimeStr)) order.paymentTimeStr = '未支付';

      order.pointPrice = math.divide(order.order_points, 10);
      order.couponPrice = math.subtract(math.add(order.goods_total_prices, order.shipping_fee), order.order_amount);
      order.refundPrice = math.subtract(math.subtract( order.order_amount, order.pointPrice), order.pd_amount );
      
      order.order_goods.forEach(v => {
        let spec = v.goods_spec,
            specStr = '';

        if(spec){

          for(let key in spec){ specStr += `${spec[key]}; `; }

          v.goods_spec = specStr.replace(/;\s$/g, '');
        }

      });

      this.addressConfig.data = order.order_reciver_info;

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

      res = await apiGoods.getGoodsId(this.detail.order_goods[0].goods_id, param);
      console.log('res', res);
      if(res && res.data){
        this.goodsId = res.data.goods_commonid;
      }

      this.$toast.clear();
    },
  },

  activated() {
    // if(this.isBack) return ;

    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  padding: 128px 0 110px;
}

.status_wrap {
  height: 88px;
  margin: 20px 0 0;
  padding: 0 30px;
  line-height: 88px;
  font-size: 32px;
  border-bottom: 1px solid #e5e5e5;
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
  padding: 10px 30px 20px;
  font-size: 20px;
}
.order_info{
  margin: 15px 0 0;
}

.bottom_bar_wrap {
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 100px;
  font-size: 28px;
}
.order_btn {
  width: 144px;
  line-height: 44px;
  margin-right: 24px;
  border: 1px solid #282425;
  border-radius: 10px;
  text-align: center;
}
.order_green_btn{
  border: 1px solid #4fb84a;
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