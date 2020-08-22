<template>
  <div class="">

    <van-swipe :autoplay="3000" :stop-propagation="false" @change="updateIndex">
      <van-swipe-item class="goods_list_wrap between" v-for="(row, rowIndex) in giftGoodsList" :key="rowIndex">
        <goods class="goods_wrap" :config="item" v-for="(item, index) in row" :key="index"></goods>
      </van-swipe-item>

      <template #indicator>
        <div class="indicator_wrap flex center">
          <div class="indicator s_bg_12" :class="{ z_active: index === i }" v-for="(item, i) in giftGoodsList.length" :key="i">1</div>
        </div>
      </template>
    </van-swipe> 

    <!-- 直播 -->
    <div class="live_wrap" v-if="liveImg">
      <img class="i_live" :src="liveImg" @click="goSearchResult" />
    </div>

  </div>
</template>
<script>
import * as apiCommon from '@/api/common';
import * as apiGoods from '@/api/goods';
import valid from '@/utils/valid';
import * as gd from '@/utils/global';
import goods from '@/components/goods/goods.vue';

export default {
  props: {
    config: {
      type: Object,
    },
  },

  components: {
    goods,
  },

  data() {
    return {
      doing: false,

      index: 0,

      classList: [],
      giftList: [],

      liveId: null,
      liveImg: '',
    };
  },

  computed: {
    giftGoodsList(){
      let arr = [];
      this.giftList.forEach((v, i) => i % 4 == 0 ? arr.push([v]) : arr[arr.length - 1].push(v));
      return arr;
    },

    isVipGoodsList(){ return this.$route.name === 'vipGoodsList'; },

    isBack() { return this.$route.meta.isBack; },
  },

  methods: {
    init() {
      this.getAsset();
    },

    goDetail() {
      let id = this.config.order_id,
          type = gd.NORMAL_ORDER;

      if(this.isVip) type = gd.VIP_ORDER;

      this.$router.push({ name: 'orderDetail', query: { id, type, }, });
    },

    goSearchResult() {
      // if(!this.liveId) return this.$toast.fail(`直播礼包分类Id不存在!`);
      
      // this.$router.push({ name: 'searchResult', query: { id: this.liveId, }, });

      this.$router.push({ name: 'publicGoodsList' });
    },

    updateIndex(index) {
      this.index = index;
    },

    format(v){
      let arr = String(v.goods_price).split('.');

      v.priceInteger = arr[0];
      v.priceDecimal = arr[1];

      return v;
    },

    async getClassList() {
      let param = {},
          children;

      let res = await apiGoods.getClassList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取分类列表信息失败!')

      if(res && res.data){
        this.classList = res.data;
        if(res.data[0]) children = res.data[0].children;
        if(children && children[1]) children = children[1].children;
        // 直播礼包
        if(children && children[0]) this.liveId = children[0].storegc_id;
        // 超值期待
        if(children && children[1]){
          children = children[1].storegc_id;

          if(children) this.getGiftGoodsList(children);
        } 
      }
    },

    async getGiftGoodsList(gc_id) {
      let param = { gc_id };

      let res = await apiGoods.getGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取礼包信息失败!')

      if(res && res.data){
        res.data.forEach(this.format);
        this.giftList = res.data;
        // this.giftList = this.giftList.concat(this.giftList);
        // this.giftList = this.giftList.concat(this.giftList);
      }
    },

    async getAsset() {
      let param = {};

      let res = await apiCommon.getAsset(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取VIP商品信息失败!')

      if(res && res.data){
        this.liveImg = res.data;
      }
    },

  },

  created() {
    this.getClassList();

    this.init();
  },
};
</script>
<style lang='less' scoped>
.goods_list_wrap{
  box-sizing: border-box;
  flex-wrap: wrap;
  padding: 0 20px;
}
.goods_wrap{
  flex-shrink: 0;
}

.indicator_wrap{
  width: 100%;
  padding: 20px 0 0;
}
.indicator{
  width: 10px;
  height: 4px;
  margin: 0 10px 0 0;
}
.z_active{
  width: 30px;
}

.live_wrap{
  margin: 20px 0 0;
}

.i_live{
  width: 100%;
  height: 400px;
}

.s_fc_11{ color: #FF557A; }
.s_fc_12{ color: #FF0032; }
.s_fc_13{ color: #151212; }
.s_fc_14{ color: #E06F00; }
.s_fc_15{ color: #DD3D27; }

.s_bg_11{ background: #F5F5F5; }
.s_bg_12{ background: #373737; }
.s_bg_fa{ background: #fafafa; }
</style>