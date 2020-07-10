<template>
  <div class="sku_wrap">

    <div class="s_bg_f">
      <div class="goods_info_wrap flex">
        <img class="i_goods s_bg_f" :src="config.goods_image" />

        <div class="ml20">
          <div class="goods_name fs32 s_fc_3">{{config.goods_name}}</div>

          <div class='price_wrap s_fc_6'>
            <span class="s_fc_12">¥<span class="price fs40">{{minPriceArr[0]}}</span>.{{minPriceArr[1]}}</span>
            <span class="s_fc_12" v-if="minPrice != maxPrice"> - ¥<span class="price fs40">{{maxPriceArr[0]}}</span>.{{maxPriceArr[1]}}</span>
            
            <span class="marketprice ml20 fs24 s_fc_14">¥<span class="price">{{marketpriceArr[0]}}</span>.{{marketpriceArr[1]}}</span>

            <span class='stock_wrap ml20 fs24 s_fc_4'>库存：{{stock}}</span>
          </div>
        </div>

        <van-icon class="i_delete" name="cross" size="16" @click="close"></van-icon>
      </div>

      <div class="spec_wrap s_fc_2">
        <div v-if="isMultiSku">
          <div class="spec_title">规格</div>

          <div class="spec">

            <div class="" v-for="(item, index) in attrList" :key="index">
              <div class="spec_name fs24">{{item.name}}</div>

              <div class="spec_value_wrap flex">
                <div class="spec_value" :class="[ item.index === i ? 'z_sel s_fc_f s_bg_11' : v.status === UN_CHECK ? 's_bg_2 s_bg_f' : 's_fc_16 s_bg_f8']" v-for="(v, i) in item.children" :key="i" @click="change(index, i)">
                  <div>{{v.name}}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="amount_wrap between s_fc_2">
        <div class="amount_title">购买数量</div>

        <div class="amount flex">
          <div class="minus fs40" :class="{ s_bg_f8: amount <= 1 }" @click="changeAmount(-1)">-</div>
          <div class="amount_ctn">{{amount}}</div>
          <div class="add fs40" @click="changeAmount(1)">+</div>
        </div>
      </div>

      <div class="btn_wrap s_fc_f flex">
        <div class="md_btn s_bg_14" v-if="showShopping" @click="submit(0)">加入购物车</div>
        <div class="md_btn s_bg_11" :class="{ big_btn: !showShopping }" @click="submit(1)">立即购买</div>
      </div>
    </div>

  </div>
