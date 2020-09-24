<template>
  <div id="app" class="page_wrap">
    <g-header></g-header>    

    <div class="main">
      <router-view/>
    </div>

    <g-footer :config="footConfig"></g-footer> 
  </div>
</template>
<script>
import gHeader from '@/components/g-header';
import gFooter from '@/components/g-footer';

export default {
  components: {
    gHeader,
    gFooter,
  },

  data(){
    return {
      footConfig: {
        company: '博伦科欣有限公司',
        domain: 'vip.com',
      },
    };
  },

  methods: {
    
  },

  created() {
  },

}
</script>
<style>
body{
  min-height: 100%;
  margin: 0;
  word-break: break-all;
}
p, ul{
  margin: 0;
}
ul{
  padding: 0;
}

@font-face {
  font-family: 'PingFangSC';
  src: url('../public/font/PingFangSC-Regular.woff2');
}

#app {
  font-family: 'PingFangSC', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: none;
}

.page_wrap{
  padding: 80px 0 0;
}

.flex, .center, .between{
  display: flex;
  align-items: center;
}

.center{
  justify-content: center;
}

.between{
  justify-content: space-between;
}

.img{
  width: 100%;
  height: 100%;
}
.bg{
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto;
}

.ellipsis{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bold{ font-weight: bold; }

.mt10{ margin-top: 10px; }
.mt20{ margin-top: 1vw; }
.mt30{ margin-top: 1.5vw; }
.mt50{ margin-top: 50px; }
.mt70{ margin-top: 70px; }
.mt80{ margin-top: 4vw; }

.ml10{ margin-left: 10px; }
.ml20{ margin-left: 20px; }
.ml30{ margin-left: 30px; }
.ml50{ margin-left: 50px; }
.ml90{ margin-left: 90px; }

.mr15{ margin-right: 15px; }
.mr20{ margin-right: 20px; }

.fs14{ font-size: 14px; }
.fs16{ font-size: 16px; }
.fs22{ font-size: 22px; }
.fs24{ font-size: 24px; }
.fs30{ font-size: 30px; }

.s_fc_main{ color: #32B48E; }
.s_fc_f{ color: #fff; }

.s_bg_0{ background: #000; }
.s_bg_f{ background: #fff; }
.s_bg_f5{ background: #F5F5F5; }
</style>
