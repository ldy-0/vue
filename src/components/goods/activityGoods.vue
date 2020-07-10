<template>
  <div class="goods_wrap flex s_bg_f s_fc_9" @click="goApp">

    <img class="i_goods" :src="config[state.imgKey] ? config[state.imgKey][0] : config.goods.goods_image" />

    <div class="goods_info_wrap">
      <div class="goods_name s_fc_13">{{config.rule_name || config.goods_name}}</div>

      <div class="other_wrap">
        <div v-if="isSeckill">
          <div class="countdown_ctn_wrap s_fc_12" v-if="isTodo">即将开始</div>

          <van-count-down class="countdown_ctn_wrap" :time="time" @finish="changeStatus" v-else-if="time > 0">
            <template v-slot="time">
              <span class="countdown_ctn s_fc_f s_bg_12">{{time.days > 9 ? '' : '0'}}{{time.days}}</span>
              <span class="countdown_ctn s_fc_15">:</span>
              <span class="countdown_ctn s_fc_f s_bg_12">{{time.hours > 9 ? '' : '0'}}{{time.hours}}</span>
              <span class="countdown_ctn s_fc_15">:</span>
              <span class="countdown_ctn s_fc_f s_bg_12">{{time.minutes > 9 ? '' : '0'}}{{time.minutes}}</span>
              <span class="countdown_ctn s_fc_15">:</span>
              <span class="countdown_ctn s_fc_f s_bg_12">{{time.seconds > 9 ? '' : '0'}}{{time.seconds}}</span>
            </template>
          </van-count-down>

          <div class="countdown_ctn_wrap s_fc_12" v-else>活动结束</div>
        </div>
      </div>

      <div class='mt40 s_fc_9'>
        <div class='activity_price_wrap flex'>
          <img class='i_activityPrice' :src='state.url' />

          <div class='activity_price s_fc_12'>
            <span class="activity_price_pre">￥</span>
            <span>{{config.goods_price}}</span>
          </div>

          <div class='market_price'>￥{{config.goods.goods_marketprice}}</div>
        </div>

        <div class='sales_wrap s_fc_12'>{{config.goods.goods_salenum}}{{state.desc}}</div>

        <div class='buy_btn s_fc_f s_bg_12'>去抢购</div>
      </div>
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

      seckill: {
        imgKey: 'images',
        desc: '人秒杀成功',
        url: require('../../assets/images/activity/seckillPrice.png'),
      },
      group: {
        imgKey: 'rule_images',
        desc: '人拼团成功',
        url: require('../../assets/images/activity/groupPrice.png'),
      },
      bargain: {
        imgKey: 'images',
        desc: '人砍价成功',
        url: require('../../assets/images/activity/bargainPrice.png'),
      },
    };
  },

  computed: {
    isSeckill(){ return this.$route.query.type == gd.SECKILL_GOODS; },
    isGroup(){ return this.$route.query.type == gd.GROUP_GOODS; },
    isBargain(){ return this.$route.query.type == gd.BARGAIN_GOODS; },

    state(){ return this.isSeckill ? this.seckill : this.isGroup ? this.group : this.isBargain ? this.bargain : {}; },

    isTodo(){
      let time = this.config.start_time;

      time = new Date(time.replace(/\-/g, '/')).getTime() - Date.now();
      
      return time > 0;
    },

    time(){
      let time = this.config.end_time;
      
      time = new Date(time.replace(/\-/g, '/')).getTime() - Date.now();

      return time;
    },
  },

  methods: {
    goApp() {
      this.$router.push({ name: 'app', query: {}, });
    },

    changeStatus() {

    },
  },

  created() {
  },
};
</script>
<style lang='less' scoped>
.goods_wrap{
  align-items: flex-end;
  margin: 20px 0 0;
  font-size: 28px;
}
.goods_info_wrap{
  flex-grow: 1;
  margin: 0 0 0 20px;
  font-size: 28px;
  word-break: break-all;
}
.goods_name, .goods_desc{
  width: 360px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity_price_wrap{
  flex-wrap: wrap;
  align-items: center;
  font-size: 24px;
}
.activity_price{
  font-size: 36px;
  margin: 0 0 0 10px;
}
.activity_price_pre{
  font-size: 28px;
}
.market_price{
  font-size: 24px;
  text-decoration: line-through;
}

.sales_wrap{
  margin: 10px 0 0;
  font-size: 22px;
  font-weight: bold;
}

.buy_btn{
  width: 180px;
  margin: 10px 0 0;
  padding: 25px 0;
  font-size: 32px;
  border-radius: 20px;
  text-align: center;
}

.other_wrap{
  margin: 10px 0 0;
  min-height: 40px;
}
.countdown_ctn_wrap{
  font-size: 20px;
}
.countdown_ctn{
  display: inline-block;
  padding: 2px 8px;
  margin: 0 2px;
  text-align: center;
}

.i_goods{
  flex-shrink: 0;
  width: 340px;
  height: 340px;
}
.i_activityPrice{
  flex-shrink: 0;
  width: 112px;
  height: 40px;
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
.s_bg_12{ background: #FF0032; }
.s_bg_13{ background: #FFE9E9; }

.s_bg_fa{ background: #fafafa; }
</style>