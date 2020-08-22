<style lang="less" scoped>
.tabbar_wrap{
  position: fixed;
  z-index: 1;
}

.all_wrap{
  margin: 120px 0 0;
}
.all_title{
  padding: 30px 20px;
  font-size: 32px;
  font-weight: bold;
}
.all_store_wrap{
}

.s_fc_16{ color: #FF0032; }

.s_bg_12{ background: #FF0032; }
</style>
<style lang="less">
.store_list_page_wrap .van-tabs__wrap--scrollable .van-tab--complete{
  flex: 0 0 25% !important;
}

.store_list_page_wrap .van-grid-item__content{
  padding: 0;
}
</style>
<template>
  <div class="store_list_page_wrap">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <header-bar :title="title" :bgColor="'#6A6A6A'"></header-bar>

      <van-tabs class="tabbar_wrap" v-model="classIndex" @change="changeClass" sticky :border="false" :ellipsis="false" line-height="2"
        :color="'#fff'" :title-inactive-color="'#aaa'"
        :title-active-color="'#fff'" :background="'#6A6A6A'">
        <van-tab class="tabbar_item" v-for="item in classList" :key="item.storeclass_id" :title="item.storeclass_name"></van-tab>
      </van-tabs>

      <div class="all_wrap">
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

      classList: [],
      classIndex: 0,

      list: [],
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
      finished: false,

      isLoading: false,
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
      let list = this.classList;

      return '购购商家';
    },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;
      
      if(!query.id) return this.$toast.fail(`缺少分类Id`);
      this.id = query.id;
      
      this.clear();
      this.classList = [];
      this.getClassList();
    },

    changeClass() {
      let item = this.classList[this.classIndex];

      this.clear();

      if(item) this.id = item.storeclass_id;
      this.getList();
    },

    onRefresh() {
      this.clear();

      this.getClassList();
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
      let param = { page: this.page, limit: this.limit, storeclass_id: this.id, };

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
        let index = this.classIndex;
        this.classList = res.data;

        setTimeout(() => {
          this.classList.forEach((v, i) => { if(v.storeclass_id == this.id) this.classIndex = i; });
          if(index == this.classIndex) this.getList();
        });
        
      }
    },

    // async getConfig() {
    //   let param = {};

    //   let res = await api.getConfig(param);
    //   if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取背景配置信息失败!')

    //   if(res && res.data){
    //     this.configInfo = res.data;
    //     this.bgColor = res.data.color.bgColor;
    //     this.bannerConfig.bgImg = res.data.img.home.url;
    //   }
    // },

    clear() {
      this.list = [];
      this.page = 1;
      this.isLoading = this.finished = false;
    },
  },

  activated() {
    this.doing = false;

    this.init();
  },

}
</script>
