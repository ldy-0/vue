<template>
  <div class="page_wrap s_bg_f5">
    <!-- <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar> -->
    <title-bar :title="title" :bgColor="bgColor"></title-bar>
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <banner :config="bannerConfig"></banner>

      <!-- 第一个分类 -->
      <div class="first_wrap s_bg_f">
        <div class="title_wrap s_fc_2 ">
          <span>{{firstClass.storegc_name || ''}}</span>
          <!-- <span class="title_vice s_fc_15">限时、限量折扣礼包</span> -->
        </div>

        <div class="first_list_wrap flex">
            <div class='goods' v-for="(item, index) in firstList" :key="index" @click="goDetail(item)">
              <img class='goods_img' :src='item.goods_image' />

              <div class='goods_desc_wrap' v-if="item.goods_advword">
                <img class='goods_desc_bg' src='../../assets/images/global/desc_bg.png' />
                <div class='goods_desc s_fc_f'>{{item.goods_advword}}</div>
              </div>

              <div class='goods_name s_fc_17'>{{item.goods_name}}</div>

              <div class='goods_integral_wrap s_fc_16' v-if="item.goods_integral">
                <span class="goods_integral_pre s_fc_f s_bg_12">返</span><span class="goods_integral">{{item.goods_integral}}积分</span>
              </div>

              <div class='goods_price s_fc_16'>
                <img class='i_activity' :src='item.tag_image' v-if="item.tag_image" />
                <span class="price_wrap">￥<span class="price">{{item.priceInteger}}</span>.{{item.priceDecimal}}</span>
                <div class="sale_wrap s_fc_9">热销{{item.goods_salenum}}</div>
              </div>
            </div>
        </div>
      </div>

      <!-- 分类栏 -->
      <van-tabs class="status_bar_wrap" v-model="status" line-width="30px" :border="false"
                :color="isFixed ? '#fff' : '#4FB84A'"
                :title-active-color="isFixed ? '#fff' : '#4FB84A'" 
                :title-inactive-color="isFixed ? '#fff' : '#000'"
                :background="isFixed ? bgColor : '#fff'"
                @scroll="scroll"
                @change="changeStatus" v-if="classList.length">
        <van-tab :title="item.storegc_name" :name="item.storegc_id" v-for="(item, index) in classList" :key="index">

          <van-list class="list_wrap s_bg_f" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
            <div class="goods_list_wrap between">
              <goods :config="item" v-for="(item, index) in list" :key="index"></goods>
            </div>

          </van-list>

        </van-tab>
      </van-tabs>
        
    </van-pull-refresh>

    <goTop></goTop>
  </div>
</template>
<script>
import { Field, } from 'vant';
import * as math from 'mathjs';
import * as api from '@/api/common';
import * as apiUser from '@/api/user';
import * as apiGoods from '@/api/goods';
import * as Type from '@/utils/type';
import * as gd from '@/utils/global';
import titleBar from '@/components/header.vue';
import banner from '@/components/banner.vue';
import goTop from '@/components/goTop.vue';
import goods from '@/components/goods/goods.vue';

