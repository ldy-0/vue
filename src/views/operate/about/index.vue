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
    <el-form label-width='100px' style="width:50%">

      <custom-img :obj='img'></custom-img>
      
      <!-- <custom-input :obj='phone'></custom-input> -->
      <mobile :obj='phone'></mobile>
      <custom-input :obj='address'></custom-input>

      <email :obj='email'></email>

      <el-form-item :label="desc.title">
        <editor style='width: 800px;' v-model='desc.value'></editor>
      </el-form-item>

    </el-form>

    <el-button class='submit_btn' @click='submit'>确定</el-button>
  </div>
</div>
</template>
<script>

import api from './api.js'
// import base from './base.js'
import customImg from '@/components/customImg'
import mobile from '@/components/mobile'
import customInput from '@/components/input'
import email from '@/components/email'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import commonReq from '@/api/common' 
export default {
  // mixins: [base],

  components: {
    customImg,
    mobile,
    customInput,
    email,
    editor,
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
        // rules: {
        //   'admin_name': [ 
        //     { required: true, message: '请输入姓名!', trigger: 'blur' },
        //     { message: '姓名必须是6~15位!', min: 6, max: 15 } 
        //   ],
        // }
      },
      formData: {},
      isAdd: true,
      img: { title: '商品图片', value: [], limit: 5, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      phone: { title: '电话', value: '', alert: null },
      address: { title: '地址', value: '', alert: null, preventValidate: true },
      email: { title: '邮箱', value: '', alert: null, preventValidate: true },
      desc: { title: '内容', value: '' },
    }
  },

  methods: {
    async submit(){
      let o = this.formData,
          paramArr = ['phone','address','email'],
          param;

      this.canSubmit = false;

      this.img.alert = this.img.value.length ? null : '请选择图片作为主图';

      if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;

      let img = this.img.value.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      param = {
        value:{
          img: img,
          phone: this.phone.value,
          address:this.address.value,
          email: this.email.value,
          desc:this.desc.value,
        },
      };

      // return console.error(img, o, 'about param : ', param);
      this.save(param);
    },
    

    // request
    async getAbout(){
      let res = await api.getAboutList();
      this.img.value = [];
      if(res.status ==0){
        res.data.img.forEach(v=>{
          this.img.value.push({
            url:v
          })
        })
        this.phone.value=res.data.phone;
        this.desc.value=res.data.desc;
        this.address.value=res.data.address;
        this.email.value=res.data.email;
      }
    },

    async save(param){
      let res = this.isAdd ? await api.setAbout(param, this) : await api.updateAbout(this.formData.admin_id, param, this);
      this.isShowForm = false;
      this.canSubmit = true;

      this.getAbout();
    },
    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.img.body.token = res.data;
      this.img.body.config = "{ useCdnDomain: true }";
    },
  },

  created(){
    this.getAbout();
    this.getUploadToken();
  }

}
</script>