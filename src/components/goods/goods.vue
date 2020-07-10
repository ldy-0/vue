<template>
  <div class="goods_wrap s_bg_f" :class="{ search_goods_wrap: isSearchList }">

    <div class="s_fc_9" @click="goDetail">
        <img class="i_goods" :src="config.goods_image" />

        <div class="goods_info_wrap">
          <div class="goods_name s_fc_3" :class="{ search_goods_name: isSearchList }">{{config.goods_name}}</div>

          <div class="goods_tag_wrap" v-if="isVipGoodsList">
            <span class="goods_tag s_fc_14 s_bg_12">赠资产</span>
            <span class="goods_tag s_fc_15 s_bg_13">包邮</span>
          </div>

          <div class='goods_integral_wrap s_fc_12' v-if="config.goods_integral">
            <span class="goods_integral_pre s_fc_f s_bg_14">返</span><span class="goods_integral">{{config.goods_integral}}积分</span>
          </div>

          <!-- 价格 -->
          <div class='goods_price s_fc_12' :class="{ search_goods_price: isSearchList }">
            <img class='i_activity' :src='config.tag_image' v-if="config.tag_image" />
            <span class="goods_price_pre">¥</span>
            <span class='goods_price_integer'>{{config.priceInteger}}</span>
            <span class="goods_price_post">.{{config.priceDecimal}}</span>

            <span class="goods_sales s_fc_9">热销:{{config.goods_salenum}}</span>
          </div>
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

    };
  },

  computed: {
    isStoreOrder(){ return this.config.store_id !== 1; },
    isVip(){ return this.config.isVip; },
    isSeckill(){ return this.config.isSeckill; },
    isGroup(){ return this.config.isGroup; },
    isBargain(){ return this.config.isBargain; },
    isNormal(){ return !(this.isVip || this.isSeckill || this.isGroup || this.isBargain); },

    isVipGoodsList(){ return this.$route.name === 'vipGoodsList'; },
    isClassGoodsList(){ return this.$route.name === 'classGoodsList'; },
    isMainGoodsList(){ return this.$route.name === 'mainGoodsList'; },
    isSearchList(){ return this.$route.name === 'searchResult'; },
  },

  methods: {
    init() {
      this.format(this.config);
    },

    goDetail() {
      let id = this.config.goods_commonid,
          type = gd.NORMAL_ORDER;

      if(this.isVip) type = gd.VIP_ORDER;

      this.$router.push({ name: 'goodsDetail', query: { id, type, }, });
    },

    format(v){
      let arr = String(v.goods_price).split('.');

      v.priceInteger = arr[0];
      v.priceDecimal = arr[1];

      return v;
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

.store_wrap{
  align-items: center;
}

.goods_wrap{
  width: 340px;
  margin: 20px 0 0;
  padding: 0 0 20px 0;
  border-radius: 10px;
  font-size: 28px;
}
.goods_info_wrap{
  font-size: 28px;
  word-break: break-all;
}
.goods_name{
  margin: 20px 0 0 10px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
.search_goods_wrap{
  border: 1px solid #ddd;
  border-radius: 10px 10px 0 0;
}
.search_goods_name{
  margin: 0px 0 0 10px;
  height: 72px;
  white-space: normal;
}

.goods_tag_wrap{
  margin: 0 0 0 10px;
}
.goods_tag{
  margin: 0 10px 0 0;
  padding: 2px 6px;
  font-size: 20px;
  letter-spacing: 1px;
  border-radius: 4px;
}

.goods_integral_wrap{
  margin: 8px 0 0 10px;
  font-size: 22px; 
}
.goods_integral_pre{
  padding: 2px 4px;
}
.goods_integral{
  padding: 0 4px;
  border: 1px solid #FF0032;
}

.goods_price{
  margin: 5px 10px 0;
  font-size: 30px;
}
.goods_price_integer{
  font-size: 32px;
}
.goods_price_pre, .goods_price_post{
  font-size: 22px;
}
.goods_sales{
  margin: 0 0 0 10px;
  font-size: 22px;
}
.goods_desc{
  margin: 10px 0 0;
  font-size: 26px;
}
.search_goods_price{
  margin: 30px 10px 0;
}

.i_goods{
  width: 100%;
  height: 340px;
  border-radius: 10px 10px 0 0;
}
.i_activity{
  position: relative;
  top: 4px;
  width: 68px;
  height: 34px;
  margin: 0 10px 0 0;
}

.s_fc_11{ color: #FF557A; }
.s_fc_12{ color: #FF0032; }
.s_fc_13{ color: #151212; }
.s_fc_14{ color: #E06F00; }
.s_fc_15{ color: #DD3D27; }

.s_bg_11{ background: #F5F5F5; }
.s_bg_12{ background: #FFF0D5; }
.s_bg_13{ background: #FFE9E9; }
.s_bg_14{ background: #FF0032; }

.s_bg_fa{ background: #fafafa; }
</style>