<template>
  <div class="user_container s_fc_f">
    <div class="form_wrap s_bg_f5">
      <van-field class="input_wrap" v-model="account.value" :label="account.title" />

      <van-field class="input_wrap" v-model="bankName.value" :label="bankName.title" />

      <van-field class="input_wrap" v-model="bankUser.value" :label="bankUser.title" type="digit" />

      <van-field class="input_wrap" v-model="amount.value" :label="amount.title" type="number" />
    </div>
    
    <div class="withdraw_btn s_fc_11 s_bg_13" @click="submit">提交</div>
  </div>
</template>
<script>
import * as apiCommon from '@/api/common';
import valid from '@/utils/valid';

export default {
  props: {
    config: {
      type: Object,
    },
  },

  data() {
    return {
      doing: false,

      account: { type: 'input', title: '提现账号', value: '', to: 'pdc_bank_no', },
      bankName: { type: 'input', title: '开户支行', value: '', to: 'pdc_bank_name', },
      bankUser: { type: 'input', title: '账户姓名', value: '', to: 'pdc_bank_user', },
      amount: { type: 'input', title: '提现金额', value: '', rule: { test: /^\d+(\.\d{1,2})?$/, message: '', }, to: 'pdc_amount', },
    };
  },

  computed: {
  },

  methods: {
    init() {
      let config = this.config;

      console.log(config);
      this.parent = config.parent;
      this.user = config.user;
    },

    goBack() {
      this.$router.back();
    },

    isIllegal() {
      let arr = [this.account, this.bankName, this.bankUser, this.amount];
      
      let res = arr.filter(v => v.rule ? !v.rule.test.test(v.value) : !v.value)[0];

      if(res) return this.$toast.fail(res.rule ? res.rule.message : `${res.title}填写不正确!`), true;
    },

    submit() {
      let arr = [this.account, this.bankName, this.bankUser, this.amount],
          param = {};
          

      if(this.doing || this.isIllegal()) return ;
      this.doing = true;

      arr.forEach(v => param[v.to] = v.value);

      this.save(param);
    },

    async save(param) {
      console.log(param);

      this.doing = false;
      this.$toast.clear();
    },
    
    async auth(e) {
      let param = {},
          type = e.target.dataset.type,
          config = this.config;

      return this.$emit('done', type);
      // param.mobile = config.mobile;
      // param.type = config.type;

      // let res = await apiCommon.getSmsCode(param);

      // if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取验证码失败!'), this.clearInterval();

    },

    
  },

  created() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.form_wrap{
  padding: 0 0 10px;
}
.input_wrap{
  height: 88px;
  padding: 0 30px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 30px;
  line-height: 88px;
}

.withdraw_btn{
  width: 690px;
  height: 70px;
  line-height: 70px;
  margin: 220px auto 0;
  font-size: 36px;
  border-radius: 10px;
  text-align: center;
}

.s_fc_11 { color: #fdfbfa; }

.s_bg_13{ background: #4FB84A; }
</style>
<style>
.van-field__label{
  width: 140px;
  color: #222;
}
</style>
