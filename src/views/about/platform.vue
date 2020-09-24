<template>
  <div class="platform_wrap">
    <banner class="banner_wrap" :config="bannerConfig"></banner>

    <div class="main_wrap">
      <!-- 公司名称 -->
      <div class="title_wrap mt70 s_fc_10">
        <div class="title bold">{{detail.company_title}}</div>
      </div>

      <div class="desc_wrap mt50">
        <div class="desc s_fc_11" v-html="detail.desc"></div>
      </div>

      <!-- 联系我们 -->
      <div class="title_wrap mt70 s_fc_10">
        <div class="title bold">联系我们</div>
      </div>

      <div class="contact_wrap flex">
        <div class="contact_item_wrap mr20 s_bg_f" v-for="(item, index) in contactList" :key="index">
          <div class="contact_item_icon">
            <img :class="[item.class]" :src="item.icon" alt="">
          </div>

          <div class="contact_title">{{item.title}}</div>
          <div class="bold mt20">{{item.value}}</div>
        </div>
      </div>
    </div>

    <!-- 公司坐标 -->
    <div class="title_wrap mt70 s_fc_10">
      <div class="title bold">公司坐标</div>
    </div>

    <div class="location_wrap bg mt50" :style="{ backgroundImage: `url('${contactInfo.contact_image}')` }"></div>
  </div>
</template>

<script>
import banner from '@/components/banner';
import aboutApi from '@/api/about';
import bannerApi from '@/api/banner';

export default {
  name: 'platform',

  components: {
    banner,
  },

  data() {
    return {
      bannerConfig: {
        config: {
          loop: true,
          autoplay: true,
        },
        from: 'banner_image',
        list: [],
      },

      detail: {},

      contactList: [
        { title: '服务电话', value: '', from: 'contact_serve', class: 'i_phone', icon: require('../../assets/company/phone.png'), },
        { title: '联系电话', value: '', from: 'contact_phone', class: 'i_mobile', icon: require('../../assets/company/mobile.png'), },
        { title: '门户网站', value: '', from: 'contact_website', class: 'i_web', icon: require('../../assets/company/web.png'), },
        { title: '公司地址', value: '', from: 'contact_site', class: 'i_address', icon: require('../../assets/company/address.png'), },
      ],
      contactInfo: {},
    };
  },

  methods: {
    format(o) {
      o.desc = o.company_brief.replace('<img', '<img style="width: 100%;"');

      return o;
    },

    async getBannerList() {
      let res = await bannerApi.getList({ banner_programa: 3, });

      if(res && res.status == 0){
        return this.bannerConfig.list = res.data;
      }

      alert(res ? res.error || res : '获取轮播图信息失败!');
    },

    async getInfo() {
      let res = await aboutApi.getCompany();

      if(res && res.status == 0){
        return this.detail = this.format(res.data);
      }

      alert(res ? res.error || res : '获取企业信息失败!');
    },

    async getContact() {
      let res = await aboutApi.getContact();

      if(res && res.status == 0){
        this.contactList.forEach(v => v.value = res.data[v.from]);
        return this.contactInfo = res.data;
      }

      alert(res ? res.error || res : '获取联系信息失败!');
    },

  },

  created() {
    scrollTo(0, 0);

    this.getBannerList();
    this.getInfo();
    this.getContact();
  },

}
</script>
<style scoped>
.platform_wrap{
  font-size: 24px;
  text-align: center;
}

.banner_wrap{
  height: 550px;
}

.main_wrap{
  max-width: 1200px;
  margin: 0 auto;
}

.title_wrap{
  font-size: 40px;
  line-height: 1.4;
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

.desc{
  /* text-indent: 2em; */
  text-align: left;
}

.contact_wrap{
  margin: 50px 0 0;
}
.contact_item_wrap{
  flex-shrink: 0;
  width: 274px;
  height: 315px;
  border-radius: 9px;
  border: 2px solid #EBEBEB;
  box-sizing: border-box;
}
.contact_title{
  margin: 50px auto 0;
}

.contact_item_icon{
  /* width: 9.9vw; */
  margin: 2.8vw 0 0;
}
.i_phone, .i_web{
  width: 3.3vw;
  height: 3.3vw;
}
.i_mobile{
  width: 3.54vw;
  height: 3.3vw;
}
.i_address{
  width: 2.65vw;
  height: 3.3vw;
}
/* .i_phone{
  display: block;
  width: 64px;
  height: 64px;
  margin: 50px auto 0;
}
.i_mobile, .i_web{
  width: 64px;
  height: 64px;
}
.i_mobile{
  width: 51px;
  height: 64px;
} */

.location_wrap{
  width: 100%;
  height: 680px;
}


@media screen and (max-width: 1500px){
  .platform_wrap{
    font-size: 20px;
  }

  .title_wrap{
    font-size: 32px;
  }

  .contact_wrap{
    max-width: 920px;
    margin: 39px auto 0;
  }
  .contact_item_wrap{
    width: 214px;
    height: 245px;
  }
  .contact_title{
    margin: 39px auto 0;
  }

}

.s_fc_10{ color: #181818; }
.s_fc_11{ color: #5E5C75; }
</style>