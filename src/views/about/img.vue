<style scoped>
.container{
  padding: 128px 0 0;
}

.image{
  width: 100%;
}
</style>

<template>
  <div class='container'>
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="" v-for="(item, index) in urlList" :key="index">

      <img class="image" :src='item' />

    </div>

  </div>
</template>

<script>
export default {
  data(){
    return {
      title: '轮播详情',

      urlList: [],
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },
  },

  activated() {
    let route = this.$route,
        query = route.query;
    
    this.urlList = [query.url];
  }

}
</script>