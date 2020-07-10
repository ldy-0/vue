<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <!-- goods -->
    <div class="goods_list_wrap s_fc_8 s_bg_f">
      <div class="flex">
        <img class="i_goods" :src="goods.goods_image" />

        <div class="goods_info_wrap">
          <div class="goods_name s_fc_3">{{goods.goods_name}}</div>

          <div class="goods_sku_wrap between s_fc_8">
            <div class="goods_standard">规格：{{goods.goods_spec || "统一规格"}}</div>
            <!-- <div class="goods_number">×{{item.goods_num}}</div> -->
          </div>

          <div class="goods_price_wrap s_fc_15">
            <span>¥</span>
            <span class="goods_price_integer">{{detail.rule ? detail.rule.goods_price : ""}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- status -->
    <div class="info_wrap s_bg_f">
      <div class="status_wrap flex center" v-if="detail.pintuangroup_state == item.id" v-for="(item, index) in statusList" :key="index">
        <img class="i_status" :src="item.src" />
        <span class="status_title">{{item.title}}</span>
      </div>

      <div class="member_wrap flex center">
        <img class="i_avatar" :src="item.member_avatar" v-for="(item, index) in detail.members" :key="index" />
      </div>

      <div class="status_desc_wrap">
        <!-- <div class="status_desc" v-if="detail.pintuangroup_state == 2">名额已满，已结束</div> -->
        <div class="status_desc" v-if="isSuccess">商家正在努力发货，请耐心等待！</div>
        <div class="status_desc" v-if="isFail">名额未满，已结束</div>
        <div class="status_desc flex center" v-if="isGrouping">
          <span>仅剩<span class="s_fc_15">{{detail.pintuangroup_surplus}}</span>个名额，</span>

          <van-count-down :time="detail.time" @finish="changeStatus">
            <template v-slot="time">
              <span class="s_fc_15"><span v-if="time.days">{{time.days}}天 </span> </span>
              <span class="s_fc_15">{{time.hours}}:{{time.minutes}}:{{time.seconds}}</span>
            </template>
          </van-count-down>

          <span>后结束</span>
        </div>
      </div>
    </div>

    <div class="submit_wrap s_fc_f s_bg_13">
      <div class="" v-if="isFail" @click="goApp">再次拼团</div>
      <div class="" v-if="isGrouping" @click="openPoster">生成海报</div>
      <div class="" v-if="isSuccess" @click="goOrder">查看订单</div>
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
      statusList: [
        { id: 0, title: '拼团失败', src: require('../../../../assets/images/order/group_error.png'), },
        { id: 1, title: '拼团中', src: require('../../../../assets/images/order/grouping.png'), },
        { id: 2, title: '拼团成功', src: require('../../../../assets/images/order/group_sucess.png'), },
      ],

      type: null,

      detail: {},
    };
  },

  computed: {
    title() { return '拼团详情'; },
    
    goods() { return this.detail.goodsinfo || {}; },

    isGrouping() { return this.detail.pintuangroup_state === 1; },
    isSuccess() { return this.detail.pintuangroup_state === 2; },
    isFail() { return this.detail.pintuangroup_state === 0; },
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

    goOrder(item) {
      let query = { type: gd.GROUP_ORDER, };

      query.id = this.detail.order.order_id;

      this.$router.push({ name: 'orderDetail', query, });
    },

    goApp() {
      console.log('app');
    },

    openPoster() {

    },

    changeStatus() {
      this.detail.pintuangroup_state = 0;
    },

    format(order){
      order.order_id = this.id;
      order.addTimeStr = moment(order.add_time).format( "YYYY年MM月DD日 HH:mm");
      order.paymentTimeStr = moment(order.payment_time).format( "YYYY年MM月DD日 HH:mm");
      if(/^1970/.test(order.paymentTimeStr)) order.paymentTimeStr = '未支付';

      this.formatSpec(order);

      order.time = order.pintuangroup_endtime * 1000 - Date.now();

      return order;
    },

    formatSpec(item){
      let specStr = '',
          specObj = item.goodsinfo.goods_spec;

      for(let key in specObj){ specStr += `${specObj[key]}; `; }

      item.specStr = specStr ? specStr.replace(/;\s$/g, '') : '统一规格';
    },

    async getInfo() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.getGroupDetail(this.id);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取订单信息失败!')

      if(res && res.data){
        this.detail = this.format(res.data);
      }

      this.$toast.clear();
    },
  },

  created() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  padding: 128px 0 110px;
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
  margin: 50px 0 0;
}
.goods_standard {
  width: 400px;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info_wrap{
  padding: 40px 0;
}
.status_wrap{
  font-size: 34px;
}
.status_title{
  margin: 0 0 0 12px;
}
.member_wrap{
  flex-wrap: wrap;
  margin: 30px;
}
.status_desc_wrap{
  font-size: 28px;
  text-align: center;
}


.submit_wrap {
  height: 88px;
  margin: 80px 30px 0;
  line-height: 88px;
  font-size: 36px;
  border-radius: 10px;
  text-align: center;
}

.i_goods{
  width: 180px;
  height: 180px;
  border-radius: 10px;
}
.i_status{
  width: 42px;
  height: 42px;
}
.i_avatar{
  width: 70px;
  height: 70px;
  margin: 0 20px 0 0;
  border: 1px dotted #a0a0a0;
  border-radius: 50%;
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