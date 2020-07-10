<template>
  <div class="top_wrap">
    <div class="package_wrap" @click="goPackage" v-if="isHome">
        <img class="i_package" src="../assets/images/home/package.gif" alt="">
    </div>

    <div class="back-top" @click="backTop()" v-show="backTopShow">
        <img src="../assets/images/global/top.png" alt="">
    </div>
  </div>
</template>

<script>
import valid from '@/utils/valid';

export default {
  data() {
    return {
      backTopShow:false
    }
  },
  components: {},

  computed: {
    isHome(){ return this.$route.name == 'home'; },
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    goPackage() {
      if(!valid.isAuth()) return this.$router.push({ name: 'login', });

      location.href = `${process.env.VUE_APP_BASE_API}/activity/rain/#/?token=${localStorage.getItem('token')}`;
    },

    backTop() {
      console.log(document);
      let back = setInterval(() => {
        if(document.body.scrollTop||document.documentElement.scrollTop){
          document.body.scrollTop-=50;
          document.documentElement.scrollTop-=50;
        }else {
          clearInterval(back)
        }
      });
    },
    handleScroll(){
      if (document.documentElement.scrollTop + document.body.scrollTop >600) {
        this.backTopShow=true;
      }
      else {
        this.backTopShow=false;
      }
    }
  }
}
</script>

<style lang='less' scoped>
.top_wrap{
  position: fixed;
  right: 15px;
  bottom: 300px;
  z-index: 1;
}

.back-top {
  border-radius: 50%;
  text-align: center;
  color:#ccc;
  line-height: 3;
}
img{
    width: 75px;
    height: 75px;
}

.package_wrap{

}
.i_package{
  width: 100px;
  height: 100px;
}

</style>