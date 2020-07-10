<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title[type]" fixed @click-left="goBack"></van-nav-bar>

    <user ref="user" :config="userConfig"></user>

    <div class="statistic_list_wrap s_bg_f">
      <div class="between">
        <div class="statistic_wrap" v-for="(statistic, statisticIndex) in statisticList" :key="statisticIndex">
          <div class="statistic_title">{{statistic.title}}</div>
          <div class="statistic_num s_fc_13">{{statistic.num}}</div>

          <div class="statistic_desc s_fc_13" v-if="statistic.desc" @click="goApp('pre')">{{statistic.desc}}</div>
        </div>
      </div>

      <div class='statistic_list_desc s_fc_9' v-if="isPoint">积分可用于普通商品消费</div>

      <div v-if="isDistribution">
        <div class='statistic_list_desc distribution_list_desc s_fc_9'>可提现佣金<span class="s_fc_3">{{statisticInfo.available_predeposit}}</span>元</div>

        <div class="withdraw_btn s_fc_f s_bg_13" @click="goWithdraw">提现</div>
      </div>
    </div>
    
    <!-- 收入/支出 -->
    <div class="record_list_wrap between" v-if="isPoint || isAsset">
      <div class="record_wrap flex center s_bg_f" v-for="(record, recordIndex) in recordList" :key="recordIndex" @click="goApp(record)">
        <img class="i_record" :src="record.src" />

        <div class="record_title">{{record.title}}</div>
      </div>
    </div>

    <!-- 我的/推广 -->
    <div class="record_list_wrap between" style="margin-top: 20px;" v-if="isDistribution">
      <div class="record_wrap flex center s_bg_f" v-for="(record, recordIndex) in distributionModuleList" :key="recordIndex" @click="goDistribution(record)">
        <img class="i_record" :src="record.src" />

        <div>
          <div class="record_title">{{record.title}}</div>
          <div class="record_desc s_fc_9">{{record.desc}}</div>
        </div>
      </div>
    </div>

    <!-- 分销明细列表 -->
    <div class="distribution_record_list_wrap s_bg_f" v-if="isDistribution">
      <div class="distribution_record_wrap between center" v-for="(item, index) in distributionRecordList" :key="index" @click="goRecordList(item)">
        <div>{{item.title}}</div>
        <van-icon name="arrow" color="#999" /> 
      </div>
    </div>

    <!-- 积分说明 -->
    <div class="point_tip_wrap s_fc_9" v-if="isPoint">
      <div class="point_tip" v-for="(tip, tipIndex) in pointTipList" :key="tipIndex">{{tip}}</div>
    </div>

    <!-- 资产说明 -->
    <div class="asset_tip_wrap s_fc_9" v-if="isAsset">
      <div class="asset_tip_title s_fc_3">资产说明</div>
      <div v-html="about"></div>
    </div>

    <!-- 余额说明 -->
    <div class="point_tip_wrap s_fc_9" v-if="isDistribution">
      <div class="point_tip" v-for="(tip, tipIndex) in distributionTipList" :key="tipIndex">{{tip}}</div>
    </div>

  </div>
</template>
<script>
import { Field, } from 'vant';
import * as apiUser from '@/api/user';
import user from '@/components/my/user';
import valid from '@/utils/valid';