export default {
  components: {
    [Field.name]: Field,
    titleBar,
    banner,
    goods,
    goTop,
  },

  data() {
    return {
      bannerConfig: {
        bgImg: null,
      },

      configInfo: {},
      bgColor: '',

      type: '',
      status: -1,
      refreshing: false,
      loading: false,
      finished: false,
      isFixed: false,

      classObj: {},
      classList: [],
      firstClass: {},
      firstList: [], // 第一个分类商品列表

      page: 1,
      limit: 10,
      total: 0,
      list: [],
    };
  },

  computed: {
    title() { return this.classObj.storegc_name; },

    isBack() { return this.$route.meta.isBack; },

    isVip(){ return this.status === 1; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;
      this.id = query.id;
      
      this.clear(true);
      this.getClassList();
    },

    goDetail(item) {
      let id = item.goods_commonid;

      this.$router.push({ name: 'goodsDetail', query: { id, } });
    },

    changeStatus() {
      this.clear();

      this.getList();
    },

    onRefresh(e) {
      this.clear(true);

      this.loading = true;

      this.getClassList();
    },

    onLoad(e) {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      this.getList();
    },

    format(v){
      let arr = String(v.goods_price).split('.');

      v.priceInteger = arr[0];
      v.priceDecimal = arr[1];

      return v;
    },

    async getConfig() {
      let param = {};

      let res = await api.getConfig(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取背景配置信息失败!')

      if(res && res.data){
        this.configInfo = res.data;
        this.bgColor = res.data.color.bgColor;
        this.bannerConfig.bgImg = res.data.img.home.url;
      }
    },

    async getList() {
      if(this.status == -1) return ;

      let param = { page: this.page, limit: this.limit, is_vip: 0, type: "sort", gc_id_2: this.status, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.getGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取商品信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.list.lenght;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    async getFirstList() {
      let id = this.firstClass.storegc_id;
      if(!id) return ;

      let param = { page: this.page, limit: 6, is_vip: 0, type: "sort", gc_id_2: id, };

      let res = await apiGoods.getGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取第一个分类商品信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.firstList.push(this.format(v)));
      }

    },

    async getClassList() {
      let param = {};

      let res = await apiGoods.getClassList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取分类列表失败!')

      if(res && res.data){
        this.classObj = res.data.filter(v => v.storegc_id == this.id)[0];
        this.classList = this.classObj.children || [];
        this.firstClass = this.classList.shift() || {};
        if(this.classList[0]) this.status = this.classList[0].storegc_id;

        this.getFirstList();
        this.getList();
      }

      this.loading = this.refreshing = false;
    },

    clear(deep) {
      this.list = [];
      this.page = 1;
      this.finished = false;

      if(deep){
        this.firstList = [];
        scrollTo(0, 0);
      }
    },

    goBack() {
      this.$router.back();
    },

    scroll(e) {
      this.isFixed = e.isFixed;
    },
  },

  activated() {
    if(this.isBack) return ;

    this.getConfig();
    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  min-height: 100vh;
}

.first_wrap{
  margin: 30px 20px 0;
  padding: 30px 0px 40px 20px;
  border-radius: 20px;
}

.status_bar_wrap{
  margin: 30px 0 0;
  z-index: 1;
}

.list_wrap{
  min-height: 100vh;
}

.title_wrap{
  height: 80px;
  padding: 0 30px 0 0;
  line-height: 80px;
  font-size: 36px;
  letter-spacing: 4px;
  font-weight: bold;
}
.title_vice{
  margin: 0 0 0 35px;
  font-size: 30px;
  font-weight: normal;
}

.goods_list_wrap{
  flex-wrap: wrap;
  padding: 0 20px; 
}

.first_list_wrap{
  flex-wrap: wrap;
}
.goods{
  position: relative;
  width: 206px;
  margin: 10px 20px 0 0;
}
.goods_img{
  flex-shrink: 0;
  width: 206px;
  height: 206px;
  border-radius: 20px;
}
.goods_info{
  flex-grow: 1;
  align-self: flex-start;
  margin-left: 20px;
}
.goods_name{
  margin: 20px 0 0;
  font-size: 28px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.goods_integral_wrap{
  margin: 8px 0 0;
  font-size: 22px; 
}
.goods_integral_pre{
  padding: 2px 4px;
}
.goods_integral{
  padding: 0 4px;
  border: 1px solid #FF0032;
}
.goods_price_wrap{
  margin: 50px 0 0;
}
.goods_price{
  margin: 15px 0 0;
  font-size: 24px;
}
.price_wrap{
  margin: 0 10px 0 0;
}
.price{
  font-size: 30px;
}
.sale_wrap{
  margin: 2px 0 0;
  font-size: 24px;
}
.goods_desc_wrap{
  position: absolute;
  top: 0;
  left: 10px;
  z-index: 1;
  width: 56px;
  height: 81px;
}
.goods_desc_bg{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.goods_desc{
  font-size: 22px;
  text-align: center;
}

.i_activity{
  position: relative;
  top: 4px;
  width: 68px;
  height: 34px;
  margin: 0 10px 0 0;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #494949; }
.s_fc_15{ color: #3f3f3f; }
.s_fc_16{ color: #FF0032; }
.s_fc_17{ color: #151212; }

.s_bg_11{ background: #FC6B76; }
.s_bg_12{ background: #FF0032; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
.van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}

.van-tabs__wrap--scrollable .van-tab{
  flex: 0 0 20% !important;
}
.van-tabs__line{
  background: #FF557A;
}

.van-sticky--fixed{
  top: 88px;
} 
</style>