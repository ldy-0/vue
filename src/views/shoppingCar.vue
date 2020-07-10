<template>
  <div class="page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">

      <div class="empty_wrap s_fc_14" v-if="isEmpty">
        <img class="i_empty" src="../assets/images/empty.png" />
        <div class="empty_desc">您的购物车有点寂寞</div>
        <div class="go_btn s_fc_13" @click="goClass">去逛一下</div>
      </div>
      <div v-else>

        <div class="top_bar_wrap between s_fc_0 s_bg_f">
          <div @click="checkAll">全选</div>

          <div @click="changeStatus">{{isEditing ? "完成" : "编辑"}}</div>
        </div>

        <van-list class="list_wrap s_bg_f" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">

          <van-checkbox-group v-model="result" ref="checkboxGroup" @change="changeCheck">
            <div class="goods_wrap flex" v-for="(item, index) in list" :key="index">
              <van-checkbox class="i_checkbox" :name="index" checked-color="#4FB84A" icon-size="20"></van-checkbox>

              <div class="goods_img_wrap" @click="goGoodsDetail(item)">
                <img class="goods_img" :src="item.goods_image" >
                <img class='i_vip' src='../assets/images/goods/vip.png' v-if="item.is_vip" />
              </div>

              <div class="goods_info_wrap">
                <div ref="scroll" class="goods_name">{{item.goods_name}}</div>

                <div class="spec_wrap s_fc_9">{{item.specStr}}</div>

                <div class="price_wrap s_fc_16">
                  <span class="">¥</span>
                  <span class="goods_price">{{item.goods_price}}</span>
                </div>

                <div class="goods_num_wrap flex">
                  <div class="minus" :class="{ s_bg_f8: item.goods_num <= 1 }" @click="minus(item)">-</div>
                  <div class="goods_num s_fc_3">{{item.goods_num}}</div>
                  <div class="add" @click="add(item)">+</div>
                </div>
              </div>

            </div>
          </van-checkbox-group>
          
        </van-list>

        <div class="bottom_bar_wrap flex s_bg_f">
          <div class="delete_btn" @click="del" v-if="isEditing">删除</div>

          <div class="submit_btn_wrap between" v-else>
            <div class="amount_wrap">
              <span>应付合计： </span>
              <span class='s_fc_16'>¥</span>
              <span class='amount s_fc_16'>{{payPriceArr[0]}}</span>
              <span class='s_fc_16'>.{{payPriceArr[1] || '00'}}</span>
            </div>

            <div class="submit_btn s_fc_f s_bg_13" @click="goSubmit">提交订单</div>
          </div>
        </div>
      </div>

    </van-pull-refresh>
  </div>
</template>
<script>
import { Field, } from 'vant';
import * as math from 'mathjs';
import * as api from '@/api/common';
import * as apiUser from '@/api/user';
import * as apiGoods from '@/api/goods';
import * as apiOrder from '@/api/order';
import activityGoods from '@/components/goods/activityGoods.vue';
import * as Type from '@/utils/type';
import * as gd from '@/utils/global';
import valid from '@/utils/valid';

