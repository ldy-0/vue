<template>
  <div class="banner" :class="{ s_banner: config.isSmall, }">
    <img class="banner_bg" :src="config.bgImg" alt="">

    <van-swipe :autoplay="3000" indicator-color="rgba(82, 190, 79, 1)" class="swipe" :class="{ s_swipe: config.isSmall, }" :stop-propagation="false">
      <van-swipe-item v-for="(image, index) in list" :key="index">

        <img :src="image.banner_pic" @click="goModule(image)" />

      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
import * as api from '@/api/common';
import * as gd from '@/utils/global';
import valid from '@/utils/valid';

export default {
  props: {
    config: {
      type: Object,
    },
  },

  data() {
    return {
      list: [],
    };
  },

  computed: {
    
  },

  methods: {
    goModule(item) {
      // 不做处理
      if(item.banner_type == 0) return ;
      
      // 图片
      if(item.banner_type == 1) return this.$router.push({ name: 'img', query: { url: item.banner_url, } });

      // 商品
      if(item.banner_type == 2) return this.$router.push({ name: 'goodsDetail', query: { id: item.banner_url, } });

      // 公众号
      if(item.banner_type == 3) return location.href = item.banner_url;

      if(item.banner_type == 4){
        if(item.banner_url == 'seckill') return this.$router.push({ name: 'activityGoodsList', query: { type: gd.SECKILL_GOODS, } });
        if(item.banner_url == 'group') return this.$router.push({ name: 'activityGoodsList', query: { type: gd.GROUP_GOODS, } });
        if(item.banner_url == 'bargain') return this.$router.push({ name: 'activityGoodsList', query: { type: gd.BARGAIN_GOODS, } });
        // 红包雨
        if(item.banner_url == 'redPackage') return this.goPackage();
        // 商圈/社区
        if(item.banner_url == 'business') return ;
        // 合作共赢
        if(item.banner_url == 'vip') return this.$router.push({ name: 'vipGoodsList', query: {} });
        // VIP特惠
        if(item.banner_url == 'special') return this.goApp();
        // 直播礼包
        if(item.banner_url == 'gift') return this.$router.push({ name: 'activityGoodsList', query: { type: gd.LIVE_GOODS, } });
      }
    },

    goApp() {
      this.$router.push({ name: 'app', query: {}, });
    },

    async getBanner() {
      let param = {};

      let res = await api.getBanner(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取轮播图信息失败!')

      if(res && res.data){
        this.list = res.data;
      }
    },

  },

  created() {
    this.getBanner();
  },
};
</script>
<style lang='less' scoped>
.banner {
  width: 100%;
  height: 350px;
  margin: 0 0 100px 0;
  position: relative;
  .banner_bg {
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.swipe {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 702px;
  height: 400px;
  border-radius: 20px;
  img {
    width: 702px;
    height: 100%;
  }
}

.s_banner{
  height: 300px;
  margin: 0 0 50px 0;
}
.s_swipe{
  height: 300px;
}
</style>