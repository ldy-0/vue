export default {
  data(){
    return {
      newPeopleBg: { title: '新人专享背景图', value: [], limit: 1, alert: null, preventValidate: true, url: '', cdnUrl: '', body: {}, width: '150px', },
      newPeopleBanner: { title: '新人专享Banner图', value: [], limit: 1, alert: null, preventValidate: true, url: '', cdnUrl: '', body: {}, width: '150px', },
    };
  },

  methods: {
    initNewPeople(o){
      if(!o) return ;

      this.newPeopleBg.value = o.bg ? [o.bg] : [];
      this.newPeopleBanner.value = o.banner ? [o.banner] : [];
    },
    
    setNewPeople(o){
      let obj = {},
          bg = this.newPeopleBg,
          bgImgList = bg.value.map(img => img.raw ? { url: `${bg.cdnUrl}/${img.response.key}`, name: img.name } : { url: img.url, name: img.name, }),
          banner = this.newPeopleBanner,
          bannerImgList = banner.value.map(img => img.raw ? { url: `${banner.cdnUrl}/${img.response.key}`, name: img.name } : { url: img.url, name: img.name, });

      if(bgImgList.length) obj.bg = bgImgList[0];
      if(bannerImgList.length) obj.banner = bannerImgList[0];

      o.img.newPeople = obj;
    },

    initNewPeopleImg(url, cdnUrl, body){
      this.newPeopleBanner.url = this.newPeopleBg.url = url;
      this.newPeopleBanner.cdnUrl = this.newPeopleBg.cdnUrl = cdnUrl;
      this.newPeopleBanner.body = this.newPeopleBg.body = body;
    }
  },

}
