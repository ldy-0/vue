<template>
  <div class="m_company_wrap flex s_fc_f">
    <div class="img_wrap">
      <img class="i_main img" :src="imgList[currentIndex]" alt="">

      <div class="img_list_wrap flex">
        <div class="img_item pointer" :class="[index === currentIndex ? 'img_item_sel' : '']" v-for="(item, index) in imgList" :key="index" @click="changeImg(index)">

          <img class="img" :src="item" alt="">

        </div>
      </div>
    </div> 

    <div class="info_wrap ml50">
      <div class="title_wrap s_fc_10">
        <div class="title bold">{{detail.company_title}}</div>
      </div>

      <div class="desc_wrap mt50">{{detail.company_brief}}</div>
    </div>
  </div>
</template>

<script>
import aboutApi from '@/api/about';

export default {
  name: 'company',

  props: {
    config: Object,
  },

  data(){
    return {
      currentIndex: 0,
      imgList: [],

      interval: null,

      detail: {},
    };
  },

  computed: {
  },
  
  methods: {
    changeImg(index) {
      if(this.interval) clearInterval(this.interval);

      this.currentIndex = index;

      this.startScroll();
    },

    startScroll() {
      this.interval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.imgList.length;
      }, 2000);
    },

    format(o) {
      try{
        o.imgList = JSON.parse(o.company_image);
        this.imgList = o.imgList;
        this.startScroll();
      }catch(e){
        o.imgList = []; 
      }

      return o;
    },

    async getInfo() {
      let res = await aboutApi.getCompany();

      if(res && res.status == 0){
        return this.detail = this.format(res.data);
      }

      alert(res ? res.error || res : '获取企业信息失败!');
    },

  },

  created() {
    this.getInfo();
  },

  destroyed() {
    if(this.interval) clearInterval(this.interval);
  }
}
</script>

<style scoped>
.m_company_wrap{
  max-width: 1240px;
  margin: 0 auto;
  font-size: 24px;
}

.img_wrap{
  width: 460px;
}
.i_main{
  flex-shrink: 0;
  width: 100%;
  height: 460px;
}
.img_list_wrap{
  margin: 10px 0 0 0;  
  overflow-x: auto;
}
.img_item{
  flex-shrink: 0;
  width: 110px;
  height: 100px;
  margin: 0 0 0 5px;
  border: 1px solid transparent;
  box-sizing: border-box;
}
.img_item_sel{
  border: 1px solid #FFF;
}

.info_wrap{
  
}
.title_wrap{
  font-size: 1.66em;
  line-height: 1.4;
  text-align: center;
}
.title{
  position: relative;
  display: inline-block;
  padding: 0 30px;
}
.title::after{
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 18px;
  background: linear-gradient(154deg, #47F8CC 0%, #67F1B7 100%);
  border-radius: 9px;
  z-index: -1;
}

.desc_wrap{
  width: 720px;
  height: 400px;
  line-height: 1.4;
  overflow-y: auto;
}

@media only screen and (max-width: 1500px){
  .m_company_wrap{
    max-width: 967px;
    font-size: 19px;
  }

  .img_wrap{
    width: 358px;
  }
  .i_main{
    width: 100%;
    height: 358px;
  }
  .img_item{
    width: 86px;
    height: 78px;
  }

  .desc_wrap{
    width: 560px;
    height: 312px;
  }
}
</style>