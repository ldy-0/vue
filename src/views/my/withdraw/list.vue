<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <van-nav-bar :title="title" fixed></van-nav-bar>

    <div class="status_wrap flex s_bg_f">
      <div class="status_item" :class="item.id === status ? ['s_fc_f', 's_bg_13'] : ['s_fc_13', 's_bg_f']" v-for="(item, index) in statusList" :key="index" @click="changeStatus(item)">{{item.name}}</div>
    </div>

    <van-pull-refresh class="list_wrap" v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">

        <div class="info between s_bg_f" v-for="(item, index) in list" :key="index">
          <div class="s_fc_9">
            <div class="info_title s_fc_3">{{item.typeStr}}</div>
            <div class="info_desc s_fc_14">{{item.time}}</div>
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
import * as Type from '@/utils/type';

export default {
  components: {
    [Field.name]: Field,
  },

  data() {
    return {
      DOING: 0,
      DONE: 1,
      titleObj: {
        distribution: {
          0: '提现明细',
          1: '提现明细',
        },
      },

      statusList:[
        { name: "提现中", id: 0, class: 'doing', },
        { name: "已完成", id: 1, class: 'done' },
      ],
      typeMap: {
        distribution: '奖金提现(¥)',
      },

      type: '',
      status: 0,
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
    title() { return this.isDistribution ? this.titleObj[this.type][this.status] : this.titleObj[this.status]; },
    capital(){ return this.type.charAt(0).toUpperCase() + this.type.slice(1); },
    isDoing(){ return this.status === this.DOING; },
    isDone(){ return this.status === this.DONE; },
    isDistribution(){ return this.type === 'distribution' },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      if(!query.type) return console.error('明细页面未设置类型!');

      this.type = query.type;

      if(query.class){
        let res = this.statusList.filter(v => v.class == query.class)[0];
        this.status = res ? res.id : 0;
      }

      this.getList();
    },

    changeStatus(item) {
      this.status = item.id;

      this.list = [];
      this.page = 1;
      this.finished = false;

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
      // 余额提现
      if(this.isDistribution){
        time = v.pdc_addtime ? Type.getTime(v.pdc_addtime) : '';
      }

      v.typeStr = this.typeMap[this.type];  // 余额收益
      v.time = time; // 余额收益

      v.score = `-${v.pdc_amount}`; // 余额提现
      // 余额预收益
      if(this.isDistribution && this.isPre) v.score = v.commission;

      v.orderSn = v.order_sn ? `订单编号：${v.order_sn}` : '';

      return v;
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, status: this.status, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiUser[`get${this.capital}WithdrawList`](param);
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
  padding: 128px 0 0;
}

.status_wrap{
  box-sizing: border-box;
  height: 98px;
  padding: 18px 30px;
  font-size: 28px;
  text-align: center;
}
.status_item{
  flex-grow: 1;
  line-height:60px;
  border: 2px solid #4fb84a;
}

.info{
  align-items: center;
  box-sizing: border-box;
  padding: 30px;
  border-top: 1px solid #ddd;
}
.info_title{
  font-size: 30px;
}
.info_desc{
  min-height: 24px;
  margin: 20px 0 0;
  font-size: 24px;
}
.info_value{
  font: normal bold 28px 'Microsoft YaHei';
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #494949; }

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