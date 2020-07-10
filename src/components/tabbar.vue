<template>
  <!-- 基于vant,封装底部tabbar组建,active控制选中 -->
  <div>
    <div class="fakefoot"></div>
    <van-tabbar v-model="checked" border active-color="#4FB84A" inactive-color="#979797" class="active_tab">
      <van-tabbar-item v-for="(item,index) in tabBar" :key="index" :to='item.url'>
        <span class="tabbar_title">{{item.title}}</span>
        <img slot="icon" slot-scope="props" :src="props.active ? item.active : item.normal">
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { Toast, Tabbar, TabbarItem } from "vant";
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      checked: 0,
      tabBar: [
        {
          title: "首页",
          normal: require("../assets/images/global/home.png"),
          active: require("../assets/images/global/home_sel.png"),
          url: "/home"
        },
        {
          title: "分类",
          normal: require("../assets/images/global/mall.png"),
          active: require("../assets/images/global/mall_sel.png"),
          url: "/classify"
        },
        {
          title: "购物车",
          normal: require("../assets/images/global/shoppingCart.png"),
          active: require("../assets/images/global/shoppingCart_sel.png"),
          url: "/shoppingCar"
        },
        {
          title: "动态",
          normal: require("../assets/images/global/dynamic.png"),
          active: require("../assets/images/global/dynamic_sel.png"),
          url: "/infomation"
        },
        {
          title: "我的",
          normal: require("../assets/images/global/my.png"),
          active: require("../assets/images/global/my_sel.png"),
          url: "/my"
        }
      ],
      active: 0
    };
  },

  computed: {
    index(){ return 'active' in this.$route.meta ? this.$route.meta.active : 0; },
  },

  watch: {
    $route(n, o) {
      // if('active' in n.meta) this.checked = n.meta.active; // Cookies.set('active', n.meta.active)
      return;
    },
  },
  components: {
    [Toast.name]: Toast,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  // created() {
  //   this.checked = this.index;
  // },
  activated() {
    this.checked = this.index;
  },
  
  methods: {
    updateIndex() {
      this.checked = this.index;
    },
    
    changeBar(i) {
      console.log('bar index:', i);
    },

    beforeunloadFn(e) {
      let a = Cookies.get('active')||0;
      Cookies.set('active', a)

    }
  }
};
</script>
<style lang="less" scoped>
.active_tab {
  height: 97px;
}
.active_tab img {
  width: 58px;
  height: 56px;
}
.fakefoot {
  height: 100px;
  width: 100%;
  background: #f4f4f4;
}
.tabbar_title {
  font-size: 22px;
}
</style>
