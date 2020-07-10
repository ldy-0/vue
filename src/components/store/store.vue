<template>
  <div class="store_item">

    <div class="store_info" @click="goStore">
      <img class="store_img" :src="config.store_avatar" alt="">

      <div class="store_content">
        <div class="store_name">{{config.store_name}}</div>
        <div class="store_desc">已售{{config.store_sales}}件 | {{config.enshrine_sum}}人收藏</div>
      </div>

      <van-button round color="#FF5373" text="进店" class="store_enter"></van-button>
    </div>

    <div class="store_goods">
      <div class="store_goods-item" :class="{ ml20: index != 0 && !isStoreList, ml30: index != 0 && isStoreList, }" v-for="(item, index) in config.store_goods" :key="item.goods_commonid" @click="goDetail(item)">
        <img class="store_goods-img" :src="item.goods_image" alt="">
        <div class="store_goods-name">{{item.goods_name}}</div>

        <div class="store_goods_price">
          <div class="store_goods-price">￥<span class="price">{{item.priceArr[0]}}</span>.{{item.priceArr[1]}}</div>
          <div class="store_goods-sale">热卖{{item.goods_salenum}}</div>
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
    isStoreList(){ return this.$route.name == 'storeList'; },
  },

  methods: {
    init() {
      this.format(this.config);
    },

    goStore() {
      let id = this.config.store_id;

      this.$router.push({ name: 'storeGoodsList', query: { id, }, });
    },

    goDetail(item) {
      let id = item.goods_commonid;

      this.$router.push({ name: 'goodsDetail', query: { id, }, });
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

.store_item {
  padding: 30px 20px;
  // width: 702px;
  border-radius: 10px;
  box-shadow: 0 5px 5px #ccc;
  box-sizing: border-box;
  border: 1px solid rgba(221, 221, 221, 1);
  margin: 20px 20px 0;
}
.store_info {
  height: 100px;
  display: flex;
  align-items: center;
  .store_img {
    width: 100px;
    height: 100px;
  }
  .store_content {
    padding: 0 20px;
    line-height: 50px;
    .store_name {
      width: 400px;
      font-weight: bold;
      font-size: 32px;
      color: #000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .store_desc {
      color: #999;
      font-size: 24px;
    }
  }
  .store_enter {
    height: 54px;
    color: #fff;
    background: #ff5373;
    line-height: 54px;
  }
}
.store_goods {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 20px;
  .store_goods-item {
    width: 200px;
    height: 100%;
    color: #333;
    line-height: 40px;
    .store_goods-img {
      width: 200px;
      height: 200px;
    }
    .store_goods-name {
      width: 100%;
      font-size: 24px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .store_goods_price {
      display: flex;
      align-items: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      box-sizing: border-box;
    }
    .store_goods-price {
      font-size: 24px;
      color: #ff5373;
    }
    .price{
      font-size: 30px;
    }
    .store_goods-sale {
      margin: 0 0 0 10px;
      color: #999;
      font-size: 22px;
    }
  }
}

.i_activity{
  position: relative;
  top: 4px;
  width: 68px;
  height: 34px;
  margin: 0 10px 0 0;
}

.ml20{ margin-left: 20px; }
.ml30{ margin-left: 30px; }

.s_fc_11{ color: #FF557A; }
.s_fc_12{ color: #FF0032; }
.s_fc_13{ color: #151212; }
.s_fc_14{ color: #E06F00; }
.s_fc_15{ color: #DD3D27; }

.s_bg_11{ background: #F5F5F5; }
.s_bg_12{ background: #FFF0D5; }
.s_bg_13{ background: #FFE9E9; }

.s_bg_fa{ background: #fafafa; }
</style>