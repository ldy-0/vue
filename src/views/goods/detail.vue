<template>
  <div class="goods_page_wrap">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack" @click-right="openShareDialog">
      <template #right>
        <!-- <img class="i_share" src="../../assets/images/goods/share.jpg" alt=""> -->
        <van-icon class="i_share" name="share" size="20" />
      </template>
    </van-nav-bar>
    <!-- 轮播图 -->
    <van-swipe class="swipe_wrap" :autoplay="3000" indicator-color="white" @change="swipeChange">
      <van-swipe-item v-for="(item, index) in imgList" :key="index">
        <img class="swipe_img" :src="item.goodsimage_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="swipe_indicator s_fc_f s_bg_0"> {{current}}/{{imgList.length}} </div>
      </template>
    </van-swipe>  

    <!-- 商品信息 -->
    <div class="goods_info_wrap s_bg_f">
      <div class="goods_main_info">
        <div class="goods_name s_fc_2">{{detail.goods_name}}</div>

        <div class='goods_integral_wrap s_fc_11' v-if="detail.goods_integral">返还<span class='goods_integral'>{{detail.goods_integral}}</span>积分</div>

        <!-- register tip -->
        <div class='register_wrap between s_bg_11 s_fc_f' v-if="isNotRegisted">
          <div class='register_text'>您为普通用户:成为体验代理分享好友购买可获得相应余额奖励</div>
          <div class='register_btn s_fc_5 s_bg_12' @click='goRegister'><div class='skew'>立即注册</div></div>
        </div>

        <!-- 价格 -->
        <div class='goods_price s_fc_12' :class="{ }">
          <span class="newPeople_desc s_fc_f s_bg_15" v-if="isNewPeople">新人价</span>
          <img class='i_activity' :src='detail.tag_image' v-if="detail.tag_image" />
          <span class="goods_price_pre">¥</span>
          <span class='goods_price_integer'>{{detail.priceInteger}}</span>
          <span class="goods_price_post">.{{detail.priceDecimal}}</span>

          <span class="goods_marketprice s_fc_8">
            <span class="goods_price_pre">¥</span>
            <span class="marketprice">{{detail.marketpriceInteger}}</span>
            <span class='marketprice_post'>.{{detail.marketpriceDecimal}}</span>
          </span>

          <span class="newPeople_freight fs24 s_fc_9" v-if="isNewPeople">运费:¥{{detail.goods_freight || 0}}</span>

          <span class="goods_tag s_fc_13 s_bg_13" v-if="isVipGoods">赠资产</span>
          <!-- <span class="goods_sales s_fc_9" v-if="isVipGoodsList">热销:{{config.goods_salenum}}</span> -->

          <div class="copy_btn s_fc_15" @click="copy">复制</div>
        </div>
      </div>

      <div class="goods_vice_info">
        <span v-if="!isNewPeople">运费:¥{{detail.goods_freight || 0}}</span>
        <span class="ml40 s_fc_8" v-if="isNormalGoods && !isNewPeople">库存：{{detail.goods_storage || ''}}</span>
      </div>
    </div>

    <!-- 规格 -->
    <div class="sku_bar_wrap between s_fc_14 s_bg_f" @click="openSkuDialog">
      <div>规格</div>

      <div v-if="isNewPeople">剩余: <span class="s_fc_15">{{detail.goods_storage || ''}}</span></div>
      <van-icon name="arrow" v-else />
    </div>

    <van-popup v-model="showSkuDialog" position="bottom">
      <sku :config="detail" @updateCart="getCartSize" @close="closeSkuDialog" v-if="showSkuDialog"></sku>
    </van-popup>

    <!-- 评价 -->
    <div class="comment_wrap s_fc_0 s_bg_f" v-if="commentTotal">
      <div class="sku_bar_wrap between">
        <div class="">宝贝评价({{commentTotal}})</div>

        <div class="align flex s_fc_15" @click="goCommentList">
          <div>查看全部</div>

          <van-icon name="arrow" />
        </div>
      </div>

      <div class="comment_list_wrap">
        <comment :config="item" v-for="(item, index) in commentList" :key="index"></comment>
      </div>
    </div>

    <rich-text class="richtext_wrap" :config="richTextConfig"></rich-text> 

    <!-- 底部栏 -->
    <div class="bottom_bar_wrap flex s_bg_f">
      <div class="menu_list_wrap around">
        <div class="menu_wrap" :class="{ collect_menu_wrap: item.isCollect }" v-for="(item, index) in menuList" :key="index" @click="handleMenu(item)">
          <img :class="{ [item.imgClass]: true }" :src="item.src" alt="" v-if="item.src">
          <van-icon :name="isCollected ? 'star' : 'star-o'" size="24" color="#4FB84A" v-else />

          <div class="collect_title" v-if="item.isCollect">{{ isCollected ? "已收藏" : "收藏" }}</div>
          <div class="" v-else>{{item.title}}</div>

          <div class="red_dot s_fc_f" v-if="item.isCart">{{cartSize}}</div>
        </div>
      </div>
      
      <div class="btn_wrap s_fc_f flex" :class="{ big_btn_wrap: isNewPeople }">
        <div class="md_btn s_bg_14" v-if="showShopping" @click="openSkuDialog">加入购物车</div>
        <div class="md_btn s_bg_11" :class="{ big_btn: !showShopping, }" @click="openSkuDialog">立即购买</div>
      </div>
    </div>

    <!-- top -->
    <goTop></goTop>

    <!-- 分享  -->
    <van-dialog v-model="showShareDialog" title="复制链接,打开微信粘贴分享好友" show-cancel-button confirm-button-text="复制" confirm-button-color="#333" cancel-button-color="#999"
                @cancel="closeShareDialog" @confirm="share">
      <div class="url_wrap s_bg_16">{{url}}</div>
    </van-dialog>

  </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import { NavBar, Search, Tag } from 'vant';