export default {
  components: {
    [Field.name]: Field,
    user,
  },

  data() {
    return {
      userConfig: {
        parent: 'asset',
        user: null,
      },
      title: {
        asset: '我的资产',
        point: '积分中心',
        distribution: '分销中心',
      },

      pointStatisticList: [
        { title: '可用积分', num: 0, from: 'member_points', },
        { title: '预计收益', num: 0, from: 'commission', desc: '查看明细', },
      ],
      assetStatisticList: [
        { title: '我的总资产', num: 0, from: 'available_assets', },
        { title: '电商预收资产', num: 0, from: 'commission', desc: '查看明细', },
      ],
      distributionStatisticList: [
        { title: '总收益(元)', num: 0, from: 'total_predeposit' },
        { title: '预计收益(元)', num: 0, from: 'commission' },
      ],
      statisticList: [],
      
      recordList: [
        { src: require("../../assets/images/dScore/in.png"), title: "收入明细", type: 'in', },
        { src: require("../../assets/images/dScore/out.png"), title: "支出明细", type: 'out', },
      ],
      distributionModuleList:[
        { src:require("../../assets/images/distribution/group.png"), title: "0", desc:"我的团队", name: 'distributionChildren', },
        { src: require('../../assets/images/distribution/invite.png'), title:"邀请好友", desc:"扫码推广", name: 'distributionQrcode', }
        // "https://cdn.health.healthplatform.xyz/icon/mall/logo.png",
      ],
      distributionRecordList: [
        { title: "收益明细", type: 'in', },
        { title: "提现明细", name: 'withdrawList', type: 'doing', },
        { title: "预收益明细", type: 'pre', },
      ],

      pointTipList: [
        '温馨提示：过了售后期才发放积分',
        '1、15天自动收货后，积分到账',
        '2、手动点击确认收货7天后，积分到账',
      ],
      distributionTipList: [
        '温馨提示：过了售后期才会发放奖金',
        '1.15天自动收货后，奖金到账',
        '2.手动点击“确认收货”7天后，奖金到账',
      ],

      type: '',
      userInfo: null,
      about: null, // 资产说明
      statisticInfo: {},
    };
  },

  computed: {
    isPoint(){ return this.type === 'point'; },
    isAsset(){ return this.type === 'asset'; },
    isDistribution(){ return this.type === 'distribution'; },
    capital(){ return this.type.charAt(0).toUpperCase() + this.type.slice(1); },
    isBack() { return this.$route.meta.isBack; },
  },

  methods: {
    init() {
      let route = this.$route;

      this.type = this.userConfig.parent = route.name;
      this.statisticList = this[`${this.type}StatisticList`];
    },

    goBack() {
      this.$router.back();
    },

    goApp(item) {
      this.$router.push({ name: 'app', query: {}, });
    },

    goRecordList(type) {
      let name = type.name;

      if(typeof type === 'object') type = type.type;

      let o = { name: name || 'recordList', query: { type: this.type, class: type, }, };

      this.$router.push(o);
    },

    goDistribution(item) {
      this.$router.push({ name: item.name, });
    },

    goWithdraw() { this.$router.push({ name: 'goWithdraw', query: { parent: 'distribution' }, }); },

    async getUser(){
      if(!valid.isAuth()) return ;

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let param = {};

      let res = await apiUser.getUser();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取用户信息失败!');

      if(res && res.status == 0){
        localStorage.setItem('user', JSON.stringify(res.data));
      }

      this.userInfo = this.userConfig.user = JSON.parse(localStorage.getItem("user"));
      this.$refs.user.init();

      // 获取预收益信息
      res = await apiUser[`get${this.capital}`]();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取预收益信息失败!');

      if(res && res.status == 0){
        this.statisticList.forEach(v => v.num = res.data[v.from]);
        this.statisticInfo = res.data;

        if(this.isAsset) this.about = res.data.about;

        if(this.isDistribution) this.distributionModuleList[0].title = res.data.junior;
      }

      this.$toast.clear();
    },
  },

  activated() {
    if(this.isBack) return ;

    this.init();

    this.getUser();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  box-sizing: border-box;
  height: 100vh;
  padding: 128px 0 0;
}

.statistic_list_wrap{
  margin: 30px 30px 0;
  padding: 60px 60px 70px;
  border-radius: 8px;
  font-size: 28px;
  text-align: center;
}
.statistic_title{
  font-size: 36px;
  letter-spacing: 1px;
}
.statistic_num{
  margin: 48px 0 0;
  font-size: 60px;
  font-weight: bold;
  letter-spacing: 2px;
}
.statistic_desc{
  margin: 10px 0 0;
  font-size: 24px;
}
.statistic_list_desc{
  margin: 30px 0 0;
}
.distribution_list_desc{
  font-size: 30px;
}

.withdraw_btn{
  width: 519px;
  height: 70px;
  line-height: 70px;
  margin: 40px auto 0;
  border-radius: 35px;
  font-size: 30px;
  letter-spacing: 1px;
}

.record_list_wrap{
  margin: 60px 30px 0;
}
.record_wrap{
  width: 336px;
  height: 139px;
  font-size: 28px;
  border-radius: 10px;
}
.record_title, .record_desc{
  margin:  0 0 0 20px;
}

.distribution_record_list_wrap{
  margin: 40px 30px 0;
}
.distribution_record_wrap{
  padding: 30px;
  border-bottom: 1px solid #ddd;
  font-size: 30px;
}

.point_tip_wrap{
  margin: 40px 30px 0;
  font-size: 24px;
}
.point_tip{
  margin: 10px 0 0;
}

.asset_tip_wrap{
  margin: 40px 30px 0;
}
.asset_tip_title{
  font-size: 28px;
  font-weight: bold;
}

.i_record{
  width: 48px;
  height: 48px;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
.login_page_wrap .van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}

.login_page_wrap .van-field__label{
  display: flex;
  width: 90px;
}
</style>