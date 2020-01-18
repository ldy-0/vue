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
.input_group{
  width: 120px;
  display: inline-block;
  font-size: 14px;
  color: #666;
  text-align: center;
}
.input_group_title{
  width: 100px;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
}
.input_group_item{
  width: 100px;
  height: 30px;
}
</style>

<template>
<div>
  <div class='form_wrap'>
    <!-- android -->
    <!-- <div class='form_wrap'>
      <el-form label-width='100px' style="width:50%">
        <custom-select :obj='androidVisitor'></custom-select>
      </el-form>

      <el-button type='primary' class='submit_btn' @click="submitAppInfo('ANDROID')">确定</el-button>
    </div> -->

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
          <div class='input_group input_group_title'>{{appIconName.title}}</div>

          <div class='input_group' v-for='(nameItem, nameIndex) in appIconName.value' :key='nameIndex'>
            <input class='input_group_item' v-model="nameItem.value" @input='changeInput(nameItem, appIconName)' />
            <div>{{nameItem.title}}</div>
          </div>

          <el-alert :title='appIconName.alert' :closable='false' type='error' show-icon v-if='appIconName.alert'></el-alert>
        </div>

        <div class='input_group_wrap'>
          <div class='input_group input_group_title'>{{wxIconName.title}}</div>

          <div class='input_group' v-for='(nameItem, nameIndex) in wxIconName.value' :key='nameIndex'>
            <input class='input_group_item' v-model="nameItem.value" @input='changeInput(nameItem, wxIconName)' />
            <div>{{nameItem.title}}</div>
          </div>

          <el-alert :title='wxIconName.alert' :closable='false' type='error' show-icon v-if='wxIconName.alert'></el-alert>
        </div>

        <custom-input :obj='bgColor'></custom-input>
      </el-form>

      <el-button type='primary' class='submit_btn' @click='submit'>确定</el-button>
    </div>

    <!-- android package -->
    <!-- <div class='form_wrap'>
      <el-form label-width='100px' style="width:50%">
        <custom-file :obj='androidApk'></custom-file>

        <custom-input :obj='androidVersion'></custom-input>
      </el-form>

      <el-button type='primary' class='submit_btn' @click='submitApk'>确定</el-button>
    </div> -->

  </div>
</div>
</template>
<script>

import api from '@/api/setting'
import customImg from '@/components/customImg'
import customFile from '@/components/customFile'
import customInput from '@/components/customInput'
import customSelect from '@/components/select'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import commonReq from '@/api/common' 