import Header from '@/components/header.vue';
import richText from '@/components/richText.vue';
import sku from '@/components/goods/sku.vue';
import comment from '@/components/my/comment.vue';
import goTop from '@/components/goTop.vue';
import * as apiGoods from '@/api/goods';
import * as gd from '@/utils/global';
import valid from '@/utils/valid';

export default {
  data() {
    return {
      type: gd.NORMAL_GOODS,
      id: null,

      showShareDialog: false,
      url: '',

      showSkuDialog: false,
      skuConfig: {},
      
      cartSize: 0,

      user: null,

      current: 0,
      detail: {},

      commentList: [],
      commentTotal: 0,

      richTextConfig: {
        title: '商品详情',
        text: '',
      },

      clip: null,
    }
  },
  
  components: {
    [Tag.name]: Tag,
    sku,
    richText,
    comment,
    goTop,
  },

  computed: {
    title(){ return '商品详情'; },

    isBack() { return this.$route.meta.isBack; },

    isPublicGoods(){ return this.type === gd.NORMAL_GOODS; },
    isVipGoods(){ return this.type === gd.VIP_GOODS; },
    isNormalGoods(){ return this.isPublicGoods || this.isVipGoods; },
    isStoreGoods(){ return this.detail.store_id != gd.MAIN_STORE; },
    isNewPeople(){ return this.detail.newcomer; },

    isNotRegisted(){ return this.user && this.user.inviter_id == 0; },
    isCollected(){ return this.detail.enshrine_type == gd.COLLECT; },

    showShopping(){ 
      if(this.isStoreGoods) return false;
      console.log(this.isVipGoods);

      return this.isVipGoods || this.isPublicGoods && this.detail.use_coupon == gd.USE_COUPON;
    },

    menuList(){
      let shopping = { title: '购物车', src: require('../../assets/images/goods/shoppingCart.png'), imgClass: 'i_shoppingCart', isCart: true, },
          collect = { title: '', isCollect: true, },
          arr = [
            { title: this.isStoreGoods ? '店铺' : '主页', src: require('../../assets/images/goods/home.png'), imgClass: 'i_home', isHome: true, },
          ];

      if(!this.isNewPeople) arr.push(collect);
      if(this.showShopping) arr.push(shopping);

      return arr;
    },

    imgList(){ return this.detail.goodsimagesList || []; },
  },

  // watch: {
  //   $route(n, o){
  //     console.log(n, o);
  //   },
  // },
  
  methods: {
    init() {
      let route = this.$route,
          query = route.query;
      
      // 分享人Id
      if(query.member_id){
        localStorage.setItem('sharerId', query.member_id);
        localStorage.setItem('sharerMobile', query.member_mobile);
      }

      this.id = query.id;
      this.showSkuDialog = false;
      this.commentTotal = 0;

      this.user = gd.getUser();

      this.getInfo();
      this.getCartSize();

      scrollTo(0, 0);
    },

    handleMenu(item) {
      if(item.isHome){
        scrollTo(0, 0);
        return this.$router.replace({ name: this.isStoreGoods ? 'storeGoodsList' : 'home', query: { id: this.detail.store_id, } });
      }

      if(item.isCart) this.$router.push({ name: 'shoppingCar' });

      if(item.isCollect) this.collectGoods();
    },

    openSkuDialog() {
      if(!valid.isAuth()) return this.$router.push({ name: 'login', });
      
      this.showSkuDialog = true;
    },

    closeSkuDialog() {
      this.showSkuDialog = false;
    },

    openShareDialog() {
      if(!valid.isAuth()) return this.$router.push({ name: 'login', });

      if(this.user && !this.user.member_mobile) return this.$router.push({ name: 'login', });

      this.showShareDialog = true;
      this.url = `${location.href.replace(/(\?).*$/, '')}?id=${this.id}&member_id=${this.user.member_id}&member_mobile=${this.user.member_mobile}`;
    },

    closeShareDialog() {
      this.showShareDialog = false;
      this.url = '';
    },

    share() {
      if(this.clip) this.clip.destroy();

      let clip = new ClipboardJS('.van-dialog__confirm', {
        text: e => this.url,
      });

      clip.on('success', e => this.$toast.success(`复制成功!`));
      clip.on('error', e => this.$toast.fail(`复制失败!`));

      this.clip = clip;
    },

    copy() {
      if(this.clip) this.clip.destroy();

      let clip = new ClipboardJS('.copy_btn', {
        text: e => this.id,
      });

      clip.on('success', e => this.$toast.success(`复制成功!`));
      clip.on('error', e => this.$toast.fail(`复制失败!`));

      this.clip = clip;
    },

    async collectGoods() {
      let param = { goods_commonid: this.id, },
          detail = this.detail,
          cid = null;

      if(!valid.isAuth()) return this.$router.push({ name: 'login', });

      if(this.isCollected) cid = detail.enshrine.filter(v => v.member_id == this.user.member_id)[0].enshrine_id;

      let res = await (this.isCollected ? apiGoods.unCollectGoods(cid) : apiGoods.collectGoods(param));
      if(!res || typeof res === 'string' || res.status != 0) return this.$toast.fail(res ? res.error || res : '收藏商品失败!')

      this.getInfo();
    },

    format(goods) {
      let firstSku = goods.SKUList[0];

      goods.type = this.type = goods.is_vip ? gd.VIP_GOODS : gd.NORMAL_GOODS;
      if(goods.newcomer){
        goods.type = gd.NEW_GOODS;
      }

      let arr = String(firstSku.newcomer ? firstSku.newcomer_price : goods.goods_price).split('.');

      goods.priceInteger = arr[0];
      goods.priceDecimal = arr[1];

      arr = String(goods.goods_marketprice).split('.');
      goods.marketpriceInteger = arr[0];
      goods.marketpriceDecimal = arr[1];

      goods.goods_salenum = goods.goods_faker_salenum ? goods.goods_faker_salenum : 0;
      goods.goods_storage = goods.SKUList[0].goods_storage;

      // this.standards = goods.spec_value ? goods.spec_value : ["统一规格"];

      this.richTextConfig.text = goods.goods_body;
      return goods;
    },

    async getInfo() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.getGoods(this.id, param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取VIP商品信息失败!')

      if(res && res.data){
        this.detail = this.format(res.data);

        if(valid.isAuth()) this.getCommentList(this.detail.SKUList[0].goods_id);
      }

      this.loading = false;
      this.$toast.clear();
    },

    async getCommentList(id) {
      let param = { goods_id: id, goods_type: "real", page: 1, limit: 3, };

      let res = await apiGoods.getCommentList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取评论信息失败!')

      if(res && res.data){
        this.commentList = res.data.slice(0, 3);
        this.commentTotal = res.pagination ? res.pagination.total : this.commentList.length;
      }
    },

    async getCartSize() {
      let param = {};

      let res = await apiGoods.getShoppingCartList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '添加失败!')

      if(res && res.data){
        let storeList = res.data.store_cart_list;
        this.cartSize = storeList && storeList[1] ? storeList[1].length : 0;
      }
    },

    goCommentList() {
      let id =this.detail.SKUList[0].goods_id; 

      this.$router.push({ name: 'commentList', query: { id, }, });
    },

    goRegister() {
      this.$router.push({ name: 'login', });
    },

    goBack() {
      this.$router.back();
    },

    swipeChange(i) {
      this.current = i + 1;
    },
  },

  activated() {
    if(this.isBack) return ;

    this.init();
  },

  deactivated() {
    if(this.clip) this.clip.destroy();
  },

  beforeRouteEnter(to, from, next) {
    if(['commentList', 'submitOrder'].indexOf(from.name) == -1) to.meta.isBack = false;
    
    next();
  },

}
</script>
<style lang="less" scoped>
.goods_page_wrap {
  min-height: 100%;
  padding: 128px 0 0;
}

