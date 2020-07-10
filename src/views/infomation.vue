<template>
  <div class="infomation">
    <van-nav-bar :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="btns around s_bg_f">
      <van-button class="btn" round color="#43B87E" text="合伙共赢" @click="go('vipGoodsList')"></van-button>
      <van-button class="btn" round color="#43B87E" text="购购商城" @click="go('publicGoodsList')"></van-button>
      <van-button class="btn" round color="#43B87E" text="商企招商" @click="goApp('business')"></van-button>
    </div>

    <div>
      <van-tabs @scroll="tabScroll" v-model="classIndex" @change="getInfo" sticky :border="false" :ellipsis="false" line-height="2" :offset-top="64"
        :color="isFiexd?'#fff':'#43B87E'" :title-inactive-color="isFiexd?'#fff':'#000'"
        :title-active-color="isFiexd?'#fff':'#43B87E'" :background="isFiexd?'#43B87E':'#fff'">
        <van-tab v-for="item in navList" :key="item.classify_id" :title="item.classify_name">
          <van-list class="list_wrap" v-model="loading" :finished="finished" finished-text="没有更多资讯了" @load="onLoad">

            <div v-for="k in list" :key="k.information_id">
              <div class="info" @click="toDetail(k.information_id)">
                <img class="info_img" :src="k.information_image" alt="" />

                <div class="info_text">
                  <div class="info_title">{{k.information_title}}</div>
                  <div class="info_desc">{{k.information_desc}}</div>
                  <div class="info_time s_fc_9">{{k.addtime | dateFormat}}</div>
                </div>
              </div>
            </div>

          </van-list>
        </van-tab>
      </van-tabs>

          
    </div>
  </div>
</template>
<script>
import { Card } from 'vant';
import navBar from '@/components/navBar';
import request from '@/utils/request';
import * as api from '@/api/common';

export default {
  components: {
    [Card.name]: Card,
    navBar: navBar
  },
  data() {
    return {
      configInfo: {},

      isFiexd: false,
      navList: [],
      classIndex: 0,

      list: [{}],
      loading: false,
      finished: false
    };
  },

  computed: {
    title(){ return '公司动态'; },
    isBack() { return this.$route.meta.isBack; },

    firstClassTitle() { 
      let menus = this.configInfo.menus;

      return menus ? menus[0].appName : '合作共赢';
    },
  },
  
  methods: {
    tabScroll(e) {
      this.isFiexd = e.isFixed;
    },

    goBack() {
      this.$router.go(-1);
    },

    goApp(type) {
      this.$router.push({ name: 'app', query: {}, });
    },

    go(name) {
      this.$router.push({ name, });
    },

    onLoad() {
      this.finished = true;
      this.loading = false;
    },

    async getList() {
      let res = await request.get('/api/v2/member/informationclass', { params: { limit: 0 } });
      if (res.status == 0) {
        this.navList = res.data;
        this.getInfo(this.classIndex);
      }
    },
    async getInfo(e) {
      let id = this.navList[e].classify_id;

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });
      
      let res = await request.get('/api/v2/member/information', { params: { classify_id: id } });
      if (res.status == 0) {
        this.list = res.data;
      }

      this.$toast.clear();
    },

    async getConfig() {
      let param = {};

      let res = await api.getConfig(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取背景配置信息失败!')

      if(res && res.data){
        this.configInfo = res.data;
      }
    },

    toDetail(id) {
      this.$router.push({ path: '/infoDetail', query: { id: id } })
    },
  },

  activated() {
    this.getConfig();

    this.getList();
  },
};
</script>
<style lang='less' scoped>
.infomation{
  padding: 128px 0 0;
}

.btns {
  height: 130px;
  align-items: center;
  .btn {
    font-size: 28px;
    width: 200px;
    height: 80px;
    line-height: 80px;
  }
}

.list_wrap{
  min-height: 100vh;
}

.info {
  display: flex;
  flex-direction: row;
  height: auto;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
  background: #fff;
}
.info_text {
  width: 60%;
  min-height: 200px;
}
.info_title {
  font-size: 32px;
  color: #000;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: bold;
}
.info_desc {
  margin: 10px 0 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  color: #666;
  font-size: 24px;
  margin-bottom: 40px;
}
.info_time {
  margin: 80px 0 0;
  font-size: 22px;
}
.info_img {
  width: 206px;
  height: 206px;
  border-radius: 20px;
}
</style>
<style>
.infomation .van-nav-bar{
  background: #43b87e;
}
.infomation .van-nav-bar__title{
  color: #fff;
}

.infomation .van-tabs__wrap {
  padding: 0 20px;
  background: #fff;
}
.infomation .van-tab {
  box-sizing: content-box;
  padding: 0 40px;
}
.infomation .van-sticky--fixed .van-tabs__wrap {
  padding: 0 20px;
  background: #43b87e;
}
.infomation .van-tab--active .van-tab__text {
  font-weight: 600;
}
.infomation .van-tabs__nav--line {
  padding-bottom: 20px;
}
.infomation .van-tabs__line {
  width: 30px !important;
}
.infomation .van-tabs--line .van-tabs__wrap {
  height: 102px !important;
}
.infomation .van-sticky--fixed {
  top: 88px !important;
}
</style>
