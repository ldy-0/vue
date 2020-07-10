<template>
  <div class="info s_bg_f">
    <div class="status_line between s_fc_5">
      <div>{{config.stateStr}}</div>

      <div class="decoration s_fc_11" @click="goGroupDetail">团详情</div>

      <!-- <div class="store_wrap flex" v-if="isStoreOrder" @click="goStore">
        <div>{{config.store_name}}</div>
        <van-icon class="i_right_arrow" name="arrow" color="#555" /> 
      </div> -->

      <!-- 已完成订单 -->
      <!-- <img class="i_done" src="../../assets/images/order/done.png" v-if="isDone" /> -->
    </div>

    <!-- goods -->
    <div class="goods_list_wrap s_fc_9 s_bg_fa" @click="goDetail">
      <div class="flex">
        <img class="i_goods" :src="goods.goods_image" />

        <div class="goods_info_wrap">
          <div class="goods_name s_fc_3">{{goods.goods_name}}</div>

          <div>
            <!-- <div class="product_price">¥{{items.goods_price}}</div> -->
          </div>

          <div class="goods_sku_wrap between s_fc_8">
            <div class="goods_standard">规格：{{goods.specStr || "统一规格"}}</div>
            <!-- <div class="goods_number">×{{goods.goods_num}}</div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- amount -->
    <div class="price_wrap s_fc_2">
      <div class="price_info">
        <span>实付款：¥<span class="order_price">{{config.order.order_amount}}</span></span>
        <span class="freight">(含运费{{config.order.shipping_fee}})</span>
      </div>

      <!-- <div class="price_info" v-if="isUseCoupon">优惠券：-¥{{config.couponPrice}}</div> -->
    </div>

    <!-- operate -->
    <div class="order_btn_wrap flex">
      <div class="order_btn order_green_btn" v-if="isSend" @click="confirm">确认收货</div>
      <div class="order_btn order_green_btn" v-if="isSend" @click="goLogistic">查看物流</div>

      <!-- <div class="order_btn">联系客服</div> -->
    </div>

  </div>
</template>
<script>
import * as apiCommon from '@/api/common';
import valid from '@/utils/valid';
import * as gd from '@/utils/global';

export default {
  props: {
    config: {
      type: Object,
    },
  },

  data() {
    return {
      doing: false,

    };
  },

  computed: {
    goods(){ return this.config.goodsinfo; },

    isStoreOrder(){ return this.config.store_id !== 1; },
    isGroup(){ return this.config.isGroup; },

    isUnPay(){ return this.config.order_state_id === gd.ORDER_UN_PAY; },
    isPayed(){ return this.config.order_state_id === gd.ORDER_PAYED; },
    isSend(){ return this.config.order_state_id === gd.ORDER_SEND; },
    isDone(){ return this.config.order_state_id === gd.ORDER_DONE || this.config.order_state === '已完成'; },
    isUseCoupon(){ return this.config.couponPrice > 0; },
  },

  methods: {
    goGroupDetail() {
      let order = this.config,
          query = {};

      query.id = order.pintuan_id;

      this.$router.push({ name: 'groupDetail', query, });
    },

    goDetail() {
      let id = this.config.order.order_id,
          type = gd.NORMAL_ORDER;

      if(this.isVip) type = gd.VIP_ORDER;
      if(this.isGroup) type = gd.GROUP_ORDER;

      this.$router.push({ name: 'orderDetail', query: { id, type, }, });
    },

    goStore() {
      console.log('store');
    },

    goLogistic() {
      let id = this.config.order_id;

      this.$router.push({ name: 'orderLogistic', query: { id, } });
    },

    confirm() {

    },

  },

  created() {
  },
};
</script>
<style lang='less' scoped>
.info{
  margin: 10px 0 0;
}

.status_line{
  position: relative;
  height: 80px;
  line-height: 80px;
  padding: 0 30px;
  font-size: 32px;
}

.decoration{
  text-decoration: underline;
}

.store_wrap{
  align-items: center;
}

.goods_list_wrap{
  padding: 20px 30px;
}
.goods_info_wrap{
  width: 500px;
  padding: 10px 0px 10px 20px;
  font-size: 28px;
  word-break: break-all;
}
.goods_name{
  height: 72px;
  overflow: hidden;
}
.goods_sku_wrap{
  margin: 28px 0 0;
}
.goods_standard {
  width: 400px;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price_wrap{
  padding: 0 30px;
  line-height: 80px;
  font-size: 26px;
  text-align: right;
}
.price_info{
  height: 80px;
}
.order_price{
  font-size: 32px;
}
.freight{
  margin: 0 0 0 10px;
  font-size: 24px;
}

.order_btn_wrap{
  justify-content: flex-end;
  padding: 10px 0;
}
.order_btn{
  width: 160px;
  height: 60px;
  line-height: 60px;
  margin: 0 24px 0 0;
  border: 1px solid #333;
  font-size: 26px;
  text-align: center;
  border-radius: 30px;
}
.order_green_btn{
  color: #4fb84a;
  border: 1px solid #4fb84a;
}

.i_done{
  position: absolute;
  right: 10px;
  width: 116px;
  height: 96px;
}
.i_delete{
  position: absolute;
  width: 34px;
  height: 34px;
  top: 24px;
  right: 30px;
}
.z_done{
  right: 80px;
}
.i_goods{
  width: 142px;
  height: 142px;
  border-radius: 10px;
}

.s_fc_11{ color: #4fb84a; }

.s_bg_fa{ background: #fafafa; }
</style>