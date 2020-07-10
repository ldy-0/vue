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

    <div class="" v-for="(item, index) in imgList" :key="index">

      <img class="image" :src='item.url' />

    </div>

  </div>
</template>

<script>
export default {
  data(){
    return {
      title: '',
      imgList: [
        { url: 'http://cdn.good-luck.healthplatform.xyz/2c2cce38f6b90af93228f3be9a78522.png' },
        { url: 'http://cdn.good-luck.healthplatform.xyz/afcb27655f30b3da9038e421ef896dc.png' },
      ],
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },
  },

}
</script>