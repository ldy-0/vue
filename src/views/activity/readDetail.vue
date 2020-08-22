<template>
  <div class="page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class='goods_wrap'>
      <div class='goods_name s_fc_3'>{{detail.title}}</div>

      <div class='goods_desc flex s_fc_9'>
        <div>{{detail.desc}}</div>
        <div class='goods_view_wrap flex'>
          <img class='i_view' src='../../assets/images/activity/view.png' />
          <div class='goods_view'>{{detail.view}}</div>
        </div>
      </div>

      <div class='detail_wrap' v-html="detailInfo"></div>
    </div>

    <div class="bottom_bar_wrap flex s_fc_f">
      <div class='share_btn flex center s_bg_14' @click="openShareDialog">
        <span>分享</span>
        <img class='i_share' src='../../assets/images/activity/m_share.png' />
      </div>

      <div class='buy_btn s_bg_13' @click='goGoodsDetail'>购买此商品</div>
    </div>

    <!-- 分享 -->
    <van-dialog v-model="showShareDialog" title="复制链接,打开微信粘贴分享好友" show-cancel-button confirm-button-text="复制" confirm-button-color="#333" cancel-button-color="#999"
                @cancel="closeShareDialog" @confirm="copy">
      <div class="url_wrap s_bg_16">{{url}}</div>
    </van-dialog>

  </div>
</template>
<script>
import moment from 'moment';
import ClipboardJS from 'clipboard';
import * as math from 'mathjs';
import * as apiGoods from '@/api/goods';
import * as gd from '@/utils/global';

export default {
  components: {
  },

  data() {
    return {
      type: null,

      detail: {},
      
      showShareDialog: false,
      url: null,
      clip: null,
    };
  },

  computed: {
    title() { return 'VIP商品解读'; },

    isBack() { return this.$route.meta.isBack; },

    detailInfo(){
      return this.detail.explain && this.detail.explain.replace( /<img/g, "<img style='display: block; width: 100%;'");
    },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;
      this.id = query.id;

      this.recordView();
    },

    goBack() {
      this.$router.back();
    },

    goGoodsDetail() {
      let id = this.detail.goods_commonid;

      this.$router.push({ name: 'goodsDetail', query: { id } });
    },

    openShareDialog() {
      // if(!valid.isAuth()) return this.$router.push({ name: 'login', });

      // if(this.user && !this.user.member_mobile) return this.$router.push({ name: 'login', });

      this.showShareDialog = true;
      this.url = `${location.href}`;
    },

    closeShareDialog() {
      this.showShareDialog = false;
      this.url = '';
    },

    copy() {
      if(this.clip) this.clip.destroy();

      let clip = new ClipboardJS('.van-dialog__confirm', {
        text: e => location.href,
      });

      clip.on('success', e => this.$toast.success(`复制成功!`));
      clip.on('error', e => this.$toast.fail(`复制失败!`));

      this.clip = clip;

      this.recordShare();
    },

    format(order){
      order.order_id = this.id;

      return order;
    },

    async getInfo() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiGoods.getReadGoodsList();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取解读信息失败!')

      if(res && res.data){
        this.detail = this.format(res.data[this.id]);
      }

      this.$toast.clear();
    },

    async recordView(){
      let param = { store_id: 1, };

      const res = await apiGoods.recordReadView(this.id);

      if(!res || typeof res === 'string' || res.error) return console.log(res ? res.error || res : '统计访问失败!');

      this.getInfo();
    },

    async recordShare(){
      let param = { store_id: 1, };

      const res = await apiGoods.recordReadShare(this.id);

      if(!res || typeof res === 'string' || res.error) return console.log(res ? res.error || res : '统计分享失败!');
    },
  },

  activated() {
    if(this.isBack) return ;

    this.init();
  },

  deactivated() {
    if(this.clip) this.clip.destroy();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  padding: 128px 0 110px;
}

.goods_wrap{
  padding: 15px 20px 150px;
}
.goods_name{
  font-size: 36px;
  font-weight: bold;
}
.goods_desc{
  margin: 30px 0 0;
  font-size: 26px;
}
.goods_view_wrap{
  align-self: flex-end;
  margin-left: 20px;
  font-size: 24px;
}
.goods_view{
}
.i_view{
  width: 30px;
  height: 24px;
  margin-right: 10px;
}

.detail_wrap{
  width: 100%;
  margin: 60px 0 0;
}

.bottom_bar_wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 36px;
  text-align: center;
}
.share_btn{
  flex-shrink: 0;
  width: 260px;
  line-height: 100px;
}
.buy_btn{
  flex-grow: 1;
}

.url_wrap{
  margin: 30px 36px;
  padding: 30px 24px;
  font-size: 24px;
  word-break: break-all;
}

.i_goods{
  width: 180px;
  height: 180px;
  border-radius: 10px;
}
.i_share{
  width: 30px;
  height: 34px;
  margin-left: 10px;
}

.ml10{ margin: 0 0 0 10; }

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #202020; }
.s_fc_15{ color: #dd3d27; }
.s_fc_16{ color: #af0000; }
.s_fc_17{ color: #636363; }
.s_fc_18{ color: #282425; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #FF003A; }
.s_bg_14{ background: #58BEB5; }
.s_bg_f5{ background: #f5f5f5; }
.s_bg_16{ background: #F7F4F8; }
</style>
<style>

</style>