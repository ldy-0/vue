<template>
  <div>
    <div class="fakefoot"></div>
  </div>
</template>
<script>
import { Toast, Tabbar, TabbarItem } from "vant";
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      checked: 0,
      tabBar: [],
      active: 0
    };
  },
  watch: {
    $route(n, o) {
      Cookies.set('active', n.meta.active)
      return;
    }
  },
  components: {

  },
  created() {
    this.checked = JSON.parse(Cookies.get('active'));
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  methods: {
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
