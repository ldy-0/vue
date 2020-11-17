<template>
  <div class="home_page">
    <banner class="banner_wrap" :config="bannerConfig"></banner>

    <!-- 企业介绍 -->
    <div class="">
      <div class="title_wrap">
        <img class="i_title img" src="../assets/g/broken.png" alt="">

        <div class="title bold mt20">企业介绍</div>
      </div>

      <div class="company_wrap bg" :style="{ backgroundImage: `url(${companyBg})` }">
        <company></company>
      </div>
    </div>

    <!-- 产品类目 -->
    <div class="s_bg_fb">
      <div class="title_wrap">
        <img class="i_title img" src="../assets/g/broken.png" alt="">

        <div class="title bold mt20">产品类目</div>
      </div>

      <div class="">
        <classify :logo="appInfo.logo"></classify>
      </div>
    </div>

    <!-- 新闻资讯 -->
    <div class="">
      <div class="title_wrap">
        <img class="i_title img" src="../assets/g/broken.png" alt="">

        <div class="title bold mt20">新闻资讯</div>
      </div>

      <div class="">
        <news></news>
      </div>
    </div>

    <!-- 联系我们 -->
    <div class="s_bg_main">
      <div class="">
        <div class="title_wrap">
          <img class="i_title img" src="../assets/g/broken.png" alt="">

          <div class="title bold mt20">联系我们</div>
        </div>

        <div class="m_contact_wrap">
          <div class="contact_info flex">
            <div class="i_contact">
              <c-map ref="map" class="img"></c-map>
            </div>

            <div class="contact_list_wrap">
              <div class="contact_item flex s_fc_12" v-for="(item, index) in contactList" :key="index">
                <div class="contact_item_icon">
                  <img :class="[item.class]" :src="item.icon" alt="">
                </div>

                <div class="contact_item_title">{{item.title}}</div>

                <div class="contact_item_value ml50">{{contactInfo[item.from]}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- APP介绍 -->
    <div class="s_bg_main">
      <div class="m_app_wrap">
        <div class="title_wrap">
          <img class="i_title img" src="../assets/g/broken.png" alt="">

          <div class="title bold mt20">APP介绍</div>
        </div>

        <div class="app_wrap bg flex" :style="{ backgroundImage: `url(${appBg})`, }">
          <!-- <div class="i_app">
            <img class="img" :src="appInfo.logo" alt="">
          </div> -->

          <div class="app_info ml90">
            <div class="app_title bold ellipsis s_fc_10">{{appInfo.app_title}}</div>

            <div class="app_desc s_fc_11">{{appInfo.app_brief}}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import banner from '@/components/banner';
import cMap from '@/components/about/map';
import classify from '@/components/home/classify';
import company from '@/components/home/company';
import news from '@/components/home/news';
import bannerApi from '@/api/banner';
import aboutApi from '@/api/about';
import f from '@/utils/format';

export default {
  name: 'Home',

  components: {
    banner,
    classify,
    company,
    news,
    cMap,
  },

  data(){
    return {
      bannerConfig: {
        config: {
          loop: true,
          autoplay: {
            // delay: 3000,
            disableOnInteraction: false,
          },
        },
        from: 'banner_image',
        list: [],
      },

      companyBg: require('../assets/home/companyBg.png'),

      contactList: [
        { title: '服务电话', value: '', from: 'contact_serve', class: 'i_phone', icon: require('../assets/company/phone.png'), },
        { title: '联系电话', value: '', from: 'contact_phone', class: 'i_mobile', icon: require('../assets/company/mobile.png'), },
        { title: '门户网站', value: '', from: 'contact_website', class: 'i_web', icon: require('../assets/company/web.png'), },
        { title: '公司地址', value: '', from: 'contact_site', class: 'i_address', icon: require('../assets/company/address.png'), },
      ],
      contactInfo: {},

      appInfo: {},
      appBg: require('../assets/home/appBg.png'),
    };
  },

  methods: {
    async getBannerList() {
      let res = await bannerApi.getList({ banner_programa: 1, });

      if(res && res.status == 0){
        return this.bannerConfig.list = res.data;
      }

      alert(res ? res.error || res : '获取轮播图信息失败!');
    },

    async getContact() {
      let res = await aboutApi.getContact();

      if(res && res.status == 0){
        this.contactInfo = f.formatContact(res.data);
        this.$refs.map.setCenter(this.contactInfo.position, 12);
        return ;
      }

      alert(res ? res.error || res : '获取联系信息失败!');
    },

    async getApp() {
      let res = await aboutApi.getApp({});

      if(res && res.status == 0){
        return this.appInfo = res.data;
      }

      alert(res ? res.error || res : '获取APP信息失败!');
    },
  },

  created() {
    this.getBannerList();
    this.getContact();
    this.getApp();
  },
}
</script>
<style scoped>
.home_page{
  font-size: 14px;
}
.banner_wrap{
  height: 600px;
}

.title_wrap{
  position: relative;
  padding: 2em 0 1.75em;
  font-size: 2.85em;
  line-height: 1.4;
  text-align: center;
}
.title{
}
.i_title{
  display: block;
  width: 2.45em;
  height: 0.45em;
  margin: 0 auto;
}

.company_wrap{
  padding: 80px 0 70px; 
}

.m_contact_wrap{
  max-width: 79.1vw;
  padding: 0 0 0 14vw;
  margin: 0 auto;
  font-size: 1.7em;
  box-sizing: border-box;
}
.i_contact{
  flex-shrink: 0;
  position: relative;
  top: 0;
  left: -14vw;
  width: 34.3vw;
  height: 38vw;
}
.contact_info{
  position: relative;
  width: 64.5vw;
  padding: 3vw 0;
  background: #FFFFFF;
  box-shadow: -10px 10px 30px 0px rgba(140, 153, 191, 0.3);
  border-radius: 46px;
}
.contact_list_wrap{
  position: relative;
  left: -10.4vw;
  width: 36.45vw;
}
.contact_item{
  padding: 2.6vw 0;
  border-bottom: 4px solid #F6F6F6;
}
.contact_item:last-child{
  border: none;
}
.contact_item_icon{
  flex-shrink: 0;
  width: 9.9vw;
}
.contact_item_title{
  flex-shrink: 0;
}
.contact_item_value{
  
}
.i_phone, .i_web{
  width: 3.3vw;
  height: 3.3vw;
  margin: 0 0 0 1.5vw;
}
.i_mobile{
  width: 3.54vw;
  height: 3.3vw;
  margin: 0 0 0 1.3vw;
}
.i_address{
  width: 2.65vw;
  height: 3.3vw;
  margin: 0 0 0 2.2vw;
}

.m_app_wrap{
  /* max-width: 1570px; */
  /* margin: 0 auto; */
  font-size: 16px;
}
.i_app{
  width: 595px;
  height: 660px;
}
.app_wrap{
  width: 100%;
  height: 47.9vw;
  background-size: auto;
}
.app_info{
  position: absolute;
  left: 47.9vw;
  width: 390px;
}
.app_title{
  font-size: 1.875em;
}
.app_desc{
  height: 220px;
  margin: 30px 0 0;
  line-height: 1.5;
  overflow-y: auto;
}

@media only screen and (max-width: 1920px){
  .home_page{
    font-size: 12px;
  }

  .m_app_wrap{
    /* max-width: 1130px; */
    font-size: 13px;
  }
  .i_app{
    width: 464px;
    height: 514px;
  }
  .app_info{
    width: 304px;
  }
  .app_desc{
    height: 171px;
  }
}

.s_fc_10{ color: #373C59; }
.s_fc_11{ color: #48495E; }
.s_fc_12{ color: #282D4D; }

.s_bg_fb{ background: #fbfbfb; }
</style>