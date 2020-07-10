<template>
  <div>
    <img class="i_wx" src="../assets/images/login/wx.png" alt="no found" data-type="wx" @click="auth" />

    <div class="wx_login_wrap" v-show="authing" @click="closeAuth">
      <div id="wxSns" class="wx_login"></div>
    </div>
  </div>
</template>
<script>
import * as apiCommon from '@/api/common';
import * as apiUser from '@/api/user';
import valid from '@/utils/valid';
import * as gd from '@/utils/global';
import wxlogin from 'vue-wxlogin';
import '@/utils/wxlogin'

export default {
  props: {
    config: {
      type: Object,
    },
  },

  components: {
    wxlogin,
  },

  data() {
    return {
      authing: false,
    };
  },

  computed: {
  },

  watch: {
  },

  methods: {
    closeAuth() {
      this.authing = false;
    },

    async auth(e) {
      let param = { source: 6, },
          type = e.target.dataset.type,
          url = `${location.origin}/${process.env.VUE_APP_BIND_URL}#/bind`,
          config = this.config;

      url = encodeURIComponent(`https://m.gogo.jdecology.com/web/wxLogin.html?url=${encodeURIComponent(url)}`);
      location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${gd.appid}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=a#wechat_redirect`;
      // this.authing = true;

      // return this.$emit('done', type);
    },

    
  },

  activated() {
    console.log(this.authing);
  },
};
</script>
<style lang='less' scoped>

.i_wx{
  width: 60px;
  height: 60px;
}
</style>
<style>
.wx_login_wrap{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.8)
}
.wx_login{
  position: relative;
  top: 20%;
}
</style>
