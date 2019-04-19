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
    <el-form label-width='100px'>

      <custom-img :obj='img'></custom-img>
      
      <!-- <custom-input :obj='phone'></custom-input> -->

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
import customImg from '@/components/img'
import customInput from '@/components/input'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";

export default {

  components: {
    customImg,
    customInput,
    editor,
  },

  data() {
    return {
      img: { title: '主图', value: [], limit: 4, alert: null },
      // address: { title: '地址', value: '', alert: null, preventValidate: true },
      desc: { title: '内容', value: '' },
    }
  },

  methods: {
    async submit(img){
      let o = this.formData,
          paramArr = [],
          uploadArr,
          param;

      this.canSubmit = false;

      this.img.alert = this.img.value.length ? null : '请选择图片作为主图';

      // if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;

      uploadArr = this.img.value.filter(v => v.raw).map(v => v.raw);

      console.error(this.img.value, uploadArr, this.desc.value);

      let imgRes = await uploadFn(uploadArr);
      console.error('imgRes :', imgRes);

      param = {
        value: `${JSON.stringify(img)}&|${o.phone}&|${o.address}&|${o.email}&|${o.detail}`,
      };

      // return console.error(img, o, 'about param : ', param);
      // this.save(param);
    },
    

    // request
    async getItem(){
      // let res = await api.getAbout();

      // if(res){
      //   let arr = res.split('&|');
      //   this.formData = {
      //     img: JSON.parse(arr[0]),
      //     phone: arr[1],
      //     address: arr[2],
      //     email: arr[3],
      //     detail: arr[4],
      //   }
      // }

      this.img.value = [{ url: 'http://images.handeson.com/Fpk6g9eNz6aWbEJvRXm9II7VvSOO?imageView2/2/w/640/q/100/@w/$w$@/@h/$h$@' }];
      this.desc.value = '<p>手动阀手动阀</p>';
    },

    async save(param){
      let res = this.isAdd ? await api.setAbout(param, this) : await api.updateAbout(this.formData.admin_id, param, this);

      this.isShowForm = false;
      this.canSubmit = true;

      this.getAbout();
    },

  },

  created(){
    this.getItem();
  }

}
</script>