<template>
  <div class="pwdSetting_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="form_container">
      <div class="form_wrap s_bg_f">
        <van-field class="input_wrap s_fc_3" type="password" :left-icon="pwd.img" v-model="pwd.value" :label-width="0" :placeholder="pwd.placeholder" />
        <van-field class="input_wrap s_fc_3" type="password" :left-icon="confirm.img" v-model="confirm.value" :label-width="0" :placeholder="confirm.placeholder" />
      </div>

      <div class='tip s_fc_3'>{{tipContent}}</div>

      <div class="submit_btn s_fc_f s_bg_13" @click="submit">确定</div>
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
      pwd: { title: '密码', value: '', rule: { test: /^\d{6}$/, }, to: 'paypwd', placeholder: '请填写6位新密码', img: require('../../../assets/images/dScore/pwd.png'), },
      confirm: { title: '密码', value: '', rule: { test: /^\d{6}$/, }, to: 'paypwd', placeholder: '请确认6位新密码', img: require('../../../assets/images/dScore/pwd.png'), },

      tipContent: '该密码在使用德分的时候需要输入，请牢记您的密码',
      loading: false,

      type: '',
      userInfo: null,
      doing: false,
      address: null,
    };
  },

  computed: {
    title(){ return '设置密码'; },

  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;
      
      this.pwd.value = this.confirm.value = '';
      this.doing = false;
    },

    goBack() {
      this.$router.back();
    },

    isIllegal() {
      let arr = [this.pwd, this.confirm];

      for(var i = 0, len = arr.length; i < len; i++){
        var item = arr[i];
        if(item.rule && !item.rule.test.test(item.value)) return this.$toast.fail(item.rule.message || `${item.title}填写不正确`), true;
      }

      if(this.pwd.value !== this.confirm.value) return this.$toast.fail(`两次密码填写不一致!`), true;
    },

    submit(item) {
      let param = {},
          arr = [this.pwd];

      if(this.doing || this.isIllegal()) return ;
      this.doing = true;
      
      arr.forEach(v => param[v.to] = v.value);

      this.save(param);
    },

    async save(param) {
      let res = await apiUser.setDscorePwd(param);
      
      if(!res || typeof res == 'string' || res.error){
        this.doing = false;
        return this.$toast.fail(res ? res.error || res : `设置失败!`);
      }

      if(res && res.status == 0){
        this.$toast.success(`设置成功!`);

        res = await apiUser.getUser();
        if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取用户信息失败!')
        if(res.data) localStorage.setItem('user', JSON.stringify(res.data));
        this.goBack();
      }
      
    },

    // async getUser(){
    //   if(!valid.isAuth()) return ;

    //   this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

    //   let param = {};

    //   let res = await apiUser.getUser();
    //   if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取用户信息失败!');

    //   if(res && res.status == 0){
    //     localStorage.setItem('user', JSON.stringify(res.data));
    //   }

    //   this.$toast.clear();
    // },
  },

  activated() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.pwdSetting_page_wrap{
  box-sizing: border-box;
  height: 100vh;
  padding: 128px 0 0;
}

.form_container{
  padding: 30px;
}
.form_wrap{
  padding: 0 0 0 50px;
}
.input_wrap{
  box-sizing: border-box;
  height: 100px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 28px;
}
.row_wrap{
  align-items: center;
  padding: 0 30px;
}

.tip{
  margin: 30px 0 0;
  font-size: 26px;
}

.submit_btn{
  width: 690px;
  height: 70px;
  margin: 80px 0 0;
  line-height: 70px;
  font-size: 36px;
  border-radius: 10px;
  text-align: center;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
.pwdSetting_page_wrap .van-field__left-icon .van-icon .van-icon__image{
  width: 31px;
  height: 41px;
}

</style>