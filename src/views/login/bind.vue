<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <!-- Form -->
    <div class="form_wrap s_bg_f">
      <!-- 昵称 -->
      <van-field class="form_input_wrap" :border="false" v-model="name.value" :label="name.title" :placeholder="name.placeholder" error-message="" clearable>
        <img slot="label" class="i_name" src="../../assets/images/login/name.png" alt=""/>
      </van-field>

      <van-field class="form_input_wrap" type="number" :border="false" v-model="phone.value" :label="phone.title" :placeholder="phone.placeholder" @input="getMobile" error-message="" clearable>
        <img slot="label" class="i_phone" src="../../assets/images/login/phone.png" alt=""/>
      </van-field>

      <!-- 验证码 -->
      <van-field class="form_input_wrap" :border="false" v-model="captcha.value" :label="captcha.title" :placeholder="captcha.placeholder">
        <img slot="label" class="i_code" src="../../assets/images/login/code.png" alt=""/>
        <captcha :config="captchaConfig" class="captcha_btn s_fc_f s_bg_11" slot="button"></captcha>
      </van-field>

      <!-- 推荐码 -->
      <van-field class="form_input_wrap" type="number" :border="false" v-model="invite.value" :label="invite.title" :placeholder="invite.placeholder" error-message="" clearable :readonly="hasInvite">
        <img slot="label" class="i_invite" src="../../assets/images/login/name.png" alt=""/>
      </van-field>

      <!-- 用户协议 -->
      <div class="agreement_wrap flex s_fc_9">
        <van-checkbox v-model="agreement.value" shape="square" checked-color="#D30D1B" icon-size="18px"></van-checkbox>
        <div class="agreement_title_wrap">已阅读<span class="s_fc_12" @click="goAgreement">《用户协议》</span></div>
      </div>

      <div class="submit_wrap">
        <van-button round color="#FC6A79" class="submit_btn" size="small" type="primary" @click="submit">完 成</van-button>

        <div class="form_desc_wrap s_fc_9">若无邀请码 请输入：{{systemInvite}}</div>
      </div>
    </div>

    <!-- logo -->
    <!-- <div class="logo_wrap">
      <img class="i_logo" src="../../assets/images/my/logo.png" />
      <div class="logo_title s_fc_3">品质生活来购购</div>
    </div> -->

  </div>
</template>
<script>
import { Field, } from 'vant';
import * as apiUser from '@/api/user';
import captcha from '@/components/captcha';
import snsLogin from '@/components/snsLogin';
import * as gd from '@/utils/global';

export default {
  components: {
    [Field.name]: Field,
    captcha,
    snsLogin,
  },

  data() {
    return {
      LOGIN: 'login',
      REGISTER: 'register',
      type: 'login',

      systemInvite: '',

      sharerId: null,

      captchaConfig: {
        title: '获取验证码',
        mobile: '',
        type: 5,
      },

      name: { type: 'input', title: '昵称', value: '', placeholder: '请输入昵称', rule: { test: /^.+$/, message: '昵称填写不正确!', }, disabled: false, },
      phone: { type: 'input', title: '手机号', value: '', placeholder: '请输入手机号', rule: { test: /^1\d{10}$/, message: '手机号填写不正确!', }, disabled: false, },
      captcha: { type: 'input', title: '验证码', value: '', placeholder: '请输入验证码', rule: { test: /^.+$/, message: '验证码填写不正确!', }, disabled: false, },
      invite: { type: 'input', title: '邀请码', value: '', placeholder: '请输入邀请码', rule: { test: /^1\d{10}$/, message: '邀请码填写不正确!', }, disabled: false, },
      agreement: { type: 'checkbox', title: '用户协议', value: '', rule: { test: /^true$/, message: '请同意用户协议!', }, disabled: false, },
    };
  },

  computed: {
    isRegister(){ return this.type === 'register'; },

    isBack() { return this.$route.meta.isBack; },
    code() { return this.$route.query.code; },

    hasInvite(){ return this.sharerId ? true : false; },
  },

  methods: {
    getMobile(v) {
      this.captchaConfig.mobile = v;
    },

    goAgreement() {
      this.$router.push('agreement');
    },

    isIllegal() {
      let arr = [this.invite, this.captcha, this.phone, this.name],
          agreement = this.agreement,
          item;

      arr.unshift(this.agreement);

      for(let i = arr.length - 1; i >= 0; i--){
        item = arr[i];
        if(item.rule && !item.rule.test.test(item.value)) return this.$toast.fail(item.rule.message), 1;
      }
    },

    submit() {
      let param = {};

      if(this.isIllegal()) return ;

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      param.member_nick = this.name.value;
      param.member_mobile = this.phone.value;
      param.inviter_mobile = this.invite.value;
      param.code = this.captcha.value;

      this.save(param);
    },

    async save(param) {
      let res = await apiUser.applyMember(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '申请会员失败!');

      this.$router.go(-3);
      this.$toast.clear();
    },

    async getUser() {
      let param = { source: 6, code: this.code, };

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiUser.login(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '登录失败!');

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('time', Date.now());
      
      res = await apiUser.getUser();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取用户信息失败!');
      if(res.data){
        localStorage.setItem('user', JSON.stringify(res.data));
        res.data.wx_bind && res.data.member_mobile ? localStorage.getItem('isFirst') == 'true' ? this.$router.replace({ name: 'home', }) : this.$router.go(-2) : '';
      }

      this.$toast.clear();
    },

    async getSystemInviter() {
      let res = await apiUser.getSystemInviter();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取系统推荐码失败!')

      if(res && res.data) this.systemInvite = res.data;
    },
  },

  activated() {
    let sharerId = localStorage.getItem('sharerId');
    
    if(this.isBack) return ;

    this.type = 'register';
    this.getSystemInviter();

    // 分享人Id
    if(sharerId){
      this.sharerId = sharerId;
      this.invite.value = localStorage.getItem('sharerMobile');
    }

    this.getUser();

    addEventListener('pagehide', e => {
      let user = gd.getUser();

      if(user && !user.member_mobile){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      removeEventListener('pagehide');
    });
  },

};
</script>
<style lang='less' scoped>
.page_wrap{
  height: 100vh;
}

.form_wrap{
  position: absolute;
  top: 140px;
  left: calc(50% - 315px);
  box-sizing: border-box;
  width: 630px;
  // height: 730px;
  padding: 30px 60px 40px;
  border-radius: 16px;
}
.form_input_wrap{
  padding: 45px 0 20px;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.form_desc_wrap{
  margin: 24px 0 0;
  font-size: 24px;
  text-align: center;
}
.captcha_btn{
  width: 160px;
  padding: 10px 0;
  font-size: 24px;
  border-radius: 10px;
  text-align: center;
}
.agreement_wrap{
  margin: 25px 0 0; 
}
.agreement_title_wrap{
  margin: 0 0 0 24px;
}

.submit_wrap{
  margin: 50px 0 0;
}
.submit_btn{
  width: 508px;
  height: 88px;
  font-size: 28px;
}

.logo_wrap{
  position: fixed;
  bottom: 85px;
  width: 100%;
  text-align: center;
}
.logo_title{
  margin: 30px 0 0;
  font-size: 35px;
  font-weight: 900;
  letter-spacing: 4px;
  text-indent: 4px;
}

.i_phone{
  width: 30px;
  height: 40px;
}
.i_code{
  width: 36px;
  height: 40px;
}
.i_name, .i_invite{
  width: 40px;
  height: 40px;
}
.i_logo{
  width: 200px;
  height: 200px;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }

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