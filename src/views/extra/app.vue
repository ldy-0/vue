<style scoped>
.ctx_wrap{
  width: 100%;
  min-height: 100vh;
  font-size: 15px;
}

.tip_wrap{
  position: fixed;
  top: 0;
  right: 20px;
  text-align: right;
}
.tip{
  margin: 10px 0 0;
  padding: 20px 20px 30px 20px;
}
.tip::before{
  position: absolute;
  top: 5px;
  right: 20px;
  content: '';
  width: 20px;
  height: 20px;
  background: #fff;
  transform: rotate(45deg);
}
.i_tip{
  width: 122px;
  height: 94px;
}

.app_wrap{
  text-align: center; 
}
.app_logo{
  width: 98px;
  height: 98px;
}
.app_title{
  /* margin: 7px 0 0; */
  font-size: 22px;
}
.app_desc{
  font-size: 7px;
}
.app_tip{
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
}

.bold{ font-weight: bold; }

.fs28{ font-size: 28px; }

.s_fc_10{ color: #FF5734; }
.s_fc_11{ color: #F98558; }
.s_fc_12{ color: #00B1FF; }
.s_fc_13{ color: #090405; }
.s_fc_14{ color: #070303; }

/* .s_bg_10{ background: rgba(red, green, blue, alpha); } */
.s_bg_11{ background: #FFFBE2; }
</style>

<template>
  <div class='ctx_wrap center s_bg_3'>

    <div class='tip_wrap' v-if="isWxBrowser">
      <div class="tip fs28 s_bg_f">
        <div class="bold s_fc_12">点击右上角</div>
        <div> 选择“<span class="bold s_fc_12">在浏览器中打开</span>”就能下载啦！</div>
      </div>
    </div>
    
    <!-- <div class='app_wrap s_fc_13'>
      <img class='app_logo' src='@img/share/logo_bg.png' />
      <div class='app_title'>健德购购</div>
      <div class='app_desc'> 一款超级的互联网新电商购物综合系统</div>
      <div class='app_tip s_fc_14'>品质生活来自购购</div>
    </div> -->

  </div>
</template>

<script>
import * as api from '@/api/common';

export default {
  components: {
  },

  data(){
    return {
      wxStr: '微信内置浏览器不支持跳转, 点击右上角用浏览器打开',
      qqStr: 'QQ浏览器不支持跳转, 请使用浏览器打开',
      shareTitle: '购物返利 分享赚钱',
      shareSubTitle: '每周红包雨  优惠不停歇',
      downloadUrl: 'http://qr02.cn/Cbv10Z',
      rainPackagePath: '/rainPackage/ongoing',

      stateMap: {
        home: { type: 'home', title: '首页', url: 'healthapp://main', iosUrl: 'jdsthealth://open?type=main', query: null, img: 'IMG_ROOT/share/download.png' },
        shop: { type: 'shop', title: '店铺分享', url: 'healthapp://open/shop?id=', iosUrl: 'jdsthealth://open?', query: null, img: 'IMG_ROOT/share/download.png' },
        shopdetail: { type: 'shopdetail', title: '店铺商品分享', url: 'healthapp://open/shopdetail?good_common_id=', iosUrl: 'jdsthealth://open?', query: null, img: 'IMG_ROOT/share/share.png' },
      },
      state: { type: '', title: '', desc: '', },

      interval: null,

      token: null,
      info: null,
      header: { token: null, },
      
      modalInfo: null,

      submited: false,
    };
  },

  computed: {
    isWxBrowser(){ return /MicroMessenger|mqqbrowser|qzone|qqbrowser/.test(navigator.userAgent); }, 
  },

  methods: {
    invokeApp(){
      let agent = navigator.userAgent,
          state = this.state,
          url;

      if(/MicroMessenger/i.test(agent)){
        return alert(this.wxStr);
      }

      if(/mqqbrowser|qzone|qqbrowser/i.test(agent)) return alert(this.qqStr);

      if(/ipad|iphone|ipod|ios/i.test(agent)){
        url = state.iosUrl;

        if(this.state.type === 'shop') url += `type=shop&id=${state.query.id}`;
        if(this.state.type === 'shopdetail') url += `type=shopdetail&id=${state.query.good_common_id}`;
      }else{
        url = state.url;

        if(this.state.type === 'shop') url += `${state.query.id}`;
        if(this.state.type === 'shopdetail') url += `${state.query.good_common_id}&type=1`;
      }

      let startTime = new Date().getTime();

      // url = 'weixin://'; // 'alipays://platformapi/startapp'
      // console.log(url);
      location.href = url;
     
      this.createTimer(startTime);
    },

    createTimer(startTime){
      this.interval = setTimeout(() => { 
        let endTime = new Date().getTime();

        let hasApp = !startTime || endTime - startTime > 2500 || document.hidden || document.webkitHidden;
        // alert(endTime - startTime + document.hidden + document.webkitHidden);
        if(!hasApp) location.href = this.downloadUrl; 
      }, 2000);
    },

    updateState(type){
      if(!type) return ;

      this.state = this.stateMap[type] || {};
    },

    format(v){
      if(!v) return ;

      // 兼容ios
      // v.start_time = v.start_time.replace(/-/g, '/');
      // v.end_time = v.end_time.replace(/-/g, '/');

      return v;
    },

    countDown(timeStamp){
      if(typeof timeStamp == 'string') timeStamp = new Date(timeStamp).getTime();

      this.interval = setInterval(() => { this.updateDate(timeStamp--); }, 1000);
    },

  },

  activated(){
    let query = this.$route.query;

    this.updateState(query.type || 'home');
    this.state.query = query;
    // 跳转app
    this.invokeApp();
  },

  destroyed(){
    if(this.interval) clearTimeout(this.interval);
  },

  beforeRouteLeave(to, from, next){
    console.error('leave');

    if(this.interval) clearInterval(this.interval);

    next();
  },

}
</script>
