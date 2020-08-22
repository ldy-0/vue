<template>
  <div class="page_wrap s_bg_f5">
    <!-- <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar> -->
    <title-bar :title="title" :bgColor="bgColor"></title-bar>
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <banner :config="bannerConfig"></banner>

      <!-- 二级分类 -->
      <div class="class_wrap flex s_bg_f">
        <div class="class_item" v-for="(item, index) in classList" :key="index" @click="goClass(item)">
          <img class="i_class" :src="item.storegc_pic" alt="">
          <div class="class_title">{{item.storegc_name}}</div>
        </div>
      </div>

      <!-- 店铺 -->
      <div class="store" @click="goStore" v-if="configInfo.img">
        <img class="store_img1" :src="configInfo.img.store.url" alt="">
      </div>
      <!-- coupon -->
      <!-- <couponList ref="coupon" :config="couponConfig"></couponList> -->

      <!-- 新品速递 -->
      <div class="first_wrap s_bg_f">
        <div class="title_wrap between s_fc_2 " @click="goGoodsList">
          <div>{{newGoods.title || ''}}</div>

          <div class="more_btn flex">
            <span class="s_fc_2">更多</span>
            <van-icon name="arrow" size="16" color="#999"></van-icon>
          </div>
        </div>

        <div class="first_list_wrap flex">
            <div class='goods' v-for="(item, index) in newList" :key="index" @click="goDetail(item)">
              <img class='goods_img' :src='item.goods_image' />

              <div class='goods_desc_wrap' v-if="item.goods_advword">
                <img class='goods_desc_bg' src='../../assets/images/global/desc_bg.png' />
                <div class='goods_desc s_fc_f'>{{item.goods_advword}}</div>
              </div>

              <div class='goods_name s_fc_17'>{{item.goods_name}}</div>

              <div class='goods_integral_wrap s_fc_16' v-if="item.goods_integral">
                <span class="goods_integral_pre s_fc_f s_bg_12">返</span><span class="goods_integral">{{item.goods_integral}}积分</span>
              </div>

              <div class='goods_price flex s_fc_16'>
                <img class='i_activity' :src='item.tag_image' v-if="item.tag_image" />
                <span class="price_wrap">￥<span class="price">{{item.priceInteger}}</span>.{{item.priceDecimal}}</span>
                <div class="sale_wrap s_fc_9">热销{{item.goods_salenum}}</div>
              </div>
            </div>
        </div>
      </div>

      <!-- 今日疯抢 -->
      <div class="first_wrap s_bg_f">
        <div class="title_wrap between s_fc_2">
          <div>今日疯抢</div>
        </div>

        <div class="first_list_wrap">
            <div class='goods flex' v-for="(item, index) in todayList" :key="index" @click="goDetail(item)">
              <div>
                <img class='goods_img' :src='item.goods_image' />

                <div class='goods_desc_wrap' v-if="item.goods_advword">
                  <img class='goods_desc_bg' src='../../assets/images/global/desc_bg.png' />
                  <div class='goods_desc s_fc_f'>{{item.goods_advword}}</div>
                </div>
              </div>
              
              <div class="goods_info">
                <div class='goods_name today_goods_name s_fc_17'>{{item.goods_name}}</div>

                <div class='goods_integral_wrap s_fc_16' v-if="item.goods_integral">
                  <span class="goods_integral_pre s_fc_f s_bg_12">返</span><span class="goods_integral">{{item.goods_integral}}积分</span>
                </div>

                <div class="sale_wrap s_fc_16">热卖{{item.goods_salenum}}</div>

                <div class="between">
                  <div class='goods_price flex s_fc_16'>
                    <img class='i_activity' :src='item.tag_image' v-if="item.tag_image" />
                    <span class="price_wrap">￥<span class="price">{{item.priceInteger}}</span>.{{item.priceDecimal}}</span>
                  </div>

                  <div class="buy_btn s_fc_f s_bg_12">去抢购</div>
                </div>
                
              </div>
              
            </div>
        </div>
      </div>

      <!-- 猜你喜欢 -->
      <div>
        <div class="title_wrap like_title_wrap s_fc_2">
          <div>猜你喜欢</div>
        </div>

        <van-list class="list_wrap s_bg_f" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
          <div class="goods_list_wrap between">
            <goods :config="item" v-for="(item, index) in list" :key="index"></goods>
          </div>
        </van-list>
      </div>
      
        
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
import valid from '@/utils/valid';
import titleBar from '@/components/header.vue';
import banner from '@/components/banner.vue';
import goTop from '@/components/goTop.vue';
import goods from '@/components/goods/goods.vue';
import couponList from '@/components/goods/couponList.vue';

