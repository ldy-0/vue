<template>
  <div class="info s_bg_f">
    <div class="status_line between s_fc_5">
      <div>{{isRefund ? config.order_state : statusObj[config.order_state_id]}}</div>

      <div class="store_wrap flex" v-if="isNormal" @click.stop="goStore">
        <!-- <img class="i_store" src="../../assets/images/home/concat.png" alt=""> -->
        <van-icon name="shop-o" size="20" />
        <div class="store_name">{{config.store_name}}</div>
        <van-icon class="i_right_arrow" name="arrow" color="#555" /> 
      </div>

      <!-- 已完成订单 -->
      <img class="i_done" :class="{ z_done: isRefund }" src="../../assets/images/order/done.png" v-if="isDone" />
      <!-- 已完成退款订单 -->
      <img class="i_delete" src="../../assets/images/order/del.png" v-if="isRefund && isDone" @click="deleteOrder" />
    </div>

    <!-- goods -->
    <div class="goods_list_wrap s_fc_9 s_bg_fa" @click="goDetail">
      <div class="flex" v-for="(item, index) in config.order_goods" :key="index">
        <img class="i_goods" :src="item.goods_image" />

        <div class="goods_info_wrap">
          <div class="goods_name s_fc_3">{{item.goods_name}}</div>

          <div>
            <!-- <div class="product_price">¥{{items.goods_price}}</div> -->
          </div>

          <div class="goods_sku_wrap between s_fc_8">
            <div class="goods_standard">规格：{{item.specStr || "统一规格"}}</div>
            <div class="goods_number">×{{item.goods_num}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- amount -->
    <div class="price_wrap s_fc_2">
      <div class="price_info">共{{config.order_goods.length}}件商品 实付款：¥<span class="order_price">{{config.order_amount}}</span></div>

      <div class="price_info" v-if="isUseCoupon">优惠券：-¥{{config.couponPrice}}</div>

      <div class='price_info' v-if="config.refund_points > 0">退还积分 -¥{{config.refund_points}}</div>
      <div class='price_info' v-if="config.refund_pd_amount > 0">退还余额 -¥{{config.refund_pd_amount}}</div>
    </div>

    <!-- operate -->
    <div class="order_btn_wrap flex">
      <div class="order_btn" v-if="isUnPay" @click="cancelOrder">取消支付</div>
      <div class="order_btn order_green_btn" v-if="isUnPay" @click="openPayDialog">去支付</div>

      <div class="order_btn order_green_btn" v-if="isSend" @click="confirm">确认收货</div>
      <div class="order_btn order_green_btn" v-if="isSend" @click="goLogistic">查看物流</div>

      <div class="order_btn order_green_btn" v-if="canReturn" @click="goAfterSale">申请售后</div>

      <div class="order_btn order_green_btn" v-if="canEvaluate" @click="goEvaluation">评价</div>

      <!-- <div class="order_btn" v-if="canDelete" @click="deleteOrder">删除订单</div> -->

      <div class='order_btn cancel_btn s_fc_3' v-if="canCancelRefund" @click="cancelRefund">取消退款</div>
      <!-- <div class="order_btn" v-if="isUnPay || isPayed">联系客服</div> -->
    </div>

    <!-- 支付方式 -->
    <van-popup class="pay_dialog_wrap" v-model="showPayDialog" :close-on-click-overlay="false" @click-overlay="closePayDialog">
      <div class="coupon_wrap s_bg_f">
        <div class="coupon_title_wrap flex">
          <div class="coupon_title">选择支付方式</div>
          <van-icon class="i_delete" name="cross" size="20" @click="closePayDialog"></van-icon>
        </div>

        <div class="pay_list_wrap">
          <van-radio-group v-model="payIndex">
            <div class="pay_item_wrap between s_fc_8" :class="{ pay_line_wrap: index !== 0 }" v-for="(item, index) in payList" :key="index">
              <div class="pay_title_wrap flex">
                <img :class="{ i_alipay: item.isAli, i_wxpay: item.isWx }" :src="item.src" />

                <div>{{item.title}}</div>
              </div>

              <van-radio :name="index" checked-color="#4FB84A"></van-radio>
            </div>
          </van-radio-group>
        </div>

        <div class="pay_btn s_fc_f s_bg_13" @click="pay">确定支付</div>
      </div>
    </van-popup>

    <!-- 支付宝表单 -->
    <div class="ali_form_wrap" v-html="aliForm"></div>

  </div>
</template>
<script>
import * as apiCommon from '@/api/common';
import * as apiOrder from '@/api/order';
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

      statusObj: {
        10: '待付款',
        20: '待发货',
        30: '待收货',
        40: '已收货',
        80: '已完成',
        100: '已关闭',
      },

      doing: false,

      showPayDialog: false,
      payIndex: 0,
      payList: [
        { title: '支付宝钱包', src: require('../../assets/images/order/aliPay.png'), isAli: true, },
        { title: '微信钱包', src: require('../../assets/images/order/wxPay.jpg'), isWx: true, },
      ],
      aliForm: null,
    };
  },

  computed: {
    isStoreOrder(){ return this.config.store_id !== 1; },
    isVip(){ return this.config.isVip; },
    isRefund(){ return this.config.refund_id; },
    isSeckill(){ return this.config.isSeckill; },
    isGroup(){ return this.config.isGroup; },
    isBargain(){ return this.config.isBargain; },
    isNormal(){ return !(this.isVip || this.isSeckill || this.isGroup || this.isBargain); },

    isUnPay(){ return this.config.order_state_id === gd.ORDER_UN_PAY; },
    isPayed(){ return this.config.order_state_id === gd.ORDER_PAYED; },
    isSend(){ return this.config.order_state_id === gd.ORDER_SEND; },
    isDone(){ return this.config.order_state_id === gd.ORDER_DONE || this.config.order_state === '已完成'; },
    isUseCoupon(){ return this.config.couponPrice > 0; },
    canReturn(){ return this.isNormal && [gd.ORDER_PAYED, gd.ORDER_SEND, gd.ORDER_RECEIVE].indexOf(this.config.order_state_id) != -1; },
    canEvaluate(){ return this.config.order_state_id == gd.ORDER_RECEIVE && this.config.evaluation_state == 0; },
    canDelete(){ return this.config.order_state_id == gd.ORDER_DONE && this.config.evaluation_state == 1; },
    canCancelRefund(){ return ['待退款', '待退货'].indexOf(this.config.order_state) !== -1; },
  },

  methods: {
    init() {
      this.doing = false;
    },

    goDetail() {
      let id = this.config.order_id,
          type = gd.NORMAL_ORDER;

      if(this.isRefund) return this.$router.push({ name: 'afterSaleDetail', query: { id: this.config.refund_id }, });

      if(this.isVip) type = gd.VIP_ORDER;
      if(this.isSeckill) type = gd.SECKILL_ORDER;
      if(this.isGroup) type = gd.GROUP_ORDER;
      if(this.isBargain) type = gd.BARGAIN_ORDER;

      this.$router.push({ name: 'orderDetail', query: { id, type, }, });
    },

    goStore() {
      let id = this.config.store_id;

      if(this.isStoreOrder) this.$router.push({ name: 'storeGoodsList', query: { id }, });
    },

    goLogistic() {
      let id = this.config.order_id;

      this.$router.push({ name: 'orderLogistic', query: { id, } });
    },

    goAfterSale() {
      let id = this.config.order_id;

      this.$router.push({ name: 'goRefund', query: { id, }, });
    },

    goEvaluation(item) {
      let query = { id: this.config.order_id, };

      this.$router.push({ name: 'orderEval', query, });
    },

    async cancelOrder() {
      let o = this.config,
          param = { order_id: o.order_id, pay_sn: o.pay_sn, state_type: 'order_cancel' };

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.change(o.order_id, param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '取消订单失败!');

      if(res.status == 0){
        this.$toast.success(`订单已取消!`);
        this.$emit('update', o, 'cancel');
      }
      this.$toast.clear();
    },

    async confirm() {
      let o = this.config,
          param = { order_id: o.order_id, state_type: 'order_receive' };

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.change(o.order_id, param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '确认收货失败!');

      if(res.status == 0){
        this.$toast.success(`确认收货成功!`);
        this.$emit('update', o, 'confirm');
      }
      this.$toast.clear();
    },

    async deleteOrder() {
      let o = this.config,
          param = { order_id: o.order_id, state_type: 'order_delete' };

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.change(o.order_id, param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '删除失败!');

      if(res.status == 0){
        this.$toast.success(`删除成功!`);
        this.$emit('update', o, 'delete');
      }
      this.$toast.clear();
    },

    openPayDialog() {
      this.showPayDialog = true;
    },

    closePayDialog(e) {
      if(e) this.showPayDialog = false;
    },

    async pay() {
      let o = this.config,
          param = { payment_code: this.payIndex ? 'wxpay_h5' : 'alipay_h5', };

      if(this.doing) return ;
      this.doing = true;

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.pay(o.pay_sn, param);
      if(!res || typeof res === 'string' || res.error) return this.doing = false, this.$toast.fail(res ? res.error || res : '支付失败!');

      if(res.status == 0){
        this.goPay(res.data);
      }
      this.$toast.clear();
    },

    goPay(o) {
      // 支付宝支付
      if(this.payIndex == 0){
        // 0元
        if(!o.content) return this.$router.replace({ name: 'orderDone', query: { id: o.order_id, } });

        let temp = document.createElement('div');
        temp.innerHTML = o.content;
        temp.style.visibility = 'hidden';
        document.body.appendChild(temp);
        temp.children[0].submit();
      }

      // 微信支付
      if(this.payIndex == 1){
        // 0元
        if(this.payPrice == 0 || !o.mweb_url) return this.$router.replace({ name: 'orderDone', query: { id: o.order_id, } });

        location.href = `${o.mweb_url}`; // &redirect_url=${encodeURIComponent(location.href)}
      }

      addEventListener('pageshow', e => {
        this.$emit('update', o, 'pay');
        removeEventListener('pageshow');
      });

    },

    async cancelRefund() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.cancelRefund(this.config.refund_id, param);
      if(!res || typeof res === 'string' || res.error) return this.doing = false, this.$toast.fail(res ? res.error || res : '取消失败!');

      if(res.status == 0){
        this.$toast.success(`已取消!`);
        this.$emit('update', this.config, 'cancelRefund');
      }
    },
    
  },

  created() {
    this.init();
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

.store_wrap{
  align-items: center;
  font-size: 28px;
}
.store_name{
  margin: 0 0 0 10px;
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
.i_store{
  width: 28px;
  height: 28px;
}

.pay_dialog_wrap{
  width: 600px;
  padding: 0 0 60px 0;
  border-radius: 20px;
  font-size: 24px;
}
.pay_list_wrap{
  margin: 0 30px;
}
.pay_item_wrap{
  padding: 20px 0;
}
.pay_line_wrap{
  border-top: 1px solid #ccc;
}
.pay_title_wrap{
  align-items: center;
}
.pay_btn{
  margin: 40px auto 0;
  width: 500px;
  height: 80px;
  line-height: 80px;
  border-radius: 10px;
  text-align: center;
}
.coupon_title_wrap{
  align-items: center;
}
.coupon_title{
  flex-grow: 1;
  padding: 25px 0;
  font-size: 32px;
  text-align: center;
}

.ali_form_wrap{
  visibility: hidden;
}

.i_delete{
  flex-shrink: 0;
  padding: 0 0 20px 10px;
}
.i_alipay{
  width: 50px;
  height: 50px;
  margin-right: 24px;
}
.i_wxpay{
  position: relative;
  left: -12px;
  width: 75px;
  height: 50px;
}

.s_bg_13{ background: #4FB84A; }
.s_bg_fa{ background: #fafafa; }
</style>