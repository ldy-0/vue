<template>
  <div class="page_wrap my_page_wrap">
    <van-nav-bar title="我的" fixed></van-nav-bar>

    <user ref="user" :config="userConfig"></user>

    <!-- 余额/德分/积分 -->
    <div class="score_box">
      <div class="score_item" v-for="(info, infoIndex) in statisticList" :key="infoIndex" @click="goApp(info)">
        <div class="score_num">{{userInfo ? userInfo[info.from] : 0}}</div>
        <div class="score_title">{{info.title}}</div>
      </div>
    </div>

    <!-- 签到 -->
    <sign v-if="activate"></sign>

    <!-- 订单 -->
    <div class="order">
      <div class="title">
        <div>我的订单</div>

        <div class="title_right flex s_fc_9" @click="goOrderList">
          <span>查看全部订单</span>
          <van-icon class="i_right_arrow" name="arrow" color="#999" /> 
        </div>
      </div>

      <div class="order_box">
        <div class="order_item" v-for="(item,index) in orderStatusList" :key="index" @click="goOrderList(item)">
          <img class="order_img" :src="item.img" alt="">
          <div class="order_status">{{item.title}}</div>
        </div>
      </div>
    </div>

    <!--  -->
    <!-- <img class="activity" src="../assets/images/my/user_bg.png" alt=""> -->

    <div class="service">
      <div class="title">
        <div>我的服务</div>
      </div>
      <div class="service_box">
        <div class="service_item" v-for="(i,index) in serviceList" :key="index" @click="goModule(i, $event)">
          <img :class="['service_img','service_img'+index]" :src="i.img" alt="">
          <div class="service_title">{{i.title}}</div>
        </div>
      </div>
    </div>

    <!--  -->
    <div class="service">
      <div class="title">
        <div>我的工具</div>
      </div>
      <div class="service_box">
        <div class="service_item" v-for="(i,index) in toolList" :key="index" @click="goModule(i, $event)">
          <img :class="['service_img','tool'+index]" :src="i.img" alt="">
          <div class="service_title">{{i.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Search } from 'vant';
import user from '@/components/my/user';
import sign from '@/components/my/sign';
import * as apiUser from '@/api/user';
import valid from '@/utils/valid';
import * as gd from '@/utils/global';
import * as app from '@/utils/app';

export default {
  components: {
    [Search.name]: Search,
    user,
    sign,
  },
  data() {
    return {
      userConfig: {
        parent: 'my',
        user: null,
      },

      statisticList: [
        { title: '余额', type: 'distribution', from: 'available_predeposit', },
        { title: '互转德分', type: 'exchange', from: 'recharge_rc_balance', url: '/pages/my/dScore/index?type=exchange', },
        { title: '消费德分', type: '', from: 'available_rc_balance', url: '/pages/my/dScore/index?type=consume', },
        { title: '积分', type: 'point', from: 'member_points', }, 
      ],

      orderStatusList: [
        { id: 10, title: '待付款', name: 'orderList', img: require('../assets/images/icon_3_daifukuan@2x.png') },
        { id: 20, title: '待发货', name: 'orderList', img: require('../assets/images/icon_3_daifahuo@2x.png') },
        { id: 30, title: '待收货', name: 'orderList', img: require('../assets/images/icon_3_daishouhuo@2x.png') },
        { id: 50, title: '待评价', name: 'orderList', img: require('../assets/images/icon_3_daipingjia@2x.png') },
        { id: 0,  title: '售后', name: 'afterSaleList', img: require('../assets/images/icon_3_shouhou@2x.png') },
      ],

      serviceList: [
        { title: '我的优惠券', img: require('../assets/images/my/coupon.png') },
        { title: '团购订单', img: require('../assets/images/my/groupbuy.png'), nam: 'groupOrderList', query: { status: gd.GROUPING }, },
        { title: '秒杀订单', img: require('../assets/images/my/seckill.png'), nam: 'seckillOrderList', },
        { title: '砍价订单', img: require('../assets/images/my/bargain.png'), nam: 'bargainOrderList', query: { status: gd.BARGAINING }, },
        { title: '商品收藏', img: require('../assets/images/my/collection.png') },
        { title: '店铺关注', img: require('../assets/images/my/follow.png') },
        { title: '我的店铺', img: require('../assets/images/my/store.png') },
        { title: '分享购购', img: require('../assets/images/my/share.png'), name: 'share', },
      ],
      toolList: [
        { title: '分销中心', img: require('../assets/images/my/distribution.png') },
        { title: '地址管理', img: require('../assets/images/my/address.png'), name: 'addressList', },
        { title: '名片管理入口', img: require('../assets/images/my/card_my.png') },
        { title: '联系客服', img: require('../assets/images/my/contact.png') },
        { title: '店铺管理', img: require('../assets/images/my/store_manage.png') },
        { title: '健德名片', img: require('../assets/images/my/card.png') },
        { title: '意见留言', img: require('../assets/images/my/distribution.png') },
        { title: '关于健德购购', img: require('../assets/images/my/logo.png') },
      ],

      userInfo: null,
      activate: false,
    };
  },

  computed: {
    isBack() { return this.$route.meta.isBack; },
  },

  methods: {
    goOrderList(item) {
      let type = gd.NORMAL_ORDER;

      if(!valid.isAuth()) return this.$router.push({ name: 'login', query: { type: 'login', }, });

      // 全部订单
      if(!item.name) item = { name: 'orderList', query: { type, status: 0 }, };

      this.$router.push({ name: item.name, query: { type, status: item ? item.id : 0, }, });
    },

    goModule(item) {
      let name = item.name,
          query = {};

      if(!name) return this.goApp(item);
      if(name === 'share') this.goShare();

      if(item.query) query = item.query;

      this.$router.push({ name, query, });
    },

    // 分享购购
    goShare() {
      location.href = `${process.env.VUE_APP_SHARE_URL}?type=share`;
    },

    goApp(item) {
      this.$router.push({ name: 'app', query: {  } });
    },

    async getUser(){
      if(!valid.isAuth()){
        this.userInfo = this.userConfig.user = null;
        return this.$refs.user.init();
      }

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let param = {};

      let res = await apiUser.getUser();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取用户信息!')

      if(res && res.status == 0){
        localStorage.setItem('user', JSON.stringify(res.data));
      }

      this.userInfo = this.userConfig.user = gd.getUser("user");
      this.$refs.user.init();

      this.$toast.clear();
    },
  },

  activated(){
    scrollTo(0, 0);

    this.getUser();
    this.activate = true;
  },

  deactivated(){
    this.activate = false;
  }
};
</script>
<style lang='less' scoped>
.page_wrap{
  padding: 128px 0 0;
}

.score_box {
  height: 150px;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: row;
  .score_item {
    width: 25%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 20px 10px;
    box-sizing: border-box;
    .score_num {
      color: #5dbe5b;
      font-size: 36px;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
      white-space: nowrap;
      text-align: center;
    }
    .score_title {
      font-size: 24px;
    }
  }
}
.activity {
  width: 100%;
  height: 170px;
  margin-top: 20px;
}
.title {
  height: 66px;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  color: #333;
  font-size: 24px;
  .title_right {
    align-items: center;
  }
}
.order {
  width: 100%;
  background: #fff;
  margin-top: 20px;
  .order_box {
    height: 163px;
    padding: 40px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    .order_item {
      width: 20%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;
      color: #666;
    }
    .order_img {
      width: 44px;
      height: 38px;
    }
  }
}
.service {
  background: #fff;
  margin-top: 20px;
  .service_box {
    height: 290px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .service_item {
      width: 25%;
      height: 125px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      font-size: 24px;
      color: #666;
      padding: 10px 0;
      box-sizing: border-box;
    }
    .service_img {
      width: 38px;
      height: 38px;
    }
    .service_img5,
    .service_img6 {
      width: 38px;
      height: 34px;
    }
    .service_img4 {
      width: 32px;
      height: 39px;
    }
    .tool0{
      width: 45px;
      height: 38px;
    }
    .tool1{
      width: 26px;
    }
    .tool4{
      width: 44px;
    }
    .tool2,.tool5{
      width: 50px;
    }
  }
}

.i_right_arrow{
  font-size: 30px;
  margin: 0 0 0 12px;
}
</style>
<style>
.my_page_wrap .van-nav-bar{
  z-index: 3 !important;
}
</style>
