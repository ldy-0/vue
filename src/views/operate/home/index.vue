<style lang="css">
.form_wrap{
  padding: 20px;
}

.submit_btn{
  margin-left: 100px;
}

.input_group_wrap{
  margin: 20px 0;
}
.input_group_title, .input_group{
  display: inline-block;
  width: 100px;
}
.input_group_title{
  padding: 0 12px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
  text-align: right;
}
.input_group{
  margin: 0 20px 0 0;
  font-size: 14px;
  color: #666;
  text-align: center;
}
.input_group_item{
  width: 100px;
  height: 30px;
}
</style>

<template>
<div>
  <div class='form_wrap'>

    <div class='form_wrap'>
      <el-form label-width='100px' style="width:90%">
        <!-- bg -->
        <custom-img :obj='bgImg'></custom-img>

        <!-- bg -->
        <custom-img :obj='activityImg'></custom-img>

        <!-- register -->
        <custom-img :obj='registerImg'></custom-img>

        <!-- store -->
        <custom-img :obj='storeImg'></custom-img>

        <!-- icon -->
        <custom-img :obj='iconImg'></custom-img>

        <!-- iconName -->
        <div class='input_group_wrap'>
          <div class='input_group_title'>{{appIconName.title}}</div>

          <div class='input_group' v-for='(nameItem, nameIndex) in appIconName.value' :key='nameIndex'>
            <input class='input_group_item' v-model="nameItem.value" @input='changeInput(nameItem, appIconName)' />
            <div>{{nameItem.title}}</div>
          </div>

          <el-alert :title='appIconName.alert' :closable='false' type='error' show-icon v-if='appIconName.alert'></el-alert>
        </div>

        <div class='input_group_wrap'>
          <div class='input_group_title'>{{wxIconName.title}}</div>

          <div class='input_group' v-for='(nameItem, nameIndex) in wxIconName.value' :key='nameIndex'>
            <input class='input_group_item' v-model="nameItem.value" @input='changeInput(nameItem, wxIconName)' />
            <div>{{nameItem.title}}</div>
          </div>

          <el-alert :title='wxIconName.alert' :closable='false' type='error' show-icon v-if='wxIconName.alert'></el-alert>
        </div>

        <!-- bg color -->
        <custom-input :obj='bgColor'></custom-input>

        <!-- new People -->
        <custom-img :obj="newPeopleBg"></custom-img>
        <custom-img :obj="newPeopleBanner"></custom-img>

        <!-- coupon -->
        <custom-radio :obj='coupon'></custom-radio>
        <custom-img :obj="couponBg"></custom-img>
      </el-form>

      <el-button type='primary' class='submit_btn' @click='submit'>确定</el-button>
    </div>


  </div>
</div>
</template>
<script>

import api from '@/api/setting'
import customImg from '@/components/customImg'
import customFile from '@/components/customFile'
import customInput from '@/components/customInput'
import customSelect from '@/components/select'
import customRadio from "@/components/customRadio";
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import commonReq from '@/api/common' 
import newPeople from './newPeople.js'

