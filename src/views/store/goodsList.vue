<template>
  <div class="store_goods_page_wrap page_wrap">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack">
      <template #right>
        <a :href="phone"><img class="i_contact" src="../../assets/images/store/contact.png" alt=""></a>
        <img class="i_share" src="../../assets/images/store/share.png" alt="" @click="openShareDialog">
      </template>
    </van-nav-bar>
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="store_wrap between s_bg_f">
        <div class="flex">
          <img class="i_store" :src="store.store_avatar" alt="">

          <div class="store_info_wrap">
            <div class="store_name">{{store.store_name}}</div>

            <div class="store_desc s_fc_9">已售{{store.store_sales}}件 | {{store.store_collect}}人收藏</div>
          </div>
        </div>

        <div class="follow_btn s_fc_f s_bg_12" @click="changeFollow">{{store.favorite ? '取消关注' : '关注'}}</div>
      </div>

      <van-list class="list_wrap s_bg_f" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">

        <div class="goods_wrap flex" v-for="(item, index) in store.store_goods" :key="index" @click="goDetail(item)">
          <img class="i_goods" :src="item.goods_image" alt="">

          <div class="goods_info_wrap s_fc_14">
            <div class="goods_name">{{item.goods_name}}</div>

            <div class="goods_tag_wrap">
              <span class="goods_integral_pre s_fc_f s_bg_14">精品</span>
              <span v-if="item.goods_integral">
                <span class="goods_integral_pre ml10 s_fc_f s_bg_14">返</span>
                <span class="goods_integral s_fc_16">{{item.goods_integral}}积分</span>
              </span>
            </div>

            <div class="goods_price s_fc_17">¥<span class="price">{{item.priceArr[0]}}</span>.{{item.priceArr[1]}}</div>

            <div class="goods_sale s_fc_9">已售{{item.goods_salenum}}件</div>
          </div>
        </div>
        
      </van-list>

    </van-pull-refresh>

    <!-- 分享 -->
    <van-dialog v-model="showShareDialog" title="复制链接,打开微信粘贴分享好友" show-cancel-button confirm-button-text="复制" confirm-button-color="#333" cancel-button-color="#999"
                @cancel="closeShareDialog" @confirm="share">
      <div class="url_wrap s_bg_16">{{url}}</div>
    </van-dialog>

  </div>
