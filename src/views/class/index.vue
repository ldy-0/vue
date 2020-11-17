<template>
  <div class="class_wrap s_fc_10 s_bg_f5">
    <banner class="banner_wrap" :config="bannerConfig"></banner>

    <div class="main_wrap">

      <!-- 产品类目 -->
      <div class="title_wrap mt80">
        <img class="i_title img" src="../../assets/g/broken.png" alt="">

        <div class="title bold mt20">产品类目</div>
      </div>
     
      <div class="mt50">
        <div ref="list" class="top_class flex mt30" v-for="(topItem, topIndex) in list" :key="topIndex">

          <banner class="swiper_wrap" :config="classBannerConfig" :list="topItem.imgList"></banner>

          <div class="class_list_wrap ml20 s_bg_f">
            <div class="top_class_item class_item_wrap">
              <div class="top_class_title ellipsis bold">{{topItem.classify_name}}</div>
              <div class="">{{topItem.classify_brief}}</div>
            </div>

            <div class="class_item_wrap flex s_bg_f" v-for="(item, index) in topItem.son" :key="index">

              <el-image class="class_img img" :src="item.classify_image" alt="" :preview-src-list="[item.classify_image]"></el-image>

              <div class="class_body s_fc_11">
                <div class="class_title ellipsis bold">{{item.classify_name}}</div>
                <div class="class_desc">{{item.classify_brief}}</div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import banner from '@/components/banner';
import aboutApi from '@/api/about';
import bannerApi from '@/api/banner';
import f from '@/utils/format';

export default {
  name: 'category',

  components: {
    banner,
  },

  data() {
    return {
      bannerConfig: {
        config: {
          loop: true,
          autoplay: {
            disableOnInteraction: false,
          }
        },
        from: 'banner_image',
        list: [],
      },

      classBannerConfig: {
        config: {
          loop: true,
          autoplay: {
            disableOnInteraction: false,
          },
          navigation: {
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          },
        },
        from: 'banner_image',
        list: [],
        showClass: true,
      },

      detail: {},

      list: [],
    };
  },

  computed: {
    offsetHeight(){ return this.$root.$children[0].$children[0].$el.offsetHeight; },
  },

  methods: {
    async getBannerList() {
      let res = await bannerApi.getList({ banner_programa: 2, });

      if(res && res.status == 0){
        return this.bannerConfig.list = res.data;
      }

      alert(res ? res.error || res : '获取轮播图信息失败!');
    },

    async getList() {
      let res = await aboutApi.getClassList({ parent_id: 0, is_son: 1, });

      if(res && res.status == 0){
        res.data.forEach(f.formatClass);
        return this.list = res.data;
      }

      alert(res ? res.error || res : '获取产品类目信息失败!');
    },

  },

  created() {
    scrollTo(0, 0);

    this.getBannerList();
    this.getList();
  },

  // updated() {
  //   let id = 19,
  //       index = null,
  //       list = this.$refs.list;
    
  //   this.list.some((v, i) => { if(v.classify_id == id) index = i; });
  //   if(typeof index == 'number'){
  //     scrollTo(0, list[index].offsetTop - offsetHeight);
  //   }
  // },
}
</script>
<style scoped>
.class_wrap{
  font-size: 14px;
}

.banner_wrap{
  height: 600px;
}

.main_wrap{
  max-width: 88.5vw;
  margin: 0 auto;
}

.title_wrap{
  position: relative;
  font-size: 40px;
  line-height: 1.4;
  text-align: center;
}
.title{
}
.i_title{
  display: block;
  width: 98px;
  height: 18px;
  margin: 0 auto;
}

.top_class{
  height: 36.9vw;
}
.top_class_item{
  border: 1px solid #EEEEEE; 
}
.top_class_title{
  font-size: 1.28em;
}

.swiper_wrap{
  width: 60.4vw;
  height: 100%;
  /* background: yellowgreen; */
}

.class_list_wrap{
  width: 27.2vw;
  height: 100%;
  border-radius: 5px;
  overflow-y: auto;
}
.class_item_wrap{
  align-items: flex-start;
  flex-shrink: 0;
  padding: 24px 10px 24px 40px;
  box-sizing: border-box;
}
.class_img{
  flex-shrink: 0;
  width: 5.4vw;
  height: 5.4vw;  
}
.class_body{
  margin: 0 0 0 1.5vw;
}
.class_title{
  width: 14.5vw;
  margin: 1em 0 0;
  font-size: 1.14em;
}
.class_desc{
  margin: 0.8em 0 0;
}

@media only screen and (max-width: 1500px){
.class_wrap{
  font-size: 12px;
}

.title_wrap{
  font-size: 32px;
}

}

.s_fc_10{ color: #222848; }
.s_fc_11{ color: #3C3D41; }

</style>