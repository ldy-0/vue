<template>
  <div class="m_class_wrap s_fc_f">
    <div class="">
      <div class="center">
        <div class="m_class_title_wrap">
          <div class="m_class_title bold s_fc_10">
            <div>非药品专家</div>
            <div>源头工厂直供</div>
          </div>

          <div class="m_class_desc bold s_fc_12">
            <div>医疗器械、化妆品、保健食品、</div>
            <div>日用品、食品工厂一站式采购平台！</div>
          </div>

          <div class="app_wrap flex s_fc_13">
            <img class="app_img" :src="logo" alt="">
            <div class="app_title bold">博伦优品</div>
          </div>
        </div>

        <div class="first_wrap flex">
          <div class="first_img_wrap">
            <el-image class="first_img pointer" :src="firstImg.url" alt="" :preview-src-list="[firstImg.url]"></el-image>
          </div>

          <div class="other_img_wrap flex">
            <div class="first_class_img_wrap" v-for="(item, index) in imgList" :key="index">
              <el-image class="first_class_img" :src="item.url" alt="" :preview-src-list="[item.url]"></el-image>
            </div>
          </div>

          <div class="more_wrap flex s_fc_13" @click="goClass">
            <div class="">查看更多</div>

            <img class="i_more" src="../../assets/home/classArrow.png" alt="">
          </div>
        </div>
      </div>

      <div class="class_list_wrap flex">
        <div class="class_item s_bg_f" v-for="(item, index) in classList" :key="index">

          <el-image class="class_img pointer" :src="item.img" alt="" :preview-src-list="[item.img]"></el-image>

          <div class="class_title ellispis s_fc_10">{{item.classify_name}}</div>

          <div class="class_desc s_fc_11">{{item.classify_brief}}</div>

        </div>
      </div>
    </div> 
    
  </div>
</template>

<script>
import aboutApi from '@/api/about';

export default {
  name: 'company',

  props: {
    logo: String,
    config: Object,
  },

  data(){
    return {
      doing: false,

      list: [],
    };
  },

  computed: {
    firstClass(){ return this.list[0]; },
    classList(){ return this.list.slice(1); },

    firstClassImg(){ return this.firstClass ? this.firstClass.imgList : []; },
    firstImg(){ return this.firstClassImg[0] || { url: '', }; },
    imgList(){ return this.firstClassImg.slice(1, 6); },
  },
  
  methods: {
    goClass() {
      if(this.doing) return ;
      this.doing = true;

      this.$router.push({ name: 'category', query: {}, });
    },

    format(o) {
      try{
        o.imgList = JSON.parse(o.classify_image);
        o.img = o.imgList[0].url;
      }catch(e){
        o.imgList = [];
        o.img = '';
      }

      return o;
    },

    async getList() {
      let res = await aboutApi.getClassList({ page: 1, limit: 6, parent_id: 0, });

      if(res && res.status == 0){
        res.data.forEach(this.format);
        return this.list = res.data;
      }

      alert(res ? res.error || res : '获取分类信息失败!');
    },

  },

  created() {
    this.getList();
  },
}
</script>

<style scoped>
.m_class_wrap{
  font-size: 16px;
}

.m_class_title_wrap{
  width: 15.1vw;
}
.m_class_title{
  font-size: 2.8em;
}
.m_class_desc{
  font-size: 1.12em;
}
.first_wrap{
  position: relative;
  align-items: flex-start;
  margin: 0 0 0 3.9vw;
}
.first_img_wrap{
  padding: 20px;
  box-shadow: 0px 30px 30px 0px rgba(140, 153, 191, 0.2);
}
.other_img_wrap{
  flex-wrap: wrap;
  width: 22vw; 
}
.first_img{
  width: 19vw;
  height: 24.2vw;
}
.first_class_img_wrap{
  flex-shrink: 0;
  margin: 0 0 0 0.5vw;
  padding: 0.5vw;
  box-shadow: 0px 30px 30px 0px rgba(140, 153, 191, 0.2);
}
.first_class_img{
  width: 9.5vw;
  height: 9.5vw;
}

.more_wrap{
  position: absolute;
  right: 0;
  bottom: 1vw;
  font-size: 1.25em;
  cursor: pointer;
}
.i_more{
  width: 22px;
  height: 22px;
  margin: 0 0 0 10px;
}

.class_list_wrap{
  margin: 6.6vw 0 0;
  padding: 0 5.7vw 7.5vw;
}
.class_item{
  width: 13.3vw;
  margin: 0 2.6vw 0 0;
  padding: 1vw;
  box-shadow: 0px 1.5vw 1.5vw 0px rgba(140, 153, 191, 0.2);
  box-sizing: content-box;
}
.class_img{
  width: 100%;
  height: 13.3vw;
}
.class_title{
  margin: 1vw 0 0 0;
  font-size: 1.25em;
  line-height: 1.2;
}
.class_desc{
  height: 4.125em;
  line-height: 1.375; 
  overflow: hidden;
}

.app_wrap{
  margin: 1.9vw 0 0;
  font-size: 1.25em;
  line-height: 1.4;
}
.app_img{
  width: 2.6vw;
  height: 2.6vw;
  border-radius: 50%;
}
.app_title{
  margin: 0 0 0 1vw;
}

@media only screen and (max-width: 1580px){
  .m_class_wrap{
    font-size: 13px;
  }
}

.s_fc_10{ color: #4E4E4E; }
.s_fc_11{ color: #9C9C9C; }
.s_fc_12{ color: #A2A2A2; }
.s_fc_13{ color: #32B48E; }
</style>