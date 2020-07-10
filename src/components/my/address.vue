<template>
  <div class="container">
    <div class="address_wrap between" :class="{ z_afterSale_detail: isAfterSaleDetail, }" @click="goAddress">
      <img class="i_address" :src="LocationImg" alt="" v-if="showAddress" />

      <div class="wrap s_fc_11">
        <div class="between">
          <div class="user_name">收货人：{{address.name}}</div>

          <div>{{address.phone}}</div>
        </div>

        <div class="address_detail" :class="{ s_fc_12: isOrderDetail || isSubmitOrder, }">
          <span v-if="!isSubmitOrder">收货地址：</span>
          <span>{{address.address}}</span>
        </div>
      </div>

      <img class="i_arrow" src="../../assets/images/global/rightArrow.png" v-if="isSubmitOrder" />
    </div>

    <img src="../../assets/images/order/line.png" class="i_line" v-if="isSubmitOrder" />
  </div>
</template>
<script>
import * as apiCommon from '@/api/common';
import * as gd from '@/utils/global';
import valid from '@/utils/valid';

export default {
  name: 'c-address',

  props: {
    config: {
      type: Object,
    },
  },

  data() {
    return {
      LocationImg: require('../../assets/images/order/location.png'),
    };
  },

  computed: {
    isSubmitOrder(){ return this.parent == gd.SUBMIT_ORDER; },
    isOrderDetail(){ return this.parent == gd.ORDER_DETAIL; },
    isAfterSaleDetail(){ return this.parent == gd.AFTERSALE_DETAIL; },
    showAddress(){ return [gd.SUBMIT_ORDER, gd.AFTERSALE_DETAIL].indexOf(this.parent) !== -1; },

    parent(){ return this.config.parent || null; },
    address(){ return this.config.data || {}; },
  },

  methods: {

    goAddress() {
      if(this.isOrderDetail || this.isAfterSaleDetail) return ;

      this.$router.push({ name: 'addressList', params: { from: this.$route.name, } });
    },
    
  },

  created() {
  },
};
</script>
<style scoped>

.address_wrap{
  position: relative;
  box-sizing: border-box;
  padding: 20px 30px 20px 10px;
  align-items: center;
}
.z_afterSale_detail{
  padding: 20px;
}

.wrap{
  flex-grow: 1;
  font-size: 28px;
  margin: 0 0 0 20px;
}
.user_name{
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.address_detail{
  margin: 20px 0 0;
}

.i_address{
  width: 33px;
  height: 40px;
}
.i_arrow{
  margin: 0 0 0 20px;
  width: 18px;
  height: 30px;
}
.i_line{
  width: 100%;
  height: 10px;
}

.s_fc_11 { color: #636363; }
.s_fc_12 { color: #979797; }

.s_bg_11 { background: #3A903C; }
</style>