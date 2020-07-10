<template>
  <div class="page_wrap login_page_wrap s_bg_f">
    <van-nav-bar :title="title" fixed></van-nav-bar>

    <div class="withdraw_wrap s_fc_f">
      <div class="withdraw_info s_fc_9">
        <div class="s_fc_13">{{total}}</div>

        <div class="withdraw_desc">当前余额(元)</div>
      </div>
    </div>

    <distribution-withdraw :config="withdrawConfig" v-if="isDistribution"></distribution-withdraw>

  </div>
</template>
<script>
import * as apiUser from '@/api/user';
import distributionWithdraw from '@/components/my/withdraw/distribution';

export default {
  components: {
    distributionWithdraw,
  },

  data() {
    return {
      DISTRIBUTION: 'distribution',
      type: null,

      withdrawInfo: {},
      total: 0,

      withdrawConfig: {},
    };
  },

  computed: {
    title() { return '提现详情'; },
    isDistribution(){ return this.type === this.DISTRIBUTION; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = this.withdrawConfig.parent = query.type;
      this.getInfo();
    },

    goBack() {
      this.$router.back();
    },

    async getInfo() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiUser.getWithdraw(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取提现信息失败!')

      if(res && res.data){
        this.withdrawInfo = res.data;
        this.total = res.data.available_predeposit;
      }

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

.withdraw_wrap{
  padding: 50px 0 40px;
  border-bottom: 10px solid rgb(248, 248, 248);
  text-align: center;
  letter-spacing: 1px;
}
.withdraw_info{
  font-size: 60px;
}
.withdraw_desc{
  margin: 40px 0 0;
  font-size: 30px;
}

.info_value{
  font: normal bold 36px 'Microsoft YaHei';
}

.ml10{ margin: 0 0 0 10; }

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
</style>