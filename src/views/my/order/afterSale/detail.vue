<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="s_bg_f" v-if="isReturnGoods">
      <div class="address_title">退货寄回地址</div>
      <c-address class="" ref="address" :config="addressConfig"></c-address>
    </div>

    <!-- 状态 -->
    <div class="status_wrap s_fc_2 s_bg_f">{{detail.refund_state}}</div>

    <!-- goods -->
    <div class="goods_list_wrap s_fc_8 s_bg_f">
      <div class="flex" v-for="(item, index) in detail.order_goods" :key="index">
        <img class="i_goods" :src="item.goods_image" />

        <div class="goods_info_wrap">
          <div class="goods_name s_fc_3">{{item.goods_name}}</div>

          <div class="goods_sku_wrap between s_fc_8">
            <div class="goods_standard">规格：{{item.goods_spec || "统一规格"}}</div>
            <div class="goods_number">×{{item.goods_num}}</div>
          </div>

          <div class="goods_price_wrap s_fc_15">
            <span>¥</span>
            <span class="goods_price_integer">{{item.goods_price}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- info -->
    <div>
      <div class="info_wrap between s_bg_f">
        <div>退款原因</div>

        <div class="s_fc_17">{{detail.reason_info}}</div>
      </div>

      <div class="info_wrap between s_bg_f">
        <div>退款金额</div>

        <div class="s_fc_16">
          <span>¥</span>
          <span class="">{{detail.refund_amount}}</span>
        </div>
      </div>

      <div class="info_wrap between s_bg_f" v-if="detail.refund_points > 0">
        <div>退还积分</div>

        <div class="s_fc_16">
          <span>¥</span>
          <span class="">{{detail.refund_points}}</span>
        </div>
      </div>

      <div class="info_wrap between s_bg_f" v-if="detail.refund_pd_amount > 0">
        <div>退还余额</div>

        <div class="s_fc_16">
          <span>¥</span>
          <span class="">{{detail.refund_pd_amount}}</span>
        </div>
      </div>

      <div class="info_wrap between s_bg_f">
        <div>退货/退款说明</div>

        <div class="s_fc_8">{{detail.buyer_message}}</div>
      </div>

      <div class="info_wrap between s_bg_f" v-if="detail.express_name">
        <div>物流公司</div>

        <div class="s_fc_8">{{detail.express_name}}</div>
      </div>

      <div class="info_wrap between s_bg_f" v-if="detail.invoice_no">
        <div>物流单号</div>

        <div class="s_fc_8">{{detail.invoice_no}}</div>
      </div>
    </div>

    <div class="bottom_bar_wrap flex s_fc_18 s_bg_f" v-if="canCancelRefund">
      <div class="order_btn order_green_btn s_fc_13" @click="cancelRefund">取消退款</div>
    </div>

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
        parent: gd.AFTERSALE_DETAIL,
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

      doing: false,
    };
  },

  computed: {
    title() { return '售后详情'; },
    isVip(){ return this.type === gd.VIP_ORDER; },
    isReturnGoods() { return this.detail && this.detail.express_name; },
    isBack() { return this.$route.meta.isBack; },

    canCancelRefund(){ return ['待退款', '待退货'].indexOf(this.detail.refund_state) !== -1; },
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

    async cancelRefund() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.cancelRefund(this.detail.refund_id, param);
      if(!res || typeof res === 'string' || res.error) return this.doing = false, this.$toast.fail(res ? res.error || res : '取消失败!');

      if(res.status == 0){
        this.$toast.success(`已取消!`);
        this.getInfo();
      }
    },

    format(order){
      order.refund_points = Number(order.refund_points);
      order.refund_pd_amount = Number(order.refund_pd_amount);
      
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

      let res = await apiOrder.getRefund(this.id);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取订单信息失败!')

      if(res && res.data){
        this.detail = this.format(res.data);
        if(this.detail.express_name) this.getAddress();
      }

      this.$toast.clear();
    },

    async getAddress() {
      let param = {};

      let res = await apiOrder.getRefundAddress();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取退货地址失败!')

      if(res && res.data){
        this.addressConfig.data = res.data;
      }

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

.address_title{
  height: 88px;
  padding: 0 20px;
  border-bottom: 1px solid #f7f7f7;
  line-height: 88px;
  font-size: 28px;
}

.status_wrap {
  height: 88px;
  margin: 20px 0 0;
  padding: 0 20px;
  line-height: 88px;
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
  margin: 15px 0 0;
  font-size: 26px;
}
.goods_price_integer{
  font-size: 32px;
}
.goods_sku_wrap{
  margin: 70px 0 0;
}
.goods_standard {
  width: 400px;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info_wrap{
  height: 88px;
  padding: 0 30px;
  line-height: 88px;
  border-top: 1px solid #f4f4f4;
  overflow: hidden;
}
.info_wrap > div:last-child{
  width: 450px;
  text-align: right;
}
.price_integer{
  font-size: 40px; 
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