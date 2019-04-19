<style lang="css">
.form_wrap{
  padding: 20px;
}

.submit_btn{
  margin-left: 100px;
  background: #42b983;
  color: #fff;
}
</style>

<template>
<div>

  <div class='form_wrap'>
    <el-form label-width='100px'>

      <custom-img :obj='img'></custom-img>
      
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
import customImg from '@/components/customImg'
import customInput from '@/components/input'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import commonReq from '@/api/common';
export default {

  components: {
    customImg,
    customInput,
    editor,
  },

  data() {
    return {
      img: { title: '商品图片', value: [], limit: 5, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      desc: { title: '内容', value: '' },
    }
  },

  methods: {
    async submit(){
      let param;

      this.canSubmit = false;
      this.img.alert = this.img.value.length ? null : '请选择图片作为主图';

      let img = this.img.value.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      param = {
        business_id:1,
        value:{
          img:img,
          desc:this.desc.value
        }
      }
      let  res = await api.editBusiness(param,this);
      if(res.status ==0){
        this.$message.success('操作成功');
      } else{
        this.$message.error('操作失败');
      }
      this.canSubmit = true;
      this.getItem();
    },
    

    // request
    async getItem(){
      this.img.value = [];
      let res = await api.getBusiness(1);
      this.desc.value = res.data.desc;
      res.data.img.forEach(v=>{
        this.img.value.push({
          url:v
        })
      })
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
    this.getItem();
    this.getUploadToken();
  }

}
</script>