export default {
  mixins: [newPeople],

  components: {
    customImg,
    customFile,
    customInput,
    customSelect,
    customRadio,
    // editor,
  },

  data() {
    return {
      formConfig: {
        width: '80%',    
        labelWidth: '200px',
        showCancel: true,
        isCenter: true,
        classList: [
          { key: '主图', value: 'img', isImg: true, },
          { key: '客服电话', value: 'phone', isText: true, },
          { key: '地址', value: 'address', isText: true, },
          { key: '邮箱', value: 'email', isText: true, },
          { key: '其他信息', value: 'detail', isRichEditor: true },
        ],
      },
      isAdd: true,

      bgImg: { title: '背景', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      registerImg: { title: '会员注册', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      storeImg: { title: '商家入驻', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      activityImg: { 
        title: '活动菜单', type: 'multi', limit: 1, alert: null, url: '', cdnUrl: '', body: {},
        value: [
          { title: '极限秒杀', value: [], }, 
          { title: '火爆拼团', value: [], }, 
          { title: '热门砍价', value: [] },
        ],
      },
      iconImg: {
        title: '主菜单', type: 'multi', limit: 1, url: '', cdnUrl: '', body: {}, alert: null,
        value: [
          { title: '图标1', value: [], }, 
          { title: '图标2', value: [], }, 
          { title: '图标3', value: [] }, 
          { title: '图标4', value: [] }, 
          { title: '图标5', value: [] },
          { title: '图标6', value: [] },
          { title: '图标7', value: [] },
          { title: '图标8', value: [] },
          { title: '图标9', value: [] },
          { title: '图标10', value: [] },
        ],
      },
      appIconName: {
        title: 'APP图标名字',
        alert: null,
        value: [
          { type: 'string', title: '图标1名字', value: '', alert: null, },
          { type: 'string', title: '图标2名字', value: '', alert: null, },
          { type: 'string', title: '图标3名字', value: '', alert: null, },
          { type: 'string', title: '图标4名字', value: '', alert: null, },
          { type: 'string', title: '图标5名字', value: '', alert: null, },
          { type: 'string', title: '图标6名字', value: '', alert: null, },
          { type: 'string', title: '图标7名字', value: '', alert: null, },
          { type: 'string', title: '图标8名字', value: '', alert: null, },
          { type: 'string', title: '图标9名字', value: '', alert: null, },
          { type: 'string', title: '图标10名字', value: '', alert: null, },
        ],
      },
      wxIconName: {
        title: 'wx图标名字',
        alert: null,
        value: [
          { type: 'string', title: '图标1名字', value: '', alert: null, },
          { type: 'string', title: '图标2名字', value: '', alert: null, },
          { type: 'string', title: '图标3名字', value: '', alert: null, },
          { type: 'string', title: '图标4名字', value: '', alert: null, },
          { type: 'string', title: '图标5名字', value: '', alert: null, },
          { type: 'string', title: '图标6名字', value: '', alert: null, },
          { type: 'string', title: '图标7名字', value: '', alert: null, },
          { type: 'string', title: '图标8名字', value: '', alert: null, },
          { type: 'string', title: '图标9名字', value: '', alert: null, },
          { type: 'string', title: '图标10名字', value: '', alert: null, },
        ],
      },
      bgColor: { type: 'string', title: '背景颜色', value: '', alert: null, },

      couponBg: { title: '优惠券背景图', value: [], limit: 1, alert: null, preventValidate: true, url: '', cdnUrl: '', body: {}, width: '150px', },
      coupon: {
        title: "开启优惠券", 
        list: [
          { id: 1, title: '是' }, 
          { id: 2, title: "否" }
        ], 
        value: 1, 
        alert: null, 
        disabled: false,
        width: '150px',
      },

      androidApk: { title: 'Android APK', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      androidVersion: { type: 'string', title: '版本号', value: '', alert: null, },
      desc: { title: '内容', value: '' },
    }
  },

  methods: {
    changeInput(item, name){
      name.alert = item.value ? null : `${item.title}不能为空`;
    },

    async submit(){
      let paramArr = [],
          param;

      // this.mock();
      
      if(this.validError()) return ;

      let loading = this.$loading();

      param = {
        value: this.fromHome(),
      };

      this.save(param, loading);
    },

    fromHome(){
      let o = {},
          imgList = this.fromImg(),
          appNameList = this.appIconName.value,
          wxNameList = this.wxIconName.value;

      o.color = { bgColor: this.bgColor.value, };
      o.img = {
        home: imgList[0],
        activity: imgList.slice(1, 4),
        register: imgList[4],
        store: imgList[5],
      };
      o.menus = imgList.slice(6, 16).map((v, i) => { v.appName = appNameList[i].value; v.wxName = wxNameList[i].value; return v; });
      // this.fromImg().concat(this.appIconName.value.map(v => v.value), this.wxIconName.value.map(v => v.value), this.bgColor.value);

      this.setNewPeople(o);

      let couponBgList = this.couponBg.value.map(img => img.raw ? { url: `${this.couponBg.cdnUrl}/${img.response.key}`, name: img.name } : { url: img.url, name: img.name, });
      o.img.coupon = {
        isOpen: this.coupon.value == 1 ? true : false,
      };
      if(couponBgList.length) o.img.coupon.bg = couponBgList[0];

      return JSON.stringify(o);
    },

    validError(){
      let imgArr = ['bgImg', 'registerImg', 'storeImg'],
          multiImgArr = ['activityImg', 'iconImg'],
          arr = ['bgColor'];

      if(imgArr.some(v => { let o = this[v]; if(o.alert || !o.value.length) return o.alert = `${o.title}不能为空!`; })) return true;

      if(multiImgArr.some(validMultiSku.bind(this))) return true;

      if(this.appIconName.value.some(v => !v.value ? this.appIconName.alert = `${v.title}不能为空` : false)) return true;
      if(this.wxIconName.value.some(v => !v.value ? this.wxIconName.alert = `${v.title}不能为空` : false)) return true;

      if(arr.some(v => !this[v].value ? this[v].alert = `${this[v].title}不能为空` : false)) return true;

      function validMultiSku(v){
        let obj = this[v],
            imgArr = obj.value;

        let res = imgArr.filter(o => o.value && !o.value.length)[0];

        if(res) return obj.alert = `${res.title}不能为空!`;
      }
    },

    fromImg(){
      let imgArr = ['bgImg', 'activityImg', 'registerImg', 'storeImg', 'iconImg'],
          arr = [];
      
      imgArr.forEach(v => {
        let o = this[v];

        if(o.type == 'multi'){
          arr = arr.concat(o.value.map(subObj => {
            let img = subObj.value[0];

            return img.raw ? { url: `${o.cdnUrl}/${img.response.key}`, name: img.name } : { url: img.url, name: img.name, };
          }));
        }else{
          arr = arr.concat(o.value.map(img => img.raw ? { url: `${o.cdnUrl}/${img.response.key}`, name: img.name } : { url: img.url, name: img.name, }));
        }
      });

      return arr; //.map(v => JSON.stringify(v));
    },

    // request
    async getHome(){
      let res = await api.getHome();

      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '获取信息失败!');

      if(res && res.data){
        let o = res.data,
            color = o.color,
            img = o.img,
            menus = o.menus,
            iconImgList = this.iconImg.value,
            appIconNameList = this.appIconName.value,
            wxIconNameList = this.wxIconName.value;
        

        this.bgImg.value = [img.home];
        this.registerImg.value = [img.register];
        this.storeImg.value = [img.store];
        this.bgColor.value = color.bgColor;

        this.activityImg.value.forEach((v, i) => v.value = [img.activity[i]]);
        
        menus.forEach((v, i) => {
          iconImgList[i].value = [v];

          appIconNameList[i].value = v.appName;
          wxIconNameList[i].value = v.wxName;
        });

        this.initNewPeople(img.newPeople);

        this.couponBg.value = img.coupon && img.coupon.bg ? [img.coupon.bg] : [];
        this.coupon.value = img.coupon && img.coupon.isOpen ? 1 : 2;
      }
    },

    async save(param, loading){
      let res = await api.setHome(param);

      this.isShowForm = false;

      !res || typeof res == 'string' || res.error ? this.$message.error(res.error || res) : this.$message.success(`修改成功`);
      loading.close();

      this.getHome();
    },

    async getUploadToken(){
      let url = 'https://up-z2.qiniup.com',
          cdnUrl = 'https://cdn.health.healthplatform.xyz',
          couponBg = this.couponBg,
          res = await commonReq.getUploadToken();

      if(!res || res.error || typeof res === 'string') return this.$message.error(`${res ? res.error || res : 'getUploadToken接口报错!'}`);

     let body = { token: res.data, config: "{ useCdnDomain: true }", };

     this.activityImg.url = this.iconImg.url = couponBg.url = url;
     this.activityImg.cdnUrl = this.iconImg.cdnUrl = couponBg.cdnUrl = cdnUrl;
     this.bgImg.body = this.activityImg.body = this.registerImg.body = this.storeImg.body = this.iconImg.body = couponBg.body = body;

     this.initNewPeopleImg(url, cdnUrl, body);
    },

    mock(){
      let url = 'https://cdn.health.healthplatform.xyz/FrTyPny2TJ2NaNyPpjuXHbPE3jkr';
      this.bgImg.value = this.registerImg.value = this.storeImg.value = [{ url }];
      this.activityImg.value.forEach(v => v.value = [{ url, }]);
      this.iconImg.value.forEach(v => v.value = [{ url, }]);
      this.appIconName.value.forEach(v => v.value = '123432');
      this.wxIconName.value.forEach(v => v.value = '11111');
    },

  },

  created(){
    this.getHome();

    this.getUploadToken();
  }

}
</script>