</template>
<script>
import { Field, } from 'vant';
import * as math from 'mathjs';
import ClipboardJS from 'clipboard';
import * as api from '@/api/common';
import * as apiUser from '@/api/user';
import * as apiGoods from '@/api/goods';
import * as apiStore from '@/api/store';
import activityGoods from '@/components/goods/activityGoods.vue';
import * as Type from '@/utils/type';
import * as gd from '@/utils/global';

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

      store: {},

      page: 1,
      limit: 10,
      total: 0,

      id: null,
      type: null,
      list: [],

      showShareDialog: false,
      url: '',
      phone: '',
    };
  },

  computed: {
    title() { return ''; },

    isBack() { return this.$route.meta.isBack; },

  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.id = query.id;
      this.type = query.type;

      this.clear();
      this.getInfo();
    },

    goDetail(item) {
      let id = item.goods_commonid;

      this.$router.push({ name: 'goodsDetail', query: { id, }, });
    },

    onRefresh(e) {
      this.clear();

      this.loading = true;

      this.getInfo();
    },

    onLoad(e) {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      this.getList();
    },

    openShareDialog() {
      // if(!valid.isAuth()) return this.$router.push({ name: 'login', });

      // if(this.user && !this.user.member_mobile) return this.$router.push({ name: 'login', });

      this.showShareDialog = true;
      this.url = `${location.href.replace(/(\?).*$/, '')}?id=${this.id}`;
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

    changeFollow() {
      this.store.favorite ? this.cancelFollow() : this.follow();
    },

    async follow() {
      let param = { fav_id: this.id, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiStore.follow(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '关注失败!')

      if(res && res.data){
        this.$toast.success(`关注成功!`);
        this.getInfo();
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    async cancelFollow() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiStore.cancelFollow(this.id);
      if(!res || typeof res === 'string' || res.error !== '删除收藏成功') return this.$toast.fail(res ? res.error || res : '取消关注失败!')

      if(res && res.data){
        this.$toast.success(`取消关注成功!`);
        this.getInfo();
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    async getInfo() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiStore.getStore(this.id, param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取店铺信息失败!')

      if(res && res.data){
        this.store = this.format(res.data);
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    format(v) {
      v.store_goods.forEach(goods => {
        goods.priceArr = String(goods.goods_price).split('.');
      });

      this.phone = `tel:${v.contacts_phone}`;

      return v;
    },

    // async getList() {
    //   let param = { page: this.page, limit: this.limit, store_id: this.id, };
    //   this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

    //   let res = await apiGoods.getGoodsList(param);
    //   if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取店铺商品列表信息失败!')

    //   if(res && res.data){
    //     res.data.forEach(this.format);
    //     this.list = this.list.concat(res.data);
    //     this.total = res.pagination ? res.pagination.total : this.list.length;
    //   }

    //   this.loading = this.refreshing = false;
    //   this.$toast.clear();
    // },

    clear() {
      this.list = [];
      this.page = 1;
      this.finished = false;

      scrollTo(0, 0);
    },

    goBack() {
      let len = localStorage.getItem('length');

      if(len <= 1) return this.$router.replace({ name: 'home' });
      
      this.$router.back();
    },

  },

  activated() {
    let token = localStorage.getItem('token');
    
    if(!token) return this.$router.push({ name: 'login' });

    if(this.isBack) return ;

    this.init();
  },

  deactivated() {
    if(this.clip) this.clip.destroy();
  },
};
</script>
<style lang='less' scoped>
.store_goods_page_wrap{
  min-height: 100vh;
  padding: 128px 0 0;
}

.store_wrap{
  padding: 30px 30px 30px 20px;
  align-items: center;
}
.store_info_wrap{
  margin: 0 0 0 40px;
}
.store_name{
  width: 450px;
  font-size: 30px;  
  overflow: hidden;
}
.store_desc{
  margin: 10px 0 0;
}
.follow_btn{
  flex-shrink: 0;
  width: 120px;
  height: 60px;
  line-height: 60px;
  border-radius: 10px;
  text-align: center;
}

.list_wrap{
  margin: 20px 0 0;
  padding: 20px 30px 0;
}

.goods_wrap{
  margin: 0 0 30px 0;
  font-size: 28px; 
}
.goods_info_wrap{
  flex-grow: 1;
  // width: 480px;
  margin: 0 0 0 20px;
  word-break: break-all;
}
.goods_name{
  height: 76px;
  overflow: hidden;
}

.goods_tag_wrap{
  margin: 10px 0 0;
  font-size: 24px;
}
.goods_integral_pre{
  padding: 2px 4px;
}
.goods_integral{
  padding: 0 6px;
  border: 1px solid #FF0032;
}

.goods_price{
  margin: 20px 0 0;
  font-size: 30px;
}
.price{
  font-size: 36px;
}

.goods_sale{
  margin: 20px 0 0;
  font-size: 24px;
}

.url_wrap{
  margin: 30px 36px;
  padding: 30px 24px;
  font-size: 24px;
  word-break: break-all;
}

.i_store{
  flex-shrink: 0;
  width: 80px;
  height: 80px;
}
.i_goods{
  flex-shrink: 0;
  width: 240px;
  height: 240px;
}
.i_contact{
  position: relative;
  top: 12px;
  width: 44px;
  height: 40px;
}
.i_share{
  position: relative;
  top: 12px;
  width: 48px;
  height: 40px;
  margin: 0 0 0 20px;
}

.ml10{ margin-left: 10px; }

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #434043; }
.s_fc_15{ color: #3f3f3f; }
.s_fc_16{ color: #FF0032; }
.s_fc_17{ color: #AAA572; }

.s_bg_11{ background: #FC6B76; }
.s_bg_12{ background: #4FB84A; }
.s_bg_14{ background: #FF0032; }
.s_bg_16{ background: #F7F4F8; }
</style>
<style>
.store_goods_page_wrap .van-nav-bar__arrow{

}
</style>