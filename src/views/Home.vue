<style lang="less" scoped>
.home_page_wrap{
  padding: 50px 0 0;
}

.banner {
  width: 100%;
  height: 512px;
  position: relative;
  .banner_bg {
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.swipe {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 702px;
  height: 400px;
  border-radius: 20px;
  img {
    width: 100%;
    height: 100%;
  }
}
.swipe_small{
  height: 300px;
  // margin: 0 0 50px 0;
}

.module {
  margin: 0 auto;
  margin-top: -175px;
  width: 702px;
  height: 280px;
  border-radius: 20px;
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
.activity {
  margin: 0 auto;
  width: 710px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  .activity_img {
    width: 230px;
    height: 180px;
    border-radius: 10px;
    overflow: hidden;
  }
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
.notice {
  width: 702px;
  height: 50px;
  margin: 25px auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.margin-25 {
  margin-top: 25px;
}
.goods {
  width: 100%;
  background: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  .goods_box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
  .goods_item {
    width: 345px;
    border: 1px solid #eee;
    margin-top: 25px;
    border-radius: 10px;
    box-shadow: 1px 4px 10px #eee;
    overflow: hidden;
    line-height: 45px;
    .goods_item-img {
      width: 100%;
      height: 335px;
    }
    .goods_item-name {
      width: 100%;
      font-size: 28px;
      padding: 0 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
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
    .goods_item-price {
      font-size: 30px;
      padding: 0 10px 0 10px;
      display: flex;
      align-items: center;
      color: #dd3d27;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .goods_item-tag {
      width: 68px;
      height: 34px;
    }
    .price_wrap{
      margin: 0 10px 0 0;
      font-size: 24px;
    }
    .price{
      font-size: 30px;
    }
    .sale_wrap{
      margin: 2px 0 0;
      font-size: 24px;
    }
  }
}
.goods_list_wrap{
  min-height: 100vh;
}

.newPeople_wrap{
  position: relative;
  align-items: center;
  height: 240px;
  padding: 0 0 0 150px;
  margin: 10px 20px 0;
}
.i_newPeople{
  position: absolute;
  top: 0;
  left: 0; 
  width: 100%;
  height: 100%;
  z-index: -1;
}
.newPeople_goods_wrap{
  width: 160px;
  margin: 0 0 0 20px;
}
.i_newPeople_goods{
  width: 100%;
  height: 160px;
  border-radius: 10px;
}
.newPeople_info_wrap{
  align-items: center;
}
.newPeople_desc{
  padding: 2px 4px;
  border-radius: 20px 20px 20px 0;
}
.newPeople_price{
  font-size: 24px;
  font-weight: bold;
  transform: scale(0.8);
}

.app_wrap{
  box-sizing: border-box;
  position: fixed;
  top: -5px;
  left: -12.5%;
  width: 125%;
  height: 50px;
  padding: 0 2px 0 3px;
  align-items: center;
  z-index: 100;
  transform: scale(0.8, 0.8);
  background: rgba(0, 0, 0, 1)
}
.app_btn{
  padding: 10px 10px 10px 10px;
  background: #ED1D26;
}

.s_fc_16{ color: #FF0032; }

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
  font-size: 30px;
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
.home_page_wrap .van-sticky--fixed {
  top: 140px !important;
}
</style>
<template>
  <div class="home home_page_wrap">
    <!-- app -->
    <div ref="app" class="app_wrap between s_fc_f" @click="goApp">
      <div>健德购购,资源整合的新电商综合体平台,为了更好的体验,请在APP中打开!</div>
      <div class="app_btn">打开app</div>
    </div>

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <header-bar ref="headerBar" :bgColor="headerBgColor"></header-bar>

      <!-- 轮播领域 -->
      <div class="banner banner_small">
        <img class="banner_bg" :src="imgs.home" alt="">
        <van-swipe :autoplay="3000" indicator-color="rgba(82, 190, 79, 1)" class="swipe swipe_small" :stop-propagation="false">
          <van-swipe-item v-for="(image, index) in bannerList" :key="index">
            <img v-lazy="image.banner_pic" @click="goModule(image)" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 图标领域 -->
      <div class="module s_bg_f">
        <van-grid :column-num="5" :border="false">
          <van-grid-item class="module_item" v-for="(value,index) in menus" :key="index" @click="handleMenu(value, index)">
            <img class="module_icon" slot="icon" :src="value.url" />
            <div class="module_text" slot="text">{{value.appName}}</div>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 活动领域 -->
      <div class="activity">
        <div class="module_item" v-for="(value,index) in imgs.activity" :key="index" @click="goActivity(value, index)">
          <img class="activity_img" :src="value.url" />
        </div>
      </div>

      <!-- 新人专享 -->
      <div class="newPeople_wrap flex" @click="goNewPeople">
        <img class="i_newPeople" :src="imgs.newPeople" alt="">
        
        <div class="newPeople_goods_wrap" v-for="(item, index) in newPeopleList" :key="index" @click.stop="goGoodsDetail(item)">
          <img class="i_newPeople_goods" :src="item.goods_image" alt="">

          <div class="newPeople_info_wrap flex between">
            <div class="newPeople_desc s_fc_f s_bg_12">新人价</div>
            <div class="newPeople_price s_fc_16">￥{{item.newcomer_price}}</div>
          </div>
        </div>
      </div>

      <!-- 注册 -->
      <div class="store margin-25" @click="goRegister">
        <img class="store_img1" :src="imgs.register" alt="">
      </div>

      <!-- 众信验证 -->
      <div class="notice" @click="goCredit">
        <img class="store_img2" src="../assets/images/home/prize_credit.png" alt="">
      </div>

      <!-- 商品领域 -->
      <div class="goods">
        <van-tabs v-model="customcatalogIndex" @scroll="tabScroll" sticky :border="false" :ellipsis="false" line-height="2"
          :offset-top="offsetTop"
          :color="isFiexd?'#fff':'#4FB84A'" :title-inactive-color="isFiexd?'#fff':'#000'"
          :title-active-color="isFiexd?'#fff':'#4FB84A'" :background="isFiexd?headerBgColor:'#fff'">
          <van-tab v-for="item in goodsList" :key="item.customcatalog_id" :title="item.customcatalog_name"></van-tab>

          <div class="goods_list_wrap">
            <div class="goods_box" v-if="goodsList[customcatalogIndex]">
              <div class="goods_item" @click="toGoods(good.goods_commonid)" v-for="good in goodsList[customcatalogIndex].goods" :key="good.cataloggoods_id">
                <img class="goods_item-img" :src="good.goodscommon.goods_image" alt="">
                <div class="goods_item-name">{{good.goodscommon.goods_name}}</div>

                <div class='goods_integral_wrap s_fc_16' v-if="good.goodscommon.goods_integral">
                  <span class="goods_integral_pre s_fc_f s_bg_12">返</span><span class="goods_integral">{{good.goodscommon.goods_integral}}积分</span>
                </div>

                <div class="goods_item-price">
                  <img v-if="good.goodscommon.tag_image" class="goods_item-tag" :src="good.goodscommon.tag_image" alt="">
                  <span class="price_wrap">￥<span class="price">{{good.priceInteger}}</span>.{{good.priceDecimal}}</span>
                  <div class="sale_wrap s_fc_9">热销{{good.goodscommon.goods_salenum}}</div>
                </div>
              </div>
            </div>
          </div>
        </van-tabs>
        
      </div>
      <van-divider :style="{ color: '#333', borderColor: '#ccc', padding: '0 30px',fontSize:'12px' }">
        已经没有了哦~
      </van-divider>
    </van-pull-refresh>
    <go-top></go-top>
  </div>
</template>

<script>
import { NavBar, Search, Tag, Lazyload, Grid, GridItem, PullRefresh, Divider } from 'vant';
import goTop from '@/components/goTop.vue';
import HeaderBar from '@/components/headerBar.vue';
import request from '@/utils/request';
import * as api from '@/api/common';
import * as apiGoods from '@/api/goods';
import * as gd from '@/utils/global';
import * as app from '@/utils/app';
import valid from '@/utils/valid';
export default {
  data() {
    return {
      headerBgColor: '#fff',
      menus: [],
      menusTo: [{ name: 'vipGoodsList', }, '/goodsDetail', '/goodsDetail', '/goodsDetail', '/goodsDetail', '/goodsDetail', '/goodsDetail', '/goodsDetail', '/goodsDetail', '/goodsDetail'],
      imgs: [],
      bannerList: [],

      externalList: [
        { url: 'https://flight.ztlvx.com', type: 'FLIGHT', },
        { url: 'https://train.ztlvx.com', type: 'TRAIN', },
        { url: 'https://hotal.ztlvx.com', type: 'hotel', },
      ],

      newPeopleList: [],

      isLoading: false,
      customcatalogIndex: 0,
      goodsList: [],
      isFiexd: false,
      doing: false,

      classList: [],
      liveId: null, // 直播礼包分类Id

      isOpenCoupon: false, // 优惠券开启状态

      offsetTop: 0,
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
    goTop: goTop,
  },

  computed: {
  },
  
  methods: {
    handleMenu(item, index) {
      if(this.doing) return ;
      this.doing = true;

      if(index === 0) return this.$router.push({ name: 'vipGoodsList', });
      if(index === 1) return this.$router.push({ name: 'publicGoodsList', });
      if(index === 2) return this.$router.push({ name: 'ticket', });

      if([4].indexOf(index) !== -1){
        return this.goApp();
      }

      // if([5].indexOf(index) !== -1){
      //   if(!this.classList.length) return ;

      //   return this.$router.push({ name: 'classGoodsList', query: { id: this.classList[index - 5].storegc_id }, });
      // }

      // if([6, 7, 8].indexOf(index) !== -1){
      //   return this.goExternal(this.externalList[index - 6]);
      // }

      this.doing = false;
      if([3, 5, 6, 7, 8, 9].indexOf(index) != -1) return this.$toast('正在开发中...');
    },

    goModule(item) {
      // 不做处理
      if(item.banner_type == 0) return ;
      
      // 图片
      if(item.banner_type == 1) return this.$router.push({ name: 'img', query: { url: item.banner_url, } });

      // 商品
      if(item.banner_type == 2) return this.$router.push({ name: 'goodsDetail', query: { id: item.banner_url, } });

      // 公众号
      if(item.banner_type == 3) return location.href = item.banner_url;

      if(item.banner_type == 4){
        if(item.banner_url == 'seckill') return this.$router.push({ name: 'activityGoodsList', query: { type: gd.SECKILL_GOODS, } });
        if(item.banner_url == 'group') return this.$router.push({ name: 'activityGoodsList', query: { type: gd.GROUP_GOODS, } });
        if(item.banner_url == 'bargain') return this.$router.push({ name: 'activityGoodsList', query: { type: gd.BARGAIN_GOODS, } });
        // 红包雨
        if(item.banner_url == 'redPackage') return this.goPackage();
        // 商圈/社区
        if(item.banner_url == 'business') return ;
        // 合作共赢
        if(item.banner_url == 'vip') return this.$router.push({ name: 'vipGoodsList', query: {} });
        // VIP特惠
        if(item.banner_url == 'special') return this.goApp();
        // 直播礼包
        if(item.banner_url == 'gift') return this.$router.push({ name: 'activityGoodsList', query: { type: gd.LIVE_GOODS, } });
      }
    },

    goApp() {
      this.$router.push({ name: 'app', query: {}, });
    },

    goStore() {
      if(!valid.isAuth()) return this.$router.push({ name: 'login', });

      this.$router.push({ name: 'storeList', })
    },

    goPackage() {
      if(!valid.isAuth()) return this.$router.push({ name: 'login', });

      location.href = `${process.env.VUE_APP_BASE_API}/activity/rain/#/?token=${localStorage.getItem('token')}`;
    },

    goActivity(item, index) {
      let arr = [gd.SECKILL_GOODS, gd.GROUP_GOODS, gd.BARGAIN_GOODS];

      this.$router.push({ name: 'activityGoodsList', query: { type: arr[index], } });
    },

    goRegister() {
      if(!valid.isAuth()) return this.$router.push({ name: 'login', });

      if(this.isOpenCoupon) return this.$router.push({ name: 'couponList', });

      if(gd.isRegister()) return this.$toast.fail('已绑定上级, 不能重复绑定!');

      this.$router.push({ name: 'login', query: { type: gd.REGISTER, }, });
    },

    goCredit() {
      this.$router.push({ name: 'credit' });
    },

    goGoodsDetail(item) {
      this.$router.push({ name: 'goodsDetail', query: { id: item.goods_commonid }, });
    },

    goNewPeople() {
      this.$router.push({ name: 'newPeopleGoodsList', query: {}, });
    },

    async getBanner() {
      let res = await request.get('/api/v2/member/banner');
      let config = await request.get('/api/v2/common/indexconfig');
      if (res.status == 0) {
        this.bannerList = res.data;
      }
      if (config.status == 0) {
        config.data.menus.forEach((v, k) => {
          v.to = this.menusTo[k]
        })
        this.menus = config.data.menus;
        this.imgs = {
          activity: config.data.img.activity,
          home: config.data.img.home.url,
          register: config.data.img.register.url,
          store: config.data.img.store.url,
          newPeople: config.data.img.newPeople.banner.url,
        }
        this.headerBgColor = config.data.color.bgColor;

        // 优惠券
        this.isOpenCoupon = config.data.img.coupon && config.data.img.coupon.isOpen ? true : false;
      }
    },

    async getnewPeopleList() {
      let param = { newcomer: 1, type: 'sort', };

      let res = await apiGoods.getGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取新人商品失败!')

      if (res.status == 0) {
        res.data.forEach(this.format);
        this.newPeopleList = res.data.slice(0, 3);
      }
    },

    format(item) {
      if(item.goods){
        item.goods.forEach(v => {
          let arr = String(v.goodscommon.goods_price).split('.');

          v.priceInteger = arr[0];
          v.priceDecimal = arr[1];
        });
      }

      return item;
    },

    async getGoodsList() {
      this.$toast.loading({ message: '加载中...', forbidClick: true });

      let res = await request.get('/api/v2/member/customcatalog');
      if (res.status == 0) {
        res.data.forEach(this.format);
        this.goodsList = res.data;
        this.$toast.clear();
      }
    },

    onRefresh() {
      this.clear();

      this.getBanner();
      this.getGoodsList();
      this.getnewPeopleList();
      this.getClassList();
    },
    tabScroll(e) {
      this.isFiexd = e.isFixed;
    },
    toGoods(id) {
      this.$router.push({ name: 'goodsDetail', query: { id }, });
    },

    async getClassList() {
      let param = { page: this.page, limit: this.limit, },
          item;

      let res = await apiGoods.getClassList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取分类信息失败!')

      if(res && res.data){
        this.classList = res.data;

        // 直播礼包
        item = res.data[0].children;
        if(item && item[1]) item = item[1].children;
        if(item && item[0]) this.liveId = item[0].storegc_id;
      }
    },

    clear() {
      this.bannerList = this.goodsList = this.newPeopleList = this.classList = [];
      this.isLoading = false;
    },
  },

  activated() {
    this.doing = false;

    this.offsetTop = this.$refs.headerBar.$el.offsetHeight + this.$refs.app.offsetHeight;
    console.log(this.$refs.headerBar.$el.offsetHeight, this.$refs.headerBar.$el.innerHeight);

    this.getBanner();
    this.getGoodsList();
    this.getnewPeopleList();
    this.getClassList();
  },

}
</script>