export default {
  components: {
    [Field.name]: Field,
    titleBar,
    goTop,
    banner,
    goods,
    couponList,
  },

  data() {
    return {
      bannerConfig: {
        isSmall: true,
        bgImg: null,
      },

      configInfo: {},
      bgColor: '',

      couponConfig: {
        
      },

      type: '',
      status: -1,
      refreshing: false,
      loading: false,
      finished: false,
      isFixed: false,

      classObj: {},
      classList: [],
      newGoods: {
        title: '新品速递',
      },
      newList: [], // 新品速递 
      todayList: [], // 今日疯抢

      page: 1,
      limit: 10,
      total: 0,
      list: [],
    };
  },

  computed: {
    title() { return this.configInfo.menus ? this.configInfo.menus[1].appName: '购购商城'; },

    isBack() { return this.$route.meta.isBack; },

    isVip(){ return this.status === 1; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;
      
      this.clear(true);

      this.getClassList();
      this.getGoodsList();
    },

    goClass(item) {
      let id = item.storegc_id;

      this.$router.push({ name: 'classGoodsList', query: { id, }, });
    },

    goGoodsList() {
      this.$router.push({ name: 'mainGoodsList', query: {}, });
    },

    goDetail(item) {
      let id = item.goods_commonid;

      this.$router.push({ name: 'goodsDetail', query: { id, } });
    },

    goStore() {
      if(!valid.isAuth()) return this.$router.push({ name: 'login', });

      this.$router.push({ name: 'storeList', })
    },

    onRefresh(e) {
      this.clear(true);

      this.loading = true;

      this.getConfig();
      this.getClassList();
      this.getGoodsList();

      // this.$refs.coupon.getList();
    },

    onLoad(e) {
      console.log(this.total, this.page);
      if(this.total <= (this.page++ - 1) * this.limit) return this.finished = true;

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
      let param = { page: this.page, limit: this.limit, is_vip: 0, rand: 1, };
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

    async getGoodsList() {
      let param = { page: 1, limit: 9, rand: 1, is_vip: 0, only_app: 1, };

      let res = await apiGoods.getGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取商品信息失败!')

      if(res && res.data){
        res.data.forEach(this.format);
        this.newList = res.data.slice(0, 6);
        this.todayList = res.data.slice(6, 9);
        this.list = res.data.slice(9);
      }

    },

    async getClassList() {
      let param = { parent_id: 0, };

      let res = await apiGoods.getClassList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取分类列表失败!')

      if(res && res.data){
        this.classList = res.data;
      }

      this.loading = this.refreshing = false;
    },

    clear(deep) {
      this.list = [];
      this.page = 1;
      this.finished = false;

      if(deep){
        this.classList = [];
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

.class_wrap{
  flex-wrap: wrap;
  margin: 30px 20px 0;
  padding: 20px;
  border-radius: 20px;
}
.class_item{
  flex-basis: 20%;
  margin: 20px 0 0;
  text-align: center;
}
.class_title{
  font-size: 22px;
}

.first_wrap{
  margin: 30px 20px 0;
  padding: 10px 0px 40px 20px;
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
  align-items: center;
  height: 80px;
  padding: 0 30px 0 0;
  font-size: 36px;
}
.like_title_wrap{
  padding: 0 40px;
  line-height: 80px;
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
  margin: 10px 22px 0 0;
}
.goods_img{
  flex-shrink: 0;
  width: 206px;
  height: 206px;
  border-radius: 20px;
}
.goods_info{
  flex-grow: 1;
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
  margin: 15px 0 0;
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
  flex-wrap: wrap;
  align-items: center;
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
  margin: 8px 0 0;
  font-size: 22px;
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

.today_goods_name{
  width: 450px;
  font-size: 36px;
  font-weight: normal;
}

.more_btn{
  align-items: center;
  padding: 10px 10px 10px 20px;
  font-size: 28px;
  border-radius: 25px;
  background: #F5F5F5;
}
.buy_btn{
  width: 160px;
  height: 80px;
  line-height: 80px;
  font-size: 32px;
  text-align: center;
  border-radius: 10px;
}

.store {
  width: 702px;
  height: 180px;
  margin: 0 auto;
  margin-top: 15px;
  .store_img1 {
    width: 100%;
    height: 100%;
  }
  .store_img2 {
    width: 100%;
    height: 50px;
  }
}

.i_class{
  width: 88px;
  height: 88px;
  border-radius: 20px;
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