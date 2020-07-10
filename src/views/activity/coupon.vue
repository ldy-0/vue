<template>
  <div class="page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="main_wrap">
      <img class="i_bg" :src="bgUrl" alt="">

      <div class="coupon_list_wrap between">
        <div :class="[index == 0 ? 'main_coupon_wrap' : 'coupon_wrap']" v-for="(item, index) in list" :key="index"  @click="receive(item, index)">
          <img class="i_bg" :src="index == 0 ? require('../../assets/images/coupon/main_coupon.png') : require('../../assets/images/coupon/coupon.png')" alt="">

          <div class="coupon_info_wrap flex">
            <div class="coupon_info">
              <div class="coupon_price_wrap s_fc_11">￥<span class='coupon_price'>{{item.vouchertemplate_price}}</span></div>
              <div class="coupon_limit">满{{item.vouchertemplate_limit}}可用</div>
              <div class="coupon_desc">除VIP产品外，其他商品皆可使用</div>
            </div>
          </div>
        </div>
      </div>

      <div class="submit_btn s_fc_f s_bg_11" @click="goApp">去使用</div>

      <div class="my_coupon s_fc_12" @click="goApp">我的优惠券</div>
    </div>

  </div>
</template>
<script>
import moment from 'moment';
import * as math from 'mathjs';
import * as api from '@/api/common';
import * as apiCoupon from '@/api/coupon';
import * as gd from '@/utils/global';

export default {
  components: {
  },

  data() {
    return {
      type: null,

      bgUrl: '',

      list: [],
      total: 0,

      clip: null,
    };
  },

  computed: {
    title() { return '优惠券'; },

    isBack() { return this.$route.meta.isBack; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;
      this.id = query.id;

      this.clear();
      this.getConfig();
      this.getList();
    },

    goApp() {
      this.$router.push({ name: 'app', query: {}, });
    },

    goBack() {
      this.$router.back();
    },

    receive(item, index) {
      let param = { vouchertemplate_id: item.vouchertemplate_id, };

      if(this.doing) return ;

      if(item.fetch_states == 1) return this.$toast.fail('请不要重复领取');

      this.doing = true;
      this.receiveCoupon(param, index);
    },

    format(v){

      return v;
    },

    async getList() {
      let param = { store_id: 1, };
      this.$toast.loading({ message: '加载中...', forbidClick: true });

      let res = await apiCoupon.getCouponList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取优惠券信息失败!')

      if(res && res.data){
        res.data.forEach(this.format);
        this.list = res.data;
        this.total = res.pagination ? res.pagination.total : this.list.lenght;
      }
      this.$toast.clear();
    },

    async receiveCoupon(param, index) {
      let res = await apiCoupon.receiveCoupon(param);

      this.doing = false;
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '领取失败!')

      if(res && res.status == 0){
        this.list[index].fetch_states = 1;
        this.$toast.success('领取成功');
      }
    },

    async getConfig() {
      let param = {};

      let res = await api.getConfig(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取配置信息失败!')

      if(res && res.data){
        this.config = res.data;
        
        if(res.data.img.coupon && res.data.img.coupon.bg){
          this.bgUrl = res.data.img.coupon.bg.url;
        }
      }
    },

    clear() {
      this.list = [];

      scrollTo(0, 0);
    }
  },

  activated() {
    if(this.isBack) return ;

    this.init();
  },

  deactivated() {
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  padding: 128px 0 0;
}

.main_wrap{
  box-sizing: border-box;
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 30px;
  z-index: 1;
}
.coupon_list_wrap{
  flex-wrap: wrap;
}
.main_coupon_wrap{
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  width: 690px;
  height: 180px;
  margin: 30px 0 0;
}
.coupon_wrap{
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  width: 330px;
  height: 190px;
  margin: 30px 0 0;
}
.coupon_info_wrap{
  flex-shrink: 0;
}
.coupon_info{
  width: 80%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}
.coupon_limit{
  margin: 10px 0 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.coupon_price_wrap{
  font-size: 30px;
}
.coupon_price{
  font-size: 36px;
  font-weight: bold;
}
.coupon_desc{
  margin: 10px 0 0;
  font-size: 24px;
  color: #999;
  text-align: left;
}

.submit_btn{
  width: 690px;
  height: 90px;
  margin: 40px auto 0;
  line-height: 90px;
  font-size: 30px;
  text-align: center;
  border-radius: 45px;
}
.my_coupon{
  margin: 30px 0 0;
  font-size: 24px;
  text-align: center;
}

.i_bg{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.ml10{ margin: 0 0 0 10; }

.s_fc_11{ color: #FA09BE; }
.s_fc_12{ color: #FF5D5B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #202020; }
.s_fc_15{ color: #dd3d27; }
.s_fc_16{ color: #af0000; }
.s_fc_17{ color: #636363; }
.s_fc_18{ color: #282425; }

.s_bg_11{ background: #FF5D5B; }
.s_bg_13{ background: #FF003A; }
.s_bg_14{ background: #58BEB5; }
.s_bg_f5{ background: #f5f5f5; }
</style>
<style>

</style>