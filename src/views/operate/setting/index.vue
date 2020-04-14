<style lang="css">
.form_wrap{
  padding: 20px;
}

.submit_btn{
  margin-left: 100px;
}
</style>

<template>
<div>
  <div class='form_wrap' v-if="isSetting">
    <!-- android -->
    <div class='form_wrap'>
      <el-form label-width='100px' style="width:50%">
        <custom-select :obj='androidVisitor'></custom-select>
      </el-form>

      <el-button type='primary' class='submit_btn' @click="submitAppInfo('ANDROID')">确定</el-button>
    </div>

    <!-- ios -->
    <div class='form_wrap'>
      <el-form label-width='100px' style="width:50%">
        <custom-select :obj='iosVisitor'></custom-select>
      </el-form>

      <el-button type='primary' class='submit_btn' @click="submitAppInfo('IOS')">确定</el-button>
    </div>

    <!-- gif -->
    <div class='form_wrap'>
      <el-form label-width='100px' style="width:50%">
        <custom-file :obj='img'></custom-file>
      </el-form>

      <el-button type='primary' class='submit_btn' @click='submitGif'>确定</el-button>
    </div>

    <!-- android package -->
    <div class='form_wrap'>
      <el-form label-width='100px' style="width:50%">
        <custom-file :obj='androidApk'></custom-file>

        <custom-input :obj='androidVersion'></custom-input>
      </el-form>

      <el-button type='primary' class='submit_btn' @click='submitApk'>确定</el-button>
    </div>

  </div>

  <!-- asset -->
  <asset v-if="isAsset"></asset>
</div>
</template>
<script>

import api from '@/api/setting'
import customFile from '@/components/customFile'
import customInput from '@/components/customInput'
import customSelect from '@/components/select'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import commonReq from '@/api/common' 
import asset from '@/components/form/asset'

export default {
  mixins: [],

  components: {
    customFile,
    customInput,
    customSelect,
    asset,
  },

  computed: {
    pageName(){ return this.$route.name; },
    isSetting(){ return this.pageName === 'setting'; },
    isAsset(){ return this.pageName === 'asset'; },
  },

  data() {
    return {
      formConfig: {
        width: '80%',    
        labelWidth: '200px',
        canSubmit: true,
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
      androidVisitor: { 
        title: 'Android', 
        categories: [
          { id: 0, title: '非游客模式' },
          { id: 1, title: '游客模式' },
        ], 
        value: '', 
        alert: null, 
      },
      iosVisitor: { 
        title: 'IOS', 
        categories: [
          { id: 0, title: '非游客模式' },
          { id: 1, title: '游客模式' },
        ], 
        value: '', 
        alert: null, 
      },
      isAdd: true,

      img: { title: '开机动画', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      androidApk: { title: 'Android APK', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      androidVersion: { type: 'string', title: '版本号', value: '', alert: null, },
      desc: { title: '内容', value: '' },
    }
  },

  methods: {
    async submitApk(source){
      let param,
          version = this.androidVersion;

      if(!version.value) version.alert = `${version.title}不能为空!`;
      if(version.alert) return ; 

      this.canSubmit = false;

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

    async submitGif(){
      let paramArr = [],
          param;

      this.canSubmit = false;

      // this.img.alert = this.img.value.length ? null : '请选择图片作为主图';

      // if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;

      let img = this.img.value.map(v => { return v.raw ? { url: `${this.img.cdnUrl}/${v.response.key}`, name: v.name } : { url: v.url, name: v.name } });

      param = {
        value: JSON.stringify(img[0]),
      };

      this.saveGif(param);
    },

    // request
    async getApk(){
      let res = await api.getApk();

      if(res && res.status == 0){
        // let list = res.data ? res.data.map(v => JSON.parse(v)) : [];
        let data = res.data ? res.data : {};
        this.androidApk.value = [ data ];
        this.androidVersion.value = data.version;
      }

      if(typeof res == 'string' || !res || res.error) this.$message.error(res ? res.error || res : `获取Apk信息失败!`);
    },

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

    async getGif(){
      let res = await api.getGif();

      if(res && res.status == 0){
        this.img.value = res.data ? [ JSON.parse(res.data) ] : [];
      }
    },

    async saveGif(param){
      let res = await api.addGif(param);
      // console.error(res);

      this.isShowForm = false;
      this.canSubmit = true;

      typeof res == 'string' || res.error ? this.$message.error(res.error || res) : this.$message.success(`修改成功`);

      this.getGif();
    },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.img.body.token = res.data;
      this.img.body.config = "{ useCdnDomain: true }";

      this.androidApk.body.token = res.data;
      this.androidApk.body.config = "{ useCdnDomain: true }";
    },

    init(){
      let route = this.$route,
          name = route.name;

      if(name === 'setting'){
        this.getAppInfo();

        this.getGif();

        this.getApk();

        this.getUploadToken();
      }
    },

  },

  created(){
    this.init();
  }

}
</script>