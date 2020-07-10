<template>
  <div class="page_wrap login_page_wrap">
    <div class="title_nav_wrap s_bg_11"></div>

    <!-- Form -->
    <van-tabs @change="changeTab" v-model="activeName" background="#FC6A79" title-inactive-color="#fff" :border="false" color="#fff" title-active-color="#fff" line-width="20">
      <van-tab title="登陆" name="login">
        <div class="form_wrap">
          <van-field class="form_input_wrap" type="number" :border="false" v-model="phone.value" :label="phone.title" :placeholder="phone.placeholder" @input="getMobile" error-message="" clearable>
            <img slot="label" class="i_phone" src="../../assets/images/login/phone.png" alt=""/>
          </van-field>

          <van-field class="form_input_wrap" :border="false" v-model="code.value" :label="code.title" :placeholder="code.placeholder">
            <img slot="label" class="i_code" src="../../assets/images/login/code.png" alt=""/>
            <captcha ref="loginCaptcha" :config="captchaConfig" class="captcha_btn s_fc_f s_bg_11" slot="button"></captcha>
          </van-field>
        </div>
      </van-tab>

      <van-tab title="注册" name="register">
        <div class="form_wrap">
          <van-field class="form_input_wrap register_input_wrap" :border="false" v-model="name.value" :label="name.title" :placeholder="name.placeholder">
            <img slot="label" class="i_name" src="../../assets/images/login/name.png" alt=""/>
          </van-field>

          <van-field class="form_input_wrap register_input_wrap" type="number" :border="false" v-model="phone.value" :label="phone.title" :placeholder="phone.placeholder" @input="getMobile" error-message="" clearable>
            <img slot="label" class="i_phone" src="../../assets/images/login/phone.png" alt=""/>
          </van-field>

          <van-field class="form_input_wrap register_input_wrap" :border="false" v-model="code.value" :label="code.title" :placeholder="code.placeholder">
            <img slot="label" class="i_code" src="../../assets/images/login/code.png" alt=""/>
            <captcha ref='registerCaptcha' :config="captchaConfig" class="captcha_btn s_fc_f s_bg_11" slot="button"></captcha>
          </van-field>

          <van-field class="form_input_wrap register_input_wrap" type="number" :border="false" v-model="invite.value" :label="invite.title" :placeholder="invite.placeholder" error-message="" clearable :readonly="hasInvite">
            <img slot="label" class="i_invite" src="../../assets/images/login/name.png" alt=""/>
          </van-field>
          <div class="form_desc_wrap s_fc_9">若无邀请码 请输入：{{systemInvite}}</div>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 登录 -->
    <div class="submit_wrap">
      <van-button round color="#FC6A79" class="submit_btn" :class="{ register_submit_btn: isRegister }" size="small" type="primary" @click="submit">{{isRegister ? '注 册' : '登 录'}}</van-button>

      <div class="other_login_wrap s_fc_9" v-if="isWxBrowser">
        <div class=""><span class="other_login_title">第三方登录</span></div>
        <sns-login class="other_login" @done="loginSns"></sns-login>
      </div>
    </div>

    <!-- logo -->
    <div class="logo_wrap" :class="{ register_logo_wrap: isRegister }">
      <img class="i_logo" src="../../assets/images/my/logo.png" />
      <div class="logo_title s_fc_3">品质生活来购购</div>
    </div>

  </div>
