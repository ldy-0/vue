<template>
  <div>
    <van-nav-bar :class="className" :title="title" left-text="" :left-arrow="arrow" @click-left="onClickLeft" @click-right="onClickRight">
      <slot></slot>
    </van-nav-bar>
    <div class="space"></div>
  </div>
</template>
<script>
import { NavBar } from 'vant';
import request from '@/utils/request';
export default {
  components: {
    [NavBar.name]: NavBar,
  },
  props: {
    title: '',
    className: {
      type: String,
      default: 'navbar',   //navbar | navbar2 
      required: false,
    },
    arrow: {
      type: Boolean,
      default: false, 
      required: false,
    }
  },
  data() {
    return {};
  },
  created() { },
  methods: {
    onClickLeft() {
      this.$emit('leftClick')
    },
    onClickRight() {
      this.$emit('rightClick')
    }
  }
};
</script>
<style lang='less' scoped>
.space {
  height: 88px;
  width: 100%;
}
</style>