.swipe_wrap{
  position: relative;
  height: 750px;
}
.swipe_img{
  width: 100%;
  height: 100%;
}
.swipe_indicator{
  position: absolute;
  top: 30px;
  right: 20px;
  z-index: 1;
  width: 80px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  border-radius: 20px;
  opacity: 0.5;
}

.goods_info_wrap{
  padding: 20px 0 0;
}
.goods_main_info{
  padding: 0 0 30px 0;
}
.goods_name{
  margin: 0 20px;
  font-size: 30px;
}
.goods_integral_wrap{
  display: inline-block;
  margin: 20px 20px 0;
  padding: 4px 10px;
  font-size: 22px;
  border-radius: 8px;
  letter-spacing: 2px;
  border: 2px solid #FF9328;
}

.register_wrap{
  align-items: center;
  box-sizing: border-box;
  width: 125%;
  margin: 30px 0 0;
  padding: 10px;
  font-size: 22px;
  transform: scale(0.8) translate(-12.5%, 0);
}
.register_btn{
  display: inline-block;
  padding: 4px 20px;
  border-radius: 10px;
  font-weight: bold;
}
.skew{
  transform: skewX(-10deg);
}

.goods_price{
  position: relative;
  margin: 5px 10px 0 20px;
  font-size: 28px;
}
.goods_marketprice{
  font-size: 24px;
  margin-left: 20px;
  text-decoration: line-through;
}
.goods_num{
  margin: 10px 0 0;
  font-size: 22px;
}
.goods_price_integer{
  font-size: 40px;
}
.goods_price_pre, .goods_price_post{
  font-size: 22px;
}
.goods_sales{
  margin: 0 0 0 10px;
  font-size: 22px;
}

