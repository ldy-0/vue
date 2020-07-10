<template>
  <div class="info s_bg_f">
    <div class="status_line between s_fc_5">
      <div>{{config.stateStr}}</div>

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

          <!-- <div>
            <div class="product_price">¥{{items.goods_price}}</div>
          </div> -->

          <div class="goods_sku_wrap between s_fc_8">
            <div class="goods_standard">规格：{{goods.specStr || "统一规格"}}</div>
            <!-- <div class="goods_number">×{{goods.goods_num}}</div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- amount -->
    <div class="price_wrap between s_fc_2">
      <div class="price_info">
        <span>已砍：<span class="s_fc_11">¥{{config.bargain_money}}</span></span>
      </div>

      <div class="status_desc_wrap">

        <div class="s_fc_11" v-if="isDoing">
          <van-count-down :time="config.time">
            <template v-slot="time">
              <span class="s_fc_11">还剩 <span v-if="time.days">{{time.days}}天 </span> </span>
              <span class="countdown_time s_fc_f s_bg_11">{{ time.hours }}</span>
              <span class="countdown_time s_fc_11">:</span>
              <span class="countdown_time s_fc_f s_bg_11">{{ time.minutes }}</span>
              <span class="countdown_time s_fc_11">:</span>
              <span class="countdown_time s_fc_f s_bg_11">{{ time.seconds }}</span>
            </template>
          </van-count-down>
        </div>
        <div class='status_desc' v-if="isSuccess">砍价完成</div>
        <div class='' v-if="isFail">砍价失效</div> 

      </div>
    </div>

    <!-- operate -->
    <div class="order_btn_wrap flex" v-if="isDoing || isFail">
      <div class="order_btn order_green_btn" v-if="isDoing" @click="goApp('pay')">立即购买</div>
      <div class="order_btn order_green_btn" v-if="isFail" @click="goApp('bargain')">重新砍价</div>

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

  components: {
  },

  data() {
    return {
      doing: false,

    };
  },

  computed: {
    goods(){ return this.config.goods; },
    countdown(){ return this.config.countdown; },

    isStoreOrder(){ return this.config.store_id !== 1; },

    isFail(){ return this.config.cutprice_activity_states === gd.NO_BARGAIN; },
    isSuccess(){ return this.config.cutprice_activity_states === gd.BARGAINED; },
    isDoing(){ return this.config.cutprice_activity_states === gd.BARGAINING; },
  },

  methods: {
    goDetail() {
      let id = this.config.order_id,
          type = gd.BARGAIN_ORDER;

      if(!id) return console.log('no order');

      this.$router.push({ name: 'orderDetail', query: { id, type, }, });
    },

    goStore() {
      console.log('store');
    },

    goLogistic() {
      let id = this.config.order_id;

      this.$router.push({ name: 'orderLogistic', query: { id, } });
    },

    goApp(item) {
      console.log('app');
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
  height: 80px;
  line-height: 80px;
  font-size: 26px;
}
.status_desc_wrap{

}
.countdown_time{
  padding: 2px 4px; 
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
.i_goods{
  width: 142px;
  height: 142px;
  border-radius: 10px;
}

.s_fc_11{ color: #4fb84a; }

.s_bg_11{ background: #4fb84a; }
.s_bg_fa{ background: #fafafa; }
</style>