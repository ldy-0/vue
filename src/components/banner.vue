<template>
  <div class="">
    <swiper class="img" :options="config.config"  @click-slide="go" v-if="bannerList.length">
      <swiper-slide v-for="(item, index) in bannerList" :key="index">

        <div class="bg img" :style="{ backgroundImage: `url('${typeof item == 'string' ? item : item[config.from]}')` }"></div>

      </swiper-slide>

        <div class="swiper-button-prev" slot="button-prev">
          <img class="prev_btn btn" src="../assets/banner/next.png" alt="" v-if="config.showClass">
        </div>
        <div class="swiper-button-next" slot="button-next">
          <img class="next_btn btn" src="../assets/banner/next.png" alt="" v-if="config.showClass">
        </div>
    </swiper>

    <div class="mask_wrap center" v-if="img" @click="closePreview">
      <img class="preview_wrap" :src="img" alt="" @click.stop="">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: Object, 
    list: Array,
  },

  data() {
    return {
      doing: false,

      img: null,

      moduleList: {
        1: 'home',
        2: 'category',
        3: 'platform',
        4: 'news',
      },
    };
  },

  computed: {
    bannerList(){ return this.list || this.config.list; },
  },

  methods: {
    go(index, i) {
      let item = this.config.list[i];

      if(this.doing) return ;
      this.doing = true;

      // 顶部轮播图
      if(item && item.banner_type){
        if(item.banner_type == 2) this.$router.push({ name: this.moduleList[item.banner_url], });

        if(item.banner_type == 3) this.img = item.banner_url;
      }

      this.doing = false;
    },

    closePreview() {
      this.doing = false;
      this.img = null; 
    },
  },

  created(){
    
  }
}
</script>

<style scoped>
.swiper_wrap{
  position: relative;
}

.btn{
  position: relative;
  width: 42px;
  height: 42px;
}
.prev_btn{
  left: 40px;
  transform: rotateZ(180deg);
}
.next_btn{
  right: 40px;
}

.swiper-button-prev, .swiper-button-next{
  width: 0;
  height: 0;
}

.mask_wrap{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  z-index: 10;
}
</style>
