<template>
  <div>
    <div class="header" :class="{ header_home: isHome }" :style="{'background':bgColor}">
      <van-icon name="arrow-left" size="20" color="#fff" @click="goBack"></van-icon>

      <!-- <img class="header_icon" src="../assets/images/home/scan.png" alt="扫码" v-if="!title"> -->

      <div class="title s_fc_f" v-if="title">{{title}}</div>

      <router-link class="header_search" to="/search">
        <img class="header_search-icon" src="../assets/images/home/search.png" alt="">
        搜索
      </router-link>

      <!-- <img class="header_icon" src="../assets/images/home/scan.png" alt="分享" v-if="!title"> -->
      <!-- <van-icon class="i_share" name="share" size="20" color="#fff" v-if="!title" /> -->

      <img class="header_icon" src="../assets/images/home/qrcode.png" alt="二维码" @click="goApp">
      <!-- <img class="header_icon" src="../assets/images/home/contact.png" alt="消息"> -->
    </div>
    <div class="space"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  props: {
    title: {
      type: String,
    },
    bgColor: {
      default: '#fff',
      type: String
    }
  },

  computed: {
    isHome(){ return this.$route.name == 'home'; },
  },

  created() {

  },
  methods: {
    goBack(){
      this.$router.back();
    },

    goApp() {
      this.$router.push({ name: 'app', query: {}, });
    },
  },
}
</script>
<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 88px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  z-index: 99;
  .header_icon {
    width: 40px;
    height: 40px;
  }
  .header_search {
    width: 450px;
    height: 50px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 25px;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 28px;
    .header_search-icon {
      width: 30px;
      height: 30px;
      margin: 0 10px 0 20px;
    }
  }
}

.header_home{
  height: 120px;
  padding: 20px 0 0;
}

.title{
  font-size: 40px;
}

.space {
  width: 100%;
  height: 88px;
}
</style>