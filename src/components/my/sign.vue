<template>
  <div class="user_container s_fc_f">
    <div v-if="sign">
      <img class="sign_banner" :src="sign.banner" alt="" @click="openSignDialog">
      <div class="sign_btn_wrap s_bg_15" :class="[sign.is_signin ? 's_fc_6' : 's_fc_12']" @click="openSignDialog">{{sign.is_signin ? '已签' : '签到' }}</div>
    </div>

    <!-- 签到弹窗 -->
    <div class="sign_dialog_wrap s_bg_2" v-if="showSignDialog" @click="closeSignDialog">

      <div class="sign_wrap s_bg_12" @click.stop=";">
        <van-icon class="i_close" name="close" size="40" @click="closeSignDialog" />
        <!-- 进行中 -->
        <div v-if="time == 0">
          <img class="i_redPackage" src="../../assets/images/my/redPackage.png" alt="">

          <div class="sign_title_wrap s_fc_11">
            <div>签到成功</div>
            <div>获得{{sign.amount}}个红包</div>
          </div>

          <div class="sign_btn s_fc_f s_bg_13" @click.stop="signIn">确定</div>

          <div class="sign_desc_wrap s_fc_6">
            <div>红包将按一定比例转入“我的资产”中</div>
            <div>请在“我的资产”中查看明细</div>
          </div>
        </div>
        
        <!-- 未开始 -->
        <div v-if="time > 0">
          <div class="sign_title_wrap mt100 s_fc_12">距离签到还剩</div>

          <van-count-down class="countdown_ctn_wrap" :time="time" @finish="changeStatus">
            <template v-slot="time">
              <!-- <span class="countdown_ctn s_fc_f s_bg_14">{{time.days > 9 ? '' : '0'}}{{time.days}}</span>
              <span class="countdown_ctn s_fc_15">:</span> -->
              <span class="countdown_ctn s_fc_f s_bg_14">{{time.hours > 9 ? '' : '0'}}{{time.hours}}</span>
              <span class="countdown_desc s_fc_15">时</span>
              <span class="countdown_ctn s_fc_f s_bg_14">{{time.minutes > 9 ? '' : '0'}}{{time.minutes}}</span>
              <span class="countdown_desc s_fc_15">分</span>
              <span class="countdown_ctn s_fc_f s_bg_14">{{time.seconds > 9 ? '' : '0'}}{{time.seconds}}</span>
              <span class="countdown_desc s_fc_15">秒</span>
            </template>
          </van-count-down>

          <div class="sign_time_wrap s_fc_6">
            <div>签到时间</div>
            <div>{{sign.signin_start_time}}-{{sign.signin_end_time}}</div>
          </div>

          <div class="waiting_btn s_fc_13 s_bg_15">敬请期待</div>

          <div class="sign_desc_wrap s_fc_6">
            <div>红包将按一定比例转入“我的资产”中</div>
            <div>请在“我的资产”中查看明细</div>
          </div>
        </div>

        <!-- 已结束 -->
        <div v-if="time < 0">
          <div class="sign_title_wrap mt80 s_fc_12">
            <div>本次签到活动已结束</div>
            <div>感谢参入！</div>
          </div>

          <img class="i_done" src="../../assets/images/my/done.png" alt="" />

          <div class="sign_btn s_fc_f s_bg_13" @click="closeSignDialog">好的</div>
        </div>
        
      </div>
    </div>
    
  </div>
</template>
<script>
import * as apiCommon from '@/api/common';
import * as apiUser from '@/api/user';
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

      sign: null,
      showSignDialog: false,

      time: 0,
    };
  },

  computed: {
  },

  methods: {
    openSignDialog() {
      if(this.sign.is_signin) return ;

      this.showSignDialog = true;
      this.format(this.sign);
    },

    closeSignDialog() {
      this.showSignDialog = false;
    },

    changeStatus() {
      this.time = 0;
    },

    async signIn(e) {
      let param = {};

      let res = await apiUser.sign(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '签到失败!');

      if(res && res.data){
        this.$toast.success(`签到成功!`);
        this.getSign();
      }
    },

    format(v) {
      let start = new Date(v.start_time.replace(/-/g, '/')),
          end,
          current = new Date();
      
      // 活动未开始
      if(current < start) return ;

      start = new Date(`${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()} ${v.signin_start_time}`);
      end = new Date(`${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()} ${v.signin_end_time}`);

      if(current < start) this.time = start.getTime() - current.getTime();
      if(current >= start && current <= end) this.time = 0;
      if(end < current) this.time = end.getTime() - current.getTime();

      return v;
    },
    
    async getSign(e) {
      let param = {};

      let res = await apiUser.getSign(param);

      if(res && res.data){
        this.sign = this.format(res.data);
      }
    },
    
  },

  created() {
    this.getSign();
  },
};
</script>
<style lang='less' scoped>
.user_container{
  position: relative;
}

.sign_banner{
  width: 100%;
  height: 120px;
}

.sign_dialog_wrap{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.sign_wrap{
  position: absolute;
  top: calc(50% - 325px);
  left: calc(50% - 280px);
  width: 560px;
  height: 650px;
  border-radius: 10px;
  text-align: center;
}
.sign_title_wrap{
  font-size: 40px;
  font-weight: bold;
}
.sign_btn{
  width: 440px;
  height: 88px;
  margin: 30px auto 0;
  line-height: 88px;
  font-size: 36px;
  border-radius: 44px;
}
.sign_desc_wrap{
  width: 410px;
  margin: 20px auto 0;
  font-size: 24px;
}
.sign_time_wrap{
  margin: 60px 0 0;
  font-size: 24px;
}

.countdown_ctn_wrap{
  margin: 70px 0 0;
  font-size: 20px;
}
.countdown_ctn{
  display: inline-block;
  padding: 20px 12px;
  margin: 0 2px;
  font-size: 40px;
  text-align: center;
}
.countdown_desc{
  position: relative;
  top: 20px;
}

.waiting_btn{
  width: 440px;
  height: 88px;
  margin: 30px auto 0;
  line-height: 88px;
  font-size: 36px;
  border-radius: 44px;
}

.sign_btn_wrap{
  position: absolute;
  right: 20px;
  top: 35px;
  padding: 8px 32px;
  font-size: 26px;
  font-weight: bold;
  border-radius: 30px;
}

.i_close{
  position: absolute;
  right: -80px;
  top: -80px;
}
.i_redPackage{
  width: 410px;
  height: 290px;
}
.i_done{
  width: 192px;
  height: 168px;
  margin: 40px 0 0;
}

.mt100{ margin-top: 100px; }
.mt80{ margin-top: 80px; }

.s_fc_11 { color: #CBAF72; }
.s_fc_12 { color: #F6402A; }
.s_fc_13 { color: #1C1E13; }

.s_bg_11 { background: #3A903C; }
.s_bg_12 { background: #FFF9F1; }
.s_bg_13 { background: #CEA15D; }
.s_bg_14 { background: #1C1E13; }
.s_bg_15 { background: #F9DFB8; }
</style>