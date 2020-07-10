<template>
  <div class="coupon_wrap s_bg_f">

    <div class="scroll_container">
      <div class="scroll_wrap flex">

        <div class="coupon_info_wrap flex s_fc_f" v-for="(item, index) in list" :key="index" @click="receive(item, index)">
          <div class="coupon_info s_bg_14">
            <div class="coupon_price_wrap">￥<span class='coupon_price'>{{item.vouchertemplate_price}}</span></div>
            <div class="coupon_desc">满{{item.vouchertemplate_limit}}可用</div>
          </div>

          <div class='coupon_vice s_bg_15'>优惠券</div>
        </div>

      </div>
    </div>

  </div>
</template>
<script>
import * as apiCommon from '@/api/common';
import * as apiCoupon from '@/api/coupon';
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

      active: null,

      list: [],
      total: 0,
    };
  },

  computed: {
  },

  methods: {
    receive(item, index) {
      let param = { vouchertemplate_id: item.vouchertemplate_id, };

      if(this.doing) return ;

      if(item.fetch_states == 1) return this.$toast.fail('请不要重复领取');

      this.doing = true;
      this.receiveCoupon(param, index);
    },

    format(v) {
      
      return v;
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

    async getList() {
      let param = { store_id: 1, };

      let res = await apiCoupon.getCouponList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取优惠券信息失败!')

      if(res && res.data){
        res.data.forEach(this.format);
        this.list = res.data;
        this.total = res.pagination ? res.pagination.total : this.list.lenght;
      }
    },

  },

  created() {
    this.getList();
  },
};
</script>
<style lang='less' scoped>
.coupon_wrap{
  margin: 30px 20px 0;
  padding: 20px;
  border-radius: 20px;
  font-size: 28px;
}

.scroll_container{
  height: 120px;
  overflow: hidden;
}
.scroll_wrap{
  padding: 0 0 20px;
  overflow: auto;
}

.coupon_info_wrap{
  flex-shrink: 0;
  margin: 0 30px 0 0;
}
.coupon_info{
  height: 120px;
  padding: 20px;
  border-radius: 10px; 
  box-sizing: border-box;
  text-align: center;
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
  font-size: 20px;
}
.coupon_vice{
  position: relative;
  width: 50px;
  height: 120px;
  padding: 10px;
  border-radius: 10px;
  font-size: 20px;
  box-sizing: border-box;
  white-space: normal;
}
.coupon_vice::before{
  position: absolute;
  content: '';
  top: 20%;
  left: 0;
  bottom: 20%;
  border-left: 1px dashed #fff;
}

.ml10{
  margin-left: 10px;
}

.s_fc_11{ color: #FF557A; }
.s_fc_12{ color: #FF0032; }
.s_fc_13{ color: #151212; }
.s_fc_14{ color: #E06F00; }
.s_fc_15{ color: #DD3D27; }

.s_bg_11{ background: #F5F5F5; }
.s_bg_12{ background: #FFF0D5; }
.s_bg_13{ background: #FFE9E9; }
.s_bg_14{ background: linear-gradient(30deg, #70e26a, #a5fb79); }
.s_bg_15{ background: #a5fb79; }

.s_bg_fa{ background: #fafafa; }
</style>
<style>
.van-tabs--line .van-tabs__wrap{

}
</style>