export default {
  components: {
    [Field.name]: Field,
    activityGoods,
  },

  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
      
      isEditing: false,

      page: 1,
      limit: 10,
      total: 0,
      payPrice: 0,

      list: [],
      result: [],
    };
  },

  computed: {
    title() { return '购物车'; },

    isEmpty(){ return !this.list.length; },
    isCheckAll(){ return this.result.length == this.list.length; },
    isBack() { return this.$route.meta.isBack; },

    cartIdList(){ return this.result.map(v => `${this.list[v].cart_id}|${this.list[v].goods_num}`); },

    payPriceArr(){ return String(this.payPrice).split('.'); },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;
      this.isEditing = false;
      this.result = [];
      this.payPrice = 0;

      if(!valid.isAuth()) return ;

      this.clear();
      this.getList();
    },

    goSubmit() {
      let list = this.list,
          result = this.result;

      if(!result.length) return this.$toast.fail(`还没有选中任何商品！`);
      
      if(result.filter(i => list[i].is_vip).length && result.filter(i => !list[i].is_vip).length) return ;

      this.$router.push({ name: 'submitOrder', params: { skuList: result.map(i => list[i]) }, });
    },

    checkAll() {
      this.$refs.checkboxGroup.toggleAll(!this.isCheckAll);
    },

    changeCheck(result) {
      let list = this.list;
      this.checkout();
    },

    changeStatus(){
      this.isEditing = !this.isEditing;
    },

    minus(item) {
      if(item.goods_num <= 1) return ;

      this.changeCart(item, item.goods_num - 1);
    },

    add(item) {
      this.changeCart(item, item.goods_num + 1);
    },

    async del() {
      let result = this.result,
          res;
      
      if(this.isCheckAll){
        res = await apiGoods.deleteCart(0);
        if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '删除失败!');

        return this.getList(this.clear());
      }

      for(let i = result.length - 1; i >= 0; i--){
        res = await apiGoods.deleteCart(this.list[result[i]].cart_id); 
        if(!res || typeof res === 'string' || res.error) this.$toast.fail(res ? res.error || res : '删除失败!');
      }
    },

    async checkout() {
      if(!this.cartIdList.length) return this.payPrice = 0;

      let param = { 
        cart_id: this.cartIdList,
        ifcart: 1,
        is_pintuan: 0,
        voucher_list: [],
      };

      let res = await apiOrder.checkout(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '结算失败!')

      if(res && res.data){
        this.payPrice = Object.keys(res.data.store_final_order_total).reduce((p, k) => math.add(p, res.data.store_final_order_total[k]), 0).toFixed(2);
      }

    },

    async deleteCart() {
      let param = { cart_id: item.cart_id, quantity: num, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.changeCart(item.cart_id, param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取购物车信息失败!')

      if(res && res.data){
        item.goods_num = num;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    async changeCart(item, num) {
      let param = { cart_id: item.cart_id, quantity: num, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.changeCart(item.cart_id, param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取购物车信息失败!')

      if(res && res.data){
        item.goods_num = num;
        this.checkout();
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    onRefresh(e) {
      this.clear();

      this.loading = true;

      this.getList();
    },

    onLoad(e) {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      this.getList();
    },

    format(v) {
      v.specStr = v.goods_spec ? Object.keys(v.goods_spec).map(k => v.goods_spec[k]).join('; ') : '统一规格';

      return v;
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.getShoppingCartList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取购物车信息失败!')

      if(res && res.data){
        let storeList = res.data.store_cart_list,
            list = storeList && storeList[1] ? storeList[1] : [];

        list.forEach(this.format);
        this.list =  list;
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    clear() {
      this.list = [];
      this.page = 1;
      this.finished = false;

      scrollTo(0, 0);
    },

    goGoodsDetail(item) {
      let id = item.goods_commonid;

      this.$router.push({ name: 'goodsDetail', query: { id }, });
    },

    goClass() {
      this.$router.push(`/classify`);
    },

    goBack() {
      this.$router.back();
    },

  },

  activated() {
    if(this.isBack) return ;

    this.init();
  },

};
</script>
<style lang='less' scoped>
.page_wrap{
  min-height: 100vh;
  padding: 128px 0 0;
  font-size: 28px;
}

.top_bar_wrap{
  padding: 0 20px;
  line-height: 88px;
}

.list_wrap{
  padding: 0 20px;
}

.empty_wrap{
  padding-top: 290px;
  text-align: center; 
  font-size: 26px;
}
.empty_desc{
  margin: 20px 0 0;
}
.go_btn{
  width: 210px;
  height: 66px;
  margin: 0 auto;
  margin-top: 100px;
  border-radius: 8px;
  line-height: 66px;
  border: solid 1px #4fb84a;
  font-size: 28px;
}

.goods_wrap{
  padding: 0 0 20px 0;
}
.goods_img_wrap{
  position: relative;
  margin: 0 0 0 20px;
}
.goods_img{
  width: 180px;
  height: 180px;
  border-radius: 10px;
}
.goods_info_wrap{
  width: 446px;
  margin: 0 0 0 30px;
}
.goods_name{
  height: 40px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.spec_wrap{
  margin: 10px 0 0;
  font-size: 24px;
}
.price_wrap{
  margin: 10px 0 0;
  font-size: 26px;
}
.goods_price{
  font-size: 32px;
}
.goods_num_wrap{
  justify-content: flex-end;
  height: 64px;
  line-height: 64px;
  border-radius: 5px;
  text-align: center;
}
.minus, .add {
  width: 80px;
  font-size: 40px;
  border: 1px solid #d3d3d3;
}
.goods_num{
  width: 120px;
  border-top: 1px solid #d3d3d3;
  border-bottom: 1px solid #d3d3d3;
}

.bottom_bar_wrap{
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  position: fixed;
  bottom: 100px;
  width: 100%;
  height: 100px;
  padding: 0 20px;
  color: #282425;
}
.amount_wrap{
  flex-grow: 1;
  text-align: right;
  padding: 0 20px;
}
.amount{
  font-size: 32px;
}
.submit_btn_wrap{
  align-items: center; 
  height: 100%;
}
.submit_btn {
  width: 160px;
  height: 70px;
  line-height: 70px;
  border-radius: 10px;
  text-align: center;
}
.delete_btn {
  align-items: center;
  width: 100px;
  height: 44px;
  border: 1px solid #282425;
  border-radius: 10px;
  text-align: center;
}

.i_checkbox{
  flex-shrink: 0;
  width: 42px;
}
.i_vip{
  position: absolute;
  top: 0;
  left: 0;
  width: 70px;
  height: 70px;
  border-radius: 10px;
}
.i_empty{
  width: 203px;
  height: 122px;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #848484; }
.s_fc_15{ color: #3f3f3f; }
.s_fc_16{ color: #dd3d27; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #4FB84A; }

.s_bg_f8{ background: #f8f8f8; }
</style>
<style>
</style>