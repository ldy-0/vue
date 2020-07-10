<style lang="less" scoped>
.module {
  margin: 0 auto;
  width: 702px;
  height: 280px;
  // border-radius: 20px;
  overflow: hidden;
  .module_item {
    height: 140px;
  }
  .module_icon {
    width: 70px;
    height: 70px;
  }
  .module_text {
    font-size: 22px;
    color: #333;
  }
}

.scroll_wrap{
  overflow-x: auto;
}

.all_title{
  padding: 30px 20px;
  font-size: 32px;
  font-weight: bold;
}
.all_store_wrap{
  margin: 20px 0 0;
}

.recommend_wrap{
  margin: 20px 20px 0;
  border-radius: 20px;
}
.recommend_list_wrap{
}
.recommend_store_wrap{
  width: 240px;
  overflow: hidden;
}
.recommend_store{
  padding: 0 10px 0 0;
}
.recommend_title{
  padding: 20px 0;
}
.recommend_info_wrap{
  box-sizing: border-box;
  padding: 20px 0;
  font-size: 24px;
  text-align: center;
}
.store_title{
  width: 230px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recommend_class{
  margin: 10px 0 0;
}
.i_recommend{
  width: 230px;
  height: 230px;
}


.ml10{ margin-left: 10px; }

.s_fc_16{ color: #FF0032; }
.s_fc_11{ color: #FF0000; }

.s_bg_11{ background: #FFECEC; }
.s_bg_12{ background: #FF0032; }
</style>
<style lang="less">
.home .goods .van-tab__text {
  font-size: 30px;
}

.home .goods .van-tabs__wrap {
  background: #fff;
}
.home .goods .van-tab--active .van-tab__text {
  font-size: 32px;
  font-weight: 600;
}
.home .goods .van-tabs__nav--line {
  padding-bottom: 20px;
}
.home .goods .van-tabs__line {
  width: 30px !important;
}
.home .goods .van-tabs--line .van-tabs__wrap {
  height: 102px !important;
}
.home .goods .van-sticky--fixed {
  top: 88px !important;
}

.store_list_page_wrap .van-grid-item__content{
  padding: 0;
}
</style>
<template>
  <div class="store_list_page_wrap">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <header-bar :title="title" :bgColor="bgColor"></header-bar>

      <banner :config="bannerConfig"></banner>

      <!-- 分类 -->
      <div class="module s_bg_f">
        <van-grid :column-num="5" :border="false">
          <van-grid-item class="module_item" v-for="(value,index) in classList" :key="index" @click="goClass(value, index)">
            <img class="module_icon" slot="icon" :src="value.storeclass_pic" />
            <div class="module_text" slot="text">{{value.storeclass_name}}</div>
          </van-grid-item>
        </van-grid>
      </div>
      
      <div class="recommend_wrap s_bg_f">
        <div class="all_title recommend_title s_fc_3">今日推荐</div>

        <van-swipe class="recommend_list_wrap" :autoplay="2000" :width="120" :show-indicators="false" :stop-propagation="false">
          <van-swipe-item class="recommend_store_wrap" v-for="(item, index) in recommendList" :key="index">

            <div class="recommend_store" @click="goStore(item)">
              <img class="i_recommend" :src="item.store_avatar" />
              <div class="recommend_info_wrap s_bg_11">
                <div class="store_title">{{item.store_name}}</div>
                <div class="recommend_class s_fc_11">{{item.storeclass.storeclass_name}}</div>
              </div>
            </div>

          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="all_wrap">
        <div class="all_title s_fc_3">全部店铺</div>

        <van-list :immediate-check="false" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div class="all_list_wrap">
            <store class="all_store_wrap s_bg_f" :config="item" v-for="(item, index) in list" :key="index"></store>
          </div>
        </van-list>
      </div>
     
    </van-pull-refresh>
    <go-top></go-top>
  </div>
</template>

<script>
import { NavBar, Search, Tag, Lazyload, Grid, GridItem, PullRefresh, Divider } from 'vant';
import goTop from '@/components/goTop.vue';
import HeaderBar from '@/components/headerBar.vue';
import banner from '@/components/banner.vue';
import store from '@/components/store/store.vue';
import request from '@/utils/request';
import * as api from '@/api/common';
import * as apiStore from '@/api/store';
import * as gd from '@/utils/global';
import * as app from '@/utils/app';
import valid from '@/utils/valid';
export default {
  data() {
    return {
      configInfo: {},
      bgColor: null,
      bannerConfig: {
        isSmall: true,
        bgImg: null,
      },
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
      },

      classList: [],
      recommendList: [],

      list: [],
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
      finished: false,

      isLoading: false,
      customcatalogIndex: 0,
      goodsList: [],
      isFiexd: false,
      doing: false,
    }
  },
  
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Tag.name]: Tag,
    [GridItem.name]: GridItem,
    [Grid.name]: Grid,
    [PullRefresh.name]: PullRefresh,
    [Divider.name]: Divider,
    headerBar: HeaderBar,
    banner,
    store,
    goTop,
  },
  computed: {
    title(){
      let menus = this.configInfo.menus;

      return '购购商家'; // menus ? menus[2].appName : '商家店铺';
    },
  },

  methods: {
    goClass(item, index) {
      if(this.doing) return ;
      this.doing = true;

      if(!this.classList.length) return ;

      return this.$router.push({ name: 'classStoreList', query: { id: this.classList[index].storeclass_id }, });

      this.doing = false;
    },

    goStore(item) {
      this.$router.push({ name: 'storeGoodsList', query: { id: item.store_id, }, });
    },

    goApp() {
      this.$router.push({ name: 'app', query: {}, });
    },

    goRegister() {
      if(!valid.isAuth()) return this.$router.push({ name: 'login', });

      if(gd.isRegister()) return this.$toast.fail('已绑定上级, 不能重复绑定!');

      this.$router.push({ name: 'login', query: { type: gd.REGISTER, }, });
    },

    goGoodsDetail(item) {
      this.$router.push({ name: 'goodsDetail', query: { id: item.goods_commonid }, });
    },
    
    async getRecommendList() {
      let param = { page: this.page, limit: this.limit, store_recommend: 1, };

      // this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiStore.getStoreList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取店铺信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.recommendList.push(this.format(v)));
      }

      this.loading = this.refreshing = false;
      // this.$toast.clear();
    },

    onRefresh() {
      this.clear();

      this.getConfig();
      this.getClassList();
      this.getList();
      this.getRecommendList();
    },

    onLoad() {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      this.getList();
    },

    format(v) {
      v.store_goods.forEach(goods => {
        goods.priceArr = goods.goods_price.split('.');
      });

      return v;
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, };

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiStore.getStoreList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取店铺信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    async getClassList() {
      let param = { page: this.page, limit: this.limit, };

      let res = await apiStore.getClassList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取分类信息失败!')

      if(res && res.data){
        this.classList = res.data;
      }
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

    clear() {
      this.list = [];
      this.classList = [];
      this.recommendList = [];
      this.page = 1;
      this.isLoading = this.finished = false;
    },
  },

  activated() {
    this.doing = false;

    this.clear();
    this.getConfig();
    this.getClassList();
    this.getList();
    this.getRecommendList();
  },

}
</script>
