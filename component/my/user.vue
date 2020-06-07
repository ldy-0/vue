<template>
  <div class="user_container s_fc_f">
    <div class="flex user_wrap">
      <img class="i_avatar" :src="user ? user.wx_avatar: avatarImg" alt="">

      <div v-if="user">
        <div class="user_content flex">
          <div class="user_name">{{user.wx_name}}</div>
          <div class="user_level" v-if="isMy">{{level}}</div>
        </div>
        <div class="user_level level_wrap" v-if="showLevel">{{level}}</div>

        <div class="code" v-if="showMobile">推荐码：{{user.member_mobile}}</div>

        <div class="user_level inviter_wrap" v-if="showInviter">推荐人：{{user.inviter_name}}</div>
      </div>

      <button v-else class="login_btn" @click="goLogin">用户请登陆</button>
    </div>

    <!-- 资产入口 -->
    <div class="asset_wrap s_bg_11" @click="goAsset" v-if="isMy">我的资产</div>
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
      MY: 'my',
      avatarImg: require('../../assets/images/my/avatar.png'),
      levelList: [
        { id: 0, name: '体验代理' },
        { id: 1, name: 'VIP1' },
        { id: 2, name: 'VIP2' },
        { id: 3, name: 'VIP3' },
        { id: 4, name: 'VIP4' },
      ],

      parent: 'my',
      user: null,
    };
  },

  computed: {
    isMy(){ return this.parent == this.MY; },
    showLevel(){ return ['asset', 'point'].indexOf(this.parent) !== -1; },
    showMobile(){ return ['my'].indexOf(this.parent) !== -1; },
    showInviter(){ return ['distribution'].indexOf(this.parent) !== -1; },
    level(){
      let memberInfo = this.user,
          level = this.levelList;

      // 游客
      if(!memberInfo) return '游客';

      // 非会员
      if(memberInfo.inviter_id == 0) return '普通用户'; 

      return level.filter(v => v.id === memberInfo.vip_level)[0].name;
    },
  },

  methods: {
    init() {
      let config = this.config;

      this.parent = config.parent;
      this.user = config.user;
    },

    goLogin() {
      this.$router.push('login');
    },

    goAsset() {
      this.$router.push({ name: 'asset' });
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
.user_container{
  position: relative;
  box-sizing: border-box;
  height: 270px;
  padding: 60px 0 0 40px;
  background: url("../../assets/images/my/user_bg.png");
}

.user_wrap{
  align-items: center;
  .user_content {
    .user_name {
      margin: 0 20px;
      font-size: 32px;
    }
  }
  .code {
    margin: 8px 20px 0;
    font-size: 28px;
  }
}
.user_level {
  padding: 0px 20px;
  height: 50px;
  line-height: 50px;
  border-radius: 30px;
  font-size: 28px;
  background: rgba(0, 0, 0, 0.2);
  text-align: center;
}
.level_wrap, .inviter_wrap{
  height: 40px;
  line-height: 40px;
  padding: 0 35px;
  font-size: 24px;
}
.level_wrap{
  margin: 10px 0 0 20px;
}
.inviter_wrap{
  margin: 20px 0 0 20px;
}

.login_btn {
  width: 200px;
  height: 80px;
  margin: 0 0 0 20px;
  font-size: 24px;
  border-radius: 10px;
  border: none;
  background: #deab16;
}

.asset_wrap{
  position: absolute;
  right: 0;
  top: 20px;
  padding: 14px 18px;
  font-size: 28px;
  border-radius: 32px 0 0 32px;
}

.i_avatar{
  width: 122px;
  height: 122px;
  border-radius: 50%;
}

.s_bg_11 { background: #3A903C; }
</style>