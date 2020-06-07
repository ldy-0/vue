<template>
  <div @click="getCaptcha">{{message}}</div>
</template>
<script>
import * as apiCommon from '@/api/common';
import captcha from '@/utils/captcha';
import valid from '@/utils/valid';

export default {
  props: {
    config: {
      type: Object,
    },
  },

  data() {
    return {
      captcha: null,

      countDown: 60,
      interval: null,
    };
  },

  computed: {
    message(){ console.log(this.interval); return this.interval ? this.countDown : this.config.title; },
  },

  methods: {
    async getCaptcha() {
      let param = {},
          config = this.config,
          captcha = this.captcha;

      if(!valid.isMobile(config.mobile)) return this.$toast.fail('手机号未填写或填写不正确!');

      if(this.interval) return ;

      if(!captcha) return this.getCaptchaInfo();

      this.countDown = 60;
      this.interval = setInterval(() => { this.countDown <= 0 ? this.clearInterval() : this.countDown-- }, 1000);

      param.mobile = config.mobile;
      param.type = config.type;
      param.randstr = captcha.randstr;
      param.ticket = captcha.ticket;

      let res = await apiCommon.getSmsCode(param);

      this.captcha = null;
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取验证码失败!'), this.clearInterval();

      this.$toast('已发送!');
    },

    clearInterval() {
      clearInterval(this.interval);
      this.interval = null;
    },

    async getCaptchaInfo() {
      let res = await captcha.getCaptcha();

      if(res) this.captcha = res;
    }
  },

  created() { },
};
</script>
<style lang='less' scoped>

</style>