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
  <div class='form_wrap'>
    <!-- app -->
    <el-form label-width='100px' style="width:50%">

      <custom-select :obj='visitor'></custom-select>

      <!-- <el-form-item :label="desc.title">
        <editor style='width: 800px;' v-model='desc.value'></editor>
      </el-form-item> -->

    </el-form>

    <el-button type='primary' class='submit_btn' @click='submitAppInfo'>确定</el-button>

    <!-- gif -->
    <div class='form_wrap'>
      <el-form label-width='100px' style="width:50%">
        <custom-file :obj='img'></custom-file>
      </el-form>

      <el-button type='primary' class='submit_btn' @click='submitGif'>确定</el-button>
    </div>
  </div>
</div>
</template>
<script>

import api from '@/api/setting'
// import base from './base.js'
import customFile from '@/components/customFile'
import customInput from '@/components/customInput'
import customSelect from '@/components/select'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import commonReq from '@/api/common' 
export default {
  // mixins: [base],

  components: {
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
      visitor: { 
        title: 'app', 
        categories: [
          { id: 0, title: '非游客模式' },
          { id: 1, title: '游客模式' },
        ], 
        value: '', 
        alert: null, 
      },
      formData: {},
      isAdd: true,
      img: { title: '开机动画', value: [], limit: 1, alert: null, preventValidate: true, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      desc: { title: '内容', value: '' },
    }
  },

  methods: {
    async submitAppInfo(){
      let o = this.formData,
          param;

      this.canSubmit = false;

      param = {
        value: this.visitor.value,
      };

      this.saveAppInfo(param);
    },

    async submitGif(){
      let o = this.formData,
          paramArr = [],
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
    async getAppInfo(){
      let res = await api.getVisitor();

      if(res && res.status == 0){
        this.visitor.value = Number(res.data);
      }
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
      console.error(res);

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
    },
  },

  created(){
    this.getAppInfo();

    this.getGif();

    this.getUploadToken();
  }

}
</script>