<template>
  <div class="ticket_page_wrap">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="module_list_wrap">
      <div class="module_wrap between s_bg_f" v-for="(item, index) in externalList" :key="index">
        <img class="i_module" :src="item.img" alt="">
        
        <div class="module_info_wrap">
          <div class="module_title s_fc_3">{{item.title}}</div>
          <div class="module_desc s_fc_9">{{item.desc}}</div>
          <div class="go_btn s_fc_f s_bg_11" @click="goExternal(item)">去订票</div>
        </div>
      </div>
      <div class="s_bg_f">
        
      </div>
    </div>
  </div>
</template>
<script>
import { Search } from 'vant';
import navBar from '@/components/navBar';
import * as api from '@/api/common';
import request from '@/utils/request';
export default {
  components: {
    navBar: navBar
  },
  data() {
    return {
      externalList: [
        { url: 'https://train.ztlvx.com', type: 'TRAIN', title: '火车票预定', desc: '让回家的路近一些，排队？拥挤？不是问题!', img: require('../../assets/images/ticket/train.png'), },
        { url: 'https://hotal.ztlvx.com', type: 'hotel', title: '酒店预定', desc: '人生且如梦，远方亦有家！', img: require('../../assets/images/ticket/hotel.png'), },
        { url: 'https://flight.ztlvx.com', type: 'FLIGHT', title: '飞机票预定', desc: '生活如同旅行，旅行就是体味不同的人生。', img: require('../../assets/images/ticket/flight.png'), },
      ],

    };
  },

  computed: {
    title(){ return '票务系统'; },
  },

  activated() {
    
  },
  methods: {
    async goExternal(o) {
      let res = await api.getTicketAuth({ url: o.type, });
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(`票务授权失败!`), this.doing = false;

      if(res.data) location.href = res.data;
    },

    goBack() {
      this.$router.back();
    },
    
  }
};
</script>
<style lang='less' scoped>
.ticket_page_wrap{
  padding: 128px 0 0;
}
.module_list_wrap{
  padding: 0 20px;
}
.module_wrap{
  align-items: center;
  margin: 24px 0 0;
  padding: 30px;
  border-radius: 12px;
}
.module_info_wrap{
  flex-grow: 1;
  text-align: right;
}
.module_title{
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 2px;
}
.module_desc{
  margin: 10px 0 0;
  font-size: 24px;
}
.go_btn{
  display: inline-block;
  width: 180px;
  height: 60px;
  margin: 40px 0 0;
  line-height: 60px;
  text-align: center;
  border-radius: 30px;
}

.i_module{
  flex-shrink: 0;
  width: 180px;
  height: 180px;
}

.s_bg_11 { background: #72C3D8; }
</style>
<style>

</style>