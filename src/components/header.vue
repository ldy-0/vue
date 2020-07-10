<template>
  <div>
    <div class="header" :style="{'background':bgColor}">
      <div class="header_back" @click="back">
        <img class="icon_zuo" src="../assets/images/icon_zuo.png" alt="">
      </div>
      <div class="header_title">{{title}}</div>
      <div class="header_search" v-if="showSearch">
        <img class="header_search-icon" src="../assets/images/home/search.png" alt="">
        搜索
      </div>
      <img v-if="showSearch" class="header_icon" src="../assets/images/home/qrcode.png" alt="二维码" @click="goApp">
      <!-- <img v-if="showSearch" class="header_icon" src="../assets/images/home/contact.png" alt="消息"> -->
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
    bgColor: {
      default: '#fff',
      type: String
    },
    title: {
      type: String,
      default: '健德商城',
      required: false,
    },
    showSearch: {
      type: Boolean,
      default: true,
      required: false,
    }
  },
  created() {

  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    goApp() {
      this.$router.push({ name: 'app', query: {}, });
    },
  }
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
  justify-content: space-between;
  z-index: 99;
  padding: 0 20px;
  box-sizing: border-box;
  .header_back {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.3);
    position: absolute;
    left: 0;
    border-radius: 0 25px 25px 0;
    text-align: center;
    line-height: 55px;
  }
  .header_title {
    width: 150px;
    color: #fff;
    font-size: 36px;
    padding-left: 50px;
  }
  .header_icon {
    width: 40px;
    height: 40px;
  }
  .header_search {
    width: 354px;
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
.space {
  width: 100%;
  height: 88px;
}
.icon_zuo {
  width: 16px;
  height: 26px;
}
</style>