export default {
  mixins: [],

  components: {
    customImg,
    customFile,
    customInput,
    customSelect,
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
      // androidVisitor: { 
      //   title: 'Android', 
      //   categories: [
      //     { id: 0, title: '非游客模式' },
      //     { id: 1, title: '游客模式' },
      //   ], 
      //   value: '', 
      //   alert: null, 
      // },
      isAdd: true,

      bgImg: { title: '背景', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      activityImg: { title: '活动菜单', type: 'multi', value: [{ title: '极限秒杀', value: [], }, { title: '火爆拼团', value: [], }, { title: '热门砍价', value: [] }], limit: 1, alert: null, url: '', cdnUrl: '', body: {} },
      registerImg: { title: '会员注册', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      storeImg: { title: '商家入驻', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
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

      androidApk: { title: 'Android APK', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      androidVersion: { type: 'string', title: '版本号', value: '', alert: null, },
      desc: { title: '内容', value: '' },
    }
  },

  methods: {
    changeInput(item, name){
      name.alert = item.value ? null : `${item.title}不能为空`;
    },

    async submitApk(source){
      let param,
          version = this.androidVersion;

      if(!version.value) version.alert = `${version.title}不能为空!`;
      if(version.alert) return ; 

      // let url = this.androidApk.value.map(v => { return v.raw ? `${this.androidApk.cdnUrl}/${v.response.key}` : v.url });
      let url = this.androidApk.value.map(v => { 
        return v.raw ? { url: `${this.androidApk.cdnUrl}/${v.response.key}`, name: v.name, version: version.value, } : { url: v.url, name: v.name, version: version.value };
      });

      param = {
        value: JSON.stringify(url[0]),
      };

      this.saveApk(param);
    },

    async submitAppInfo(source){
      let param;

      this.canSubmit = false;

      param = {
        value: source == 'IOS' ? this.iosVisitor.value : this.androidVisitor.value,
        source,
      };

      this.saveAppInfo(param);
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
    // async getApk(){
    //   let res = await api.getApk();

    //   if(res && res.status == 0){
    //     // let list = res.data ? res.data.map(v => JSON.parse(v)) : [];
    //     let data = res.data ? res.data : {};
    //     this.androidApk.value = [ data ];
    //     this.androidVersion.value = data.version;
    //   }

    //   if(typeof res == 'string' || !res || res.error) this.$message.error(res ? res.error || res : `获取Apk信息失败!`);
    // },

    async saveApk(param){
      let res = await api.addApk(param);

      this.isShowForm = false;
      this.canSubmit = true;

      typeof res == 'string' || res.error ? this.$message.error(res.error || res) : this.$message.success(`修改成功`);

      this.getApk();
    },

    async getAppInfo(){
      let androidRes = await api.getVisitor({ source: 'ANDROID' }),
          iosRes = await api.getVisitor({ source: 'IOS' });

      if(androidRes && androidRes.status == 0){
        this.androidVisitor.value = Number(androidRes.data);
      }

      if(iosRes && iosRes.status == 0){
        this.iosVisitor.value = Number(iosRes.data);
      }

      if(typeof androidRes == 'string' || !androidRes || androidRes.error) this.$message.error(androidRes ? androidRes.error || androidRes : '获取android信息失败');
      if(typeof iosRes == 'string' || !iosRes || iosRes.error) this.$message.error(iosRes ? iosRes.error || iosRes : '获取ios信息失败');
    },

    async saveAppInfo(param){
      let res = await api.addVisitor(param);

      this.isShowForm = false;
      this.canSubmit = true;

      typeof res == 'string' || res.error ? this.$message.error(res.error || res) : this.$message.success(`修改成功`);

      this.getAppInfo();
    },

    async getHome(){
      let res = await api.getHome();

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
        // let imgArr = res.data.slice(0, 16).map(v => JSON.parse(v)),
        //     activityImgArr = imgArr.slice(1, 4),
        //     iconImgArr = imgArr.slice(6),
        //     appNameArr = res.data.slice(16, 26),
        //     wxNameArr = res.data.slice(26);

        // this.bgImg.value = [imgArr[0]];
        // this.registerImg.value = [imgArr[4]];
        // this.storeImg.value = [imgArr[5]];
        // this.activityImg.value.forEach((v, i) => v.value = [activityImgArr[i]]);
        // this.iconImg.value.forEach((v, i) => v.value = [iconImgArr[i]]);

        // this.appIconName.value.forEach((v, i) => v.value = appNameArr[i]);
        // this.wxIconName.value.forEach((v, i) => v.value = wxNameArr[i]);
      }
    },

    async save(param, loading){
      let res = await api.setHome(param);

      this.isShowForm = false;

      typeof res == 'string' || res.error ? this.$message.error(res.error || res) : this.$message.success(`修改成功`);
      loading.close();

      this.getHome();
    },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

     this.activityImg.url = this.iconImg.url = 'https://up-z2.qiniup.com';
     this.activityImg.cdnUrl = this.iconImg.cdnUrl = 'https://cdn.health.healthplatform.xyz';
     this.bgImg.body = this.activityImg.body = this.registerImg.body = this.storeImg.body = this.iconImg.body = { token: res.data, config: "{ useCdnDomain: true }", };
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