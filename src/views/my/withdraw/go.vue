<template>
  <div class="page_wrap login_page_wrap s_bg_f">
    <van-nav-bar :title="title" fixed></van-nav-bar>

    <div class="withdraw_wrap s_fc_f">
      <img class="i_withdraw" src = "../../../assets/images/distribution/withDraw.png" />

      <div class="withdraw_info s_fc_9">可提现奖金<span class="ml10 s_fc_13">¥{{total}}</span></div>

      <div class="withdraw_btn s_bg_13" @click="goWithdraw">立即提现</div>
    </div>

  </div>
</template>
<script>
import { Field, } from 'vant';
import * as apiUser from '@/api/user';

export default {
  components: {
    [Field.name]: Field,
  },

  data() {
    return {
      withdrawInfo: {},
      total: 0,
    };
  },

  computed: {
    title() { return '立即提现'; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.getInfo();
    },

    goWithdraw() {
      this.$router.push({ name: 'withdraw', query: { type: 'distribution', }, });
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
  font-size: 24px;
  text-align: center;
  letter-spacing: 1px;
}
.withdraw_info{
  margin: 38px 0 0;
}
.i_withdraw{
  width: 126px;
  height: 126px;
  margin: 50px 0 0;
}
.withdraw_btn{
  width: 690px;
  height: 70px;
  line-height: 70px;
  margin: 60px auto 0;
  font-size: 36px;
  border-radius: 10px;
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

.login_page_wrap .van-field__label{
  display: flex;
  width: 90px;
}
</style>