.copy_btn{
  position: absolute;
  top: 0;
  right: 20px;
  font-size: 28px;
  padding: 8px 5px;
  border: 1px solid #4FB84A;
  border-radius: 4px;
  text-align: center;
}

.collect_wrap{
  position: absolute;
  top: 0;
  right: 20px;
  font-size: 20px;
  text-align: center;
}
.collect_title{
  width: 80px;
}

.goods_vice_info{
  font-size: 24px;
  height: 84px;
  padding: 0 20px;
  border-top: 2px solid #eee;
  line-height: 84px;
}

.goods_tag{
  position: relative;
  top: -4px;
  margin: 0 0 0 10px;
  padding: 2px 6px;
  font-size: 24px;
  letter-spacing: 1px;
  border-radius: 4px;
}

.sku_bar_wrap{
  align-items: center;
  margin: 20px 0 0;
  padding: 0 20px;
  line-height: 88px;
  font-size: 28px;
}

.comment_wrap{
  font-size: 28px;
}
.comment_list_wrap{
  padding: 0 20px;
}
.align{
  align-items: center;
}

.richtext_wrap{
  margin: 20px 0 110px;
}

.bottom_bar_wrap {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 104px;
}
.menu_list_wrap{
  flex-grow: 1;
  align-items: center;
}
.menu_wrap{
  position: relative;
  text-align: center;
}
.collect_menu_wrap{
  top: -2px;
}
.red_dot {
  position: absolute;
  top: -7px;
  right: 0px;
  background: #fc332b;
  width: 34px;
  height: 34px;
  text-align: center;
  line-height: 34px;
  border-radius: 50%;
}

.btn_wrap{
  flex-shrink: 0;
  align-items: center;
  width: 450px;
  border-top: 1px solid #e6e6e6;
}
.big_btn_wrap{
  width: 560px;
}
.md_btn{
  width: 200px;
  height: 76px;
  line-height: 76px;
  margin-right: 20px;
  border-radius: 10px;
  text-align: center;
}
.big_btn{
  width: 100%;
}

.newPeople_desc{
  padding: 2px 4px;
  border-radius: 20px 20px 20px 0;
  font-size: 24px;
}
.newPeople_freight{
  margin: 0 0 0 20px;
}

.url_wrap{
  margin: 30px 36px;
  padding: 30px 24px;
  font-size: 24px;
  word-break: break-all;
}

.i_activity{
  position: relative;
  top: 4px;
  width: 68px;
  height: 34px;
  margin: 0 10px 0 0;
}
.i_home{
  width: 44px;
  height: 43px;
}
.i_shoppingCart{
  width: 45px;
  height: 43px;
}
.i_share{
  width: 40px;
  height: 40px;
}

.ml40{ margin-left: 40px; }

.fs24{ font-size: 24px; }

.s_fc_11{ color: #FF9328; }
.s_fc_12{ color: #FF0032; }
.s_fc_13{ color: #E06F00; }
.s_fc_14{ color: #636363; }
.s_fc_15{ color: #4FB84A; }

.s_bg_11{ background: #4FB84A; }
.s_bg_12{ background: #ffc31d; }
.s_bg_13{ background: #FFF0D5; }
.s_bg_14{ background: #3a3a47; }
.s_bg_15{ background: #FF0032; }
.s_bg_16{ background: #F7F4F8; }
</style>
<style>
.van-nav-bar--fixed{
  z-index: 2 !important;
}

.goods_page_wrap .van-popup{
  overflow-y: visible;
}
</style>