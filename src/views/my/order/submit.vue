<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <c-address class="s_bg_f" ref="address" :config="addressConfig"></c-address>

    <!-- goods -->
    <div class="goods_list_wrap s_fc_8 s_bg_f">
      <div class="flex" v-for="(item, index) in goodsList" :key="index">
        <img class="i_goods" :src="item.goods_image" />

        <div class="goods_info_wrap">
          <div class="goods_name s_fc_3">{{item.goods_name}}</div>

          <div class="goods_price_container between">
            <div class="goods_price_wrap s_fc_15">
              <span>¥</span>
              <span class="goods_price_integer">{{item.priceInteger}}</span>
              <span>.{{item.priceDecimal}}</span>
            </div>

            <div class="goods_number">×{{item.goods_num}}</div>
          </div>

          <div class="goods_sku_wrap s_fc_8">
            <div class="goods_standard">规格：{{item.specStr}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="order_info_wrap s_fc_6 s_bg_f">
      <div class="form_item between">
        <div>运费：</div>
        <div>¥{{freight}}</div>
      </div>

      <div class="form_item">
        <van-field class="form_input" label-width="50" v-model="remarks" label="备注：" placeholder="如有特殊情况可提现备注（50字以内）" />
      </div>

      <div class="form_item between" @click="openCouponDialog" v-if="showCoupon">
        <div>优惠券：</div>
        <div class="coupon_num_wrap flex">
          <div class="" v-if="couponDeduct">省：{{couponDeduct}}元</div>
          <div class="coupon_num s_fc_f" v-else>{{couponList.length}}张优惠券</div>
          <van-icon name="arrow"></van-icon>
        </div>
      </div>

      <div v-if="showIntegral">
        <div class="form_item between">
          <div class="integral_info_wrap flex">
            <van-icon name="checked" size="20" color="#4FB84A" v-if="integral.checked" @click="changeIntegral"></van-icon>
            <van-icon name="circle" size="20" v-else @click="changeIntegral"></van-icon>

            <div class="integral_info">积分抵扣（当前积分¥{{integral.value}}）</div>
          </div>

          <div class="s_fc_15" v-if="integral.deduct">-¥{{integral.deduct}}</div>
        </div>

        <div class="form_item between">
          <div class="integral_info_wrap flex">
            <van-icon name="checked" size="20" color="#4FB84A" v-if="remain.checked" @click="changeRemain"></van-icon>
            <van-icon name="circle" size="20" v-else @click="changeRemain"></van-icon>

            <div class="integral_info">余额抵扣（当前余额¥{{remain.value}}）</div>
          </div>

          <div class="s_fc_15" v-if="remain.deduct">-¥{{remain.deduct}}</div>
        </div>
      </div>

      <!-- 德分 -->
      <div v-if="isVip">
        <div class="form_item between">
          <div class="integral_info_wrap flex">
            <van-icon name="checked" size="20" color="#4FB84A" v-if="dScore.checked" @click="changeDScore"></van-icon>
            <van-icon name="circle" size="20" v-else @click="changeDScore"></van-icon>

            <div class="integral_info">德分抵扣（当前德分¥{{dScore.value}}）</div>
          </div>

          <div class="s_fc_15" v-if="dScore.deduct">-¥{{dScore.deduct}}</div>
        </div>
      </div>
    </div>

    <!-- bottom -->
    <div class="bottom_bar_wrap between s_fc_18 s_bg_f">
      <div class="">
        <span>应付合计</span>
        <span class="ml20 s_fc_15">¥</span>
        <span class="price_integer s_fc_15">{{payPriceArr[0]}}</span>
        <span class="s_fc_15">.{{payPriceArr[1] || '00'}}</span>
      </div>

      <div class="submit_btn s_bg_13 s_fc_f" @click="submit">提交订单</div>
    </div>

    <!-- 优惠券 -->
    <van-popup v-model="showCouponDialog" position="bottom">
      <div class="coupon_wrap s_bg_f">
        <div class="coupon_title_wrap flex">
          <div class="coupon_title">可用优惠券</div>
          <van-icon class="i_delete" name="cross" size="20" @click="closeCouponDialog"></van-icon>
        </div>

        <div class="coupon_list_wrap">
          <van-radio-group v-model="couponIndex">
            <div class="coupon_item between" v-for="(item, index) in couponList" :key="index">
              <van-radio :name="index" checked-color="#4FB84A"></van-radio>

              <div class="coupon_info_wrap s_fc_f s_bg_13">
                <div class="coupon_price_wrap">¥
                  <span class="coupon_price">{{item.voucher_price}}</span>
                </div>

                <div>{{item.startStr}} ~ {{item.endStr}}</div>
                <div>满{{item.voucher_limit}}可用</div>
              </div>
            </div>
          </van-radio-group>
        </div>

        <div class="coupon_btn s_fc_f s_bg_13" @click="changeCoupon">确定</div>
      </div>
    </van-popup>

    <!-- 支付密码 -->
    <div class="pwd_dialog_wrap" v-if="showPwdDialog">
      <div class="pwd_mask" @click="closePwdDialog"></div>

      <div class="coupon_wrap pwd_wrap s_bg_f">
        <div class="coupon_title_wrap flex">
          <div class="coupon_title">请输入支付密码</div>
          <van-icon class="i_delete" name="cross" size="20" @click="closePwdDialog"></van-icon>
        </div>

        <van-password-input :value="pwd" :focused="showKeyboard" @focus="showKeyboard = true" />
      </div>
    </div>
    <van-number-keyboard style="z-index: 2008;" :show="showKeyboard" @input="inputPwd" @delete="deletePwd" @blur="showKeyboard = false" />

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

        <div class="pay_btn s_fc_f s_bg_13" @click="submitOrder">确定支付</div>
      </div>
    </van-popup>

    <!-- 支付宝表单 -->
    <div class="ali_form_wrap" v-html="aliForm"></div>
  </div>
</template>
<script>
import moment from 'moment';
import * as math from 'mathjs';
import * as apiUser from '@/api/user';
import * as apiOrder from '@/api/order';
import * as apiAddress from '@/api/address';
import * as apiCoupon from '@/api/coupon';
import * as gd from '@/utils/global';
import address from '@/components/my/address';

export default {
  components: {
    [address.name]: address,
  },

  data() {
    return {
      addressConfig: {
        parent: gd.SUBMIT_ORDER,
        data: null,
      },

      sku: null,
      skuList: [],
      user: null,

      type: null,
      doing: false,
      checkouted: false,

      couponList: [],
      showCouponDialog: false,
      couponIndex: -1,
      voucher: [],
      couponDeduct: 0,

      integral: { value: 0, deduct: 0, checked: false, },
      remain: { value: 0, deduct: 0, checked: false, },
      dScore: { value: 0, deduct: 0, checked: false, },

      freight: 0,
      goodsPrice: 0,
      payPrice: 0,
      remarks: '',

      detail: {},

      pwd: '',
      showKeyboard: false,
      showPwdDialog: false,

      showPayDialog: false,
      payIndex: 0,
      payList: [
        { title: '支付宝钱包', src: require('../../../assets/images/order/aliPay.png'), isAli: true, },
        { title: '微信钱包', src: require('../../../assets/images/order/wxPay.jpg'), isWx: true, },
      ],
      aliForm: null,
    };
  },

  computed: {
    title() { return '确认订单'; },

    isVip(){ return this.goodsList[0] ? this.goodsList[0].is_vip : false; },
    isNewPeople(){ return this.goodsList[0] ? this.goodsList[0].newcomer : false; },
    isPublic(){ return !this.isVip && !this.isNewPeople; },
    isBack() { return this.$route.meta.isBack; },

    goodsList(){ return this.sku ? [this.sku] : this.skuList; },
    storeId(){ return this.goodsList[0] ? this.goodsList[0].store_id : gd.MAIN_STORE; },
    cartIdList(){ return this.goodsList.map(v => `${this.isCart ? v.cart_id : v.goods_id}|${v.goods_num}`); },
    isCart(){ return !this.sku; },

    showCoupon(){ return this.isPublic && this.couponList.length && this.goodsList[0].use_coupon == gd.USE_COUPON; },
    showIntegral(){ return this.isPublic; },

    payPriceArr(){ return String(this.payPrice).split('.'); },

  },

  methods: {
    init() {
      let route = this.$route,
          orderId = localStorage.getItem('orderId'),
          params = route.params;

      if(orderId){
        localStorage.removeItem('orderId');
        return setTimeout(() => this.goOrder(orderId), 2000);
      }
      
      if(!params || !(params.sku || params.skuList)) return this.$router.replace({ name: 'home', });
      this.sku = null;
      this.skuList = [];

      if(params.sku) this.sku = this.format(params.sku);
      
      if(params.skuList){
        params.skuList.forEach(this.format);
        this.skuList = params.skuList;
      }

      this.showCouponDialog = this.showKeyboard = this.showPwdDialog = this.showPayDialog = false;
      this.remain.checked = this.integral.checked = this.dScore.checked = false;
      this.payPrice = 0;
      this.couponIndex = -1;
      this.voucher = [];
      this.remarks = '';
      this.doing = this.checkouted = false;

      this.getAddress();
      this.getStoreCouponList();

      this.getUser();
    },

    submit() {
      let opt = { 
        title: '温馨提示', 
        message: '您还未设置德分支付密码', 
        confirmButtonText: '去设置',
        confirmButtonColor: '#4fb84a',
        cancelButtonText: '再看看',
        beforeClose: (action, done) => { if (action === 'confirm') this.$router.push({ name: 'dScorePwd', }); done(); }, 
      };
      
      if(this.doing) return ;

      if(!this.addressConfig.data){
        return this.$toast.fail('缺少收货地址');
      }

      if(!this.checkouted) return console.log('未结算!');;

      if(this.isVip && this.dScore.checked){

        if(this.user.set_paypwd != '1') return this.$dialog.confirm(opt).catch(() => {  });

        this.pwd = '';
        return this.showPwdDialog = this.showKeyboard = true;
      }

      if(this.payPrice == 0) return this.submitOrder();

      this.openPayDialog();
    },

    goBack() {
      this.$router.back();
    },

    async goOrder(id) {
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.getOrder(id);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取订单信息失败!');

      if(res.data){
        this.$router.replace({ name: res.data[0].order_state_id == gd.ORDER_UN_PAY ? 'orderDetail' : 'orderDone', query: { id, } })
      }

      this.$toast.clear();
    },

    openCouponDialog() {
      this.showCouponDialog = true;
    },

    closeCouponDialog(isCancel) {
      if(isCancel){
        this.couponIndex = -1; 
        this.checkout();
      }

      this.showCouponDialog = false;
    },

    changeCoupon() {
      let item = this.couponList[this.couponIndex];

      if(Number(item.voucher_limit) > Number(this.goodsPrice)){
        this.couponIndex = -1;
        this.voucher = [];
        return this.$toast.fail(`商品总金额必须大于${item.voucher_limit}`);
      }

      this.voucher = item ? { [this.storeId]: item.voucher_code } : [];

      this.checkout();
      this.closeCouponDialog();
    },

    changeIntegral() {
      this.integral.checked = !this.integral.checked;

      this.checkout();
    },

    changeRemain() {
      this.remain.checked = !this.remain.checked;

      this.checkout();
    },

    changeDScore() {
      this.dScore.checked = !this.dScore.checked;

      this.checkout();
    },

    closePwdDialog() {
      this.showPwdDialog = this.showKeyboard = false;
    },

    inputPwd(key) {
      this.pwd = (this.pwd + key).slice(0, 6);

      if(this.pwd.length === 6){
        this.closePwdDialog();

        if(this.payPrice == 0) return this.submitOrder();
        this.openPayDialog();
      }
    },

    deletePwd() {
      this.pwd = this.pwd.slice(0, this.pwd.length - 1);
    },

    openPayDialog() {
      this.showPayDialog = true;
    },

    closePayDialog(e) {
      if(e) this.showPayDialog = false;
    },

    async submitOrder() {
      this.showPayDialog = false;
      if(this.doing) return ;
      this.doing = true;

      let params = {
        cart_id: this.cartIdList,
        address_id: this.addressConfig.data.address_id,
        payment_code: this.payIndex ? 'wxpay_h5' : 'alipay_h5',
        pay_name: "online",
        order_from: 2,
        pay_message: { 1: this.remarks },
        ifcart: this.isCart ? 1 : 0,
        voucher: this.voucher,
        is_pintuan: 0,
        rcb_pay: 0,
      };

      if(this.isVip && this.dScore.checked){
        params.rcb_pay = 1;
        params.password = this.pwd;
      }

      if(this.integral.checked) params.point_pay = 1;
      if(this.remain.checked) params.pd_pay = 1;

      // 新人专享
      if(this.isNewPeople) params.is_newcomer = 1;

      if(this.sharerId) params.inviter_id = this.sharerId;

      let res = await apiOrder.submit(params);
      if(!res || typeof res === 'string' || res.error){
        this.doing = false;
        return this.$toast.fail(res ? res.error || res : '提交订单失败!');
      }

      if(res && res.data){
        localStorage.setItem('orderId', res.data.order_id);
        this.goPay(res.data);
      }

    },

    async goPay(o) {
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
        
        location.href = `${o.mweb_url}`;
      }

      addEventListener('pageshow', e => {
        this.init();
        removeEventListener('pageshow');
      });
    },

    format(o) {
      let spec = o.goods_spec,
          priceArr = String(o.newcomer ? o.newcomer_price : o.goods_price).split('.');

      o.specStr = spec ? Object.keys(spec).map(k => spec[k]).join('; ') : '统一规格';

      o.priceInteger = priceArr[0];
      o.priceDecimal = priceArr[1];

      return o;
    },

    async checkout() {
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let integral = this.integral,
          remain = this.remain,
          dScore = this.dScore,
          param = { 
            cart_id: this.cartIdList,
            ifcart: this.isCart ? 1 : 0,
            is_pintuan: this.isGroup,
            voucher_list: this.voucher,
          };
      
      if(this.addressConfig.data) param.city_id = this.addressConfig.data.city_id;

      if(integral.checked) param.point_pay = 1;
      if(remain.checked) param.pd_pay = 1;

      // vip goods
      if(this.isVip){
        if(dScore.checked) param.rcb_pay = 1;
      }

      // 新人专享
      if(this.isNewPeople) param.is_newcomer = 1;

      let res = await apiOrder.checkout(param);
      if(!res || typeof res === 'string' || res.error) return this.checkouted = false, this.$toast.fail(res ? res.error || res : '结算失败!')

      if(res && res.data){
        this.freight = res.data.freight_list ? Object.keys(res.data.freight_list).reduce((p, k) => math.add(p, res.data.freight_list[k]), 0).toFixed(2) : 0;
        this.payPrice = Object.keys(res.data.store_final_order_total).reduce((p, k) => math.add(p, res.data.store_final_order_total[k]), 0).toFixed(2);
        this.goodsPrice = Object.keys(res.data.goods_total).reduce((p, k) => math.add(p, res.data.goods_total[k]), 0);
        this.deduct = math.subtract(math.add(this.goodsPrice, this.freight), this.payPrice);

        if(this.isVip){
          dScore.deduct = dScore.checked ? Math.min(this.deduct, dScore.value) : 0;
        }

        this.couponDeduct = !res.data.voucher_list.hasOwnProperty('length') ? Math.min(this.couponList[this.couponIndex].voucher_price, this.goodsPrice) : 0;
        this.deduct = math.subtract(this.deduct, this.couponDeduct);
        integral.deduct = integral.checked ? Math.min(this.deduct, math.divide(integral.value.toFixed(1), 10)) : 0; // 积分抵扣
        this.deduct = math.subtract(this.deduct, integral.deduct);
        remain.deduct = remain.checked ? Math.min(this.deduct, remain.value) : 0; // 余额抵扣
        this.checkouted = true;
      }

      this.$toast.clear();
    },

    formatCoupon(v) {
      v.startStr = moment(v.voucher_startdate * 1000).format('YYYY-MM-DD');
      v.endStr = moment(v.voucher_enddate * 1000).format('YYYY-MM-DD');

      return v;
    },

    async getStoreCouponList() {
      let param = { voucher_state: 1 };

      let res = await apiCoupon.getStoreCouponList(this.goodsList[0].store_id, param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取优惠券信息失败!');

      if(res && res.data){
        res.data.forEach(this.formatCoupon);
        this.couponList = res.data;
      }

    },

    formatAddress(o) {
      o.name = o.address_realname;
      o.phone = o.address_mob_phone;
      o.address = `${o.area_info}${o.address_detail}`;

      return o;
    },

    // 默认地址
    async getAddress() {
      let param = {};

      let res = await apiAddress.getAddressList();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取地址信息失败!')

      if(res.data && res.data.length){
        this.addressConfig.data = this.formatAddress(res.data.filter(v => v.address_is_default == 1)[0] || res.data[0]);
      }
      this.checkout();
    },

    async getUser() {
      let param = {},
          user;

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiUser.getUser();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取用户信息失败!')

      if(res && res.data){
        this.user = user = res.data;

        this.integral.value = Number(user.member_points);
        this.remain.value = Number(user.available_predeposit);
        this.dScore.value = Number(user.available_rc_balance);
      }

      this.$toast.clear();
    },
  },

  activated() {
    let address = gd.get('address');
    if(address){
      localStorage.removeItem('address');
      this.addressConfig.data = this.formatAddress(address);

      this.checkout();
    }

    if(this.isBack) return ;

    this.init();
  },

};
</script>
<style lang='less' scoped>
.page_wrap{
  padding: 128px 0 110px;
}

.goods_list_wrap{
  margin: 20px 0 0;
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
.goods_price_container{
  margin: 50px 0 0;
  align-items: center; 
}
.goods_price_wrap{
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

.order_info_wrap{
  padding: 0 24px;
}
.order_info{
  margin: 15px 0 0;
}
.form_item{
  align-items: center;
  height: 80px;
  font-size: 28px;
  border-top: 1px solid #f4f4f4;
}
.form_input{
  padding: 0;
  line-height: 80px;
}

.coupon_num_wrap{
  align-items: center;
  font-size: 20px;
}
.coupon_num{
  height: 32px;
  padding: 0 10px;
  background-image: linear-gradient(90deg, #7fd27d 0%, #bacf6a 100%);
  border-radius: 5px;
  text-align: center;
  line-height: 32px;
  margin-right: 20px;
}
.integral_info_wrap{
  align-items: center;
}
.integral_info{
  margin: 0 0 0 20px;
}

.bottom_bar_wrap{
  align-items: center;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  margin: 20px 0 0;
  padding: 0 30px;
  font-size: 28px;
}
.price_integer{
  font-size: 36px; 
}
.submit_btn {
  width: 160px;
  height: 70px;
  line-height: 70px;
  border-radius: 10px;
  text-align: center;
  font-size: 30px;
}

.coupon_wrap{
  position: relative;
  border-radius: 6px 6px 0px 0px;
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
.coupon_list_wrap{
  height: 500px;
  overflow: auto;
}
.coupon_item{
  padding: 10px 40px;
  align-items: center;
  font-size: 24px;
}
.coupon_info_wrap{
  width: 504px;
  height: 200px;
  border-radius: 6px;
  font-size: 22px;
  text-align: center;
}
.coupon_price_wrap{
  font-size: 34px;
  padding: 50px 0 0;
}
.coupon_btn{
  margin: 20px 0 0;
  padding: 27px 0;
  font-size: 36px;
  text-align: center;
}

.pwd_dialog_wrap{
  position: fixed;
  top: 40%;
  left: calc(50% - 300px);
  width: 600px;
  border-radius: 20px;
}
.pwd_mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.pwd_wrap{
  padding: 0 0 50px 0;
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

.ali_form_wrap{
  visibility: hidden;
}

.i_goods{
  width: 180px;
  height: 180px;
  border-radius: 10px;
}
.i_delete{
  flex-shrink: 0;
  padding: 20px 10px;
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

.ml20{ margin: 0 0 0 20px; }

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