</template>
<script>
import * as apiCommon from '@/api/common';
import * as apiGoods from '@/api/goods';
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
      UN_CHECK: 1,
      CHECK: 2,
      DISABLED: 3,

      doing: false,

      pricekey: 'goods_price', // 价格名

      minPrice: 0,
      maxPrice: 0,
      amount: 1, // 购买数量
      sku: null,
      attrList: [],
    };
  },

  computed: {
    isPublicGoods(){ return this.config.type === gd.NORMAL_GOODS; },
    isVipGoods(){ return this.config.type === gd.VIP_GOODS; },
    isNewPeople(){ return this.config.type === gd.NEW_GOODS; },
    isNormalGoods(){ return this.isPublicGoods || this.isVipGoods; },
    isStoreGoods(){ return this.config.store_id != gd.MAIN_STORE; },

    isMultiSku(){ return this.config.spec_name; },
    showShopping(){ 
      if(this.isStoreGoods || this.isNewPeople) return false;

      return this.isVipGoods || this.isPublicGoods && this.config.use_coupon == gd.USE_COUPON;
    },

    minPriceArr(){ return String(this.minPrice).split('.'); },
    maxPriceArr(){ return String(this.maxPrice).split('.'); },
    marketpriceArr(){ return String(this.marketprice).split('.'); },
    
    marketprice(){ return this.sku ? this.sku.goods_marketprice : this.config.goods_marketprice; },
    stock(){ return this.sku ? this.sku.goods_storage : this.config.goods_storage; },
    skuStr(){ return this.isMultiSku ? this.attrList.filter(v => v.index !== -1).map(v => v.children[v.index].name).join('; ') : '统一规格'; },
  },

  watch: {
    config(n, o){ this.init(); },
  },

  methods: {
    close(){ this.$emit('close'); },

    init() {
      let arr = this.config.spec_name,
          vArr = this.config.spec_value;

      if(this.isNewPeople) this.pricekey = 'newcomer_price';

      if(this.isMultiSku){
        this.attrList = arr.map((v, i) => ({ name: v, index: -1, children: vArr[i].map(vv => ({ name: vv, status: this.UN_CHECK, })), }));

        this.inspect();
      }else{
        this.sku = this.config.SKUList[0];
        this.minPrice = this.maxPrice = this.sku[this.pricekey];
      }

    },

    change(i, j) {
      let item = this.attrList[i];
      if(item.children[j].status === this.DISABLED) return ;

      item.index = item.index === j ? -1 : j;
      this.inspect();
    },

    changeAmount(v) {
      if(v < 0 && this.amount <= 1) return ;

      this.amount += v;
    },

    submit(isBuy) {
      if(!this.sku) return this.$toast.fail(`请选择规格!`);
      
      if(this.sku.goods_storage < this.amount) return this.$toast.fail(`库存不足!`);

      if(isBuy){
        this.sku.goods_num = this.amount;
        return this.$router.push({ name: 'submitOrder', params: { sku: this.sku, }, });
      }

      this.addCart();
    },

    async addCart() {
      let param = { 
        goods_id: this.sku.goods_id, 
        quantity: this.amount,
      };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.addCart(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '添加失败!')

      if(res && res.data){
        this.$toast.success(`添加成功!`);
        this.$emit('updateCart');
      }

      this.$toast.clear();
    },

    // 检查库存
    inspect() {
      let list = this.attrList,
          arr, goodsArr, name, isAll;

      goodsArr = this.filter(this.createArray());
      this.minPrice = Math.min.apply(null, goodsArr.map(v => v[this.pricekey])).toFixed(2);
      this.maxPrice = Math.max.apply(null, goodsArr.map(v => v[this.pricekey])).toFixed(2);
      this.sku = this.attrList.every(v => v.index !== -1) ? goodsArr[0] : null;

      for(let i = list.length - 1; i >= 0; i--) {
        var item = list[i];

        for(var j = item.children.length - 1; j >= 0; j--){
          arr = this.createArray();
          name = item.children[j].name;
          isAll = arr[i].v === name && arr.every(v => v.v);
          arr[i].v = name;

          goodsArr = this.filter(arr, isAll);
          item.children[j].status = goodsArr.length ? this.UN_CHECK : this.DISABLED;
        }
      }
    },

    // 过滤无库存商品
    filter(arr, isAll) {
      let goodsList = this.config.SKUList;

      goodsList = goodsList.filter(v => arr.every(vv => v.goods_spec[vv.k] === vv.v || !vv.v));
      
      return goodsList.filter(v => v.goods_storage);
    },

    createArray() {
      let arr = this.attrList;

      return arr.map((v, i) => ({ k: v.name, v: v.index === -1 ? null : v.children[v.index].name, }));
    },

  },

  created() {
    this.init();
  },

};
</script>
<style lang='less' scoped>
.sku_wrap{
  font-size: 28px;
}
.goods_info_wrap{
  padding: 0 30px;
  font-size: 28px;
  word-break: break-all;
}
.goods_name{
  width: 400px;
  margin: 20px 0;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.marketprice{
  text-decoration: line-through;
}

.spec_wrap{
  padding: 0 30px;
}
.spec_title{
  padding: 0 30px 30px 0;
}
.spec{
  height: 200px;
  overflow-x: auto;
}
.spec_name{
  height: 56px;
  line-height: 56px;
  font-weight: bold;
}
.spec_value_wrap{
  flex-wrap: wrap;
  padding-bottom: 30px;
  border-bottom: 1px solid #F0F0F0; 
  text-align: center;
}
.spec_value{
  min-width: 120px;
  height: 56px;
  margin: 0 40px 10px 0;
  padding: 0 10px;
  line-height: 56px;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
}
.z_sel{
  border: 1px solid transparent;
}

.amount_wrap{
  padding: 30px;
  align-items: center;
}
.amount_title {
}
.amount{
  height: 64px;
  line-height: 64px;
  border: solid 1px #d3d3d3;
  border-radius: 5px;
  text-align: center;
}
.amount_ctn{
  width: 120px;
  font-size: 26px;
  border-left: 1px solid #d3d3d3;
  border-right: 1px solid #d3d3d3;
}
.add, .minus{
  width: 80px;
}

.btn_wrap{
  align-items: center;
  padding: 0 30px 10px;
}
.md_btn{
  width: 330px;
  text-align: center;
  height: 76px;
  line-height: 76px;
  border-radius: 10px;
  margin-right: 20px;
}
.big_btn{
  width: 100%;
}

.i_goods{
  position: relative;
  top: -34px;
  flex-shrink: 0;
  align-self: flex-start;
  width: 180px;
  height: 180px;
  border-radius: 20px;
}
.i_delete{
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
  padding: 30px;
}

.ml10{ margin-left: 10px; }
.ml20{ margin-left: 20px; }

.fs24{ font-size: 24px; }
.fs32{ font-size: 32px; }
.fs40{ font-size: 40px; }

.s_fc_11{ color: #FF557A; }
.s_fc_12{ color: #FF0032; }
.s_fc_13{ color: #151212; }
.s_fc_14{ color: #636363; }
.s_fc_15{ color: #4FB84A; }
.s_fc_16{ color: #dcdcdc; }

.s_bg_11{ background: #4FB84A; }
.s_bg_12{ background: #FFF0D5; }
.s_bg_13{ background: #FFE9E9; }
.s_bg_14{ background: #3a3a47; }

.s_bg_fa{ background: #fafafa; }
.s_bg_f8{ background: #f8f8f8; }
</style>
