<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <van-nav-bar :title="title" fixed></van-nav-bar>

    <van-pull-refresh class="list_wrap" v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">

        <div class="info between s_bg_f" v-for="(item, index) in list" :key="index">
          <div class="s_fc_9">
            <div class="info_title s_fc_3">{{item.typeStr}}</div>
            <div class='info_desc' v-if="showOrderSn">{{item.orderSn}}</div>
            <div class="info_desc">{{item.time}}</div>
          </div>

          <div class="info_value s_fc_13">{{item.score}}</div>
        </div>

      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { Field, } from 'vant';
import * as apiUser from '@/api/user';
import snsLogin from '@/components/snsLogin';

export default {
  components: {
    [Field.name]: Field,
    snsLogin,
  },

  data() {
    return {
      PRE: 'pre',
      IN: 'in',
      OUT: 'out',
      titleObj: {
        pre: '预收明细',
        in: '收入明细',
        out: '支出明细',
        distribution: {
          in: '收益明细',
        },
      },

      typeMap: {
        order_pay: '购物抵扣积分',
        order: '购物返积分',
        order_refund: '退款返积分',
        luckymoney: '红包雨',
        change_points: '转换积分',
        order_inviter: '销售奖',
      },
      distributionType: {
        order_inviter: '奖金返现(¥)',
        agent_commission: '对接人返现(¥)',
        pre: '预收益(¥)',
      },

      type: '',
      class: '',
      refreshing: false,
      loading: false,
      finished: false,

      page: 1,
      limit: 10,
      total: 0,
      list: [],
    };
  },

  computed: {
    title() { 
      let o = this.titleObj,
          child = o[this.type];
      return child && child[this.class] ? child[this.class] : o[this.class]; 
    },
    capital(){ return this.type.charAt(0).toUpperCase() + this.type.slice(1); },
    isIn(){ return this.class === this.IN; },
    isOut(){ return this.class === this.OUT; },
    isPre(){ return this.class === this.PRE; },
    isDistribution(){ return this.type === 'distribution' },
    showOrderSn(){ return ['point', 'distribution'].indexOf(this.type) !== -1 || this.class === this.PRE; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      if(!query.type) return console.error('明细页面未设置类型!');

      this.type = query.type;
      this.class = query.class;

      this.getList();
    },

    onRefresh(e) {
      this.finished = false;
      this.list = [];
      this.page = 1;

      this.loading = true;
      this.getList();
    },

    onLoad(e) {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      this.getList();
    },

    format(v) {
      let time;
      // 余额收益
      if(this.isDistribution && this.isIn){
        time = new Date(v.lg_addtime * 1000);
        time = time ? `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}` : '';
      }

      v.typeStr = v.log_description || this.typeMap[v.pl_stage] || this.distributionType[v.lg_type];  // 资产收入/支出 积分收入/支出  余额收益
      v.time = v.pl_addtime || v.log_addtime || v.payment_time || time; // 积分收入/支出  资产收入/支出  积分/资产/余额预收益  余额收益

      v.score = `${this.isOut ? '' : '+'}${v.pl_points || v.available_amount || v.goods_integral || v.assets_commission || v.lg_av_amount}`; // 积分收入/支出  资产收入/支出  积分预收益  资产预收益  余额收益
      // 余额预收益
      if(this.isDistribution && this.isPre) v.score = `${v.commission}`;

      // 积分
      if(['order', 'order_pay', 'order_refund'].indexOf(v.pl_stage) !== -1) v.order_sn = `${v.pl_desc.match(/\d{10,}/g)}`;
      // 余额
      if(v.lg_desc)  v.order_sn = v.lg_desc.replace(/^订单|返佣金$/g, '');

      v.orderSn = v.order_sn ? `订单编号：${v.order_sn}` : '';

      return v;
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      if(this.isOut) param.reduce = 1;

      let res = await apiUser[`get${this.capital}List`](param, this.class);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取明细信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.list.lenght;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },
  },

  created() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  height: 100vh;
}

.list_wrap{
  margin: 128px 0 0;
}

.info{
  align-items: center;
  box-sizing: border-box;
  padding: 30px;
  border-top: 1px solid #ddd;
}
.info_title{
  font-size: 28px;
}
.info_desc{
  min-height: 24px;
  margin: 12px 0 0;
  font-size: 24px;
}
.info_value{
  font: normal bold 36px 'Microsoft YaHei';
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }

.s_bg_11{ background: #FC6B76; }
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