</template>
<script>
import { Field, Toast } from 'vant';
import * as apiUser from '@/api/user';
import captcha from '@/components/captcha';
import snsLogin from '@/components/snsLogin';
import valid from '@/utils/valid';

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
      activeName: 'login',

      systemInvite: '',
      
      sharerId: null,

      captchaConfig: {
        title: '获取验证码',
        mobile: '',
        type: 6,
      },

      name: { type: 'input', title: '昵称', value: '', placeholder: '请输入昵称', rule: { test: /^.+$/, message: '昵称填写不正确!', }, disabled: false, },
      phone: { type: 'input', title: '手机号', value: '', placeholder: '请输入手机号', rule: { test: /^1\d{10}$/, message: '手机号填写不正确!', }, disabled: false, },
      code: { type: 'input', title: '验证码', value: '', placeholder: '请输入验证码', rule: { test: /^.+$/, message: '验证码填写不正确!', }, disabled: false, },
      invite: { type: 'input', title: '邀请码', value: '', placeholder: '请输入邀请码', rule: { test: /^1\d{10}$/, message: '邀请码填写不正确!', }, disabled: false, },
    };
  },

  computed: {
    isRegister(){ return this.activeName === 'register'; },

    isBack() { return this.$route.meta.isBack; },
    isFirst() { return this.$route.meta.isFirst; },

    isWxBrowser(){ return valid.isWxBrowser(); },

    hasInvite(){ return this.sharerId ? true : false; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query,
          sharerId = localStorage.getItem('sharerId');

      if(query.type) this.activeName = query.type;

      // 分享人Id
      if(sharerId){
        this.sharerId = sharerId;
        this.invite.value = localStorage.getItem('sharerMobile');
      }

      this.getSystemInviter();
    },

    changeTab() {
      this.captchaConfig.type = this.isRegister ? 5 : 6;

      this.phone.value = '';
      this.code.value = '';

      this.isRegister ? this.$refs.loginCaptcha.clearInterval() : this.$refs.registerCaptcha.clearInterval();
    },

    getMobile(v) {
      this.captchaConfig.mobile = v;
    },

    isIllegal() {
      let arr = [this.code, this.phone],
          item;
      
      if(this.isRegister){
        arr.push(this.name);
        arr.unshift(this.invite);
      }

      for(let i = arr.length - 1; i >= 0; i--){
        item = arr[i];
        if(item.rule && !item.rule.test.test(item.value)) return this.$toast.fail(item.rule.message), 1;
      }
    },

    submit() {
      let param = { source: 6, action: this.isRegister ? 'register' : 'login', };

      if(this.isIllegal()) return ;

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      param.member_mobile = this.phone.value;
      param.captcha_code = this.code.value;

      if(this.isRegister){
        param.member_nick = this.name.value;
        param.inviter_mobile = this.invite.value;
      }

      this.save(param);
    },

    async save(param) {
      let res = await apiUser.login(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '登录失败!');

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('time', Date.now());
      
      res = await apiUser.getUser();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取用户信息失败!');
      if(res.data) localStorage.setItem('user', JSON.stringify(res.data));
      
      localStorage.getItem('isFirst') == 'true' ? this.$router.replace({ name: 'home', }) : this.$router.back();
      this.$toast.clear();
    },

    loginSns(type) {
      
    },

    async getSystemInviter() {
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });
      
      let res = await apiUser.getSystemInviter();
      if(!res || typeof res === 'string' || res.error) return Toast.fail(res ? res.error || res : '获取系统推荐码失败!')

      if(res && res.data) this.systemInvite = res.data;

      this.$toast.clear();
    },
  },

  activated() {
    if(this.isBack) return ;

    this.init();
  },

  beforeRouteEnter(to, from, next){
    // 是否为非跳转登录
    localStorage.setItem('isFirst', from.path == '/');
    next();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  height: 100vh;
  background: #fff;
}
.title_nav_wrap{
  height: 120px;
}

.form_wrap{
  box-sizing: border-box;
  padding: 0 120px;
}
.form_input_wrap{
  padding: 45px 0 20px;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.form_input_wrap{
  padding: 40px 0 10px;
}
.form_desc_wrap{
  margin: 20px 0 0;
}
.captcha_btn{
  width: 160px;
  padding: 10px 0;
  font-size: 24px;
  border-radius: 10px;
  text-align: center;
}

.submit_wrap{
}
.submit_btn{
  position: relative;
  left: calc(50% - 254px);
  width: 508px;
  height: 88px;
  margin: 50px 0 0;
  font-size: 28px;
}
.register_submit_btn{
  margin: 20px 0 0;
}
.other_login_wrap{
  margin: 30px 0 0;
  text-align: center;
}
.other_login_title{
  position: relative;
  font-size: 24px;
}
.other_login_title::before, .other_login_title::after{
  content: '';
  position: absolute;
  top: 50%;
  width: 80px;
  height: 1px;
  background: #ddd;
}
.other_login_title::before{
  left: -100px;
}
.other_login_title::after{
  right: -100px;
}
.other_login{
  margin: 20px 0 0;
}

.logo_wrap{
  margin: 242px 0 0;
  width: 100%;
  text-align: center;
}
.register_logo_wrap{
  margin: 20px 0 0;
}
.logo_title{
  margin: 10px 0 0;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 4px;
  text-indent: 4px;
  transform: scale(0.8, 0.8);
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
  width: 130px;
  height: 130px;
}

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