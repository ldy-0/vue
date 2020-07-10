<template>
  <div class="page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="s_bg_f" v-if="isReturnGoods">
      <div class="address_title">退货寄回地址</div>
      <c-address class="" ref="address" :config="addressConfig"></c-address>
    </div>

    <!-- goods -->
    <div class="goods_list_wrap s_fc_8 s_bg_f" :class="{ mt20: isReturnGoods }">
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

        <div class="info_reason_wrap flex s_fc_17" @click="openActionSheet">
          <span>{{reasonInfo.value || '请选择'}}</span>
          <van-icon name="arrow" size="12" /> 
        </div>
      </div>

      <div class="info_wrap between s_bg_f">
        <div>退款金额</div>

        <div class="s_fc_16">
          <span>¥</span>
          <span class="">{{detail.refundPrice}}</span>
        </div>
      </div>

      <div class="info_wrap between s_bg_f">
        <div>退还积分</div>

        <div class="s_fc_16">
          <span>¥</span>
          <span class="">{{detail.order_points}}</span>
        </div>
      </div>

      <div class="info_wrap between s_bg_f">
        <div>退还余额</div>

        <div class="s_fc_16">
          <span>¥</span>
          <span class="">{{detail.pd_amount}}</span>
        </div>
      </div>

      <div class="info_wrap between s_bg_f">
        <div>退货说明</div>

        <input class="info_input" :placeholder="message.placeholder" v-model="message.value" />
      </div>

      <div v-if="isReturnGoods">
        <div class="info_wrap between s_bg_f">
          <div>物流公司</div>

          <input class="info_input" :placeholder="company.placeholder" v-model="company.value" />
        </div>

        <div class="info_wrap between s_bg_f">
          <div>物流单号</div>

          <input class="info_input" :placeholder="logisticNo.placeholder" v-model="logisticNo.value" />
        </div>
      </div>
    </div>

    <van-action-sheet v-model="showReason" :actions="reasonList" :round="false" title="退款原因" cancel-text="关闭" close-on-click-action @select="setReason" @cancel="closeActionSheet" />

    <div class="submit_btn s_fc_f s_bg_13" @click="submit">提交</div>

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

      showReason: false,
      reasonList: [
        { name: "货物缺损", },
        { name: "商品与描述不符", },
        { name: "长时间未发货", },
        { name: "质量问题", },
        { name: "假冒品牌", },
        { name: "其他", },
      ],
      reasonInfo: { value: '', to: 'reason_info', message: '请填写退款原因!', },
      message: { value: '', to: 'buyer_message', placeholder: '选填', },
      company: { value: '', to: 'express_name', placeholder: '必填', message: '请填写物流公司!', },
      logisticNo: { value: '', to: 'invoice_no', placeholder: '必填', message: '请填写物流单号!', },

      type: null,
      id: null,
      detail: {},

      doing: false,
    };
  },

  computed: {
    title() { return this.isRefund ? '退款' : '退换货'; },

    isBack() { return this.$route.meta.isBack; },

    isRefund(){ return this.type === gd.RETURN_MONEY; },
    isReturnGoods(){ return this.type === gd.RETURN_GOODS; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;
      this.id = query.id;
      
      this.reasonInfo.value = this.message.value = this.company.value = this.logisticNo.value = '';
      this.doing = false;

      this.getInfo();

      if(this.isReturnGoods) this.getAddress();
    },

    goBack() {
      this.$router.back();
    },

    openActionSheet() {
      this.showReason = true;
    },

    closeActionSheet() {
      this.showReason = false;
    },

    setReason(item) {
      this.reasonInfo.value = item.name;
    },

    isIllegal() {
      let arr = [this.reasonInfo];

      if(this.isReturnGoods) arr.push(this.company, this.logisticNo);

      for(var i = 0, len = arr.length; i < len; i++){
        if(!arr[i].value) return this.$toast.fail(`${arr[i].message}`), true;
      }
    },

    submit() {
      let param = { order_id: this.id, refund_type: this.isReturnGoods ? 2 : 1 },
          arr = [this.reasonInfo, this.message, this.company, this.logisticNo];

      if(this.doing || this.isIllegal()) return ;
      this.doing = true;

      arr.forEach(v => param[v.to] = v.value);

      this.save(param);
    },

    async save(param) {
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.refund(param);
      if(!res || typeof res === 'string' || res.error) return this.doing, this.$toast.fail(res ? res.error || res : '获取订单信息失败!')

      this.$toast.success(`提交成功!`);
      localStorage.setItem('isBack', 1);
      setTimeout(() => { this.$router.go(-2); }, 1000);
    },

    format(order){
      order.couponPrice = math.subtract(math.add(order.goods_total_prices, order.shipping_fee), order.order_amount);
      order.pointPrice = math.divide(order.order_points, 10);
      order.refundPrice = math.subtract(math.subtract(order.order_amount, order.pointPrice), order.pd_amount );

      let freight = order.shipping_fee;

      if(order.pointPrice >= freight){
        order.pointPrice = math.subtract(order.pointPrice, freight);
      }else{
        freight = math.subtract(freight, order.pointPrice);
        order.pointPrice = 0;

        if(order.pd_amount >= freight){
          order.pd_amount = math.subtract(order.pd_amount, freight);
        }else{
          freight = math.subtract(freight, order.pd_amount);
          order.pd_amount = 0;

          order.refundPrice = math.subtract(order.refundPrice, freight);
        }
      }
      
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
  margin: 10px 0 0;
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
.info_reason_wrap{
  justify-content: flex-end;
  align-items: center;
}
.info_input{
  flex-grow: 1;
  margin: 0 0 0 40px;
  border: none;
}

.submit_btn {
  line-height: 88px;
  margin: 188px 30px 0;
  font-size: 32px;
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
.van-action-sheet__item{
  padding: 0 30px;
  font-size: 32px;
  text-align: left;
  color: #000;
}
.van-action-sheet__cancel{
  color: #fff;
  background: #4FB84A;
}
.van-action-sheet__close{
  display: none;
}
</style>