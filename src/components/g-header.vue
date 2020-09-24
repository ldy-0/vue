<template>
  <div class="hd_wrap bold s_fc_10 s_bg_f">
    <div class="nav_wrap flex">
      <div class="nav_item" :class="{ nav_sel: index == currentIndex }" v-for="(item, index) in navList" :key="index" @click="goModule(index)">
        <div>{{item.title}}</div>
        <!-- <router-link class="" :to="item.path">{{item.title}}</router-link> -->
      </div>
      <!-- <router-link to="/about">产品类目</router-link> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object, 
      default(){
        return {};
      },
    },
  },

  data() {
    return {
      year: '',

      navList: [
        { title: '首页', name: 'home', },
        { title: '产品类目', name: 'category', },
        { title: '平台简介', name: 'platform', },
        { title: '新闻资讯', name: 'news', },
      ],
      currentIndex: 0,
    };
  },

  watch: {
    $route(n){ return this.navList.some((v, i) => { if(v.name == n.name) return this.currentIndex = i, true; }); },
  },

  methods: {
    goModule(index) {
      if(this.currentIndex == index) return ;

      this.currentIndex = index;
      this.$router.push({ name: this.navList[index].name, });
    },
  },

  created() {
    let t = new Date();

    this.year = t.getFullYear();
  },

}
</script>

<style scoped>
.hd_wrap{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  font-size: 14px;
  line-height: 1.4;
  z-index: 2;
}

.nav_wrap{
  position: absolute;
  top: 0;
  left: 50%; 
  height: 100%;
}

.nav_item{
  position: relative;
  width: 5em;
  height: 100%;
  line-height: 80px;
  margin: 0 30px 0 0;
  text-align: center;
  cursor: pointer;
}
.nav_sel::after{
  content: ''; 
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: #32B48E;
  border-radius: 3px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}


.s_fc_10{ color: #505050; }
</style>