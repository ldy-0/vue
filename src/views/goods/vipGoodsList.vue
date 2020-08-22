<template>
  <div class="page_wrap vip_goods_page_wrap s_bg_f5">
    <!-- <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar> -->
    <title-bar ref="titleBar" :title="title" :bgColor="bgColor"></title-bar>
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <banner :config="bannerConfig"></banner>

      <!-- 状态栏 -->
      <van-tabs class="status_bar_wrap" v-model="status" line-width="75px" :border="false" sticky
                :color="isFixed ? '#fff' : '#FF557A'"
                :title-active-color="isFixed ? '#fff' : '#FF557A'" 
                :title-inactive-color="isFixed ? '#fff' : '#000'"
                :background="isFixed ? bgColor : '#fff'"
                :offset-top="offsetTop" @scroll="scroll"
                @change="changeStatus">
        <van-tab :title="item.title" :name="item.id" v-for="(item, index) in statusList" :key="index">

          <van-list class="list_wrap" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
            <!-- vip -->
            <div v-if="isVip">

              <div class="title_wrap s_fc_0 s_bg_f">
                <span>超值期待</span>
                <span class="title_vice s_fc_15">限时、限量折扣礼包</span>
              </div>

              <giftList></giftList> 

              <div class="title_wrap s_fc_0 s_bg_f">
                <span>健康优选</span>
                <span class="title_vice s_fc_15">有健康、有财富</span>
              </div>

              <div class="goods_list_wrap between" v-for="(row, rowIndex) in vipList" :key="rowIndex">
                <goods :config="item" v-for="(item, index) in row" :key="index"></goods>
              </div>
            </div>

            <!-- 解读 -->
            <div v-if="isRead">
              <div class="read_list_wrap s_bg_f">
                <read :config="item" v-for="(item, index) in readList" :key="index"></read>
              </div>
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
import goods from '@/components/goods/goods.vue';
import giftList from '@/components/goods/giftList.vue';
import read from '@/components/goods/read.vue';
import goTop from '@/components/goTop.vue';

export default {
  components: {
    [Field.name]: Field,
    titleBar,
    banner,
    goods,
    giftList,
    read,
    goTop,
  },

  data() {
    return {
      statusList: [
        { id: 1, title: 'VIP商品', },
        { id: 2, title: 'VIP商品解析', },
      ],

      bannerConfig: {
        isSmall: true,
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
      offsetTop: 0,

      page: 1,
      limit: 10,
      total: 0,
      list: [],
      allReadList: [],
    };
  },

  computed: {
    title() { 
      let menus = this.configInfo.menus;

      return menus ? menus[0].appName : '合作共赢';
    },

    isBack() { return this.$route.meta.isBack; },

    isVip(){ return this.status === 1; },
    isRead(){ return this.status === 2; },

    vipList(){
      let arr = [];
      this.list.forEach((v, i) => i % 2 == 0 ? arr.push([v]) : arr[arr.length - 1].push(v));
      return arr;
    },
    
    readList(){
      return this.allReadList.slice(0, this.page * this.limit);
    },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;
      this.status = query.status || 1;

      this.clear();
      this.getList();
    },

    changeStatus() {
      this.clear();

      if(this.isVip){
        this.getList();
      }
      if(this.isRead) this.getReadList();
    },

    onRefresh(e) {
      this.clear();

      this.loading = true;

      if(this.isVip) this.getList();
      if(this.isRead) this.getReadList();
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
      let param = { page: this.page, limit: this.limit, is_vip: 1, type: "sort", goods_state: 1, only_app: 1 };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.getGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取VIP商品信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.list.lenght;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    async getReadList() {
      let param = { page: this.page, limit: this.limit, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.getReadGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取VIP解读列表失败!')

      if(res && res.data){
        let obj = res.data;

        this.allReadList = Object.keys(obj).map(v => obj[v]).reverse();
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    clear() {
      this.list = this.allReadList = [];
      this.page = 1;
      this.finished = false;

      // scrollTo(0, 0);
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
    
    this.offsetTop = this.$refs.titleBar.$el.offsetHeight;

    this.getConfig();
    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  min-height: 100vh;
}

.status_bar_wrap{
  width: 100%;
  z-index: 1;
}

.list_wrap{
  min-height: 100vh;
}

.title_wrap{
  height: 88px;
  margin: 20px 0 0;
  padding: 0 30px;
  line-height: 88px;
  font-size: 40px;
  letter-spacing: 4px;
  font-weight: bold;
}
.title_vice{
  margin: 0 0 0 35px;
  font-size: 30px;
  font-weight: normal;
}

.goods_list_wrap{
  padding: 0 20px; 
}

.read_list_wrap{
  margin: 20px 25px 0;
  padding: 30px 20px;
  border-radius: 20px;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #494949; }
.s_fc_15{ color: #3f3f3f; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
.van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}

.van-tabs__wrap--scrollable .van-tab{
  flex: 0 0 20%;
}
.van-tabs__line{
  background: #FF557A;
}

.vip_goods_page_wrap .van-sticky--fixed{
  top: 88px !important;
} 
</style>